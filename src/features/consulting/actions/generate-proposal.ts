// ABOUTME: Server action for generating and managing consulting proposals
// ABOUTME: Creates proposals, updates inquiry status, and tracks proposal activities

'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { ProposalGenerator } from '../services/proposal-generator';
import { getAuthOrRedirect } from '@/features/auth/queries/get-auth-or-redirect';
import { InquiryStatus } from '@prisma/client';

const generateProposalSchema = z.object({
  inquiryId: z.string().cuid(),
  customMessage: z.string().optional(),
  sendImmediately: z.boolean().default(false)
});

export async function generateProposal(formData: FormData) {
  try {
    // Check admin authentication
    await getAuthOrRedirect(); // TODO: Add admin role check

    // Validate input
    const { inquiryId, sendImmediately } = generateProposalSchema.parse({
      inquiryId: formData.get('inquiryId')?.toString(),
      customMessage: formData.get('customMessage')?.toString(),
      sendImmediately: formData.get('sendImmediately') === 'on'
    });

    // Get the inquiry with full details
    const inquiry = await prisma.consultingInquiry.findUnique({
      where: { id: inquiryId },
      include: {
        assignedConsultant: {
          select: { id: true, email: true, username: true }
        }
      }
    });

    if (!inquiry) {
      return { success: false, error: 'Inquiry not found' };
    }

    // Generate the proposal
    const proposalGenerator = new ProposalGenerator();
    const proposalData = await proposalGenerator.generateProposal(inquiry);
    const proposalDocument = await proposalGenerator.generateProposalDocument(proposalData);

    // Create or update client project
    const existingProject = await prisma.clientProject.findUnique({
      where: { inquiryId }
    });

    let project: any;
    if (existingProject) {
      // Update existing project
      project = await prisma.clientProject.update({
        where: { id: existingProject.id },
        data: {
          contractValue: proposalData.pricing.total * 100, // Convert to cents
          estimatedHours: proposalData.services.reduce((sum, s) => sum + s.baseHours, 0),
          updatedAt: new Date()
        }
      });
    } else {
      // Create new project
      project = await prisma.clientProject.create({
        data: {
          projectName: `${inquiry.company} - ${inquiry.projectType.join(', ')}`,
          clientCompany: inquiry.company,
          projectType: inquiry.projectType[0], // Use first type as primary
          contractValue: proposalData.pricing.total * 100, // Convert to cents
          estimatedHours: proposalData.services.reduce((sum, s) => sum + s.baseHours, 0),
          inquiryId,
          status: 'PROPOSAL'
        }
      });

      // Create milestones based on proposal
      if (proposalData.pricing.milestonePayments) {
        await Promise.all(
          proposalData.pricing.milestonePayments.map((payment, index) =>
            prisma.projectMilestone.create({
              data: {
                title: payment.milestone,
                description: `Payment milestone: ${payment.percentage}% of total project value`,
                dueDate: new Date(Date.now() + (index + 1) * 14 * 24 * 60 * 60 * 1000), // 2 weeks apart
                paymentAmount: payment.amount * 100, // Convert to cents
                projectId: project.id
              }
            })
          )
        );
      }

      // Create deliverables
      await Promise.all(
        proposalData.deliverables.slice(0, 10).map((deliverable) => // Limit to 10 deliverables
          prisma.projectDeliverable.create({
            data: {
              title: deliverable,
              description: `Deliverable: ${deliverable}`,
              projectId: project.id
            }
          })
        )
      );
    }

    // Update inquiry status
    await prisma.consultingInquiry.update({
      where: { id: inquiryId },
      data: {
        status: InquiryStatus.PROPOSAL_SENT,
        proposalSent: true,
        lastContactDate: new Date()
      }
    });

    // Log activity
    await prisma.inquiryActivity.create({
      data: {
        inquiryId,
        type: 'proposal_generated',
        description: `Proposal generated and ${sendImmediately ? 'sent' : 'prepared'} for ${inquiry.company}. Total value: $${proposalData.pricing.total.toLocaleString()}`
      }
    });

    await prisma.projectActivity.create({
      data: {
        projectId: project.id,
        type: 'proposal_generated',
        description: `Project proposal generated with ${proposalData.services.length} services and ${proposalData.deliverables.length} deliverables`
      }
    });

    // TODO: If sendImmediately is true, send email with proposal
    // TODO: Store proposal document in database or file system

    // Revalidate admin pages
    revalidatePath('/admin/consulting');
    revalidatePath(`/admin/consulting/inquiries/${inquiryId}`);
    revalidatePath('/admin/consulting/projects');

    return {
      success: true,
      proposal: proposalData,
      document: proposalDocument,
      projectId: project.id
    };

  } catch (error) {
    console.error('Error generating proposal:', error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Invalid input data',
        fieldErrors: error.flatten().fieldErrors
      };
    }
    
    return {
      success: false,
      error: 'Failed to generate proposal. Please try again.'
    };
  }
}

// Action to update proposal status
export async function updateProposalStatus(
  projectId: string,
  status: 'accepted' | 'rejected' | 'negotiating',
  notes?: string
) {
  try {
    await getAuthOrRedirect(); // TODO: Add admin role check

    const project = await prisma.clientProject.findUnique({
      where: { id: projectId },
      include: { inquiry: true }
    });

    if (!project) {
      return { success: false, error: 'Project not found' };
    }

    // Update project status
    const newProjectStatus = status === 'accepted' ? 'CONTRACTED' : 
                           status === 'negotiating' ? 'PROPOSAL' : 'CANCELLED';
    
    const newInquiryStatus = status === 'accepted' ? InquiryStatus.CLOSED_WON :
                           status === 'rejected' ? InquiryStatus.CLOSED_LOST :
                           InquiryStatus.NEGOTIATING;

    await prisma.$transaction([
      prisma.clientProject.update({
        where: { id: projectId },
        data: {
          status: newProjectStatus,
          startDate: status === 'accepted' ? new Date() : null
        }
      }),
      prisma.consultingInquiry.update({
        where: { id: project.inquiryId },
        data: { status: newInquiryStatus }
      }),
      prisma.projectActivity.create({
        data: {
          projectId,
          type: 'status_change',
          description: `Proposal ${status}${notes ? `: ${notes}` : ''}`
        }
      })
    ]);

    revalidatePath('/admin/consulting');
    revalidatePath(`/admin/consulting/projects/${projectId}`);

    return { success: true };

  } catch (error) {
    console.error('Error updating proposal status:', error);
    return { success: false, error: 'Failed to update proposal status' };
  }
}

// Get proposal data for display
export async function getProposalData(inquiryId: string) {
  try {
    const inquiry = await prisma.consultingInquiry.findUnique({
      where: { id: inquiryId }
    });

    if (!inquiry) {
      return null;
    }

    const proposalGenerator = new ProposalGenerator();
    const proposalData = await proposalGenerator.generateProposal(inquiry);

    return proposalData;
  } catch (error) {
    console.error('Error getting proposal data:', error);
    return null;
  }
}