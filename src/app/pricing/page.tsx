// ABOUTME: Pricing page with subscription plans and feature comparisons
// ABOUTME: Handles premium subscription conversion and course pricing display

import { Suspense } from 'react';
import { Check, Star, Zap } from 'lucide-react';
import { getAuthOrRedirect } from '@/features/auth/queries/get-auth-or-redirect';
import { getPremiumAccess } from '@/features/auth/queries/get-premium-access';
import { getProducts } from '@/features/products/queries/get-products';
import { PricingCard } from '@/features/products/components/pricing-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default async function PricingPage() {
  const { hasAccess } = await getPremiumAccess();
  const { list: courses } = await getProducts({ type: 'COURSE', limit: 3 });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Growth Path
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of men transforming their relationships, confidence, and purpose. 
            Get access to premium content, exclusive courses, and personal development tools.
          </p>
        </div>

        {/* Subscription Plans */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Access</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">$0</div>
              <p className="text-gray-600">Forever free</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Access to public articles and stories</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Weekly newsletter updates</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Community event notifications</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Basic video library access</span>
              </li>
            </ul>

            <Link href="/articles" className="w-full">
              <Button className="w-full" variant="outline">Start Reading</Button>
            </Link>
          </div>

          {/* Premium Plan */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-500 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-blue-500 text-white px-4 py-1">
                <Star className="h-4 w-4 mr-1" />
                Most Popular
              </Badge>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Access</h3>
              <div className="text-4xl font-bold text-blue-600 mb-2">$20</div>
              <p className="text-gray-600">per month</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-blue-500 mr-3" />
                <span className="font-medium">Everything in Free, plus:</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-blue-500 mr-3" />
                <span>Exclusive premium video content</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-blue-500 mr-3" />
                <span>Advanced relationship strategies</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-blue-500 mr-3" />
                <span>Live Q&A session access</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-blue-500 mr-3" />
                <span>Premium community access</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-blue-500 mr-3" />
                <span>Monthly bonus content</span>
              </li>
            </ul>

            {hasAccess ? (
              <Button className="w-full" disabled>
                Current Plan
              </Button>
            ) : (
              <Suspense fallback={<Button className="w-full" disabled>Loading...</Button>}>
                <PricingCard
                  type="subscription"
                  price={2000} // $20 in cents
                  priceId="price_1QSGGw02z6oR9gRZwVAo2xSH"
                  buttonText="Start Premium"
                  className="w-full"
                />
              </Suspense>
            )}
          </div>
        </div>

        {/* Course Offerings */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Transformational Courses
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Deep-dive programs designed to create lasting change in your relationships, 
              confidence, and personal growth.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="mb-4">
                  {course.images?.[0] && (
                    <img 
                      src={course.images[0]} 
                      alt={course.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {course.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {course.shortDesc}
                  </p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-gray-900">
                    ${(course.price / 100).toLocaleString()}
                  </div>
                  {course.comparePrice && (
                    <div className="text-sm text-gray-500 line-through">
                      ${(course.comparePrice / 100).toLocaleString()}
                    </div>
                  )}
                </div>

                <Link href={`/products/${course.slug}`} className="w-full">
                  <Button className="w-full">Learn More</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can cancel your premium subscription at any time. You'll continue to have 
                access to premium content until the end of your billing period.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What's included in the courses?
              </h3>
              <p className="text-gray-600">
                Each course includes video lessons, written materials, exercises, and lifetime access. 
                Some courses also include live group sessions and one-on-one coaching calls.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a money-back guarantee?
              </h3>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee on all courses. If you're not completely 
                satisfied, we'll refund your purchase in full.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How do I access premium content?
              </h3>
              <p className="text-gray-600">
                Once you subscribe, you'll immediately have access to all premium videos and content. 
                Premium content is marked with a special badge throughout the site.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 bg-blue-50 rounded-2xl p-12">
          <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Life?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of men who are already building better relationships, 
            stronger confidence, and clearer purpose.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg">Browse Courses</Button>
            </Link>
            <Link href="/watch">
              <Button size="lg" variant="outline">Watch Videos</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}