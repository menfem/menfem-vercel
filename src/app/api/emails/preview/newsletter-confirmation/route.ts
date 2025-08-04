// ABOUTME: API route for previewing newsletter confirmation email template
// ABOUTME: Development tool for testing email templates with sample data

import { render } from '@react-email/render';
import { NextResponse } from 'next/server';
import { NewsletterConfirmationEmail } from '@/emails/newsletter-confirmation';

export async function GET() {
  try {
    const html = await render(
      NewsletterConfirmationEmail({
        userEmail: 'test@example.com',
        userName: 'Alex Thompson',
        confirmationUrl: `${process.env.BASE_URL || 'http://localhost:3000'}/newsletter/confirm/sample-token`,
      })
    );

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Error rendering email template:', error);
    return NextResponse.json(
      { error: 'Failed to render email template' },
      { status: 500 }
    );
  }
}