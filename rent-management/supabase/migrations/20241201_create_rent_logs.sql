-- Create rent_logs table for automatic rent record generation
CREATE TABLE IF NOT EXISTS public.rent_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lease_id UUID NOT NULL REFERENCES public.leases(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    unit_id UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    
    -- Rent details
    rent_amount DECIMAL(10,2) NOT NULL,
    rent_currency VARCHAR(3) NOT NULL DEFAULT 'KES',
    due_date INTEGER NOT NULL DEFAULT 1,
    
    -- Period tracking
    period_month INTEGER NOT NULL,
    period_year INTEGER NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Payment tracking
    amount_due DECIMAL(10,2) NOT NULL,
    amount_paid DECIMAL(10,2) DEFAULT 0,
    balance DECIMAL(10,2) GENERATED ALWAYS AS (amount_due - amount_paid) STORED,
    payment_status VARCHAR(20) DEFAULT 'pending',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique rent log per lease per period
    UNIQUE(lease_id, period_month, period_year)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_rent_logs_lease_id ON public.rent_logs(lease_id);
CREATE INDEX IF NOT EXISTS idx_rent_logs_tenant_id ON public.rent_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_rent_logs_unit_id ON public.rent_logs(unit_id);
CREATE INDEX IF NOT EXISTS idx_rent_logs_property_id ON public.rent_logs(property_id);
CREATE INDEX IF NOT EXISTS idx_rent_logs_period ON public.rent_logs(period_month, period_year);
CREATE INDEX IF NOT EXISTS idx_rent_logs_payment_status ON public.rent_logs(payment_status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_rent_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_rent_logs_updated_at ON public.rent_logs;
CREATE TRIGGER update_rent_logs_updated_at
    BEFORE UPDATE ON public.rent_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_rent_logs_updated_at();

-- Create function to generate rent logs for active leases
CREATE OR REPLACE FUNCTION generate_monthly_rent_logs(target_month INTEGER, target_year INTEGER)
RETURNS TABLE (
    generated_logs INTEGER,
    skipped_logs INTEGER,
    error_logs INTEGER
) AS $$
DECLARE
    lease_record RECORD;
    log_count INTEGER := 0;
    skip_count INTEGER := 0;
    error_count INTEGER := 0;
    period_start DATE;
    period_end DATE;
BEGIN
    -- Calculate period start and end dates
    period_start := DATE(target_year || '-' || LPAD(target_month::TEXT, 2, '0') || '-01');
    period_end := (period_start + INTERVAL '1 month') - INTERVAL '1 day';

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
            l.rent_frequency
        FROM leases l
        JOIN units u ON l.unit_id = u.id
        WHERE l.status = 'active'
        AND l.start_date <= period_end
        AND (l.end_date IS NULL OR l.end_date >= period_start)
    LOOP
        BEGIN
            -- Check if rent log already exists for this period
            IF EXISTS (
                SELECT 1 FROM rent_logs 
                WHERE lease_id = lease_record.lease_id 
                AND period_month = target_month 
                AND period_year = target_year
            ) THEN
                skip_count := skip_count + 1;
                CONTINUE;
            END IF;

            -- Insert new rent log
            INSERT INTO rent_logs (
                lease_id,
                tenant_id,
                unit_id,
                property_id,
                rent_amount,
                rent_currency,
                due_date,
                period_month,
                period_year,
                period_start,
                period_end,
                amount_due
            ) VALUES (
                lease_record.lease_id,
                lease_record.tenant_id,
                lease_record.unit_id,
                lease_record.property_id,
                lease_record.rent_amount,
                lease_record.rent_currency,
                lease_record.due_date,
                target_month,
                target_year,
                period_start,
                period_end,
                lease_record.rent_amount
            );

            log_count := log_count + 1;
        EXCEPTION
            WHEN OTHERS THEN
                error_count := error_count + 1;
        END;
    END LOOP;

    RETURN QUERY SELECT log_count, skip_count, error_count;
END;
$$ LANGUAGE plpgsql;
