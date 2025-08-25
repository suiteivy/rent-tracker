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
    const { startDate, endDate, status, type } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }

    const scheduler = new ReminderSchedulerService();
    const reminders = await scheduler.getRemindersByDateRange(
      new Date(startDate),
      new Date(endDate),
      status
    );

    // Filter by type if provided
    let filteredReminders = reminders;
    if (type) {
      filteredReminders = reminders.filter(r => r.reminder_type === type);
    }

    res.status(200).json({
      success: true,
      message: 'Reminders retrieved successfully',
      data: filteredReminders,
      count: filteredReminders.length,
      filters: {
        startDate,
        endDate,
        status,
        type
      }
    });
  } catch (error) {
    console.error('Error in date range reminders API:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch reminders by date range'
    });
  }
}
