// ABOUTME: Not found page component for article detail routes
// ABOUTME: Displays user-friendly error when article doesn't exist or isn't published

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-sage flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <h1 className="text-4xl font-bold text-brand-brown mb-4">Article Not Found</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          The article you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/articles">
            <Button className="bg-brand-terracotta hover:bg-brand-rust text-white">
              Browse All Articles
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="border-brand-brown text-brand-brown hover:bg-brand-cream">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}