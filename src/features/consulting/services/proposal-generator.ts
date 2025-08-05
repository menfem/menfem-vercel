// ABOUTME: Automated proposal generation service for consulting projects
// ABOUTME: Creates dynamic proposals with pricing, timeline, and service details

import type { ConsultingInquiry } from '@prisma/client';
import type { ProposalData, ServiceItem, PricingStructure, TimelineItem } from '../types';
import { ConsultingType, BudgetRange, CompanySize } from '@prisma/client';

export class ProposalGenerator {
  async generateProposal(inquiry: ConsultingInquiry): Promise<ProposalData> {
    const services = this.calculateServices(inquiry);
    const pricing = this.calculatePricing(services, inquiry);
    const timeline = this.generateTimeline(services, inquiry);
    const terms = this.getStandardTerms();
    const deliverables = this.generateDeliverables(services);

    return {
      clientInfo: {
        company: inquiry.company,
        contact: `${inquiry.firstName} ${inquiry.lastName}`,
        email: inquiry.email
      },
      services,
      pricing,
      timeline,
      terms,
      deliverables
    };
  }

  private calculateServices(inquiry: ConsultingInquiry): ServiceItem[] {
    const serviceMap: Record<ConsultingType, ServiceItem> = {
      BRAND_STRATEGY: {
        name: 'Brand Strategy Development',
        description: 'Comprehensive brand positioning, messaging framework, and competitive analysis to establish your brand\'s unique market position.',
        baseHours: 40,
        basePrice: 15000,
        includes: [
          'Brand audit and competitive analysis',
          'Target audience research and persona development', 
          'Brand positioning and messaging framework',
          'Visual identity guidelines and recommendations',
          'Brand implementation roadmap'
        ]
      },
      CONTENT_STRATEGY: {
        name: 'Content Strategy & Planning',
        description: 'Strategic content framework with editorial calendar, channel strategy, and performance optimization to drive engagement and conversions.',
        baseHours: 30,
        basePrice: 12000,
        includes: [
          'Content audit and gap analysis',
          '90-day editorial calendar with content themes',
          'Multi-channel distribution strategy',
          'Content performance metrics and KPIs',
          'SEO optimization guidelines'
        ]
      },
      COMMUNITY_BUILDING: {
        name: 'Community Building Strategy',
        description: 'End-to-end community development strategy with platform selection, engagement frameworks, and growth tactics.',
        baseHours: 35,
        basePrice: 14000,
        includes: [
          'Community platform evaluation and recommendation',
          'Community launch strategy and roadmap',
          'Engagement frameworks and moderation guidelines',
          'Growth and retention tactics',
          'Community analytics and measurement plan'
        ]
      },
      AI_INTEGRATION: {
        name: 'AI Integration & Automation',
        description: 'Strategic AI implementation to streamline operations, enhance customer experience, and drive business efficiency.',
        baseHours: 45,
        basePrice: 18000,
        includes: [
          'AI readiness assessment and strategy development',
          'Tool evaluation and implementation roadmap',
          'Workflow automation design',
          'Team training and change management',
          'Performance measurement and optimization'
        ]
      },
      MARKET_RESEARCH: {
        name: 'Market Research & Analysis',
        description: 'Data-driven market insights, competitive intelligence, and trend analysis to inform strategic decision-making.',
        baseHours: 25,
        basePrice: 10000,
        includes: [
          'Comprehensive market landscape analysis',
          'Competitive intelligence and benchmarking',
          'Consumer behavior and trend analysis',
          'Market opportunity identification',
          'Strategic recommendations and next steps'
        ]
      },
      SPEAKING_ENGAGEMENT: {
        name: 'Speaking Engagement',
        description: 'Keynote presentation or workshop delivery tailored to your event theme and audience.',
        baseHours: 8,
        basePrice: 5000,
        includes: [
          'Custom presentation development',
          'Audience research and content tailoring',
          'Interactive workshop materials (if applicable)',
          'Q&A session facilitation',
          'Follow-up resources and materials'
        ]
      },
      ADVISORY_RETAINER: {
        name: 'Strategic Advisory Retainer',
        description: 'Ongoing strategic guidance with monthly consultations, priority access, and strategic support.',
        baseHours: 8,
        basePrice: 8000, // Monthly
        includes: [
          'Monthly strategic consultation sessions',
          'Priority email and phone support',
          'Strategic planning and review',
          'Market opportunity assessment',
          'Executive coaching and guidance'
        ]
      }
    };

    return inquiry.projectType.map(type => serviceMap[type]).filter(Boolean);
  }

  private calculatePricing(services: ServiceItem[], inquiry: ConsultingInquiry): PricingStructure {
    const subtotal = services.reduce((sum, service) => sum + service.basePrice, 0);
    
    // Apply company size multiplier
    const companySizeMultiplier = this.getCompanySizeMultiplier(inquiry.companySize);
    const adjustedSubtotal = Math.round(subtotal * companySizeMultiplier);
    
    // Apply discounts
    const discounts = this.calculateDiscounts(adjustedSubtotal, services, inquiry);
    const discountAmount = discounts.reduce((sum, d) => sum + d.amount, 0);
    
    const total = adjustedSubtotal - discountAmount;
    
    // Generate milestone payments
    const milestonePayments = this.generateMilestonePayments(total, services);

    return {
      subtotal: adjustedSubtotal,
      discounts: discounts.length > 0 ? discounts : undefined,
      total,
      paymentTerms: this.getPaymentTerms(),
      milestonePayments
    };
  }

  private getCompanySizeMultiplier(companySize: CompanySize): number {
    const multipliers: Record<CompanySize, number> = {
      STARTUP_1_10: 0.8,      // 20% discount for startups
      SMALL_11_50: 0.9,       // 10% discount for small companies
      MEDIUM_51_200: 1.0,     // Base pricing
      LARGE_201_1000: 1.2,    // 20% premium for large companies
      ENTERPRISE_1000_PLUS: 1.5  // 50% premium for enterprise
    };
    
    return multipliers[companySize] || 1.0;
  }

  private calculateDiscounts(
    subtotal: number, 
    services: ServiceItem[], 
    inquiry: ConsultingInquiry
  ): { reason: string; amount: number }[] {
    const discounts: { reason: string; amount: number }[] = [];
    
    // Multi-service discount
    if (services.length >= 3) {
      discounts.push({
        reason: 'Multi-service package discount (10%)',
        amount: Math.round(subtotal * 0.1)
      });
    } else if (services.length === 2) {
      discounts.push({
        reason: 'Two-service package discount (5%)',
        amount: Math.round(subtotal * 0.05)
      });
    }
    
    // First-time client discount (could be determined by previousConsulting field)
    if (!inquiry.previousConsulting) {
      discounts.push({
        reason: 'First-time client discount (5%)',
        amount: Math.round(subtotal * 0.05)
      });
    }
    
    return discounts;
  }

  private generateMilestonePayments(
    total: number, 
    services: ServiceItem[]
  ): { milestone: string; amount: number; percentage: number }[] {
    if (services.length === 1) {
      // Single service - 50/50 payment
      return [
        {
          milestone: 'Project kickoff',
          amount: Math.round(total * 0.5),
          percentage: 50
        },
        {
          milestone: 'Project completion',
          amount: Math.round(total * 0.5),
          percentage: 50
        }
      ];
    } else {
      // Multiple services - 3-part payment
      return [
        {
          milestone: 'Project kickoff and discovery',
          amount: Math.round(total * 0.4),
          percentage: 40
        },
        {
          milestone: 'Mid-project deliverables',
          amount: Math.round(total * 0.4),
          percentage: 40
        },
        {
          milestone: 'Final deliverables and completion',
          amount: Math.round(total * 0.2),
          percentage: 20
        }
      ];
    }
  }

  private generateTimeline(services: ServiceItem[], inquiry: ConsultingInquiry): TimelineItem[] {
    const timeline: TimelineItem[] = [];
    
    // Discovery phase (always first)
    timeline.push({
      phase: 'Discovery & Planning',
      duration: '1-2 weeks',
      deliverables: [
        'Project kickoff meeting',
        'Stakeholder interviews',
        'Requirements gathering',
        'Project plan finalization'
      ]
    });

    // Service-specific phases
    if (inquiry.projectType.includes(ConsultingType.BRAND_STRATEGY)) {
      timeline.push({
        phase: 'Brand Strategy Development',
        duration: '3-4 weeks',
        deliverables: [
          'Brand audit and competitive analysis',
          'Brand positioning framework',
          'Messaging and voice guidelines',
          'Visual identity recommendations'
        ],
        dependencies: ['Discovery & Planning']
      });
    }

    if (inquiry.projectType.includes(ConsultingType.CONTENT_STRATEGY)) {
      timeline.push({
        phase: 'Content Strategy Creation',
        duration: '2-3 weeks',
        deliverables: [
          'Content audit and analysis',
          'Editorial calendar development',
          'Content guidelines and templates',
          'Distribution strategy'
        ],
        dependencies: inquiry.projectType.includes(ConsultingType.BRAND_STRATEGY) 
          ? ['Brand Strategy Development'] 
          : ['Discovery & Planning']
      });
    }

    if (inquiry.projectType.includes(ConsultingType.COMMUNITY_BUILDING)) {
      timeline.push({
        phase: 'Community Strategy Development',
        duration: '2-3 weeks',
        deliverables: [
          'Platform evaluation and selection',
          'Community launch strategy',
          'Engagement framework',
          'Growth and moderation guidelines'
        ],
        dependencies: ['Discovery & Planning']
      });
    }

    if (inquiry.projectType.includes(ConsultingType.AI_INTEGRATION)) {
      timeline.push({
        phase: 'AI Integration Planning',
        duration: '3-4 weeks',
        deliverables: [
          'AI readiness assessment',
          'Tool evaluation and selection',
          'Implementation roadmap',
          'Training and change management plan'
        ],
        dependencies: ['Discovery & Planning']
      });
    }

    // Implementation phase (always last)
    timeline.push({
      phase: 'Implementation & Handoff',
      duration: '1-2 weeks',
      deliverables: [
        'Implementation guidance',
        'Team training sessions',
        'Documentation and resources',
        'Success metrics and monitoring setup'
      ],
      dependencies: timeline.length > 1 ? [timeline[timeline.length - 1].phase] : ['Discovery & Planning']
    });

    return timeline;
  }

  private generateDeliverables(services: ServiceItem[]): string[] {
    const deliverables: string[] = [];
    
    // Standard deliverables for all projects
    deliverables.push(
      'Project overview and executive summary',
      'Strategic recommendations document',
      'Implementation timeline and roadmap',
      'Success metrics and KPI framework'
    );
    
    // Service-specific deliverables
    services.forEach(service => {
      deliverables.push(...service.includes);
    });
    
    // Additional deliverables
    deliverables.push(
      'Team training and knowledge transfer',
      'Post-project support and consultation (30 days)',
      'Quarterly check-in and optimization recommendations'
    );
    
    return deliverables;
  }

  private getStandardTerms(): string[] {
    return [
      'Payment is due within 30 days of invoice date',
      'Project scope changes require written approval and may affect timeline and cost',
      'Client will provide timely feedback and access to necessary resources',
      'All deliverables remain confidential and proprietary to the client',
      'Either party may terminate with 30 days written notice',
      'Travel expenses (if applicable) will be billed separately at cost',
      'Post-project support included for 30 days after completion',
      'Additional consulting beyond scope available at standard hourly rates'
    ];
  }

  private getPaymentTerms(): string {
    return 'Net 30 days from invoice date. Late payments subject to 1.5% monthly service charge.';
  }

  // Generate proposal as formatted text/markdown
  async generateProposalDocument(proposal: ProposalData): Promise<string> {
    const formatCurrency = (amount: number) => 
      `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    let document = `# Consulting Proposal\n\n`;
    
    // Client Info
    document += `**Prepared for:** ${proposal.clientInfo.company}\n`;
    document += `**Contact:** ${proposal.clientInfo.contact}\n`;
    document += `**Date:** ${new Date().toLocaleDateString()}\n\n`;
    
    // Services
    document += `## Proposed Services\n\n`;
    proposal.services.forEach((service, index) => {
      document += `### ${index + 1}. ${service.name}\n\n`;
      document += `${service.description}\n\n`;
      document += `**Investment:** ${formatCurrency(service.basePrice)}\n`;
      document += `**Estimated Hours:** ${service.baseHours}\n\n`;
      document += `**Includes:**\n`;
      service.includes.forEach(item => {
        document += `- ${item}\n`;
      });
      document += `\n`;
    });
    
    // Pricing
    document += `## Investment Summary\n\n`;
    document += `**Subtotal:** ${formatCurrency(proposal.pricing.subtotal)}\n`;
    
    if (proposal.pricing.discounts) {
      proposal.pricing.discounts.forEach(discount => {
        document += `**${discount.reason}:** -${formatCurrency(discount.amount)}\n`;
      });
    }
    
    document += `**Total Investment:** ${formatCurrency(proposal.pricing.total)}\n\n`;
    
    // Payment Structure
    if (proposal.pricing.milestonePayments) {
      document += `### Payment Structure\n\n`;
      proposal.pricing.milestonePayments.forEach((payment, index) => {
        document += `**Payment ${index + 1}:** ${formatCurrency(payment.amount)} (${payment.percentage}%) - ${payment.milestone}\n`;
      });
      document += `\n`;
    }
    
    // Timeline
    document += `## Project Timeline\n\n`;
    proposal.timeline.forEach((phase, index) => {
      document += `### Phase ${index + 1}: ${phase.phase}\n`;
      document += `**Duration:** ${phase.duration}\n\n`;
      document += `**Deliverables:**\n`;
      phase.deliverables.forEach(deliverable => {
        document += `- ${deliverable}\n`;
      });
      if (phase.dependencies) {
        document += `\n**Dependencies:** ${phase.dependencies.join(', ')}\n`;
      }
      document += `\n`;
    });
    
    // Terms
    document += `## Terms & Conditions\n\n`;
    proposal.terms.forEach(term => {
      document += `- ${term}\n`;
    });
    
    document += `\n---\n\n`;
    document += `This proposal is valid for 30 days from the date above. `;
    document += `We look forward to partnering with you on this exciting project!\n\n`;
    document += `**Next Steps:** Reply to this proposal to schedule a discussion call and finalize project details.`;
    
    return document;
  }
}