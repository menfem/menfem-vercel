// ABOUTME: API route for previewing generated newsletter content
// ABOUTME: Returns JSON with articles that would be included in newsletter

import { NextResponse } from 'next/server';
import { NewsletterGenerator } from '@/features/newsletter/services/newsletter-generator';
import { getAuth } from '@/features/auth/queries/get-auth';

export async function GET() {
  try {
    // Basic auth check (expand this for admin-only access later)
    const { user } = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const generator = new NewsletterGenerator();
    const content = await generator.previewNewsletter();

    return NextResponse.json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error('Newsletter preview API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate newsletter preview',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}