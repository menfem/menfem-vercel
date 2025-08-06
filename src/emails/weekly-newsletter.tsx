// ABOUTME: Weekly newsletter email template with featured articles
// ABOUTME: Automatically generated with recent published articles

import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Button,
  Tailwind,
} from '@react-email/components';

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

interface WeeklyNewsletterProps {
  userEmail: string;
  userName?: string;
  featuredArticle: Article;
  recentArticles: Article[];
  weekOf: string;
  unsubscribeUrl: string;
}

export const WeeklyNewsletterEmail = ({
  userEmail,
  userName,
  featuredArticle,
  recentArticles,
  weekOf,
  unsubscribeUrl,
}: WeeklyNewsletterProps) => {
  const greeting = userName ? `Hello ${userName}` : 'Hello there';
  const baseUrl = process.env.BASE_URL || 'https://menfem.com';

  return (
    <Html>
      <Head />
      <Preview>This week at MenFem: {featuredArticle.title}</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto py-8 px-4 max-w-2xl">
            {/* Header */}
            <Section className="text-center mb-8 border-b border-gray-200 pb-6">
              <Text className="text-3xl font-bold text-gray-900 mb-2">
                MenFem Weekly
              </Text>
              <Text className="text-lg text-gray-600">
                Week of {weekOf}
              </Text>
            </Section>

            {/* Greeting */}
            <Section className="mb-8">
              <Text className="text-xl font-semibold text-gray-900 mb-4">
                {greeting}! 📰
              </Text>
              
              <Text className="text-gray-700 mb-6 leading-relaxed">
                Welcome to your weekly dose of modern masculinity insights. This week we&apos;re exploring new perspectives on culture, style, and personal development.
              </Text>
            </Section>

            {/* Featured Article */}
            <Section className="mb-10">
              <Text className="text-lg font-semibold text-gray-900 mb-4 border-l-4 border-gray-900 pl-4">
                🌟 Featured This Week
              </Text>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <Text className="text-xl font-bold text-gray-900 mb-2">
                  {featuredArticle.title}
                </Text>
                
                {featuredArticle.subtitle && (
                  <Text className="text-lg text-gray-700 mb-3 font-medium">
                    {featuredArticle.subtitle}
                  </Text>
                )}
                
                <Text className="text-gray-600 mb-4 leading-relaxed">
                  {featuredArticle.excerpt}
                </Text>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>
                    By {featuredArticle.author.username || featuredArticle.author.email}
                  </span>
                  <span>{featuredArticle.readingTime} min read</span>
                </div>
                
                <Button
                  href={`${baseUrl}/articles/${featuredArticle.slug}`}
                  className="bg-gray-900 text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors"
                >
                  Read Article
                </Button>
              </div>
            </Section>

            {/* Recent Articles */}
            {recentArticles.length > 0 && (
              <Section className="mb-10">
                <Text className="text-lg font-semibold text-gray-900 mb-4 border-l-4 border-gray-600 pl-4">
                  📚 More This Week
                </Text>
                
                <div className="space-y-4">
                  {recentArticles.map((article) => (
                    <div key={article.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <Text className="text-lg font-semibold text-gray-900 mb-1">
                        <a 
                          href={`${baseUrl}/articles/${article.slug}`}
                          className="text-gray-900 hover:text-gray-600 transition-colors"
                        >
                          {article.title}
                        </a>
                      </Text>
                      
                      <Text className="text-gray-600 mb-2 text-sm leading-relaxed">
                        {article.excerpt}
                      </Text>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>
                          By {article.author.username || article.author.email}
                        </span>
                        <span>{article.readingTime} min read</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Call to Action */}
            <Section className="bg-gray-900 text-white p-6 rounded-lg mb-8 text-center">
              <Text className="text-lg font-semibold mb-2">
                Want More?
              </Text>
              <Text className="text-gray-300 mb-4">
                Explore our full collection of articles on modern masculinity, style, and personal growth.
              </Text>
              <Button
                href={`${baseUrl}/articles`}
                className="bg-white text-gray-900 px-6 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors"
              >
                Browse All Articles
              </Button>
            </Section>

            {/* Social Links */}
            <Section className="text-center mb-8">
              <Text className="text-sm text-gray-600 mb-4">
                Follow us for daily insights:
              </Text>
              <div className="flex justify-center space-x-4">
                {/* Add social media links when available */}
                <Text className="text-sm text-gray-500">
                  Social links coming soon
                </Text>
              </div>
            </Section>

            {/* Footer */}
            <Section className="border-t border-gray-200 pt-6 text-center">
              <Text className="text-sm text-gray-500 mb-2">
                This newsletter was sent to {userEmail}
              </Text>
              <Text className="text-xs text-gray-400 mb-2">
                You&apos;re receiving this because you subscribed to MenFem updates.
              </Text>
              <Text className="text-xs text-gray-400">
                <a href={unsubscribeUrl} className="text-gray-600 hover:text-gray-800 underline">
                  Unsubscribe
                </a>
                {' | '}
                <a href={`${baseUrl}`} className="text-gray-600 hover:text-gray-800 underline">
                  Visit Website
                </a>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WeeklyNewsletterEmail;