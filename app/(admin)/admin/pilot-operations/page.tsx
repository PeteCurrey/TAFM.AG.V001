import React from 'react'
import { requireAdmin } from '@/lib/auth/context'
import { getOperationalStateAudit, getCommercialFunnelAudit } from '@/lib/pilot/operational-state'
import { PilotFeedbackModal } from '@/components/pilot/PilotFeedbackModal'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function PilotOperationsPage() {
  await requireAdmin()

  const [stateAudit, funnelAudit] = await Promise.all([
    getOperationalStateAudit(),
    getCommercialFunnelAudit(),
  ])

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--color-border-dark)]">
        <div>
          <p className="text-[11px] text-orange-400 font-mono uppercase tracking-widest">
            PHASE 7 &middot; PILOT OPERATIONS & COMMERCIAL VALIDATION
          </p>
          <h1 className="text-2xl font-light text-white tracking-tight mt-1">
            Pilot Operational State & Provenance Audit
          </h1>
          <p className="text-xs text-[var(--color-text-on-dark-muted)] mt-1 font-mono">
            Authoritative audit of production operating states, real vs seeded data segregation, and active pilot provider criteria.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/pilot-feedback"
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-white rounded border border-zinc-700 transition-colors"
          >
            View Feedback &rarr;
          </Link>
          <PilotFeedbackModal userType="ADMIN" />
        </div>
      </div>

      {/* 4 Operating States Status Grid */}
      <div>
        <h2 className="text-sm font-medium text-zinc-300 uppercase tracking-wider font-mono mb-3">
          Four Operating States Classification
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* State 1 */}
          <div className="p-5 bg-[#0e0e0e] border border-blue-900/40 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-blue-950/80 text-blue-300 border border-blue-800 rounded">
                STATE 1
              </span>
              <span className="text-xs text-emerald-400 font-mono">ACTIVE</span>
            </div>
            <h3 className="text-sm font-semibold text-white">Production Seeded</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              Deterministic verified baseline models, verified manufacturers, and initial market observations.
            </p>
            <div className="pt-2 border-t border-zinc-800/80 text-[11px] font-mono text-zinc-300">
              <p>Mfrs: <strong>{stateAudit.manufacturers.state1}</strong></p>
              <p>Assets: <strong>{stateAudit.assets.state1}</strong></p>
              <p>Market Data: <strong>{stateAudit.marketObservations.state1}</strong></p>
            </div>
          </div>

          {/* State 2 */}
          <div className="p-5 bg-[#0e0e0e] border border-emerald-900/40 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-emerald-950/80 text-emerald-300 border border-emerald-800 rounded">
                STATE 2
              </span>
              <span className="text-xs text-emerald-400 font-mono">ACTIVE</span>
            </div>
            <h3 className="text-sm font-semibold text-white">Externally Validated</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              Confirmed provider underwriting criteria, real rate cards, and verified external intermediary appetite.
            </p>
            <div className="pt-2 border-t border-zinc-800/80 text-[11px] font-mono text-zinc-300">
              <p>Providers: <strong>{stateAudit.providers.state2}</strong></p>
              <p>Criteria Sets: <strong>{stateAudit.criteria.state2}</strong></p>
              <p>Haydock Confirmed: <strong>YES</strong></p>
            </div>
          </div>

          {/* State 3 */}
          <div className="p-5 bg-[#0e0e0e] border border-amber-900/40 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-amber-950/80 text-amber-300 border border-amber-800 rounded">
                STATE 3
              </span>
              <span className="text-xs text-amber-400 font-mono">
                {funnelAudit.realExternal.opportunitiesSubmitted > 0 ? 'ACTIVE' : 'READY'}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-white">Commercially Exercised</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              Real external borrowers submitting genuine commercial requirements through intake & deterministic matching.
            </p>
            <div className="pt-2 border-t border-zinc-800/80 text-[11px] font-mono text-zinc-300">
              <p>Real Apps: <strong>{funnelAudit.realExternal.applicationsSubmitted}</strong></p>
              <p>Real Opps: <strong>{funnelAudit.realExternal.opportunitiesSubmitted}</strong></p>
              <p>Real Matches: <strong>{funnelAudit.realExternal.matchesGenerated}</strong></p>
            </div>
          </div>

          {/* State 4 */}
          <div className="p-5 bg-[#0e0e0e] border border-purple-900/40 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-purple-950/80 text-purple-300 border border-purple-800 rounded">
                STATE 4
              </span>
              <span className="text-xs text-purple-400 font-mono">
                {funnelAudit.realExternal.completedOffers > 0 ? 'COMPLETED' : 'AWAITING TRANSACTIONS'}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-white">Transactionally Exercised</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              Provider response recorded, formal indicative terms issued, information satisfied, completion achieved.
            </p>
            <div className="pt-2 border-t border-zinc-800/80 text-[11px] font-mono text-zinc-300">
              <p>Interested Appetite: <strong>{funnelAudit.realExternal.providerResponses.interested}</strong></p>
              <p>Formal Terms: <strong>{funnelAudit.realExternal.providerResponses.offered}</strong></p>
              <p>Completions: <strong>{funnelAudit.realExternal.completedOffers}</strong></p>
            </div>
          </div>
        </div>
      </div>

      {/* Strict Commercial Funnel Segregation: REAL_EXTERNAL vs SEED/TEST */}
      <div className="border border-[var(--color-border-dark)] bg-[#0c0c0c] rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--color-border-dark)] bg-[#111111] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium text-white uppercase tracking-wider font-mono">
              Data Segregation: Real External vs Synthetic Seed/Test
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Strict audit ensuring test activities are never commingled with live commercial performance.
            </p>
          </div>
          <span className="px-2 py-1 bg-zinc-800 text-[10px] font-mono uppercase text-zinc-300 border border-zinc-700 rounded">
            Audit Enforced
          </span>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400">
                  <th className="pb-3 uppercase">Funnel Metric</th>
                  <th className="pb-3 uppercase text-emerald-400">Real External Activity (Live)</th>
                  <th className="pb-3 uppercase text-zinc-500">Synthetic Seed / Test Baseline</th>
                  <th className="pb-3 uppercase">Commercial Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                <tr>
                  <td className="py-3">Borrower Applications Submitted</td>
                  <td className="py-3 text-emerald-400 font-bold">{funnelAudit.realExternal.applicationsSubmitted}</td>
                  <td className="py-3 text-zinc-500">{funnelAudit.seedOrTest.applicationsSubmitted}</td>
                  <td className="py-3 text-zinc-400">Intake Portal</td>
                </tr>
                <tr>
                  <td className="py-3">Commercial Opportunities Created</td>
                  <td className="py-3 text-emerald-400 font-bold">{funnelAudit.realExternal.opportunitiesSubmitted}</td>
                  <td className="py-3 text-zinc-500">{funnelAudit.seedOrTest.opportunitiesSubmitted}</td>
                  <td className="py-3 text-zinc-400">Pipeline Ingest</td>
                </tr>
                <tr>
                  <td className="py-3">Deterministic Provider Matches</td>
                  <td className="py-3 text-emerald-400 font-bold">{funnelAudit.realExternal.matchesGenerated}</td>
                  <td className="py-3 text-zinc-500">{funnelAudit.seedOrTest.matchesGenerated}</td>
                  <td className="py-3 text-zinc-400">Matching Engine</td>
                </tr>
                <tr>
                  <td className="py-3">Provider Appetite (Interested)</td>
                  <td className="py-3 text-emerald-400 font-bold">{funnelAudit.realExternal.providerResponses.interested}</td>
                  <td className="py-3 text-zinc-500">{funnelAudit.seedOrTest.providerResponses.interested}</td>
                  <td className="py-3 text-zinc-400">Preliminary Appetite</td>
                </tr>
                <tr>
                  <td className="py-3">Provider Formal Terms (Offered)</td>
                  <td className="py-3 text-emerald-400 font-bold">{funnelAudit.realExternal.providerResponses.offered}</td>
                  <td className="py-3 text-zinc-500">{funnelAudit.seedOrTest.providerResponses.offered}</td>
                  <td className="py-3 text-zinc-400">Underwritten Terms</td>
                </tr>
                <tr>
                  <td className="py-3">Information Requests Issued</td>
                  <td className="py-3 text-emerald-400 font-bold">{funnelAudit.realExternal.providerResponses.informationRequested}</td>
                  <td className="py-3 text-zinc-500">{funnelAudit.seedOrTest.providerResponses.informationRequested}</td>
                  <td className="py-3 text-zinc-400">Underwriter Clarification</td>
                </tr>
                <tr>
                  <td className="py-3">Completed Facilities</td>
                  <td className="py-3 text-emerald-400 font-bold">{funnelAudit.realExternal.completedOffers}</td>
                  <td className="py-3 text-zinc-500">{funnelAudit.seedOrTest.completedOffers}</td>
                  <td className="py-3 text-zinc-400">Closed Commercial Deal</td>
                </tr>
                <tr>
                  <td className="py-3">Commercial Invoicing / Billing</td>
                  <td className="py-3 text-amber-400 font-bold">
                    {funnelAudit.billing.activeBillingRecords} Active (PILOT MODE: £0.00 Invoiced)
                  </td>
                  <td className="py-3 text-zinc-500">—</td>
                  <td className="py-3 text-emerald-400">Protected / Free Pilot</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Real Pilot Provider Section */}
      <div className="border border-[var(--color-border-dark)] bg-[#0c0c0c] rounded-lg p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border-dark)]">
          <div>
            <p className="text-[10px] text-emerald-400 font-mono uppercase tracking-widest">
              ACCREDITED PILOT LENDER
            </p>
            <h2 className="text-base font-semibold text-white">Haydock Finance Ltd</h2>
            <p className="text-xs text-zinc-400">
              Company No: 01479860 &middot; Established UK asset finance specialist lender &middot; Pilot Status: ACTIVE
            </p>
          </div>
          <div className="text-right">
            <span className="px-2.5 py-1 bg-emerald-950/80 text-emerald-300 border border-emerald-700 rounded text-xs font-mono">
              CONFIRMED EXTERNAL CRITERIA
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3 bg-[#111111] p-4 rounded border border-zinc-800 text-xs">
            <h3 className="font-mono text-zinc-200 uppercase text-[11px] font-semibold">
              Live Underwriting Parameters
            </h3>
            <ul className="space-y-1.5 font-mono text-zinc-300">
              <li className="flex justify-between">
                <span className="text-zinc-500">Minimum Facility:</span>
                <span className="font-bold text-white">£10,000</span>
              </li>
              <li className="flex justify-between">
                <span className="text-zinc-500">Maximum Facility:</span>
                <span className="font-bold text-white">£750,000</span>
              </li>
              <li className="flex justify-between">
                <span className="text-zinc-500">Max Facility Term:</span>
                <span className="font-bold text-white">84 months (7 years)</span>
              </li>
              <li className="flex justify-between">
                <span className="text-zinc-500">Min Business Trading:</span>
                <span className="font-bold text-white">24 months</span>
              </li>
              <li className="flex justify-between">
                <span className="text-zinc-500">Max Asset Age at Inception:</span>
                <span className="font-bold text-white">15 years</span>
              </li>
              <li className="flex justify-between">
                <span className="text-zinc-500">Eligible Asset Conditions:</span>
                <span className="font-bold text-white">NEW, USED, REFURBISHED</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3 bg-[#111111] p-4 rounded border border-zinc-800 text-xs">
            <h3 className="font-mono text-zinc-200 uppercase text-[11px] font-semibold">
              External Provenance & Verification Audit
            </h3>
            <ul className="space-y-1.5 font-mono text-zinc-300">
              <li className="flex justify-between">
                <span className="text-zinc-500">Criteria Provenance Source:</span>
                <span className="font-bold text-emerald-400">Haydock Finance Broker Guide & Rate Schedule</span>
              </li>
              <li className="flex justify-between">
                <span className="text-zinc-500">External Verification Status:</span>
                <span className="font-bold text-emerald-400">CONFIRMED (State 2)</span>
              </li>
              <li className="flex justify-between">
                <span className="text-zinc-500">Verified By:</span>
                <span className="font-bold text-white">Pete Currey / Head of Operations</span>
              </li>
              <li className="flex justify-between">
                <span className="text-zinc-500">Verification Date:</span>
                <span className="font-bold text-white">2026-09-22</span>
              </li>
              <li className="flex justify-between">
                <span className="text-zinc-500">Scheduled Review Date:</span>
                <span className="font-bold text-white">2026-12-31</span>
              </li>
              <li className="flex justify-between">
                <span className="text-zinc-500">Eligible Sectors / Assets:</span>
                <span className="font-bold text-white">Commercial Vehicles, Cranes, Construction</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
