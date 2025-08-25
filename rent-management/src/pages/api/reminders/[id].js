import { ReminderSchedulerService } from '../../../services/ReminderSchedulerService.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;
  const scheduler = new ReminderSchedulerService();

  try {
    switch (req.method) {
      case 'GET':
        // Get specific reminder
        const { data: reminder, error } = await supabase
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
          .eq('id', id)
          .single();

        if (error) throw error;

        res.status(200).json({
          success: true,
          data: reminder
        });
        break;

      case 'PUT':
        // Update reminder status
        const { status, whatsappMessageId, failedReason } = req.body;
        
        let updatedReminder;
        if (status === 'sent') {
          updatedReminder = await scheduler.markReminderSent(id, { whatsappMessageId });
        } else if (status === 'failed') {
          updatedReminder = await scheduler.markReminderFailed(id, failedReason);
        } else {
          const { data, error: updateError } = await supabase
            .from('reminder_schedules')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
          
          if (updateError) throw updateError;
          updatedReminder = data;
        }

        res.status(200).json({
          success: true,
          message: 'Reminder updated successfully',
          data: updatedReminder
        });
        break;

      case 'DELETE':
        // Cancel reminder (soft delete)
        const { data: cancelledReminder, error: cancelError } = await supabase
          .from('reminder_schedules')
          .update({ 
            status: 'cancelled',
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();

        if (cancelError) throw cancelError;

        res.status(200).json({
          success: true,
          message: 'Reminder cancelled successfully',
          data: cancelledReminder
        });
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in reminder API:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process reminder request'
    });
  }
}
