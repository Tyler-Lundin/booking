-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.availability CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop existing functions and triggers
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;

-- Create users table (this will be extended by Supabase Auth)
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.users enable row level security;

-- Create availability table
create table public.availability (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  day_of_week smallint not null check (day_of_week between 0 and 6), -- 0 = Sunday, 6 = Saturday
  start_time time not null,
  end_time time not null,
  buffer_minutes integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint valid_time_range check (end_time > start_time)
);

-- Enable RLS
alter table public.availability enable row level security;

-- Create bookings table
create table public.bookings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  date date not null,
  start_time time not null,
  end_time time not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint valid_time_range check (end_time > start_time)
);

-- Enable RLS
alter table public.bookings enable row level security;

-- Create function to handle updated_at timestamps
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_users_updated_at
  before update on public.users
  for each row
  execute function public.handle_updated_at();

create trigger handle_availability_updated_at
  before update on public.availability
  for each row
  execute function public.handle_updated_at();

create trigger handle_bookings_updated_at
  before update on public.bookings
  for each row
  execute function public.handle_updated_at();

-- Create policies for users table
create policy "Users can view their own data"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update their own data"
  on public.users for update
  using (auth.uid() = id);

-- Create policies for availability table
create policy "Users can view their own availability"
  on public.availability for select
  using (auth.uid() = user_id);

create policy "Users can manage their own availability"
  on public.availability for all
  using (auth.uid() = user_id);

-- Create policies for bookings table
create policy "Users can view their own bookings"
  on public.bookings for select
  using (auth.uid() = user_id);

create policy "Users can create bookings"
  on public.bookings for insert
  with check (true); -- For now, allow anyone to create bookings

create policy "Users can update their own bookings"
  on public.bookings for update
  using (auth.uid() = user_id);

-- Create indexes for better query performance
create index if not exists idx_availability_user_id on public.availability(user_id);
create index if not exists idx_availability_day_of_week on public.availability(day_of_week);
create index if not exists idx_bookings_user_id on public.bookings(user_id);
create index if not exists idx_bookings_date on public.bookings(date);
create index if not exists idx_bookings_status on public.bookings(status); 