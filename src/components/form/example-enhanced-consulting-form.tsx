// ABOUTME: Example demonstration of enhanced form components
// ABOUTME: Shows the new form pattern applied to consulting inquiry form structure

'use client';

import { z } from 'zod';
import { EnhancedForm, FormField, SelectField } from '@/components/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SubmitButton } from '@/components/form/submit-button';
import { CompanySize, BudgetRange, ConsultingType } from '@prisma/client';
import { submitConsultingInquiry } from '@/features/consulting/actions/submit-inquiry';

// This would normally be exported from the consulting feature
const consultingInquirySchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Valid email is required'),
  company: z.string().min(1, 'Company name is required').max(200),
  jobTitle: z.string().min(1, 'Job title is required').max(100),
  phone: z.string().optional(),
  industryVertical: z.string().min(1, 'Industry is required').max(100),
  companySize: z.enum(Object.values(CompanySize) as [CompanySize, ...CompanySize[]], {
    message: 'Please select a company size'
  }),
  projectType: z.array(z.enum(Object.values(ConsultingType) as [ConsultingType, ...ConsultingType[]])).min(1, 'Please select at least one service'),
  budgetRange: z.enum(Object.values(BudgetRange) as [BudgetRange, ...BudgetRange[]], {
    message: 'Please select a budget range'
  }),
  timeline: z.string().min(1, 'Timeline is required').max(100),
  projectDescription: z.string().min(10, 'Please provide a detailed project description').max(2000),
  currentChallenges: z.string().min(10, 'Please describe your current challenges').max(2000),
  previousConsulting: z.boolean().default(false),
  referralSource: z.string().optional()
});

const companySizeOptions = [
  { value: CompanySize.STARTUP_1_10, label: 'Startup (1-10 employees)' },
  { value: CompanySize.SMALL_11_50, label: 'Small (11-50 employees)' },
  { value: CompanySize.MEDIUM_51_200, label: 'Medium (51-200 employees)' },
  { value: CompanySize.LARGE_201_1000, label: 'Large (201-1,000 employees)' },
  { value: CompanySize.ENTERPRISE_1000_PLUS, label: 'Enterprise (1,000+ employees)' },
];

const budgetOptions = [
  { value: BudgetRange.UNDER_10K, label: 'Under $10,000' },
  { value: BudgetRange.TEN_TO_25K, label: '$10,000 - $25,000' },
  { value: BudgetRange.TWENTY_FIVE_TO_50K, label: '$25,000 - $50,000' },
  { value: BudgetRange.FIFTY_TO_100K, label: '$50,000 - $100,000' },
  { value: BudgetRange.OVER_100K, label: 'Over $100,000' },
];

const consultingTypeOptions = [
  { value: ConsultingType.BRAND_STRATEGY, label: 'Brand Strategy' },
  { value: ConsultingType.CONTENT_STRATEGY, label: 'Content Strategy' },
  { value: ConsultingType.COMMUNITY_BUILDING, label: 'Community Building' },
  { value: ConsultingType.AI_INTEGRATION, label: 'AI Integration' },
  { value: ConsultingType.MARKET_RESEARCH, label: 'Market Research' },
  { value: ConsultingType.SPEAKING_ENGAGEMENT, label: 'Speaking Engagement' },
  { value: ConsultingType.ADVISORY_RETAINER, label: 'Advisory Retainer' }
];

export function ExampleEnhancedConsultingForm() {
  return (
    <div className="max-w-4xl mx-auto">
      <EnhancedForm
        schema={consultingInquirySchema}
        action={submitConsultingInquiry}
        persistence={{ key: 'consulting-inquiry' }}
        onSuccess={() => {
          console.log('Form submitted successfully!');
        }}
        showToasts={true}
      >
        {/* Personal Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 
                Notice how much cleaner this is compared to the old form:
                - No manual error handling
                - No need to extract actionState.fieldErrors
                - No need to set defaultValue from actionState.formData
                - Built-in accessibility attributes
              */}
              <FormField name="firstName" label="First Name" required>
                <Input placeholder="John" />
              </FormField>

              <FormField name="lastName" label="Last Name" required>
                <Input placeholder="Smith" />
              </FormField>
            </div>

            <FormField 
              name="email" 
              label="Email" 
              required
              description="We'll use this to contact you about your project"
            >
              <Input type="email" placeholder="john@company.com" />
            </FormField>
          </CardContent>
        </Card>

        {/* Company Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField name="company" label="Company Name" required>
                <Input placeholder="Acme Corp" />
              </FormField>

              <FormField name="jobTitle" label="Job Title" required>
                <Input placeholder="CEO, Marketing Director, etc." />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField name="industryVertical" label="Industry" required>
                <Input placeholder="Technology, Finance, Healthcare, etc." />
              </FormField>

              <FormField name="phone" label="Phone" description="Optional contact number">
                <Input type="tel" placeholder="+1 (555) 123-4567" />
              </FormField>
            </div>

            <SelectField
              name="companySize"
              label="Company Size"
              options={companySizeOptions}
              placeholder="Select company size"
              required
            />
          </CardContent>
        </Card>

        {/* Project Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Consulting Services Checkboxes */}
            <div className="space-y-4">
              <label className="text-sm font-medium">
                Consulting Services Needed <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {consultingTypeOptions.map((type) => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <Checkbox 
                      id={type.value} 
                      name="projectType" 
                      value={type.value}
                    />
                    <label htmlFor={type.value} className="text-sm font-normal">
                      {type.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                name="budgetRange"
                label="Budget Range"
                options={budgetOptions}
                placeholder="Select budget range"
                required
              />

              <FormField name="timeline" label="Desired Timeline" required>
                <Input placeholder="ASAP, 1 month, 3 months, etc." />
              </FormField>
            </div>

            <FormField 
              name="projectDescription" 
              label="Project Description" 
              required
              description="Describe your project goals, requirements, and what you hope to achieve"
            >
              <Textarea 
                placeholder="Describe your project goals, requirements, and what you hope to achieve..."
                rows={4}
              />
            </FormField>

            <FormField 
              name="currentChallenges" 
              label="Current Challenges" 
              required
              description="What challenges are you facing that we could help solve?"
            >
              <Textarea
                placeholder="What challenges are you facing that we could help solve?"
                rows={3}
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="previousConsulting" 
                  name="previousConsulting"
                />
                <label htmlFor="previousConsulting" className="text-sm">
                  Have you worked with consultants before?
                </label>
              </div>

              <FormField 
                name="referralSource" 
                label="How did you hear about us?"
                description="Optional - helps us improve our outreach"
              >
                <Input placeholder="Google, LinkedIn, referral, etc." />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <SubmitButton>Submit Inquiry</SubmitButton>
        </div>
      </EnhancedForm>
    </div>
  );
}