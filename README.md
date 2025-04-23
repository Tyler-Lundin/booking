# Slot Fox - Smart Scheduling Platform

Slot Fox is a modern, full-featured appointment scheduling platform designed to help businesses manage their bookings efficiently. Built with Next.js, TypeScript, and Supabase, it provides a seamless experience for both service providers and their clients.

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
