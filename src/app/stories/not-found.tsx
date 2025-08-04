// ABOUTME: 404 not found page for invalid story routes or resources
// ABOUTME: Provides helpful navigation when users access non-existent story content

import Link from 'next/link';

export default function StoriesNotFound() {
  return (
    <div className="min-h-screen bg-brand-sage flex items-center justify-center">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-lg mx-auto">
          {/* 404 Visual */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-brand-brown opacity-20">404</h1>
          </div>
          
          {/* Content */}
          <h2 className="text-3xl font-bold text-brand-brown mb-4">
            Story Not Found
          </h2>
          
          <p className="text-gray-700 text-lg mb-8 leading-relaxed">
            The story you're looking for doesn't exist or may have been moved. 
            But don't worry – we have plenty of other compelling stories waiting for you.
          </p>
          
          {/* Navigation Options */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/stories"
              className="bg-brand-terracotta text-white px-8 py-3 rounded font-medium hover:bg-brand-rust transition-colors"
            >
              Browse All Stories
            </Link>
            
            <Link 
              href="/articles"
              className="border-2 border-brand-brown text-brand-brown px-8 py-3 rounded font-medium hover:bg-brand-cream transition-colors"
            >
              View Articles
            </Link>
            
            <Link 
              href="/"
              className="text-brand-brown hover:text-brand-terracotta font-medium px-8 py-3 transition-colors"
            >
              Return Home
            </Link>
          </div>
          
          {/* Suggested Categories */}
          <div className="mt-12 pt-8 border-t border-gray-300">
            <p className="text-gray-600 mb-4">Or explore these popular categories:</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link 
                href="/culture"
                className="bg-white text-brand-brown px-4 py-2 rounded hover:bg-brand-cream transition-colors"
              >
                Culture
              </Link>
              <Link 
                href="/personal-development"
                className="bg-white text-brand-brown px-4 py-2 rounded hover:bg-brand-cream transition-colors"
              >
                Personal Development
              </Link>
              <Link 
                href="/style"
                className="bg-white text-brand-brown px-4 py-2 rounded hover:bg-brand-cream transition-colors"
              >
                Style
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}