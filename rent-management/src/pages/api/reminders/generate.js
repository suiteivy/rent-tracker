import { ReminderSchedulerService } from '../../../services/ReminderSchedulerService.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const scheduler = new ReminderSchedulerService();
    const { targetDate } = req.body;

    const result = await scheduler.generateReminderSchedules(
      targetDate ? new Date(targetDate) : new Date()
    );

    res.status(200).json({
      success: true,
      message: 'Reminder schedules generated successfully',
      data: result
    });
  } catch (error) {
    console.error('Error in generate reminders API:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate reminder schedules'
    });
  }
}
