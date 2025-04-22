# Custom Booking Flow

A self-hosted booking system built with Supabase and Next.js, designed for personal or freelance developer portfolios. This system provides a clean, minimalist interface for clients to book time while giving you full control over your availability and data.

## Features

- Clean, minimalist booking interface
- Timezone-aware scheduling
- Admin dashboard for managing bookings and availability
- Email confirmations and reminders
- Full control over your data and scheduling logic
- Dark mode support
- Responsive design

## Tech Stack

- Next.js 15 (App Router)
- Supabase (Postgres + Auth)
- TypeScript
- Tailwind CSS
- Luxon (for timezone handling)

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- npm or yarn

### Environment Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Database Setup

1. Create the following tables in your Supabase database:

   ```sql
   -- Users table
   create table users (
     id uuid default uuid_generate_v4() primary key,
     email text unique not null,
     role text check (role in ('admin', 'client')) not null,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null
   );

   -- Availability table
   create table availability (
     id uuid default uuid_generate_v4() primary key,
     day_of_week integer check (day_of_week between 0 and 6) not null,
     start_time time not null,
     end_time time not null,
     buffer_minutes integer not null
   );

   -- Bookings table
   create table bookings (
     id uuid default uuid_generate_v4() primary key,
     user_id uuid references users(id) not null,
     date date not null,
     start_time time not null,
     end_time time not null,
     status text check (status in ('pending', 'confirmed', 'canceled')) not null,
     notes text,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null
   );
   ```

2. Set up Row Level Security (RLS) policies in Supabase for each table.

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the booking interface.

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
├── lib/             # Utility functions and configurations
├── types/           # TypeScript type definitions
└── utils/           # Helper functions
```

## Customization

### Styling

The project uses Tailwind CSS for styling. You can customize the look and feel by modifying the `tailwind.config.js` file.

### Timezone Handling

All timezone operations are handled using Luxon. The system automatically detects the user's timezone and displays times accordingly.

### Email Notifications

Email notifications are handled through Supabase Edge Functions. You can customize the email templates and logic in the `supabase/functions` directory.

## License

MIT
