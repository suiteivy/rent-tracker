import { ReminderSchedulerService } from '../../../services/ReminderSchedulerService.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify cron job authorization
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.CRON_SECRET || 'your-cron-secret'}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const scheduler = new ReminderSchedulerService();
    
    // Generate reminders for current month
    const result = await scheduler.generateReminderSchedules(new Date());
    
    // Get today's reminders for WhatsApp preparation
    const todaysReminders = await scheduler.getTodaysReminders();
    const whatsappMessages = scheduler.bulkPrepareWhatsAppMessages(todaysReminders);

    res.status(200).json({
      success: true,
      message: 'Cron job executed successfully',
      data: {
        generated: result,
        todaysReminders: todaysReminders.length,
        whatsappMessages: whatsappMessages.length
      }
    });
  } catch (error) {
    console.error('Error in cron job:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to execute cron job'
    });
  }
}
