// ABOUTME: Newsletter confirmation email template with MenFem branding
// ABOUTME: Sent to users after newsletter signup to confirm subscription

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

interface NewsletterConfirmationProps {
  userEmail: string;
  confirmationUrl: string;
  userName?: string;
}

export const NewsletterConfirmationEmail = ({
  userEmail,
  confirmationUrl,
  userName,
}: NewsletterConfirmationProps) => {
  const greeting = userName ? `Hello ${userName}` : 'Hello';

  return (
    <Html>
      <Head />
      <Preview>Confirm your MenFem newsletter subscription</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto py-8 px-4 max-w-2xl">
            {/* Header */}
            <Section className="text-center mb-8">
              <Text className="text-3xl font-bold text-gray-900 mb-2">
                MenFem
              </Text>
              <Text className="text-lg text-gray-600">
                The Modern Men's Movement
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-8">
              <Text className="text-xl font-semibold text-gray-900 mb-4">
                {greeting}! 👋
              </Text>
              
              <Text className="text-gray-700 mb-4 leading-relaxed">
                Thank you for subscribing to the MenFem newsletter! We're excited to have you join our community of men who are redefining what it means to be masculine in the modern world.
              </Text>

              <Text className="text-gray-700 mb-6 leading-relaxed">
                To complete your subscription and start receiving our weekly insights on culture, style, and personal development, please confirm your email address by clicking the button below.
              </Text>

              {/* Confirmation Button */}
              <Section className="text-center mb-8">
                <Button
                  href={confirmationUrl}
                  className="bg-gray-900 text-white px-8 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
                >
                  Confirm Subscription
                </Button>
              </Section>

              <Text className="text-sm text-gray-500 mb-6">
                If the button doesn't work, you can copy and paste this link into your browser:
                <br />
                <span className="text-blue-600 break-all">{confirmationUrl}</span>
              </Text>
            </Section>

            {/* What to Expect */}
            <Section className="bg-gray-50 p-6 rounded-lg mb-8">
              <Text className="text-lg font-semibold text-gray-900 mb-4">
                What to expect:
              </Text>
              <ul className="space-y-2 text-gray-700">
                <li>• Weekly newsletter with our latest articles and insights</li>
                <li>• Exclusive content on modern masculinity and personal growth</li>
                <li>• Early access to events and workshops in London</li>
                <li>• Curated recommendations for style, culture, and lifestyle</li>
              </ul>
            </Section>

            {/* Footer */}
            <Section className="border-t border-gray-200 pt-6 text-center">
              <Text className="text-sm text-gray-500 mb-2">
                This email was sent from MenFem to {userEmail}
              </Text>
              <Text className="text-xs text-gray-400">
                If you didn't sign up for our newsletter, you can safely ignore this email.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default NewsletterConfirmationEmail;