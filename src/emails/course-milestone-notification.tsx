// ABOUTME: Course milestone notification email template for student progress
// ABOUTME: Sends congratulations and next steps for course progress milestones

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';

interface CourseMilestoneNotificationProps {
  studentName: string;
  courseTitle: string;
  milestone: {
    type: 'course_started' | 'halfway_complete' | 'almost_complete' | 'course_completed';
    progressPercentage: number;
    lessonsCompleted: number;
    totalLessons: number;
  };
  nextSteps: {
    nextLessonTitle?: string;
    nextLessonUrl?: string;
    certificateUrl?: string;
    reviewUrl?: string;
  };
  courseUrl: string;
  baseUrl: string;
}

const getMilestoneContent = (milestone: CourseMilestoneNotificationProps['milestone']) => {
  switch (milestone.type) {
    case 'course_started':
      return {
        emoji: '🚀',
        title: 'Welcome to Your Learning Journey!',
        description: 'You\'ve just started your course. Great choice!',
        color: '#3b82f6'
      };
    case 'halfway_complete':
      return {
        emoji: '🎯',
        title: 'Halfway There!',
        description: 'You\'re making excellent progress. Keep up the momentum!',
        color: '#f59e0b'
      };
    case 'almost_complete':
      return {
        emoji: '⚡',
        title: 'Almost Done!',
        description: 'You\'re so close to completing this course. Push through!',
        color: '#ef4444'
      };
    case 'course_completed':
      return {
        emoji: '🎉',
        title: 'Congratulations!',
        description: 'You\'ve successfully completed the course. Well done!',
        color: '#22c55e'
      };
    default:
      return {
        emoji: '📚',
        title: 'Course Progress Update',
        description: 'Keep up the great work!',
        color: '#6b7280'
      };
  }
};

export default function CourseMilestoneNotification({
  studentName,
  courseTitle,
  milestone,
  nextSteps,
  courseUrl,
  baseUrl,
}: CourseMilestoneNotificationProps) {
  const content = getMilestoneContent(milestone);
  const previewText = `${content.title} - ${milestone.progressPercentage}% complete`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto py-8 px-4 max-w-2xl">
            {/* Header */}
            <Section className="bg-white rounded-t-lg p-8 text-center">
              <div className="text-6xl mb-4">{content.emoji}</div>
              <Heading className="text-2xl font-bold text-gray-900 mb-2">
                {content.title}
              </Heading>
              <Text className="text-gray-600 text-lg">
                Hi {studentName}, {content.description}
              </Text>
            </Section>

            {/* Progress Section */}
            <Section className="bg-white p-8 border-t border-gray-200">
              <div className="text-center mb-6">
                <Heading className="text-xl font-semibold text-gray-900 mb-2">
                  {courseTitle}
                </Heading>
                
                {/* Progress Bar */}
                <div className="bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className="h-3 rounded-full"
                    style={{ 
                      width: `${milestone.progressPercentage}%`,
                      backgroundColor: content.color 
                    }}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold" style={{ color: content.color }}>
                      {milestone.progressPercentage}%
                    </div>
                    <div className="text-sm text-gray-600">Complete</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {milestone.lessonsCompleted}
                    </div>
                    <div className="text-sm text-gray-600">Lessons Done</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {milestone.totalLessons - milestone.lessonsCompleted}
                    </div>
                    <div className="text-sm text-gray-600">Remaining</div>
                  </div>
                </div>
              </div>
            </Section>

            {/* Action Section */}
            <Section className="bg-white p-8 border-t border-gray-200">
              {milestone.type === 'course_completed' ? (
                <div className="text-center space-y-4">
                  <Text className="text-gray-700 mb-4">
                    🎓 You've earned your certificate of completion! Share your achievement and continue your learning journey.
                  </Text>
                  
                  <div className="space-y-3">
                    {nextSteps.certificateUrl && (
                      <Button
                        href={nextSteps.certificateUrl}
                        className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium text-center w-full"
                      >
                        📜 Download Certificate
                      </Button>
                    )}
                    
                    {nextSteps.reviewUrl && (
                      <Button
                        href={nextSteps.reviewUrl}
                        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium text-center w-full"
                      >
                        ⭐ Leave a Review
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Text className="text-gray-700 mb-4">
                    {nextSteps.nextLessonTitle ? (
                      <>Ready for your next lesson: <strong>{nextSteps.nextLessonTitle}</strong></>
                    ) : (
                      'Continue your learning journey and maintain your momentum!'
                    )}
                  </Text>
                  
                  <Button
                    href={nextSteps.nextLessonUrl || courseUrl}
                    className="inline-block text-white px-8 py-4 rounded-lg font-medium text-lg"
                    style={{ backgroundColor: content.color }}
                  >
                    Continue Learning →
                  </Button>
                </div>
              )}
            </Section>

            {/* Tips Section */}
            <Section className="bg-gray-50 p-6 border-t border-gray-200">
              <Heading className="text-lg font-semibold text-gray-900 mb-3">
                💡 Learning Tips
              </Heading>
              
              {milestone.type === 'course_started' && (
                <div className="space-y-2 text-sm text-gray-700">
                  <Text>• Set aside dedicated time for learning each day</Text>
                  <Text>• Take notes as you go through the lessons</Text>
                  <Text>• Don't hesitate to replay sections you want to review</Text>
                </div>
              )}
              
              {milestone.type === 'halfway_complete' && (
                <div className="space-y-2 text-sm text-gray-700">
                  <Text>• You're doing great! Consistency is key to success</Text>
                  <Text>• Review previous lessons to reinforce your learning</Text>
                  <Text>• Apply what you've learned in real-world scenarios</Text>
                </div>
              )}
              
              {milestone.type === 'almost_complete' && (
                <div className="space-y-2 text-sm text-gray-700">
                  <Text>• You're almost there! Don't lose momentum now</Text>
                  <Text>• Prepare to implement what you've learned</Text>
                  <Text>• Think about sharing your new knowledge with others</Text>
                </div>
              )}
              
              {milestone.type === 'course_completed' && (
                <div className="space-y-2 text-sm text-gray-700">
                  <Text>• Practice and apply your new skills regularly</Text>
                  <Text>• Share your certificate on LinkedIn</Text>
                  <Text>• Consider enrolling in related advanced courses</Text>
                </div>
              )}
            </Section>

            {/* Footer */}
            <Section className="bg-white rounded-b-lg p-6 text-center border-t border-gray-200">
              <Text className="text-gray-600 text-sm mb-4">
                Keep up the excellent work! We're proud of your dedication to learning.
              </Text>
              
              <Hr className="my-4" />
              
              <div className="text-xs text-gray-500 space-y-1">
                <Text>
                  Questions? Reply to this email or visit our{' '}
                  <Link href={`${baseUrl}/support`} className="text-blue-600">
                    support center
                  </Link>
                </Text>
                <Text>
                  <Link href={`${baseUrl}/courses`} className="text-blue-600">
                    Browse more courses
                  </Link>
                  {' • '}
                  <Link href={`${baseUrl}/profile/notifications`} className="text-blue-600">
                    Manage notifications
                  </Link>
                </Text>
              </div>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}