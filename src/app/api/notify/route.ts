import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { bookingId, type, booking } = await request.json();

    if (!bookingId || !type || !booking) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { name, date, start_time, end_time, email, phone_number } = booking;

    // Format the date and time
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const formattedStartTime = new Date(`2000-01-01T${start_time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const formattedEndTime = new Date(`2000-01-01T${end_time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    if (type === 'email' && email) {
      // Send email notification
      const { data, error } = await resend.emails.send({
        from: 'Booking System <notifications@yourdomain.com>',
        to: email,
        subject: 'Booking Confirmation',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #059669;">Booking Confirmation</h2>
            <p>Hello ${name},</p>
            <p>Your booking has been confirmed for:</p>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Time:</strong> ${formattedStartTime} - ${formattedEndTime}</p>
            </div>
            <p>If you need to make any changes, please contact us.</p>
            <p>Best regards,<br>Your Booking Team</p>
          </div>
        `
      });

      if (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
          { error: 'Failed to send email notification' },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, data });
    }

    if (type === 'sms' && phone_number) {
      // Send SMS notification
      const { data, error } = await resend.emails.send({
        from: 'Booking System <notifications@yourdomain.com>',
        to: '5095145418@vtext.com', // Verizon SMS gateway
        subject: 'Booking Confirmation',
        text: `Booking Confirmation: ${name}, your appointment is scheduled for ${formattedDate} at ${formattedStartTime}.`
      });

      if (error) {
        console.error('Error sending SMS:', error);
        return NextResponse.json(
          { error: 'Failed to send SMS notification' },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json(
      { error: 'Invalid notification type or missing contact information' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in notification route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 