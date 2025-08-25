 # Project Setup – Justina 
- [x] Create and share GitHub repo
- [x] Set up Firebase project (Authentication + Firestore + Hosting)
- [x] Write and share Firestore schema doc 
- [x] Create README 
  - [x] weekly team check-in meetings

## Authentication (Samuel)
- [x] Set up Firebase **Email/Password Authentication**
- [x] Create login and signup pages
- [x] Implement **role assignment**: landlord, tenant
- [x] On login, **redirect user** to appropriate dashboard based on role
- [x] Store role and user data in users collection in Firestore

# Property & Unit Management (Ian)
- [x] Create **Add Property** form
- [x] Create **Add Unit** form (linked to property)
- [x] Display list of properties + nested units in landlord dashboard
- [x] Connect forms to Firestore:
  - [x] properties collection
  - [x] units collection



# Integration & Testing (Dev 5)
- [x] Help integrate Property → Unit → Tenant → Lease flow
- [x] Test form submission and Firestore writes
- [x] Validate required fields, add input validation
- [x] Check real-time updates using Firestore listeners
- [x] Assist with mobile-friendly layout polishing

# End of Sprint 1 Deliverables (Due Week 2)
- [x] Firebase Auth + Firestore fully set up
- [x] Landlord can:
  - [x] Add Property
  - [x] Add Unit under Property
  - [x] Add Tenant
  - [x] Create Lease linked to Unit & Tenant
- [x] Role-based dashboard access working
- [x] Landlord dashboard UI is functional
- [x] Firestore schema and collections are created
- [x] Repo is organized and updated on GitHub




##  Sprint 2 

###  Oversee Rent Log System
- [ ] Define rent log structure (tenant, unit, month, amount, status)
- [ ] Align with database schema
- [ ] Plan update & display logic

### Design Finance Dashboard - Ian
  Add "Export to PDF/CSV" buttons
- [ ] Format data for reports
- [ ] Create wireframes or mockups
- [ ] Add dashboard components to frontend
- a chart

###  Create Rent Log & Expense Tracker UI - Gregg
- [ ] Design rent log table
- [ ] Add expense input form
- [ ] Connect UI to backend (Supabase)
- [ ] Enable editing/deleting records

###  Implement Rent Status Filters - Gregg
- [ ] Add filters (Paid, Due, Overdue)
- [ ] Define filtering logic
- [ ] Update rent log view

###  Automate Rent Log Generation 
- [ ] Define monthly rent entry trigger
- [ ] Auto-generate logs with "due" status
- [ ] Connect with tenant/unit data

###  Build Backend for Late Fees & Rent Status
- [ ] Define late fee rules
- [ ] Simulate late payments
- [ ] function to calculate late fees
- [ ] Auto-update rent status
- [ ] Link payments to rent logs


###  Add Filter-by-Property/Unit/Month
- [ ] Add dropdown filters
- [ ] Update UI with filtered data
- [ ] Support filtered queries in backend

###  Build Backend Reminder Scheduler
- [ ] Define reminder logic (e.g., 3 days before due)
- [ ] Schedule with Supabase/cron
- [ ] Store reminder logs in DB

### Define WhatsApp Notification Triggers
- [ ] Set up WhatsApp API integration
- [ ] Identify notification triggers (rent due, late fee, receipt)
- [ ] Trigger messages from backend functions

###  Goal by End of Sprint 2:
> A tenant can view their dashboard, check rent status, and profile details.  
> The landlord can track rent payments and payment history, while the system auto-calculates due/overdue statuses.