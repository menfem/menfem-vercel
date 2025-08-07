// ABOUTME: Server action for submitting consulting inquiries
// ABOUTME: Handles form validation, lead scoring, and database persistence

'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { 
  fromErrorToActionState, 
  toActionState 
} from '@/components/form/utils/to-action-state';
import { calculateLeadScore } from '../utils/lead-scoring';
import { CompanySize, ConsultingType, BudgetRange } from '@prisma/client';
import type { ActionState } from '@/types/action-state';

// Validation schema
const consultingInquirySchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Valid email is required'),
  company: z.string().min(1, 'Company name is required').max(200),
  jobTitle: z.string().min(1, 'Job title is required').max(100),
  phone: z.string().optional(),
  industryVertical: z.string().min(1, 'Industry is required').max(100),
  companySize: z.nativeEnum(CompanySize, {
    message: 'Please select a company size'
  }),
  projectType: z.array(z.nativeEnum(ConsultingType)).min(1, 'Please select at least one service'),
  budgetRange: z.nativeEnum(BudgetRange, {
    message: 'Please select a budget range'
  }),
  timeline: z.string().min(1, 'Timeline is required').max(100),
  projectDescription: z.string().min(10, 'Please provide a detailed project description').max(2000),
  currentChallenges: z.string().min(10, 'Please describe your current challenges').max(2000),
  previousConsulting: z.boolean().default(false),
  referralSource: z.string().optional()
});

export async function submitConsultingInquiry(
  _actionState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    // Parse form data
    const rawData = {
      firstName: formData.get('firstName')?.toString() || '',
      lastName: formData.get('lastName')?.toString() || '',
      email: formData.get('email')?.toString() || '',
      company: formData.get('company')?.toString() || '',
      jobTitle: formData.get('jobTitle')?.toString() || '',
      phone: formData.get('phone')?.toString() || undefined,
      industryVertical: formData.get('industryVertical')?.toString() || '',
      companySize: formData.get('companySize')?.toString() as CompanySize,
      projectType: formData.getAll('projectType').filter(Boolean) as ConsultingType[],
      budgetRange: formData.get('budgetRange')?.toString() as BudgetRange,
      timeline: formData.get('timeline')?.toString() || '',
      projectDescription: formData.get('projectDescription')?.toString() || '',
      currentChallenges: formData.get('currentChallenges')?.toString() || '',
      previousConsulting: formData.get('previousConsulting') === 'on',
      referralSource: formData.get('referralSource')?.toString() || undefined
    };

    // Validate the data
    const validatedData = consultingInquirySchema.parse(rawData);

    // Check for duplicate inquiry (same email + company in last 30 days)
    const existingInquiry = await prisma.consultingInquiry.findFirst({
      where: {
        email: validatedData.email,
        company: validatedData.company,
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
        }
      }
    });

    if (existingInquiry) {
      return toActionState(
        'ERROR', 
        'We already have a recent inquiry from this email and company. Please check your email or contact us directly.'
      );
    }

    // Create the inquiry
    const inquiry = await prisma.consultingInquiry.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        company: validatedData.company,
        jobTitle: validatedData.jobTitle,
        phone: validatedData.phone,
        industryVertical: validatedData.industryVertical,
        companySize: validatedData.companySize,
        projectType: validatedData.projectType,
        budgetRange: validatedData.budgetRange,
        timeline: validatedData.timeline,
        projectDescription: validatedData.projectDescription,
        currentChallenges: validatedData.currentChallenges,
        previousConsulting: validatedData.previousConsulting,
        referralSource: validatedData.referralSource
      }
    });

    // Calculate lead score and update priority
    const leadScore = calculateLeadScore(inquiry);
    
    await prisma.consultingInquiry.update({
      where: { id: inquiry.id },
      data: { priority: leadScore.priority }
    });

    // Create initial activity log
    await prisma.inquiryActivity.create({
      data: {
        inquiryId: inquiry.id,
        type: 'inquiry_submitted',
        description: `New inquiry submitted with lead score: ${leadScore.score} (${leadScore.category})`
      }
    });

    // TODO: Send notification email to admin
    // TODO: Send confirmation email to client
    // TODO: Trigger follow-up automation

    // Revalidate admin pages
    revalidatePath('/admin/consulting');
    revalidatePath('/admin/dashboard');

    return toActionState(
      'SUCCESS',
      'Thank you for your inquiry! We\'ll review your project details and get back to you within 24 hours.'
    );

  } catch (error) {
    console.error('Error submitting consulting inquiry:', error);
    
    if (error instanceof z.ZodError) {
      return fromErrorToActionState(error, formData);
    }
    
    return toActionState(
      'ERROR',
      'There was an error submitting your inquiry. Please try again or contact us directly.'
    );
  }
}

// Helper action to get inquiry by ID (for admin use)
export async function getConsultingInquiry(id: string) {
  try {
    const inquiry = await prisma.consultingInquiry.findUnique({
      where: { id },
      include: {
        assignedConsultant: {
          select: { id: true, email: true, username: true }
        },
        project: true,
        notes: {
          orderBy: { createdAt: 'desc' }
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    return inquiry;
  } catch (error) {
    console.error('Error fetching consulting inquiry:', error);
    return null;
  }
}

// Update inquiry status
export async function updateInquiryStatus(
  inquiryId: string,
  status: string,
  note?: string
) {
  try {
    await prisma.$transaction(async (tx) => {
      // Update inquiry status
      await tx.consultingInquiry.update({
        where: { id: inquiryId },
        data: { 
          status: status.toUpperCase() as any,
          lastContactDate: new Date()
        }
      });

      // Add activity log
      await tx.inquiryActivity.create({
        data: {
          inquiryId,
          type: 'status_change',
          description: `Status changed to ${status}${note ? `: ${note}` : ''}`
        }
      });

      // Add note if provided
      if (note) {
        await tx.inquiryNote.create({
          data: {
            inquiryId,
            content: note
          }
        });
      }
    });

    revalidatePath('/admin/consulting');
    revalidatePath(`/admin/consulting/${inquiryId}`);
    
    return { success: true };
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    return { success: false, error: 'Failed to update inquiry status' };
  }
}