// ABOUTME: Newsletter subscription form component
// ABOUTME: Reusable form for email newsletter signup

import { Form, SubmitButton } from '@/components/form';
import { subscribeToNewsletter } from '../actions/subscribe';

export function NewsletterForm() {
  return (
    <Form action={subscribeToNewsletter} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          id="email"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="you@example.com"
        />
      </div>
      <SubmitButton className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        Subscribe to Newsletter
      </SubmitButton>
    </Form>
  );
}