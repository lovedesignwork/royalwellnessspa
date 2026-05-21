import { NextRequest, NextResponse } from 'next/server';
import { insertSpaContact } from '@/lib/supabase-rpch';

interface ContactRequest {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactRequest = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Insert into RPCH admin dashboard (spa_contact_submissions table)
    const result = await insertSpaContact({
      name,
      email,
      phone,
      subject,
      message,
      inquiry_type: 'general',
      inquiry_type_label: subject || 'General Inquiry',
    });

    if (!result.ok) {
      console.error('Contact submission failed:', result.error);
      return NextResponse.json(
        { success: false, error: 'Failed to submit message. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully.',
    });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
