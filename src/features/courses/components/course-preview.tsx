// ABOUTME: Course preview component for non-enrolled users with curriculum overview
// ABOUTME: Shows course structure, sample content, and enrollment call-to-action

'use client';

import { useState } from 'react';
import { Play, Lock, CheckCircle, Clock, Users, BookOpen, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PricingCard } from '@/features/products/components/pricing-card';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface CoursePreviewProps {
  course: {
    id: string;
    title: string;
    description: string;
    thumbnailUrl?: string;
    price: number;
    comparePrice?: number;
    level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    duration: string;
    enrollmentCount?: number;
    rating?: number;
    reviewCount?: number;
    instructor?: {
      name: string;
      avatar?: string;
      bio?: string;
    };
    modules: Array<{
      id: string;
      title: string;
      description: string;
      order: number;
      lessons: Array<{
        id: string;
        title: string;
        duration?: number;
        isPreview?: boolean;
        hasVideo?: boolean;
      }>;
    }>;
    learningOutcomes?: string[];
    requirements?: string[];
    testimonials?: Array<{
      id: string;
      author: string;
      content: string;
      rating: number;
    }>;
  };
  productSlug: string;
}

export function CoursePreview({ course, productSlug }: CoursePreviewProps) {
  const [selectedModule, setSelectedModule] = useState(course.modules[0]?.id);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const selectedModuleData = course.modules.find(m => m.id === selectedModule);
  const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const previewLessons = course.modules.flatMap(m => m.lessons.filter(l => l.isPreview));
  const totalDuration = course.modules.flatMap(m => m.lessons).reduce((acc, lesson) => {
    return acc + (lesson.duration || 0);
  }, 0);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'BEGINNER': return 'bg-green-100 text-green-800';
      case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800';
      case 'ADVANCED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-8 mb-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Badge className={getLevelColor(course.level)}>
                {course.level}
              </Badge>
              {course.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{course.rating}</span>
                  {course.reviewCount && (
                    <span className="text-sm opacity-75">({course.reviewCount} reviews)</span>
                  )}
                </div>
              )}
            </div>

            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            
            <p className="text-lg opacity-90 mb-6 leading-relaxed">
              {showFullDescription ? course.description : course.description.slice(0, 200)}
              {course.description.length > 200 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="ml-2 underline hover:no-underline"
                >
                  {showFullDescription ? 'Show less' : 'Show more'}
                </button>
              )}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>{totalLessons} lessons</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(totalDuration)}</span>
              </div>
              {course.enrollmentCount && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{course.enrollmentCount.toLocaleString()} students</span>
                </div>
              )}
            </div>
          </div>

          {course.thumbnailUrl && (
            <div className="relative">
              <img 
                src={course.thumbnailUrl} 
                alt={course.title}
                className="w-full rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4">
                  <Play className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Learning Outcomes */}
          {course.learningOutcomes && course.learningOutcomes.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">What You&apos;ll Learn</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {course.learningOutcomes.map((outcome, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Course Curriculum */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Course Curriculum</h2>
              <div className="text-sm text-gray-600">
                {previewLessons.length} free preview{previewLessons.length !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Module Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {course.modules.map((module) => (
                <button
                  key={module.id}
                  onClick={() => setSelectedModule(module.id)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    selectedModule === module.id
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  Module {module.order}: {module.title}
                </button>
              ))}
            </div>

            {/* Selected Module Content */}
            {selectedModuleData && (
              <div>
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{selectedModuleData.title}</h3>
                  <p className="text-gray-600 text-sm">{selectedModuleData.description}</p>
                </div>

                <div className="space-y-2">
                  {selectedModuleData.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {lesson.isPreview ? (
                            <Play className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Lock className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{lesson.title}</p>
                          {lesson.duration && (
                            <p className="text-xs text-gray-500">{formatDuration(lesson.duration)}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {lesson.isPreview && (
                          <Badge variant="secondary" className="text-xs">Free Preview</Badge>
                        )}
                        {lesson.hasVideo && (
                          <Play className="h-3 w-3 text-gray-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Requirements */}
          {course.requirements && course.requirements.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
              <ul className="space-y-2">
                {course.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Instructor */}
          {course.instructor && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Instructor</h2>
              <div className="flex items-start gap-4">
                {course.instructor.avatar ? (
                  <img 
                    src={course.instructor.avatar} 
                    alt={course.instructor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-gray-400" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{course.instructor.name}</h3>
                  {course.instructor.bio && (
                    <p className="text-gray-600 text-sm leading-relaxed">{course.instructor.bio}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Testimonials */}
          {course.testimonials && course.testimonials.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Student Reviews</h2>
              <div className="space-y-6">
                {course.testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="border-l-4 border-blue-100 pl-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-4 w-4",
                              i < testimonial.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            )}
                          />
                        ))}
                      </div>
                      <span className="font-medium text-gray-900">{testimonial.author}</span>
                    </div>
                    <p className="text-gray-700 italic">&quot;{testimonial.content}&quot;</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(course.price)}
                </span>
                {course.comparePrice && (
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(course.comparePrice)}
                  </span>
                )}
              </div>
              {course.comparePrice && (
                <div className="text-sm text-green-600 font-medium">
                  Save {formatPrice(course.comparePrice - course.price)}
                </div>
              )}
            </div>

            <PricingCard
              type="one-time"
              price={course.price}
              productId={course.id}
              buttonText="Enroll Now"
              className="w-full mb-4"
            />

            <div className="text-center">
              <p className="text-xs text-gray-600 mb-2">30-day money-back guarantee</p>
              <Link href={`/products/${productSlug}`} className="text-sm text-blue-600 hover:underline">
                View full product details
              </Link>
            </div>
          </div>

          {/* Course Features */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">This course includes:</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <span>{totalLessons} video lessons</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-blue-600" />
                <span>{formatDuration(totalDuration)} of content</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span>Lifetime access</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-blue-600" />
                <span>Certificate of completion</span>
              </div>
              {previewLessons.length > 0 && (
                <div className="flex items-center gap-3">
                  <Play className="h-4 w-4 text-blue-600" />
                  <span>{previewLessons.length} free preview lessons</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}