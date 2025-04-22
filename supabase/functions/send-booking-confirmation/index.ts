// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface BookingData {
  id: string
  date: string
  start_time: string
  end_time: string
  status: string
  user: {
    email: string
    full_name: string
  }
}

interface RequestPayload {
  booking: BookingData
}

console.info('Booking confirmation server started');

Deno.serve(async (req: Request) => {
  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('PROJECT_URL') ?? '',
      Deno.env.get('SERVICE_ROLE_KEY') ?? '',
    )

    // Get the booking data from the request body
    const { booking }: RequestPayload = await req.json()

    if (!booking) {
      throw new Error('No booking data provided')
    }

    // Format the date and time
    const date = new Date(booking.date)
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    const formattedTime = `${booking.start_time} - ${booking.end_time}`

    // Send the email using Supabase's email service
    const { error } = await supabaseClient.auth.admin.sendEmail(
      booking.user.email,
      {
        emailTemplate: 'booking-confirmation',
        data: {
          full_name: booking.user.full_name,
          date: formattedDate,
          time: formattedTime,
          status: booking.status
        }
      }
    )

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ message: 'Email sent successfully' }),
      {
        headers: { 
          'Content-Type': 'application/json',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'An error occurred' }),
      {
        headers: { 
          'Content-Type': 'application/json',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        },
        status: 400,
      },
    )
  }
}) 