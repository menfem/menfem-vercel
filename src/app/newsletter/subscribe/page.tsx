// ABOUTME: Newsletter subscription page with branded signup form
// ABOUTME: Dedicated page for newsletter signups from navigation and external links

import { NewsletterForm } from '@/features/newsletter/components/newsletter-form';
import Link from 'next/link';

export default function NewsletterSubscribePage() {
  return (
    <div className="min-h-screen bg-brand-sage">
      {/* Header */}
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="text-center">
          <Link 
            href="/" 
            className="inline-block text-brand-brown hover:text-brand-terracotta text-sm font-medium mb-8 transition-colors"
          >
            ← Back to MenFem
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-brand-brown mb-4">
            Join the MenFem Newsletter
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get weekly curated content on culture, style, tech, and more. 
            Insider recommendations delivered straight to your inbox.
          </p>
        </div>
      </div>

      {/* Newsletter Form */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <NewsletterForm />
        </div>
      </div>

      {/* What to Expect */}
      <div className="bg-brand-cream py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-brand-brown text-center mb-12">
              What to Expect
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-terracotta rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">📚</span>
                </div>
                <h3 className="font-semibold text-brand-brown mb-2">Curated Content</h3>
                <p className="text-gray-600 text-sm">
                  Handpicked articles on culture, style, and personal development
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-terracotta rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">🎯</span>
                </div>
                <h3 className="font-semibold text-brand-brown mb-2">Weekly Delivery</h3>
                <p className="text-gray-600 text-sm">
                  Every Friday, get the week's best recommendations
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-terracotta rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">✨</span>
                </div>
                <h3 className="font-semibold text-brand-brown mb-2">Exclusive Access</h3>
                <p className="text-gray-600 text-sm">
                  Early access to events and member-only content
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}