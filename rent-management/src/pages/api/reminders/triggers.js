import { ReminderSchedulerService } from '../../../services/ReminderSchedulerService.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const scheduler = new ReminderSchedulerService();

  try {
    switch (req.method) {
      case 'GET':
        // Get all active reminder triggers
        const triggers = await scheduler.getActiveReminderTriggers();
        res.status(200).json({
          success: true,
          data: triggers,
          count: triggers.length
        });
        break;

      case 'POST':
        // Create new reminder trigger
        const newTrigger = await scheduler.upsertReminderTrigger(req.body);
        res.status(201).json({
          success: true,
          message: 'Reminder trigger created successfully',
          data: newTrigger
        });
        break;

      case 'PUT':
        // Update existing reminder trigger
        const updatedTrigger = await scheduler.upsertReminderTrigger(req.body);
        res.status(200).json({
          success: true,
          message: 'Reminder trigger updated successfully',
          data: updatedTrigger
        });
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in triggers API:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process trigger request'
    });
  }
}
