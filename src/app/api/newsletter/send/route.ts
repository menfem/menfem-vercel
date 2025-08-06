// ABOUTME: API route for triggering newsletter sending via POST request
// ABOUTME: Designed for use with cron jobs or automation systems

import { NextResponse } from 'next/server';
import { NewsletterGenerator } from '@/features/newsletter/services/newsletter-generator';

export async function POST() {
  try {
    // TODO: Add API key authentication when ready for production
    // const authHeader = request.headers.get('authorization');
    // if (!authHeader || authHeader !== `Bearer ${process.env.NEWSLETTER_API_KEY}`) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // For development, allow any POST request
    // In production, this should be secured with API key or other authentication

    const generator = new NewsletterGenerator();
    const result = await generator.sendWeeklyNewsletter();

    return NextResponse.json({
      success: true,
      message: `Newsletter sent successfully!`,
      data: {
        sent: result.sent,
        failed: result.failed,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Newsletter sending API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send newsletter',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// GET method for testing/health check
export async function GET() {
  return NextResponse.json({
    message: 'Newsletter API is active. Use POST to trigger newsletter sending.',
    timestamp: new Date().toISOString(),
  });
}