# Reminder Scheduler System Documentation

## Overview
The Reminder Scheduler System is a comprehensive backend solution for property rent management that automatically generates and manages reminders for rent payments, lease renewals, and other property-related notifications. It integrates with WhatsApp for message delivery (Sprint 3) and provides full CRUD operations through RESTful APIs.

## Features
- **Automated Reminder Generation**: Creates reminders for all active leases
- **Configurable Triggers**: Customizable reminder timing and messages
- **WhatsApp Integration Ready**: Prepared for Sprint 3 WhatsApp API integration
- **Multi-type Reminders**: Rent due, lease renewal, maintenance, inspection
- **Status Tracking**: Pending, sent, failed, cancelled status management
- **Personalized Messages**: Dynamic message templates with tenant/lease data
- **RESTful APIs**: Complete CRUD operations
- **Cron Job Support**: Automated daily reminder generation

## Database Schema

### Tables Created
1. **reminder_triggers** - Configuration for reminder types and timing
2. **reminder_schedules** - Actual reminder instances for tenants

### Key Fields
- **reminder_triggers**: trigger_name, days_offset, trigger_type, message_template
- **reminder_schedules**: lease_id, tenant_id, trigger_date, status, personalized_message

## API Endpoints

### Core Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reminders/generate` | Generate reminders for current period |
| GET | `/api/reminders/today` | Get today's pending reminders |
| GET | `/api/reminders/date-range` | Get reminders by date range |
| GET | `/api/reminders/triggers` | Get all active reminder triggers |
| POST/PUT | `/api/reminders/triggers` | Create/update reminder triggers |
| GET | `/api/reminders/[id]` | Get specific reminder |
| PUT | `/api/reminders/[id]` | Update reminder status |
| DELETE | `/api/reminders/[id]` | Cancel reminder (soft delete) |
| POST | `/api/reminders/cron` | Cron job endpoint for automation |

### Query Parameters
- **date-range**: `startDate`, `endDate`, `status`, `type`
- **triggers**: All endpoints support standard REST parameters

## Default Reminder Triggers

| Trigger Name | Days Offset | Type | Description |
|--------------|-------------|------|-------------|
| rent_due_3_days_before | -3 | rent_due | 3 days before rent due |
| rent_due_on_due_date | 0 | rent_due | On the rent due date |
| rent_due_2_days_overdue | 2 | rent_due | 2 days after due date |
| lease_renewal_30_days_before | -30 | lease_renewal | 30 days before lease expires |
| lease_renewal_15_days_before | -15 | lease_renewal | 15 days before lease expires |

## Message Template Variables
Available variables for message personalization:
- `{{tenant_name}}` - Tenant's full name
- `{{property_name}}` - Property name
- `{{rent_amount}}` - Monthly rent amount
- `{{due_date}}` - Rent due date (DD/MM/YYYY)
- `{{lease_end_date}}` - Lease expiration date

## Setup Instructions

### 1. Database Migration
```bash
# Run the migration to create reminder tables
supabase db reset
# OR apply the migration manually
supabase migration up
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Setup Script
```bash
node scripts/setup-reminder-system.js
```

### 4. Environment Variables
Create `.env` file:
```env
CRON_SECRET=your-cron-secret-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### 5. Test API Endpoints
```bash
# Generate reminders
curl -X POST http://localhost:3000/api/reminders/generate

# Get today's reminders
curl http://localhost:3000/api/reminders/today

# Get reminders by date range
curl "http://localhost:3000/api/reminders/date-range?startDate=2024-01-01&endDate=2024-12-31"

# Test cron job
curl -X POST http://localhost:3000/api/reminders/cron \
  -H "Authorization: Bearer your-cron-secret-key"
```

## Usage Examples

### 1. Generate Reminders Programmatically
```javascript
import { ReminderSchedulerService } from './src/services/ReminderSchedulerService.js';

const scheduler = new ReminderSchedulerService();

// Generate reminders for current month
const result = await scheduler.generateReminderSchedules(new Date());
console.log(`Generated ${result.generatedReminders} reminders`);

// Get today's reminders
const todaysReminders = await scheduler.getTodaysReminders();

// Prepare WhatsApp messages
const whatsappMessages = scheduler.bulkPrepareWhatsAppMessages(todaysReminders);
```

### 2. Custom Reminder Triggers
```javascript
// Create custom trigger
const customTrigger = {
  trigger_name: 'rent_due_7_days_before',
  days_offset: -7,
  trigger_type: 'rent_due',
  message_template: 'Early reminder: {{tenant_name}}, your rent is due in 7 days',
  is_active: true,
  priority: 1
};

await scheduler.upsertReminderTrigger(customTrigger);
```

### 3. WhatsApp Integration (Sprint 3)
```javascript
// Prepare message for WhatsApp
const reminder = await scheduler.getTodaysReminders()[0];
const whatsappData = scheduler.prepareWhatsAppMessageData(reminder);

// Example WhatsApp data structure
{
  to: '+254712345678',
  message: 'Hi John, your rent of 50000 KES for Sample Apartment is due on 05/12/2024',
  templateVariables: {
    tenant_name: 'John',
    property_name: 'Sample Apartment',
    rent_amount: 50000,
    due_date: '05/12/2024'
  },
  metadata: {
    reminder_id: 'uuid',
    lease_id: 'uuid',
    tenant_id: 'uuid'
  }
}
```

## Cron Job Setup

### Vercel Cron Job
Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/reminders/cron",
      "schedule": "0 8 * * *"
    }
  ]
}
```

### Manual Cron Setup
```bash
# Daily at 8 AM
0 8 * * * curl -X POST https://your-app.com/api/reminders/cron \
  -H "Authorization: Bearer your-cron-secret-key"
```

## Error Handling
- All APIs include comprehensive error handling
- Failed reminders are logged with failure reasons
- Retry mechanisms for failed deliveries
- Validation for all input parameters

## Monitoring & Debugging
- Check reminder statistics: `scheduler.getReminderStatistics()`
- Monitor failed reminders through status tracking
- Use Supabase dashboard to view reminder tables
- Check application logs for detailed error information

## Security Considerations
- Cron endpoints require authorization tokens
- Input validation on all API endpoints
- Rate limiting recommended for production
- Secure storage of sensitive data

## Next Steps for Sprint 3
1. Integrate WhatsApp Business API
2. Add message delivery tracking
3. Implement retry mechanisms for failed messages
4. Add delivery reports and analytics
5. Create admin dashboard for reminder management
6. Add bulk operations for reminders

## Support
For issues or questions, please check:
1. Database connectivity
2. Supabase configuration
3. API endpoint responses
4. Console logs for detailed error messages
