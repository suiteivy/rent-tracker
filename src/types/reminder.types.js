/**
 * TypeScript type definitions for the Reminder Scheduler System
 * These can be used as JSDoc comments for better IDE support
 */

/**
 * @typedef {Object} ReminderTrigger
 * @property {string} id - Unique identifier
 * @property {string} trigger_name - Unique trigger name
 * @property {number} days_offset - Days offset from due date (negative for before, positive for after)
 * @property {'rent_due' | 'lease_renewal' | 'maintenance' | 'inspection'} trigger_type - Type of trigger
 * @property {boolean} is_active - Whether trigger is active
 * @property {string} message_template - Message template with variables
 * @property {number} priority - Priority for ordering
 * @property {string} created_at - Creation timestamp
 * @property {string} updated_at - Last update timestamp
 */

/**
 * @typedef {Object} ReminderSchedule
 * @property {string} id - Unique identifier
 * @property {string} lease_id - Associated lease ID
 * @property {string} tenant_id - Associated tenant ID
 * @property {string} property_id - Associated property ID
 * @property {'rent_due' | 'lease_renewal' | 'maintenance' | 'inspection'} reminder_type - Type of reminder
 * @property {string} trigger_date - Date when reminder should be triggered (YYYY-MM-DD)
 * @property {'pending' | 'sent' | 'failed' | 'cancelled'} status - Current status
 * @property {string} message_template - Original message template
 * @property {string} personalized_message - Personalized message with variables replaced
 * @property {Object} trigger_config - JSON configuration for trigger details
 * @property {Object} metadata - Additional data like tenant info, amounts, etc.
 * @property {string} [sent_at] - When the reminder was sent
 * @property {string} [failed_reason] - Reason for failure if status is 'failed'
 * @property {string} [whatsapp_message_id] - WhatsApp message ID for tracking
 * @property {string} created_at - Creation timestamp
 * @property {string} updated_at - Last update timestamp
 */

/**
 * @typedef {Object} WhatsAppMessageData
 * @property {string} to - Recipient phone number
 * @property {string} message - Full message text
 * @property {Object} templateVariables - Variables for message personalization
 * @property {string} templateVariables.tenant_name - Tenant's name
 * @property {string} templateVariables.property_name - Property name
 * @property {number} templateVariables.rent_amount - Rent amount
 * @property {string} templateVariables.due_date - Due date
 * @property {Object} metadata - Tracking metadata
 * @property {string} metadata.reminder_id - Reminder schedule ID
 * @property {string} metadata.lease_id - Lease ID
 * @property {string} metadata.tenant_id - Tenant ID
 */

/**
 * @typedef {Object} ReminderGenerationResult
 * @property {boolean} success - Whether generation was successful
 * @property {number} generatedReminders - Number of reminders created
 * @property {number} skippedReminders - Number of reminders skipped
 * @property {number} errorReminders - Number of reminders with errors
 */

/**
 * @typedef {Object} ReminderStatistics
 * @property {number} total - Total number of reminders
 * @property {Array<{status: string, count: number}>} byStatus - Count by status
 * @property {Array<{status: string, count: number}>} today - Today's counts by status
 * @property {Array<{reminder_type: string, count: number}>} byType - Count by reminder type
 */

/**
 * @typedef {Object} APIResponse
 * @property {boolean} success - Whether the request was successful
 * @property {string} message - Response message
 * @property {*} data - Response data
 * @property {number} [count] - Count of items (for list responses)
 * @property {Object} [filters] - Applied filters
 */

export {};
