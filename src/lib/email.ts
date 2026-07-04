import { Resend } from 'resend';

/**
 * Admin recipients that should receive every inquiry and booking notification
 * across the website.
 */
export const ADMIN_RECIPIENTS = [
  'reservation@royalphuketcity.com',
  'sales@royalphuketcity.com',
  'marketing@royalphuketcity.com',
  'puttipop.l@royalphuketcity.com',
  'gm@royalphuketcity.com',
  'wallop.c@royalphuketcity.com',
] as const;

export const SENDER_EMAIL = 'Royal Wellness Spa <marketing@royalphuketcity.com>';
export const REPLY_TO_EMAIL = 'marketing@royalphuketcity.com';

export function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
}

const GOLD = '#B8974F';

function formatTHB(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatBookingDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }
  return parsed.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export interface BookingEmailData {
  reference: string;
  guestName: string;
  email: string;
  phone?: string | null;
  date: string;
  time: string;
  guests?: number | null;
  service: string;
  amount: number;
  occasion?: string | null;
  specialRequests?: string | null;
  transactionId?: string | null;
}

function bookingHeader(): string {
  return `
    <div style="background: linear-gradient(135deg, ${GOLD} 0%, #9A7B3A 100%); padding: 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px; font-weight: normal;">Royal Wellness Spa</h1>
      <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0 0; font-size: 13px; letter-spacing: 2px;">PHUKET · THAILAND</p>
    </div>
  `;
}

function bookingDetailsTable(data: BookingEmailData): string {
  return `
    <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
      <tr>
        <td style="padding: 10px 0; color: #333; font-weight: bold; width: 150px; font-size: 14px;">Booking Ref:</td>
        <td style="padding: 10px 0; color: #666; font-size: 14px;">${data.reference}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; color: #333; font-weight: bold; font-size: 14px;">Guest Name:</td>
        <td style="padding: 10px 0; color: #666; font-size: 14px;">${data.guestName}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; color: #333; font-weight: bold; font-size: 14px;">Date:</td>
        <td style="padding: 10px 0; color: #666; font-size: 14px;">${formatBookingDate(data.date)}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; color: #333; font-weight: bold; font-size: 14px;">Time:</td>
        <td style="padding: 10px 0; color: #666; font-size: 14px;">${data.time}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; color: #333; font-weight: bold; font-size: 14px; vertical-align: top;">Treatment(s):</td>
        <td style="padding: 10px 0; color: #666; font-size: 14px;">${(data.service || '').replace(/\|/g, '<br />')}</td>
      </tr>
      ${data.guests ? `
      <tr>
        <td style="padding: 10px 0; color: #333; font-weight: bold; font-size: 14px;">Guests:</td>
        <td style="padding: 10px 0; color: #666; font-size: 14px;">${data.guests}</td>
      </tr>
      ` : ''}
      ${data.occasion ? `
      <tr>
        <td style="padding: 10px 0; color: #333; font-weight: bold; font-size: 14px;">Note:</td>
        <td style="padding: 10px 0; color: #666; font-size: 14px;">${data.occasion}</td>
      </tr>
      ` : ''}
      ${data.specialRequests ? `
      <tr>
        <td style="padding: 10px 0; color: #333; font-weight: bold; font-size: 14px; vertical-align: top;">Special Requests:</td>
        <td style="padding: 10px 0; color: #666; font-size: 14px; white-space: pre-wrap;">${data.specialRequests}</td>
      </tr>
      ` : ''}
      ${data.transactionId ? `
      <tr>
        <td style="padding: 10px 0; color: #333; font-weight: bold; font-size: 14px;">Transaction ID:</td>
        <td style="padding: 10px 0; color: #666; font-size: 14px;">${data.transactionId}</td>
      </tr>
      ` : ''}
      <tr>
        <td style="padding: 14px 0 0 0; color: #333; font-weight: bold; font-size: 16px; border-top: 2px solid #eee;">Total Paid:</td>
        <td style="padding: 14px 0 0 0; color: ${GOLD}; font-size: 18px; font-weight: bold; border-top: 2px solid #eee;">฿${formatTHB(data.amount)}</td>
      </tr>
    </table>
  `;
}

function generateCustomerBookingHtml(data: BookingEmailData): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      ${bookingHeader()}
      <div style="padding: 30px; background-color: #ffffff;">
        <h2 style="color: ${GOLD}; margin-top: 0; font-size: 22px;">Booking Confirmed — Thank You, ${data.guestName}!</h2>
        <p style="color: #666; line-height: 1.7; font-size: 15px;">
          Your payment was successful and your spa reservation is now confirmed. We look forward to welcoming you.
        </p>

        <div style="background-color: #f9f9f9; padding: 20px; margin: 24px 0; border: 1px solid #eee; text-align: center;">
          <p style="margin: 0 0 8px 0; color: #666; font-size: 13px;">Your Booking Reference</p>
          <p style="margin: 0; color: ${GOLD}; font-size: 28px; font-weight: bold; letter-spacing: 1px;">${data.reference}</p>
          <p style="margin: 10px 0 0 0; color: #888; font-size: 12px;">Please quote this reference when you arrive.</p>
        </div>

        <h3 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px; font-size: 16px;">Booking Details</h3>
        ${bookingDetailsTable(data)}

        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />

        <p style="color: #666; font-size: 14px; line-height: 1.6;">Need to make changes or have questions? Contact us:</p>
        <p style="color: #666; font-size: 14px; line-height: 1.8;">
          <strong>Phone:</strong> 090-596-9666<br />
          <strong>WhatsApp:</strong> 090-596-9666<br />
          <strong>LINE:</strong> @royalwellnessspa
        </p>
      </div>
      <div style="background-color: #1a1a1a; padding: 20px; text-align: center;">
        <p style="color: rgba(255,255,255,0.6); margin: 0; font-size: 12px;">
          Royal Wellness Spa | 3rd Floor, Royal Phuket City Hotel, Phuket, Thailand
        </p>
      </div>
    </div>
  `;
}

function generateAdminBookingHtml(data: BookingEmailData): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      ${bookingHeader()}
      <div style="padding: 30px; background-color: #f9f9f9;">
        <h2 style="color: #333; border-bottom: 2px solid ${GOLD}; padding-bottom: 12px; margin-top: 0; font-size: 20px;">
          New Confirmed Booking (Paid)
        </h2>
        <p style="color: #666; font-size: 14px;"><strong>Customer Email:</strong>
          <a href="mailto:${data.email}" style="color: ${GOLD};">${data.email}</a>
        </p>
        <p style="color: #666; font-size: 14px;"><strong>Customer Phone:</strong> ${data.phone || 'Not provided'}</p>
        ${bookingDetailsTable(data)}
        <p style="color: #888; font-size: 12px; margin-top: 30px; text-align: center;">
          Paid on ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Asia/Bangkok' })} (Bangkok Time)
        </p>
      </div>
      <div style="background-color: #1a1a1a; padding: 20px; text-align: center;">
        <p style="color: rgba(255,255,255,0.5); margin: 0; font-size: 11px;">
          This booking was made via royalwellnessspa.vercel.app
        </p>
      </div>
    </div>
  `;
}

/**
 * Sends a booking confirmation to the customer and a notification to all admin
 * recipients. Safe to call without a configured Resend key (it no-ops).
 */
export async function sendBookingConfirmationEmails(data: BookingEmailData): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.warn('RESEND_API_KEY not configured — skipping booking emails');
    return;
  }

  try {
    await resend.emails.send({
      from: SENDER_EMAIL,
      to: [...ADMIN_RECIPIENTS],
      replyTo: data.email,
      subject: `✅ New Spa Booking (Paid): ${data.guestName} — Ref: ${data.reference}`,
      html: generateAdminBookingHtml(data),
    });
  } catch (error) {
    console.error('Failed to send admin booking notification:', error);
  }

  if (data.email) {
    try {
      await resend.emails.send({
        from: SENDER_EMAIL,
        to: [data.email],
        replyTo: REPLY_TO_EMAIL,
        subject: `Your Royal Wellness Spa Booking is Confirmed (Ref: ${data.reference})`,
        html: generateCustomerBookingHtml(data),
      });
    } catch (error) {
      console.error('Failed to send customer booking confirmation:', error);
    }
  }
}
