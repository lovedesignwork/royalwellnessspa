import { NextRequest, NextResponse } from 'next/server';
import { insertSpaContact } from '@/lib/supabase-rpch';

interface ContactRequest {
  name: string;
  email: string;
  phone?: string;
  country?: string;
  inquiryType?: string;
  subject?: string;
  message: string;
  _ts?: number;
}

const ADMIN_RECIPIENTS = [
  "marketing@royalphuketcity.com",
  "wallop.c@royalwellnessspaphuket.com",
] as const;

const SENDER_EMAIL = "Royal Wellness Spa <marketing@royalphuketcity.com>";
const REPLY_TO_EMAIL = "marketing@royalphuketcity.com";

export async function POST(request: NextRequest) {
  try {
    const body: ContactRequest = await request.json();
    const { name, email, phone, country, inquiryType, subject, message, _ts } = body;

    // Basic anti-spam: form should be filled at least 3 seconds after load
    if (_ts && Date.now() - _ts < 3000) {
      return NextResponse.json(
        { success: false, error: 'Please take your time filling out the form.' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    let submissionId: string | null = null;

    // Insert into RPCH admin dashboard (spa_contact_submissions table)
    const result = await insertSpaContact({
      name,
      email,
      phone,
      subject,
      message,
      inquiry_type: inquiryType || 'general',
      inquiry_type_label: inquiryType || 'General Inquiry',
    });

    if (result.ok && result.id) {
      submissionId = result.id;
    } else {
      console.error('Contact submission to Supabase failed:', result.error);
    }

    const referenceNumber = submissionId 
      ? `RWS-${submissionId.slice(0, 8).toUpperCase()}` 
      : `RWS-${Date.now()}`;

    // Send emails via Resend if API key is available
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);

      // Send notification to admin
      await resend.emails.send({
        from: SENDER_EMAIL,
        to: [...ADMIN_RECIPIENTS],
        replyTo: email,
        subject: `🧘 New Spa Inquiry: ${subject || inquiryType || 'General'} - Ref: ${referenceNumber}`,
        html: generateAdminEmailHtml({
          name,
          email,
          phone,
          country,
          inquiryType,
          subject,
          message,
          referenceNumber,
        }),
      });

      // Send confirmation to customer
      await resend.emails.send({
        from: SENDER_EMAIL,
        to: [email],
        replyTo: REPLY_TO_EMAIL,
        subject: `Thank You for Contacting Royal Wellness Spa (Ref: ${referenceNumber})`,
        html: generateCustomerEmailHtml({
          name,
          email,
          phone,
          subject,
          message,
          referenceNumber,
        }),
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully.',
      referenceNumber,
    });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateAdminEmailHtml(data: {
  name: string;
  email: string;
  phone?: string;
  country?: string;
  inquiryType?: string;
  subject?: string;
  message: string;
  referenceNumber: string;
}): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #B8974F 0%, #9A7B3A 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: normal;">Royal Wellness Spa</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0 0; font-size: 13px; letter-spacing: 2px;">PHUKET · THAILAND</p>
      </div>
      <div style="padding: 30px; background-color: #f9f9f9;">
        <h2 style="color: #333; border-bottom: 2px solid #B8974F; padding-bottom: 12px; margin-top: 0; font-size: 20px;">
          New Contact Form Submission
        </h2>
        <p style="color: #666; font-size: 14px;"><strong>Reference Number:</strong> ${data.referenceNumber}</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
          <tr>
            <td style="padding: 10px 0; color: #333; font-weight: bold; width: 120px; font-size: 14px;">Name:</td>
            <td style="padding: 10px 0; color: #666; font-size: 14px;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #333; font-weight: bold; font-size: 14px;">Email:</td>
            <td style="padding: 10px 0; color: #666; font-size: 14px;"><a href="mailto:${data.email}" style="color: #B8974F;">${data.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #333; font-weight: bold; font-size: 14px;">Phone:</td>
            <td style="padding: 10px 0; color: #666; font-size: 14px;">${data.phone || 'Not provided'}</td>
          </tr>
          ${data.country ? `
          <tr>
            <td style="padding: 10px 0; color: #333; font-weight: bold; font-size: 14px;">Country:</td>
            <td style="padding: 10px 0; color: #666; font-size: 14px;">${data.country}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 10px 0; color: #333; font-weight: bold; font-size: 14px;">Inquiry Type:</td>
            <td style="padding: 10px 0; color: #666; font-size: 14px;">${data.inquiryType || 'General Inquiry'}</td>
          </tr>
          ${data.subject ? `
          <tr>
            <td style="padding: 10px 0; color: #333; font-weight: bold; font-size: 14px;">Subject:</td>
            <td style="padding: 10px 0; color: #666; font-size: 14px;">${data.subject}</td>
          </tr>
          ` : ''}
        </table>
        
        <div style="background-color: white; padding: 20px; border-left: 4px solid #B8974F; margin: 24px 0;">
          <h3 style="color: #333; margin-top: 0; font-size: 16px;">Message:</h3>
          <p style="color: #666; line-height: 1.7; margin: 0; font-size: 14px; white-space: pre-wrap;">${data.message}</p>
        </div>
        
        <p style="color: #888; font-size: 12px; margin-top: 30px; text-align: center;">
          Submitted on ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Asia/Bangkok' })} (Bangkok Time)
        </p>
      </div>
      <div style="background-color: #1a1a1a; padding: 20px; text-align: center;">
        <p style="color: rgba(255,255,255,0.5); margin: 0; font-size: 11px;">
          This inquiry was submitted via royalwellnessspa.vercel.app
        </p>
      </div>
    </div>
  `;
}

function generateCustomerEmailHtml(data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  referenceNumber: string;
}): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #B8974F 0%, #9A7B3A 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: normal;">Royal Wellness Spa</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0 0; font-size: 13px; letter-spacing: 2px;">PHUKET · THAILAND</p>
      </div>
      <div style="padding: 30px; background-color: #ffffff;">
        <h2 style="color: #B8974F; margin-top: 0; font-size: 22px;">Thank You, ${data.name}!</h2>
        <p style="color: #666; line-height: 1.7; font-size: 15px;">
          We have received your message and a member of our team will get back to you shortly.
        </p>
        
        <div style="background-color: #f9f9f9; padding: 20px; margin: 24px 0; border: 1px solid #eee; text-align: center;">
          <p style="margin: 0 0 8px 0; color: #666; font-size: 13px;">Your Reference Number</p>
          <p style="margin: 0; color: #B8974F; font-size: 28px; font-weight: bold; letter-spacing: 1px;">${data.referenceNumber}</p>
          <p style="margin: 10px 0 0 0; color: #888; font-size: 12px;">Please quote this reference in any future correspondence.</p>
        </div>
        
        <h3 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px; font-size: 16px;">Your Submission Details:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; color: #333; font-weight: bold; width: 100px; font-size: 14px;">Name:</td>
            <td style="padding: 10px 0; color: #666; font-size: 14px;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #333; font-weight: bold; font-size: 14px;">Email:</td>
            <td style="padding: 10px 0; color: #666; font-size: 14px;">${data.email}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #333; font-weight: bold; font-size: 14px;">Phone:</td>
            <td style="padding: 10px 0; color: #666; font-size: 14px;">${data.phone || 'Not provided'}</td>
          </tr>
          ${data.subject ? `
          <tr>
            <td style="padding: 10px 0; color: #333; font-weight: bold; font-size: 14px;">Subject:</td>
            <td style="padding: 10px 0; color: #666; font-size: 14px;">${data.subject}</td>
          </tr>
          ` : ''}
        </table>
        
        <div style="background-color: #faf9f7; padding: 16px; border-left: 3px solid #B8974F; margin: 20px 0;">
          <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${data.message}</p>
        </div>
        
        <div style="background-color: #B8974F; color: white; padding: 20px; margin: 24px 0; text-align: center;">
          <p style="margin: 0 0 6px 0; font-size: 13px;">Our team typically responds within</p>
          <p style="margin: 0; font-size: 22px; font-weight: bold;">24 Business Hours</p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
        
        <p style="color: #666; font-size: 14px; line-height: 1.6;">
          If you have any urgent inquiries, please contact us directly:
        </p>
        <p style="color: #666; font-size: 14px; line-height: 1.8;">
          <strong>Phone:</strong> 090-596-9666<br />
          <strong>WhatsApp:</strong> 090-596-9666<br />
          <strong>LINE:</strong> @royalwellnessspa<br />
          <strong>Email:</strong> wallop.c@royalwellnessspaphuket.com
        </p>
      </div>
      <div style="background-color: #1a1a1a; padding: 20px; text-align: center;">
        <p style="color: rgba(255,255,255,0.6); margin: 0; font-size: 12px;">
          Royal Wellness Spa | 3rd Floor, Royal Phuket City Hotel, Phuket, Thailand
        </p>
        <p style="color: rgba(255,255,255,0.4); margin: 10px 0 0 0; font-size: 11px;">
          This is an automated confirmation. If you need to reply, please email wallop.c@royalwellnessspaphuket.com
        </p>
      </div>
    </div>
  `;
}
