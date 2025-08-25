-- Create reminder_triggers table for configurable reminder triggers
CREATE TABLE IF NOT EXISTS public.reminder_triggers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    trigger_name VARCHAR(100) NOT NULL UNIQUE,
    days_offset INTEGER NOT NULL, -- Negative for before due date, positive for after
    trigger_type VARCHAR(50) NOT NULL CHECK (trigger_type IN ('rent_due', 'lease_renewal', 'maintenance', 'inspection')),
    is_active BOOLEAN DEFAULT true,
    message_template TEXT NOT NULL,
    priority INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reminder_schedules table for actual reminder instances
CREATE TABLE IF NOT EXISTS public.reminder_schedules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lease_id UUID NOT NULL REFERENCES public.leases(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    reminder_type VARCHAR(50) NOT NULL CHECK (reminder_type IN ('rent_due', 'lease_renewal', 'maintenance', 'inspection')),
    trigger_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
    message_template TEXT NOT NULL,
    personalized_message TEXT,
    trigger_config JSONB, -- Stores trigger configuration details
    metadata JSONB, -- Stores additional data like rent amount, due date, etc.
    sent_at TIMESTAMP WITH TIME ZONE,
    failed_reason TEXT,
    whatsapp_message_id VARCHAR(255), -- For tracking WhatsApp messages
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_reminder_schedules_lease_id ON public.reminder_schedules(lease_id);
CREATE INDEX IF NOT EXISTS idx_reminder_schedules_tenant_id ON public.reminder_schedules(tenant_id);
CREATE INDEX IF NOT EXISTS idx_reminder_schedules_property_id ON public.reminder_schedules(property_id);
CREATE INDEX IF NOT EXISTS idx_reminder_schedules_trigger_date ON public.reminder_schedules(trigger_date);
CREATE INDEX IF NOT EXISTS idx_reminder_schedules_status ON public.reminder_schedules(status);
CREATE INDEX IF NOT EXISTS idx_reminder_schedules_reminder_type ON public.reminder_schedules(reminder_type);
CREATE INDEX IF NOT EXISTS idx_reminder_schedules_composite ON public.reminder_schedules(trigger_date, status, reminder_type);

-- Create function to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_reminder_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_reminder_triggers_updated_at ON public.reminder_triggers;
CREATE TRIGGER update_reminder_triggers_updated_at
    BEFORE UPDATE ON public.reminder_triggers
    FOR EACH ROW
    EXECUTE FUNCTION update_reminder_updated_at();

DROP TRIGGER IF EXISTS update_reminder_schedules_updated_at ON public.reminder_schedules;
CREATE TRIGGER update_reminder_schedules_updated_at
    BEFORE UPDATE ON public.reminder_schedules
    FOR EACH ROW
    EXECUTE FUNCTION update_reminder_updated_at();

-- Insert default reminder triggers
INSERT INTO public.reminder_triggers (trigger_name, days_offset, trigger_type, message_template, priority) VALUES
-- Rent Due Reminders
('rent_due_3_days_before', -3, 'rent_due', 'Hi {{tenant_name}}, your rent of {{rent_amount}} for {{property_name}} is due on {{due_date}}. Please ensure payment is made on time. Thank you!', 1),
('rent_due_on_due_date', 0, 'rent_due', 'Hi {{tenant_name}}, your rent of {{rent_amount}} for {{property_name}} is due today. Please make payment to avoid late fees.', 2),
('rent_due_2_days_overdue', 2, 'rent_due', 'Hi {{tenant_name}}, your rent of {{rent_amount}} for {{property_name}} is now 2 days overdue. Please make immediate payment to avoid further penalties.', 3),

-- Lease Renewal Reminders
('lease_renewal_30_days_before', -30, 'lease_renewal', 'Hi {{tenant_name}}, your lease for {{property_name}} expires on {{lease_end_date}}. Would you like to renew? Contact us to discuss renewal options.', 1),
('lease_renewal_15_days_before', -15, 'lease_renewal', 'Hi {{tenant_name}}, friendly reminder that your lease for {{property_name}} expires on {{lease_end_date}}. Please let us know your renewal decision soon.', 2),

-- Maintenance Reminders (placeholder for future)
('maintenance_due', 0, 'maintenance', 'Hi {{tenant_name}}, scheduled maintenance for {{property_name}} is due today. Our team will arrive between 9 AM - 5 PM.', 1),

-- Inspection Reminders (placeholder for future)
('inspection_due', 0, 'inspection', 'Hi {{tenant_name}}, property inspection for {{property_name}} is scheduled for today. Please ensure access is available.', 1);

-- Create function to calculate next rent due date for a lease
CREATE OR REPLACE FUNCTION calculate_next_rent_due_date(
    lease_start DATE,
    due_day INTEGER,
    target_date DATE DEFAULT CURRENT_DATE
) RETURNS DATE AS $$
DECLARE
    next_due_date DATE;
    current_month INTEGER;
    current_year INTEGER;
BEGIN
    current_month := EXTRACT(MONTH FROM target_date);
    current_year := EXTRACT(YEAR FROM target_date);
    
    -- Calculate next due date
    next_due_date := DATE(current_year || '-' || LPAD(current_month::TEXT, 2, '0') || '-' || LPAD(due_day::TEXT, 2, '0'));
    
    -- If the due date has passed this month, move to next month
    IF next_due_date < target_date THEN
        next_due_date := next_due_date + INTERVAL '1 month';
    END IF;
    
    RETURN next_due_date;
END;
$$ LANGUAGE plpgsql;

-- Create function to generate reminder schedules for active leases
CREATE OR REPLACE FUNCTION generate_reminder_schedules_for_period(
    target_month INTEGER,
    target_year INTEGER
) RETURNS TABLE (
    generated_reminders INTEGER,
    skipped_reminders INTEGER,
    error_reminders INTEGER
) AS $$
DECLARE
    lease_record RECORD;
    trigger_record RECORD;
    reminder_count INTEGER := 0;
    skip_count INTEGER := 0;
    error_count INTEGER := 0;
    next_due_date DATE;
    reminder_trigger_date DATE;
    personalized_msg TEXT;
    trigger_config JSONB;
BEGIN
    -- Loop through all active leases
    FOR lease_record IN
        SELECT 
            l.id as lease_id,
            l.tenant_id,
            l.unit_id,
            u.property_id,
            l.rent_amount,
            l.rent_currency,
            l.due_date,
            l.start_date,
            l.end_date,
            t.name as tenant_name,
            t.phone as tenant_phone,
            p.name as property_name
        FROM leases l
        JOIN units u ON l.unit_id = u.id
        JOIN tenants t ON l.tenant_id = t.id
        JOIN properties p ON u.property_id = p.id
        WHERE l.status = 'active'
        AND l.start_date <= DATE(target_year || '-' || LPAD(target_month::TEXT, 2, '0') || '-01') + INTERVAL '1 month' - INTERVAL '1 day'
        AND (l.end_date IS NULL OR l.end_date >= DATE(target_year || '-' || LPAD(target_month::TEXT, 2, '0') || '-01'))
    LOOP
        -- Calculate next rent due date
        next_due_date := calculate_next_rent_due_date(
            lease_record.start_date,
            lease_record.due_date,
            DATE(target_year || '-' || LPAD(target_month::TEXT, 2, '0') || '-01')
        );
        
        -- Loop through all active triggers
        FOR trigger_record IN
            SELECT * FROM reminder_triggers 
            WHERE is_active = true 
            AND trigger_type = 'rent_due'
        LOOP
            BEGIN
                -- Calculate trigger date
                reminder_trigger_date := next_due_date + INTERVAL '1 day' * trigger_record.days_offset;
                
                -- Skip if trigger date is in the past
                IF reminder_trigger_date < CURRENT_DATE THEN
                    skip_count := skip_count + 1;
                    CONTINUE;
                END IF;
                
                -- Check if reminder already exists
                IF EXISTS (
                    SELECT 1 FROM reminder_schedules 
                    WHERE lease_id = lease_record.lease_id 
                    AND reminder_type = 'rent_due'
                    AND trigger_date = reminder_trigger_date
                    AND status != 'cancelled'
                ) THEN
                    skip_count := skip_count + 1;
                    CONTINUE;
                END IF;
                
                -- Create trigger config
                trigger_config := jsonb_build_object(
                    'trigger_name', trigger_record.trigger_name,
                    'days_offset', trigger_record.days_offset,
                    'due_date', next_due_date,
                    'rent_amount', lease_record.rent_amount,
                    'rent_currency', lease_record.rent_currency
                );
                
                -- Personalize message
                personalized_msg := REPLACE(trigger_record.message_template, '{{tenant_name}}', COALESCE(lease_record.tenant_name, 'Tenant'));
                personalized_msg := REPLACE(personalized_msg, '{{rent_amount}}', lease_record.rent_amount::TEXT || ' ' || lease_record.rent_currency);
                personalized_msg := REPLACE(personalized_msg, '{{property_name}}', COALESCE(lease_record.property_name, 'Property'));
                personalized_msg := REPLACE(personalized_msg, '{{due_date}}', TO_CHAR(next_due_date, 'DD/MM/YYYY'));
                
                -- Insert reminder schedule
                INSERT INTO reminder_schedules (
                    lease_id,
                    tenant_id,
                    property_id,
                    reminder_type,
                    trigger_date,
                    message_template,
                    personalized_message,
                    trigger_config,
                    metadata
                ) VALUES (
                    lease_record.lease_id,
                    lease_record.tenant_id,
                    lease_record.property_id,
                    'rent_due',
                    reminder_trigger_date,
                    trigger_record.message_template,
                    personalized_msg,
                    trigger_config,
                    jsonb_build_object(
                        'tenant_name', lease_record.tenant_name,
                        'tenant_phone', lease_record.tenant_phone,
                        'property_name', lease_record.property_name,
                        'rent_amount', lease_record.rent_amount,
                        'rent_currency', lease_record.rent_currency,
                        'due_date', next_due_date
                    )
                );
                
                reminder_count := reminder_count + 1;
            EXCEPTION
                WHEN OTHERS THEN
                    error_count := error_count + 1;
            END;
        END LOOP;
        
        -- Handle lease renewal reminders
        IF lease_record.end_date IS NOT NULL THEN
            FOR trigger_record IN
                SELECT * FROM reminder_triggers 
                WHERE is_active = true 
                AND trigger_type = 'lease_renewal'
            LOOP
                BEGIN
                    reminder_trigger_date := lease_record.end_date + INTERVAL '1 day' * trigger_record.days_offset;
                    
                    -- Skip if trigger date is in the past
                    IF reminder_trigger_date < CURRENT_DATE THEN
                        skip_count := skip_count + 1;
                        CONTINUE;
                    END IF;
                    
                    -- Check if reminder already exists
                    IF EXISTS (
                        SELECT 1 FROM reminder_schedules 
                        WHERE lease_id = lease_record.lease_id 
                        AND reminder_type = 'lease_renewal'
                        AND trigger_date = reminder_trigger_date
                        AND status != 'cancelled'
                    ) THEN
                        skip_count := skip_count + 1;
                        CONTINUE;
                    END IF;
                    
                    -- Create trigger config
                    trigger_config := jsonb_build_object(
                        'trigger_name', trigger_record.trigger_name,
                        'days_offset', trigger_record.days_offset,
                        'lease_end_date', lease_record.end_date
                    );
                    
                    -- Personalize message
                    personalized_msg := REPLACE(trigger_record.message_template, '{{tenant_name}}', COALESCE(lease_record.tenant_name, 'Tenant'));
                    personalized_msg := REPLACE(personalized_msg, '{{property_name}}', COALESCE(lease_record.property_name, 'Property'));
                    personalized_msg := REPLACE(personalized_msg, '{{lease_end_date}}', TO_CHAR(lease_record.end_date, 'DD/MM/YYYY'));
                    
                    -- Insert reminder schedule
                    INSERT INTO reminder_schedules (
                        lease_id,
                        tenant_id,
                        property_id,
                        reminder_type,
                        trigger_date,
                        message_template,
                        personalized_message,
                        trigger_config,
                        metadata
                    ) VALUES (
                        lease_record.lease_id,
                        lease_record.tenant_id,
                        lease_record.property_id,
                        'lease_renewal',
                        reminder_trigger_date,
                        trigger_record.message_template,
                        personalized_msg,
                        trigger_config,
                        jsonb_build_object(
                            'tenant_name', lease_record.tenant_name,
                            'tenant_phone', lease_record.tenant_phone,
                            'property_name', lease_record.property_name,
                            'lease_end_date', lease_record.end_date
                        )
                    );
                    
                    reminder_count := reminder_count + 1;
                EXCEPTION
                    WHEN OTHERS THEN
                        error_count := error_count + 1;
                END;
            END LOOP;
        END IF;
    END LOOP;
    
    RETURN QUERY SELECT reminder_count, skip_count, error_count;
END;
$$ LANGUAGE plpgsql;
