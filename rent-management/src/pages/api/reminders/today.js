import { ReminderSchedulerService } from '../../../services/ReminderSchedulerService.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const scheduler = new ReminderSchedulerService();
    const reminders = await scheduler.getTodaysReminders();

    res.status(200).json({
      success: true,
      message: 'Today\'s reminders retrieved successfully',
      data: reminders,
      count: reminders.length
    });
  } catch (error) {
    console.error('Error in today reminders API:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch today\'s reminders'
    });
  }
}
