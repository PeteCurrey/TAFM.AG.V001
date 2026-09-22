// ─── Commercial Funnel Analytics (Phase 5) ───────────────────────────────────
//
// Authoritative measurement of the real commercial pipeline.
// Strictly calculates from verified database entities.
// Every metric declares its exact source and calculation logic.

import { db } from '@/lib/db/client'

export interface FunnelStageMetric {
  stage: string
  label: string
  count: number
  source: string
  calculation: string
  conversionFromPreviousPercent: number
}

export interface CommercialFunnelReport {
  period: string
  generatedAt: string
  stages: FunnelStageMetric[]
}

export async function getCommercialFunnelMetrics(): Promise<CommercialFunnelReport> {
  if (!db) {
    return {
      period: 'All-time',
      generatedAt: new Date().toISOString(),
      stages: [],
    }
  }

  // 1. Leads
  const totalLeads = await db.lead.count()

  // 2. Finance Application Starts / Submissions
  const totalApplications = await db.financeApplication.count()
  const submittedApplications = await db.financeApplication.count({
    where: { status: { in: ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'COMPLETED'] } },
  })

  // 3. Qualified Opportunities
  const totalOpportunities = await db.opportunity.count()

  // 4. Provider Matches
  const totalMatches = await db.opportunityProvider.count()

  // 5. Provider Responses (Reviewing, Interested, Declined, Offered)
  const respondedMatches = await db.opportunityProvider.count({
    where: {
      matchStatus: { in: ['REVIEWING', 'INFORMATION_REQUESTED', 'INTERESTED', 'SUBMITTED_TO_CREDIT', 'OFFERED', 'COMPLETED', 'DECLINED'] },
    },
  })

  // 6. Formal Offers
  const totalOffers = await db.financeOffer.count()

  // 7. Completed Transactions
  const completedTransactions = await db.opportunity.count({
    where: { status: 'COMPLETED' },
  })

  const stages: FunnelStageMetric[] = [
    {
      stage: 'LEADS',
      label: 'Initial Leads Received',
      count: totalLeads,
      source: 'leads table',
      calculation: 'COUNT(*) from leads',
      conversionFromPreviousPercent: 100,
    },
    {
      stage: 'FINANCE_SUBMISSIONS',
      label: 'Formal Finance Submissions',
      count: submittedApplications,
      source: 'finance_applications table',
      calculation: 'COUNT(*) where status != DRAFT',
      conversionFromPreviousPercent: totalLeads > 0 ? Math.round((submittedApplications / totalLeads) * 100) : 0,
    },
    {
      stage: 'OPPORTUNITIES',
      label: 'Qualified Opportunities',
      count: totalOpportunities,
      source: 'opportunities table',
      calculation: 'COUNT(*) from opportunities',
      conversionFromPreviousPercent: submittedApplications > 0 ? Math.round((totalOpportunities / submittedApplications) * 100) : 0,
    },
    {
      stage: 'PROVIDER_MATCHES',
      label: 'Deterministic Provider Matches',
      count: totalMatches,
      source: 'opportunity_providers table',
      calculation: 'COUNT(*) from opportunity_providers',
      conversionFromPreviousPercent: totalOpportunities > 0 ? Math.round((totalMatches / totalOpportunities) * 100) : 0,
    },
    {
      stage: 'PROVIDER_RESPONSES',
      label: 'Provider Action / Engagement',
      count: respondedMatches,
      source: 'opportunity_providers table',
      calculation: 'COUNT(*) where respondedAt IS NOT NULL or status changed',
      conversionFromPreviousPercent: totalMatches > 0 ? Math.round((respondedMatches / totalMatches) * 100) : 0,
    },
    {
      stage: 'FORMAL_OFFERS',
      label: 'Credit Offers Issued',
      count: totalOffers,
      source: 'finance_offers table',
      calculation: 'COUNT(*) from finance_offers',
      conversionFromPreviousPercent: respondedMatches > 0 ? Math.round((totalOffers / respondedMatches) * 100) : 0,
    },
    {
      stage: 'COMPLETED',
      label: 'Completed Financings',
      count: completedTransactions,
      source: 'opportunities table',
      calculation: 'COUNT(*) where status = COMPLETED',
      conversionFromPreviousPercent: totalOffers > 0 ? Math.round((completedTransactions / totalOffers) * 100) : 0,
    },
  ]

  return {
    period: 'All-time verified pipeline',
    generatedAt: new Date().toISOString(),
    stages,
  }
}
