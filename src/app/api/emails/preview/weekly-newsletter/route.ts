// ABOUTME: API route for previewing weekly newsletter email template
// ABOUTME: Development tool for testing newsletter template with sample articles

import { render } from '@react-email/render';
import { NextResponse } from 'next/server';
import { WeeklyNewsletterEmail } from '@/emails/weekly-newsletter';

export async function GET() {
  try {
    // Sample data for template preview
    const sampleFeaturedArticle = {
      id: '1',
      title: 'The Modern Gentleman\'s Guide to Style',
      subtitle: 'Building a wardrobe that reflects your authentic self',
      excerpt: 'Style isn\'t about following trends—it\'s about expressing who you are. Learn how to build a wardrobe that works for the modern man.',
      slug: 'modern-gentleman-style-guide',
      coverImage: '/images/style-guide.jpg',
      author: {
        username: 'james_writer',
        email: 'james@menfem.com',
      },
      readingTime: 8,
      publishedAt: new Date(),
    };

    const sampleRecentArticles = [
      {
        id: '2',
        title: 'Redefining Masculinity in the Digital Age',
        excerpt: 'How social media and technology are changing what it means to be a man in 2024.',
        slug: 'redefining-masculinity-digital-age',
        author: {
          username: 'alex_smith',
          email: 'alex@menfem.com',
        },
        readingTime: 6,
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: '3',
        title: 'The Art of Mindful Living',
        excerpt: 'Practical strategies for staying present and intentional in a fast-paced world.',
        slug: 'art-of-mindful-living',
        author: {
          username: 'marcus_jones',
          email: 'marcus@menfem.com',
        },
        readingTime: 5,
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        id: '4',
        title: 'Building Better Relationships',
        excerpt: 'Communication skills that will transform your personal and professional connections.',
        slug: 'building-better-relationships',
        author: {
          username: 'david_brown',
          email: 'david@menfem.com',
        },
        readingTime: 7,
        publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
    ];

    const weekOf = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const html = await render(
      WeeklyNewsletterEmail({
        userEmail: 'subscriber@example.com',
        userName: 'Alex',
        featuredArticle: sampleFeaturedArticle,
        recentArticles: sampleRecentArticles,
        weekOf,
        unsubscribeUrl: `${process.env.BASE_URL || 'http://localhost:3000'}/newsletter/unsubscribe?email=subscriber@example.com`,
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