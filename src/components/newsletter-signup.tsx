// ABOUTME: Newsletter signup component for homepage with email input and subscription
// ABOUTME: Styled to match Service95 aesthetic with prominent call-to-action

import { Form, SubmitButton } from '@/components/form';
import { subscribeToNewsletter } from '@/features/newsletter/actions/subscribe';

export function NewsletterSignup() {
  return (
    <section className="bg-brand-cream py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join the Menfem Newsletter
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Get weekly curated content on culture, style, tech, and more. 
            Insider recommendations delivered straight to your inbox.
          </p>
          
          <Form action={subscribeToNewsletter} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-3 border border-brand-sand rounded-md focus:outline-none focus:ring-2 focus:ring-brand-terracotta focus:border-transparent bg-white"
            />
            <SubmitButton className="bg-brand-terracotta hover:bg-brand-rust text-white px-6 py-3">
              SUBSCRIBE
            </SubmitButton>
          </Form>
        </div>
      </div>
    </section>
  )
}