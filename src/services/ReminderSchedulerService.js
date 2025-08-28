import { supabase } from '../supabaseClient.js';

/**
 * Service class for managing reminder schedules and triggers
 * Handles generation of reminders for active leases and WhatsApp integration
 */
export class ReminderSchedulerService {
  constructor() {
    this.defaultTriggers = [
      { name: 'rent_due_3_days_before', offset: -3, type: 'rent_due' },
      { name: 'rent_due_on_due_date', offset: 0, type: 'rent_due' },
      { name: 'rent_due_2_days_overdue', offset: 2, type: 'rent_due' },
      { name: 'lease_renewal_30_days_before', offset: -30, type: 'lease_renewal' }
    ];
  }

  /**
   * Generate reminder schedules for all active leases
   * @param {Date} targetDate - Target date for reminder generation
   * @returns {Promise<Object>} Generation results
   */
  async generateReminderSchedules(targetDate = new Date()) {
    try {
      const { data, error } = await supabase
        .rpc('generate_reminder_schedules_for_period', {
          target_month: targetDate.getMonth() + 1,
          target_year: targetDate.getFullYear()
        });

      if (error) throw error;

      return {
        success: true,
        generatedReminders: data[0]?.generated_reminders || 0,
        skippedReminders: data[0]?.skipped_reminders || 0,
        errorReminders: data[0]?.error_reminders || 0
      };
    } catch (error) {
      console.error('Error generating reminder schedules:', error);
      throw new Error(`Failed to generate reminders: ${error.message}`);
    }
  }

  /**
   * Get reminders scheduled for today
   * @returns {Promise<Array>} Today's reminders
   */
  async getTodaysReminders() {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('reminder_schedules')
        .select(`
          *,
          leases (
            id,
            start_date,
            end_date,
            rent_amount,
            due_date,
            rent_frequency
          ),
          tenants (
            id,
            name,
            email,
            phone
          ),
          properties (
            id,
            name,
            address
          )
        `)
        .eq('trigger_date', today)
        .eq('status', 'pending')
        .order('trigger_date', { ascending: true });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching today\'s reminders:', error);
      throw new Error(`Failed to fetch reminders: ${error.message}`);
    }
  }

  /**
   * Get all active reminder triggers
   * @returns {Promise<Array>} Active triggers
   */
  async getActiveReminderTriggers() {
    try {
      const { data, error } = await supabase
        .from('reminder_triggers')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: true });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching reminder triggers:', error);
      throw new Error(`Failed to fetch triggers: ${error.message}`);
    }
  }

  /**
   * Create or update a reminder trigger
   * @param {Object} triggerData - Trigger configuration
   * @returns {Promise<Object>} Created/updated trigger
   */
  async upsertReminderTrigger(triggerData) {
    try {
      const { data, error } = await supabase
        .from('reminder_triggers')
        .upsert(triggerData)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error upserting reminder trigger:', error);
      throw new Error(`Failed to save trigger: ${error.message}`);
    }
  }

  /**
   * Mark a reminder as sent
   * @param {string} reminderId - Reminder schedule ID
   * @param {Object} sentData - Sent status data
   * @returns {Promise<Object>} Updated reminder
   */
  async markReminderSent(reminderId, sentData = {}) {
    try {
      const { data, error } = await supabase
        .from('reminder_schedules')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
          whatsapp_message_id: sentData.whatsappMessageId || null,
          ...sentData
        })
        .eq('id', reminderId)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error marking reminder as sent:', error);
      throw new Error(`Failed to update reminder: ${error.message}`);
    }
  }

  /**
   * Mark a reminder as failed
   * @param {string} reminderId - Reminder schedule ID
   * @param {string} reason - Failure reason
   * @returns {Promise<Object>} Updated reminder
   */
  async markReminderFailed(reminderId, reason) {
    try {
      const { data, error } = await supabase
        .from('reminder_schedules')
        .update({
          status: 'failed',
          failed_reason: reason,
          updated_at: new Date().toISOString()
        })
        .eq('id', reminderId)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error marking reminder as failed:', error);
      throw new Error(`Failed to update reminder: ${error.message}`);
    }
  }

  /**
   * Get reminders by date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {string} status - Optional status filter
   * @returns {Promise<Array>} Reminders in date range
   */
  async getRemindersByDateRange(startDate, endDate, status = null) {
    try {
      let query = supabase
        .from('reminder_schedules')
        .select(`
          *,
          leases (
            id,
            start_date,
            end_date,
            rent_amount,
            due_date,
            rent_frequency
          ),
          tenants (
            id,
            name,
            email,
            phone
          ),
          properties (
            id,
            name,
            address
          )
        `)
        .gte('trigger_date', startDate.toISOString().split('T')[0])
        .lte('trigger_date', endDate.toISOString().split('T')[0]);

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query.order('trigger_date', { ascending: true });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching reminders by date range:', error);
      throw new Error(`Failed to fetch reminders: ${error.message}`);
    }
  }

  /**
   * Prepare WhatsApp message data for a reminder
   * @param {Object} reminder - Reminder schedule object
   * @returns {Object} WhatsApp message data
   */
  prepareWhatsAppMessageData(reminder) {
    if (!reminder || !reminder.personalized_message) {
      throw new Error('Invalid reminder data for WhatsApp preparation');
    }

    const tenant = reminder.tenants;
    const lease = reminder.leases;
    const property = reminder.properties;

    return {
      to: tenant?.phone,
      message: reminder.personalized_message,
      templateVariables: {
        tenant_name: tenant?.name || 'Tenant',
        property_name: property?.name || 'Property',
        rent_amount: lease?.rent_amount || 0,
        due_date: reminder.metadata?.due_date || 'N/A',
        lease_id: lease?.id,
        tenant_id: tenant?.id,
        property_id: property?.id
      },
      metadata: {
        reminder_id: reminder.id,
        reminder_type: reminder.reminder_type,
        trigger_date: reminder.trigger_date,
        lease_id: lease?.id,
        tenant_id: tenant?.id
      }
    };
  }

  /**
   * Bulk prepare WhatsApp messages for multiple reminders
   * @param {Array} reminders - Array of reminder schedules
   * @returns {Array} Array of WhatsApp message data
   */
  bulkPrepareWhatsAppMessages(reminders) {
    return reminders.map(reminder => this.prepareWhatsAppMessageData(reminder));
  }

  /**
   * Get reminder statistics
   * @returns {Promise<Object>} Statistics data
   */
  async getReminderStatistics() {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get counts by status
      const { data: statusCounts, error: statusError } = await supabase
        .from('reminder_schedules')
        .select('status, count(*)')
        .group('status');

      if (statusError) throw statusError;

      // Get today's counts
      const { data: todayCounts, error: todayError } = await supabase
        .from('reminder_schedules')
        .select('status, count(*)')
        .eq('trigger_date', today)
        .group('status');

      if (todayError) throw todayError;

      // Get monthly counts
      const { data: monthlyCounts, error: monthlyError } = await supabase
        .from('reminder_schedules')
        .select('reminder_type, count(*)')
        .group('reminder_type');

      if (monthlyError) throw monthlyError;

      return {
        total: statusCounts?.reduce((sum, item) => sum + parseInt(item.count), 0) || 0,
        byStatus: statusCounts || [],
        today: todayCounts || [],
        byType: monthlyCounts || []
      };
    } catch (error) {
      console.error('Error fetching reminder statistics:', error);
      throw new Error(`Failed to fetch statistics: ${error.message}`);
    }
  }

  /**
   * Clean up old reminders (older than 90 days)
   * @returns {Promise<Object>} Cleanup results
   */
  async cleanupOldReminders() {
    try {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      
      const { data, error } = await supabase
        .from('reminder_schedules')
        .delete()
        .lt('trigger_date', ninetyDaysAgo.toISOString().split('T')[0])
        .eq('status', 'sent');

      if (error) throw error;

      return {
        success: true,
        deletedCount: data?.length || 0
      };
    } catch (error) {
      console.error('Error cleaning up old reminders:', error);
      throw new Error(`Failed to cleanup reminders: ${error.message}`);
    }
  }
}
