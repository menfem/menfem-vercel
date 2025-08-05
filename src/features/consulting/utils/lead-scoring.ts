// ABOUTME: Lead scoring algorithm for consulting inquiries
// ABOUTME: Calculates lead priority and potential value based on inquiry data

import type { ConsultingInquiry } from '@prisma/client';
import type { LeadScore } from '../types';
import { Priority, BudgetRange, CompanySize, ConsultingType } from '@prisma/client';

export function calculateLeadScore(inquiry: ConsultingInquiry): LeadScore {
  let totalScore = 0;
  
  // Budget scoring (40% weight) - most important factor
  const budgetScore = getBudgetScore(inquiry.budgetRange);
  totalScore += budgetScore * 0.4;
  
  // Company size scoring (30% weight)
  const companySizeScore = getCompanySizeScore(inquiry.companySize);
  totalScore += companySizeScore * 0.3;
  
  // Project type scoring (20% weight)
  const projectTypeScore = getProjectTypeScore(inquiry.projectType);
  totalScore += projectTypeScore * 0.2;
  
  // Timeline urgency scoring (10% weight)
  const timelineScore = getTimelineScore(inquiry.timeline);
  totalScore += timelineScore * 0.1;
  
  // Determine priority and category
  const priority = getPriorityFromScore(totalScore);
  const category = getCategoryFromScore(totalScore);
  
  return {
    score: Math.round(totalScore),
    factors: {
      budget: budgetScore,
      companySize: companySizeScore,
      projectType: projectTypeScore,
      timeline: timelineScore
    },
    priority,
    category
  };
}

function getBudgetScore(budgetRange: BudgetRange): number {
  const budgetScores: Record<BudgetRange, number> = {
    UNDER_10K: 20,
    TEN_TO_25K: 40,
    TWENTY_FIVE_TO_50K: 60,
    FIFTY_TO_100K: 80,
    OVER_100K: 100
  };
  
  return budgetScores[budgetRange] || 0;
}

function getCompanySizeScore(companySize: CompanySize): number {
  const companySizeScores: Record<CompanySize, number> = {
    STARTUP_1_10: 30,
    SMALL_11_50: 50,
    MEDIUM_51_200: 70,
    LARGE_201_1000: 85,
    ENTERPRISE_1000_PLUS: 100
  };
  
  return companySizeScores[companySize] || 0;
}

function getProjectTypeScore(projectTypes: ConsultingType[]): number {
  // High-value services get higher scores
  const highValueServices: ConsultingType[] = [
    'AI_INTEGRATION',
    'ADVISORY_RETAINER',
    'BRAND_STRATEGY'
  ];
  
  const mediumValueServices: ConsultingType[] = [
    'CONTENT_STRATEGY',
    'COMMUNITY_BUILDING'
  ];
  
  const hasHighValue = projectTypes.some(type => highValueServices.includes(type));
  const hasMediumValue = projectTypes.some(type => mediumValueServices.includes(type));
  
  if (hasHighValue) return 100;
  if (hasMediumValue) return 70;
  return 40; // Speaking engagements, market research
}

function getTimelineScore(timeline: string): number {
  const timelineLower = timeline.toLowerCase();
  
  // Urgent timelines score higher
  if (timelineLower.includes('asap') || 
      timelineLower.includes('urgent') || 
      timelineLower.includes('immediately')) {
    return 100;
  }
  
  if (timelineLower.includes('1 month') || 
      timelineLower.includes('4 week')) {
    return 80;
  }
  
  if (timelineLower.includes('2 month') || 
      timelineLower.includes('8 week')) {
    return 60;
  }
  
  if (timelineLower.includes('3 month') || 
      timelineLower.includes('quarter')) {
    return 40;
  }
  
  return 20; // 6+ months or flexible timeline
}

function getPriorityFromScore(score: number): Priority {
  if (score >= 80) return Priority.URGENT;
  if (score >= 60) return Priority.HIGH;
  if (score >= 40) return Priority.MEDIUM;
  return Priority.LOW;
}

function getCategoryFromScore(score: number): 'hot' | 'warm' | 'cold' {
  if (score >= 70) return 'hot';
  if (score >= 40) return 'warm';
  return 'cold';
}

// Additional scoring helpers
export function getEstimatedProjectValue(inquiry: ConsultingInquiry): number {
  const budgetMidpoints: Record<BudgetRange, number> = {
    UNDER_10K: 7500,
    TEN_TO_25K: 17500,
    TWENTY_FIVE_TO_50K: 37500,
    FIFTY_TO_100K: 75000,
    OVER_100K: 125000
  };
  
  return budgetMidpoints[inquiry.budgetRange] || 0;
}

export function getServiceMultiplier(projectTypes: ConsultingType[]): number {
  // Multiple services increase project value
  if (projectTypes.length >= 3) return 1.5;
  if (projectTypes.length === 2) return 1.25;
  return 1.0;
}

export function calculatePotentialRevenue(inquiry: ConsultingInquiry): number {
  const baseValue = getEstimatedProjectValue(inquiry);
  const multiplier = getServiceMultiplier(inquiry.projectType);
  return Math.round(baseValue * multiplier);
}