// ABOUTME: Newsletter generation service for automated weekly newsletters
// ABOUTME: Selects featured articles and recent content for email campaigns

import { prisma } from '@/lib/prisma';
import { sendEmailBatch } from '@/lib/resend';
import { WeeklyNewsletterEmail } from '@/emails/weekly-newsletter';
import { PATHS } from '@/paths';

interface Article {
  id: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  slug: string;
  coverImage?: string;
  author: {
    username?: string;
    email: string;
  };
  readingTime: number;
  publishedAt: Date;
}

interface NewsletterContent {
  featuredArticle: Article;
  recentArticles: Article[];
  weekOf: string;
}

export class NewsletterGenerator {
  /**
   * Generate newsletter content from recent articles
   */
  async generateWeeklyContent(): Promise<NewsletterContent> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Get articles published in the last week
    const recentArticles = await prisma.article.findMany({
      where: {
        isPublished: true,
        publishedAt: {
          gte: oneWeekAgo,
        },
      },
      include: {
        author: {
          select: {
            username: true,
            email: true,
          },
        },
      },
      orderBy: [
        { viewCount: 'desc' }, // Prioritize popular articles
        { publishedAt: 'desc' },
      ],
      take: 10, // Get up to 10 articles
    });

    if (recentArticles.length === 0) {
      // Fallback to recent articles from the last month if no weekly content
      const oneMonthAgo = new Date();
      oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

      const fallbackArticles = await prisma.article.findMany({
        where: {
          isPublished: true,
          publishedAt: {
            gte: oneMonthAgo,
          },
        },
        include: {
          author: {
            select: {
              username: true,
              email: true,
            },
          },
        },
        orderBy: [
          { viewCount: 'desc' },
          { publishedAt: 'desc' },
        ],
        take: 5,
      });

      if (fallbackArticles.length === 0) {
        throw new Error('No articles available for newsletter generation');
      }

      return this.formatNewsletterContent(fallbackArticles.filter(a => a.publishedAt) as any);
    }

    return this.formatNewsletterContent(recentArticles.filter(a => a.publishedAt) as any);
  }

  /**
   * Format articles into newsletter content structure
   */
  private formatNewsletterContent(articles: Array<{
    id: string;
    title: string;
    subtitle: string | null;
    excerpt: string;
    slug: string;
    coverImage?: string | null;
    author: {
      username: string | null;
      email: string;
    };
    readingTime: number;
    publishedAt: Date;
  }>): NewsletterContent {
    const [featuredArticle, ...otherArticles] = articles;

    return {
      featuredArticle: {
        id: featuredArticle.id,
        title: featuredArticle.title,
        subtitle: featuredArticle.subtitle || undefined,
        excerpt: featuredArticle.excerpt,
        slug: featuredArticle.slug,
        coverImage: featuredArticle.coverImage || undefined,
        author: {
          username: featuredArticle.author.username || undefined,
          email: featuredArticle.author.email,
        },
        readingTime: featuredArticle.readingTime,
        publishedAt: featuredArticle.publishedAt,
      },
      recentArticles: otherArticles.slice(0, 3).map((article) => ({
        id: article.id,
        title: article.title,
        subtitle: article.subtitle || undefined,
        excerpt: article.excerpt,
        slug: article.slug,
        coverImage: article.coverImage || undefined,
        author: {
          username: article.author.username || undefined,
          email: article.author.email,
        },
        readingTime: article.readingTime,
        publishedAt: article.publishedAt,
      })),
      weekOf: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };
  }

  /**
   * Send newsletter to all active subscribers
   */
  async sendWeeklyNewsletter(): Promise<{ sent: number; failed: number }> {
    try {
      // Generate newsletter content
      const content = await this.generateWeeklyContent();

      // Get all active subscribers
      const subscribers = await prisma.newsletterSubscription.findMany({
        where: {
          isActive: true,
        },
        include: {
          user: {
            select: {
              username: true,
            },
          },
        },
      });

      if (subscribers.length === 0) {
        console.log('No active subscribers found');
        return { sent: 0, failed: 0 };
      }

      // Prepare email batch
      const emails = subscribers.map((subscriber) => ({
        to: subscriber.email,
        subject: `MenFem Weekly: ${content.featuredArticle.title}`,
        react: WeeklyNewsletterEmail({
          userEmail: subscriber.email,
          userName: subscriber.user?.username || undefined,
          featuredArticle: content.featuredArticle,
          recentArticles: content.recentArticles,
          weekOf: content.weekOf,
          unsubscribeUrl: `${process.env.BASE_URL}${PATHS.NEWSLETTER.UNSUBSCRIBE}?email=${encodeURIComponent(subscriber.email)}`,
        }),
      }));

      // Send emails in batches (Resend has rate limits)
      const batchSize = 10; // Send 10 emails at a time
      let totalSent = 0;
      let totalFailed = 0;

      for (let i = 0; i < emails.length; i += batchSize) {
        const batch = emails.slice(i, i + batchSize);
        
        try {
          const result = await sendEmailBatch(batch);
          totalSent += result.successful;
          totalFailed += result.failed;
          
          // Wait a bit between batches to respect rate limits
          if (i + batchSize < emails.length) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
          }
        } catch (error) {
          console.error('Batch sending failed:', error);
          totalFailed += batch.length;
        }
      }

      console.log(`Newsletter sent: ${totalSent} successful, ${totalFailed} failed`);
      return { sent: totalSent, failed: totalFailed };

    } catch (error) {
      console.error('Newsletter generation failed:', error);
      throw error;
    }
  }

  /**
   * Preview newsletter content without sending
   */
  async previewNewsletter(): Promise<NewsletterContent> {
    return await this.generateWeeklyContent();
  }
}