/**
 * Setup script for the reminder scheduler system
 * This script creates sample data and tests the reminder system
 */

import { createClient } from '@supabase/supabase-js';
import { ReminderSchedulerService } from '../src/services/ReminderSchedulerService.js';

// Initialize Supabase client
const supabaseUrl = 'https://ktemrlewjvdesvfbzlen.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZW1ybGV3anZkZXN2ZmJ6bGVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NjQ3NTIsImV4cCI6MjA2OTQ0MDc1Mn0.1igWzAy3o-eBPT6cNWhHIXzPt-7XabefBwdleThaX1Y';
const supabase = createClient(supabaseUrl, supabaseKey);

async function setupReminderSystem() {
  console.log('🚀 Setting up Reminder Scheduler System...\n');

  try {
    // 1. Check if reminder tables exist
    console.log('📊 Checking database schema...');
    const { data: tablesExist, error: schemaError } = await supabase
      .from('reminder_schedules')
      .select('count')
      .limit(1);

    if (schemaError) {
      console.error('❌ Database schema not found. Please run the migration first:');
      console.error('   Run: supabase db reset or apply the migration manually');
      return;
    }

    console.log('✅ Database schema verified\n');

    // 2. Check existing triggers
    console.log('🔔 Checking existing reminder triggers...');
    const { data: existingTriggers, error: triggersError } = await supabase
      .from('reminder_triggers')
      .select('*');

    if (triggersError) {
      console.error('❌ Error checking triggers:', triggersError);
      return;
    }

    console.log(`📋 Found ${existingTriggers?.length || 0} reminder triggers`);
    if (existingTriggers && existingTriggers.length > 0) {
      existingTriggers.forEach(trigger => {
        console.log(`   - ${trigger.trigger_name}: ${trigger.days_offset} days offset`);
      });
    }
    console.log();

    // 3. Create sample leases if none exist
    console.log('🏠 Checking for active leases...');
    const { data: leases, error: leasesError } = await supabase
      .from('leases')
      .select(`
        *,
        tenants (id, name, phone),
        units (id, property_id, unit_number),
        properties (id, name, address)
      `)
      .eq('status', 'active')
      .limit(5);

    if (leasesError) {
      console.error('❌ Error checking leases:', leasesError);
      return;
    }

    if (!leases || leases.length === 0) {
      console.log('⚠️  No active leases found. Creating sample data...');
      await createSampleData();
    } else {
      console.log(`✅ Found ${leases.length} active leases`);
      leases.forEach(lease => {
        console.log(`   - ${lease.tenants?.name || 'Tenant'}: ${lease.properties?.name || 'Property'} - ${lease.rent_amount} ${lease.rent_currency}`);
      });
    }
    console.log();

    // 4. Test reminder generation
    console.log('🔄 Testing reminder generation...');
    const scheduler = new ReminderSchedulerService();
    
    const result = await scheduler.generateReminderSchedules(new Date());
    console.log('✅ Reminder generation test completed:');
    console.log(`   - Generated: ${result.generatedReminders}`);
    console.log(`   - Skipped: ${result.skippedReminders}`);
    console.log(`   - Errors: ${result.errorReminders}`);
    console.log();

    // 5. Check today's reminders
    console.log('📅 Checking today\'s reminders...');
    const todaysReminders = await scheduler.getTodaysReminders();
    console.log(`📨 Found ${todaysReminders.length} reminders for today`);
    
    if (todaysReminders.length > 0) {
      console.log('\n   Sample reminders:');
      todaysReminders.slice(0, 3).forEach((reminder, index) => {
        console.log(`   ${index + 1}. ${reminder.personalized_message.substring(0, 80)}...`);
      });
    }
    console.log();

    // 6. Test WhatsApp preparation
    console.log('💬 Testing WhatsApp message preparation...');
    if (todaysReminders.length > 0) {
      const whatsappData = scheduler.prepareWhatsAppMessageData(todaysReminders[0]);
      console.log('✅ WhatsApp message prepared successfully:');
      console.log(`   - To: ${whatsappData.to}`);
      console.log(`   - Message: ${whatsappData.message.substring(0, 80)}...`);
      console.log(`   - Variables: ${Object.keys(whatsappData.templateVariables).join(', ')}`);
    }
    console.log();

    // 7. Display statistics
    console.log('📊 Reminder System Statistics:');
    const stats = await scheduler.getReminderStatistics();
    console.log(`   - Total reminders: ${stats.total}`);
    console.log(`   - By status: ${stats.byStatus.map(s => `${s.status}: ${s.count}`).join(', ')}`);
    console.log(`   - Today's reminders: ${stats.today.map(s => `${s.status}: ${s.count}`).join(', ')}`);
    console.log(`   - By type: ${stats.byType.map(t => `${t.reminder_type}: ${t.count}`).join(', ')}`);
    console.log();

    console.log('🎉 Reminder Scheduler System setup completed successfully!');
    console.log('\n📖 Next steps:');
    console.log('   1. Test API endpoints:');
    console.log('      - POST /api/reminders/generate');
    console.log('      - GET /api/reminders/today');
    console.log('      - GET /api/reminders/date-range?startDate=2024-01-01&endDate=2024-12-31');
    console.log('   2. Set up cron job to call /api/reminders/cron daily');
    console.log('   3. Integrate with WhatsApp API in Sprint 3');
    console.log('   4. Monitor reminder delivery and adjust triggers as needed');

  } catch (error) {
    console.error('❌ Error setting up reminder system:', error);
  }
}

async function createSampleData() {
  console.log('📝 Creating sample data...');

  try {
    // Create sample properties
    const { data: property, error: propError } = await supabase
      .from('properties')
      .insert({
        name: 'Sample Apartment Complex',
        address: '123 Main Street, Nairobi',
        type: 'apartment',
        total_units: 10
      })
      .select()
      .single();

    if (propError) throw propError;

    // Create sample unit
    const { data: unit, error: unitError } = await supabase
      .from('units')
      .insert({
        property_id: property.id,
        unit_number: 'A101',
        type: 'apartment',
        bedrooms: 2,
        bathrooms: 1,
        rent_amount: 50000,
        status: 'occupied'
      })
      .select()
      .single();

    if (unitError) throw unitError;

    // Create sample tenant
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .insert({
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+254712345678',
        id_number: '12345678',
        emergency_contact: '+254723456789'
      })
      .select()
      .single();

    if (tenantError) throw tenantError;

    // Create sample lease
    const leaseStart = new Date();
    leaseStart.setMonth(leaseStart.getMonth() - 1);
    
    const leaseEnd = new Date();
    leaseEnd.setFullYear(leaseEnd.getFullYear() + 1);

    const { data: lease, error: leaseError } = await supabase
      .from('leases')
      .insert({
        tenant_id: tenant.id,
        unit_id: unit.id,
        start_date: leaseStart.toISOString().split('T')[0],
        end_date: leaseEnd.toISOString().split('T')[0],
        rent_amount: 50000,
        rent_currency: 'KES',
        due_date: 5,
        security_deposit: 100000,
        status: 'active'
      })
      .select()
      .single();

    if (leaseError) throw leaseError;

    console.log('✅ Sample data created successfully');
    console.log(`   - Property: ${property.name}`);
    console.log(`   - Unit: ${unit.unit_number}`);
    console.log(`   - Tenant: ${tenant.name}`);
    console.log(`   - Lease: ${lease.rent_amount} KES/month`);

  } catch (error) {
    console.error('❌ Error creating sample data:', error);
    throw error;
  }
}

// Run the setup
if (import.meta.url === `file://${process.argv[1]}`) {
  setupReminderSystem()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Setup failed:', error);
      process.exit(1);
    });
}

export { setupReminderSystem };
