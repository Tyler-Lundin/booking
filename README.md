# Booking - Smart Scheduling Platform

Booking is a modern, full-featured appointment scheduling platform designed to help businesses manage their bookings efficiently. Built with Next.js, TypeScript, and Supabase, it provides a seamless experience for both service providers and their clients.

## Features

### For Service Providers
- **Admin Dashboard**: Comprehensive overview of bookings, availability, and business metrics
- **Availability Management**: 
  - Set working hours and days
  - Configure buffer times between appointments
  - Manage multiple time slots efficiently
- **Booking Management**:
  - View and manage all appointments
  - Handle booking statuses (confirmed, cancelled, etc.)
  - Track client information
- **Embeddable Booking Widget**: Easy integration into existing websites
- **User Management**: Secure authentication and role-based access control

### For Clients
- **Easy Booking Process**: Simple and intuitive interface for scheduling appointments
- **Real-time Availability**: See up-to-date available slots
- **Booking History**: Access past and upcoming appointments
- **Email Notifications**: Receive booking confirmations and reminders

## Technical Stack

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Heroicons
- **Deployment**: Vercel (recommended)

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── admin/             # Admin dashboard and management
│   │   ├── availability/  # Availability management
│   │   ├── bookings/      # Booking management
│   │   ├── config/        # Business configuration
│   │   └── embeds/        # Embeddable booking widget
│   ├── auth/              # Authentication pages
│   ├── bookings/          # Client booking pages
│   ├── dashboard/         # User dashboard
│   └── [embed_id]/        # Embedded booking pages
├── components/            # Reusable components
│   ├── admin/            # Admin-specific components
│   └── shared/           # Shared components
├── contexts/             # React contexts
├── lib/                  # Utility functions and configurations
└── types/                # TypeScript type definitions
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Configure your Supabase project and update the environment variables
5. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `NEXT_PUBLIC_APP_URL`: Your application URL (for email links)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

# Booking System Implementation Plan

## Overview
This document outlines the plan for implementing a comprehensive booking system using Supabase as the backend. The system will handle appointments, availability, and client management.

## Database Schema

### Core Tables

1. **embeds** (Existing)
   - Primary table for each booking widget instance
   - Contains settings and configuration

2. **appointment_types**
   - Types of appointments/services offered
   - Fields:
     - `id` (uuid, primary key)
     - `embed_id` (uuid, foreign key to embeds)
     - `name` (text)
     - `description` (text)
     - `duration_minutes` (integer)
     - `price` (decimal, optional)
     - `is_active` (boolean)
     - `created_at` (timestamp)
     - `updated_at` (timestamp)

3. **appointment_fields**
   - Custom fields for appointment types
   - Fields:
     - `id` (uuid, primary key)
     - `appointment_type_id` (uuid, foreign key to appointment_types)
     - `label` (text)
     - `type` (text, enum: 'text', 'number', 'select', 'checkbox')
     - `options` (jsonb, for select fields)
     - `is_required` (boolean)
     - `order` (integer)
     - `created_at` (timestamp)

4. **availability**
   - Weekly availability slots
   - Fields:
     - `id` (uuid, primary key)
     - `embed_id` (uuid, foreign key to embeds)
     - `day_of_week` (integer, 0-6)
     - `start_time` (time)
     - `end_time` (time)
     - `is_recurring` (boolean)
     - `created_at` (timestamp)

5. **bookings**
   - Client appointments
   - Fields:
     - `id` (uuid, primary key)
     - `embed_id` (uuid, foreign key to embeds)
     - `appointment_type_id` (uuid, foreign key to appointment_types)
     - `client_name` (text)
     - `client_email` (text)
     - `client_phone` (text, optional)
     - `date` (date)
     - `start_time` (time)
     - `end_time` (time)
     - `status` (text, enum: 'pending', 'confirmed', 'cancelled', 'completed')
     - `notes` (text, optional)
     - `created_at` (timestamp)
     - `updated_at` (timestamp)

6. **booking_metadata**
   - Custom field values for bookings
   - Fields:
     - `id` (uuid, primary key)
     - `booking_id` (uuid, foreign key to bookings)
     - `field_id` (uuid, foreign key to appointment_fields)
     - `value` (text)
     - `created_at` (timestamp)

## Implementation Steps

### 1. Database Setup
1. Create a Supabase migration script that:
   - Creates all necessary tables
   - Sets up appropriate foreign key constraints
   - Creates indexes for performance
   - Sets up Row Level Security (RLS) policies
   - Creates database functions for common operations

2. Create a CLI tool that:
   - Connects to Supabase
   - Runs the migration script
   - Sets up initial admin user
   - Configures basic settings

### 2. API Layer
1. Create TypeScript types for all database entities
2. Implement Supabase client functions for:
   - CRUD operations on all tables
   - Complex queries (e.g., availability checking)
   - Data validation
   - Error handling

### 3. Frontend Implementation
1. Dashboard Components:
   - Appointment type management
   - Availability management
   - Booking management
   - Client management
   - Settings management

2. Booking Widget:
   - Step-by-step booking flow
   - Availability calendar
   - Form handling
   - Confirmation process

### 4. Security & Permissions
1. Implement RLS policies for:
   - Embed owners (full access)
   - Admins (full access)
   - Clients (limited access)
   - Public (read-only where appropriate)

2. Set up authentication:
   - User roles
   - Session management
   - API key handling

## Development Workflow

1. **Local Development**
   - Use Supabase CLI for local development
   - Set up local database
   - Run migrations locally
   - Test changes before deployment

2. **Testing**
   - Unit tests for database functions
   - Integration tests for API endpoints
   - E2E tests for booking flow
   - Performance testing

3. **Deployment**
   - Automated deployment pipeline
   - Database migration strategy
   - Backup and recovery procedures

## Example Supabase CLI Commands

```bash
# Initialize new project
supabase init

# Create new migration
supabase migration new create_booking_schema

# Apply migrations
supabase db push

# Generate types
supabase gen types typescript --local > src/types/database.types.ts

# Start local development
supabase start
```

## Next Steps

1. Create the initial migration script
2. Set up the development environment
3. Implement core database functions
4. Build the basic UI components
5. Test and iterate

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
