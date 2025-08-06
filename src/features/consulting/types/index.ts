// ABOUTME: Type definitions for the consulting feature module
// ABOUTME: Includes enums, interfaces, and utility types for B2B consulting services

import type { 
  ConsultingInquiry, 
  ClientProject, 
  ProjectMilestone,
  ProjectDeliverable,
  InquiryNote,
  InquiryActivity,
  ProjectActivity,
  CompanySize,
  ConsultingType,
  BudgetRange,
  InquiryStatus,
  ProjectStatus,
  MilestoneStatus,
  DeliverableStatus,
  Priority,
  EngagementFormat,
  EngagementStatus,
  User
} from '@prisma/client';

// Extended inquiry with relations
export interface ConsultingInquiryWithRelations extends ConsultingInquiry {
  assignedConsultant?: User;
  project?: ClientProject;
  notes: InquiryNote[];
  activities: InquiryActivity[];
}

// Extended project with relations
export interface ClientProjectWithRelations extends ClientProject {
  inquiry: ConsultingInquiry & {
    assignedConsultant?: User;
  };
  milestones: ProjectMilestone[];
  deliverables: ProjectDeliverable[];
  activities: ProjectActivity[];
}

// Form data types
export interface ConsultingInquiryFormData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  jobTitle: string;
  phone?: string;
  industryVertical: string;
  companySize: CompanySize;
  projectType: ConsultingType[];
  budgetRange: BudgetRange;
  timeline: string;
  projectDescription: string;
  currentChallenges: string;
  previousConsulting: boolean;
  referralSource?: string;
}

export interface SpeakingEngagementFormData {
  title: string;
  eventName: string;
  organizerName: string;
  organizerEmail: string;
  eventDate: Date;
  duration: number;
  format: EngagementFormat;
  audience: string;
  expectedSize?: number;
  fee?: number;
  travelRequired: boolean;
  location: string;
  notes?: string;
}

// Lead scoring types
export interface LeadScore {
  score: number;
  factors: {
    budget: number;
    companySize: number;
    projectType: number;
    timeline: number;
  };
  priority: Priority;
  category: 'hot' | 'warm' | 'cold';
}

// Proposal generation types
export interface ProposalData {
  clientInfo: {
    company: string;
    contact: string;
    email: string;
  };
  services: ServiceItem[];
  pricing: PricingStructure;
  timeline: TimelineItem[];
  terms: string[];
  deliverables: string[];
}

export interface ServiceItem {
  name: string;
  description: string;
  baseHours: number;
  basePrice: number;
  includes: string[];
}

export interface PricingStructure {
  subtotal: number;
  discounts?: {
    reason: string;
    amount: number;
  }[];
  total: number;
  paymentTerms: string;
  milestonePayments?: {
    milestone: string;
    amount: number;
    percentage: number;
  }[];
}

export interface TimelineItem {
  phase: string;
  duration: string;
  deliverables: string[];
  dependencies?: string[];
}

// Dashboard statistics
export interface ConsultingStats {
  newInquiries: number;
  activeProjects: number;
  monthlyRevenue: number;
  avgProjectValue: number;
  conversionRate: number;
  pipelineValue: number;
  inquiriesByStatus: Record<InquiryStatus, number>;
  projectsByStatus: Record<ProjectStatus, number>;
  revenueByMonth: { month: string; revenue: number }[];
}

// Filter and search types
export interface ConsultingInquiryFilters {
  status?: InquiryStatus[];
  priority?: Priority[];
  companySize?: CompanySize[];
  budgetRange?: BudgetRange[];
  projectType?: ConsultingType[];
  assignedTo?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export interface ClientProjectFilters {
  status?: ProjectStatus[];
  projectType?: ConsultingType[];
  contractValueRange?: {
    min: number;
    max: number;
  };
  dateRange?: {
    from: Date;
    to: Date;
  };
}

// Email template types
export interface ConsultingEmailTemplate {
  type: 'inquiry_received' | 'meeting_scheduled' | 'proposal_sent' | 'project_update';
  subject: string;
  content: string;
  variables: Record<string, string>;
}

// Export all enum types for convenience
export {
  CompanySize,
  ConsultingType,
  BudgetRange,
  InquiryStatus,
  ProjectStatus,
  MilestoneStatus,
  DeliverableStatus,
  Priority,
  EngagementFormat,
  EngagementStatus
};