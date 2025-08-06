// ABOUTME: Consulting inquiry form component for B2B lead capture
// ABOUTME: Comprehensive form with validation and lead qualification fields

'use client';

import { useActionState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Building2, User, Phone, Mail } from 'lucide-react';
import { submitConsultingInquiry } from '../actions/submit-inquiry';
import { CompanySize, ConsultingType, BudgetRange } from '@prisma/client';
import type { ActionState } from '@/components/form/utils/to-action-state';

const emptyActionState: ActionState = {
  status: undefined,
  message: '',
  fieldErrors: {},
  timestamp: 0
};

export function ConsultingInquiryForm() {
  const [actionState, formAction] = useActionState(submitConsultingInquiry, emptyActionState);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Start Your Consulting Journey</h1>
        <p className="text-lg text-muted-foreground">
          Tell us about your project and we&apos;ll get back to you within 24 hours
        </p>
      </div>

      <form action={formAction} className="space-y-8">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  required
                  defaultValue={actionState.formData?.get('firstName')?.toString()}
                />
                {actionState.fieldErrors?.firstName && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {actionState.fieldErrors.firstName[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Smith"
                  required
                  defaultValue={actionState.formData?.get('lastName')?.toString()}
                />
                {actionState.fieldErrors?.lastName && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {actionState.fieldErrors.lastName[0]}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@company.com"
                    className="pl-10"
                    required
                    defaultValue={actionState.formData?.get('email')?.toString()}
                  />
                </div>
                {actionState.fieldErrors?.email && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {actionState.fieldErrors.email[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    className="pl-10"
                    defaultValue={actionState.formData?.get('phone')?.toString()}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company Name *</Label>
                <Input
                  id="company"
                  name="company"
                  placeholder="Acme Corp"
                  required
                  defaultValue={actionState.formData?.get('company')?.toString()}
                />
                {actionState.fieldErrors?.company && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {actionState.fieldErrors.company[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Input
                  id="jobTitle"
                  name="jobTitle"
                  placeholder="CEO, Marketing Director, etc."
                  required
                  defaultValue={actionState.formData?.get('jobTitle')?.toString()}
                />
                {actionState.fieldErrors?.jobTitle && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {actionState.fieldErrors.jobTitle[0]}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industryVertical">Industry *</Label>
                <Input
                  id="industryVertical"
                  name="industryVertical"
                  placeholder="Technology, Finance, Healthcare, etc."
                  required
                  defaultValue={actionState.formData?.get('industryVertical')?.toString()}
                />
                {actionState.fieldErrors?.industryVertical && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {actionState.fieldErrors.industryVertical[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="companySize">Company Size *</Label>
                <Select name="companySize" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CompanySize.STARTUP_1_10}>Startup (1-10 employees)</SelectItem>
                    <SelectItem value={CompanySize.SMALL_11_50}>Small (11-50 employees)</SelectItem>
                    <SelectItem value={CompanySize.MEDIUM_51_200}>Medium (51-200 employees)</SelectItem>
                    <SelectItem value={CompanySize.LARGE_201_1000}>Large (201-1,000 employees)</SelectItem>
                    <SelectItem value={CompanySize.ENTERPRISE_1000_PLUS}>Enterprise (1,000+ employees)</SelectItem>
                  </SelectContent>
                </Select>
                {actionState.fieldErrors?.companySize && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {actionState.fieldErrors.companySize[0]}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Details */}
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Consulting Services Needed *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.values(ConsultingType).map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox 
                      id={type} 
                      name="projectType" 
                      value={type}
                    />
                    <Label htmlFor={type} className="text-sm font-normal">
                      {getConsultingTypeLabel(type)}
                    </Label>
                  </div>
                ))}
              </div>
              {actionState.fieldErrors?.projectType && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {actionState.fieldErrors.projectType[0]}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budgetRange">Budget Range *</Label>
                <Select name="budgetRange" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={BudgetRange.UNDER_10K}>Under $10,000</SelectItem>
                    <SelectItem value={BudgetRange.TEN_TO_25K}>$10,000 - $25,000</SelectItem>
                    <SelectItem value={BudgetRange.TWENTY_FIVE_TO_50K}>$25,000 - $50,000</SelectItem>
                    <SelectItem value={BudgetRange.FIFTY_TO_100K}>$50,000 - $100,000</SelectItem>
                    <SelectItem value={BudgetRange.OVER_100K}>Over $100,000</SelectItem>
                  </SelectContent>
                </Select>
                {actionState.fieldErrors?.budgetRange && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {actionState.fieldErrors.budgetRange[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline">Desired Timeline *</Label>
                <Input
                  id="timeline"
                  name="timeline"
                  placeholder="ASAP, 1 month, 3 months, etc."
                  required
                  defaultValue={actionState.formData?.get('timeline')?.toString()}
                />
                {actionState.fieldErrors?.timeline && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {actionState.fieldErrors.timeline[0]}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectDescription">Project Description *</Label>
              <Textarea
                id="projectDescription"
                name="projectDescription"
                placeholder="Describe your project goals, requirements, and what you hope to achieve..."
                rows={4}
                required
                defaultValue={actionState.formData?.get('projectDescription')?.toString()}
              />
              {actionState.fieldErrors?.projectDescription && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {actionState.fieldErrors.projectDescription[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentChallenges">Current Challenges *</Label>
              <Textarea
                id="currentChallenges"
                name="currentChallenges"
                placeholder="What challenges are you facing that we could help solve?"
                rows={3}
                required
                defaultValue={actionState.formData?.get('currentChallenges')?.toString()}
              />
              {actionState.fieldErrors?.currentChallenges && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {actionState.fieldErrors.currentChallenges[0]}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="previousConsulting" 
                  name="previousConsulting"
                />
                <Label htmlFor="previousConsulting" className="text-sm">
                  Have you worked with consultants before?
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="referralSource">How did you hear about us?</Label>
                <Input
                  id="referralSource"
                  name="referralSource"
                  placeholder="Google, LinkedIn, referral, etc."
                  defaultValue={actionState.formData?.get('referralSource')?.toString()}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="text-center">
          <Button type="submit" size="lg" className="min-w-48">
            Submit Inquiry
          </Button>
          
          {actionState.status === 'SUCCESS' && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">
                {actionState.message}
              </p>
            </div>
          )}
          
          {actionState.status === 'ERROR' && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {actionState.message}
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

function getConsultingTypeLabel(type: ConsultingType): string {
  const labels: Record<ConsultingType, string> = {
    BRAND_STRATEGY: 'Brand Strategy',
    CONTENT_STRATEGY: 'Content Strategy',
    COMMUNITY_BUILDING: 'Community Building',
    AI_INTEGRATION: 'AI Integration',
    MARKET_RESEARCH: 'Market Research',
    SPEAKING_ENGAGEMENT: 'Speaking Engagement',
    ADVISORY_RETAINER: 'Advisory Retainer'
  };
  
  return labels[type] || type;
}