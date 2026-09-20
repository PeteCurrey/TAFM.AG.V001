import React from 'react'
import Link from 'next/link'

export default function ProviderDashboardPage() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extralight text-text-primary mb-2">Provider dashboard</h1>
        <p className="text-sm text-text-secondary">
          Review opportunities matched to your lending criteria.
        </p>
      </div>

      <div className="border border-indigo-900/40 bg-indigo-950/20 rounded-sm px-5 py-4 mb-8">
        <p className="text-sm text-indigo-300 font-medium mb-1">Provider onboarding coming soon</p>
        <p className="text-xs text-indigo-200/70 leading-relaxed">
          The provider portal is under development. When available, registered lenders and 
          finance providers will be able to set their eligibility criteria, review matched 
          opportunities, and manage their profile — all from this dashboard.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-xs text-text-tertiary uppercase tracking-wider">How provider matching works</h2>
        {[
          { step: '01', label: 'Criteria setup',     desc: 'Define your asset categories, finance structures, amount ranges, and business criteria.' },
          { step: '02', label: 'Opportunity matching',desc: 'TAFM\'s deterministic eligibility engine matches requirements against your criteria.' },
          { step: '03', label: 'Opportunity review',  desc: 'Review matched opportunities with full asset, business, and finance requirement detail.' },
          { step: '04', label: 'Provider response',   desc: 'Indicate appetite, request information, or pass — no obligation to every opportunity.' },
        ].map((s) => (
          <div key={s.step} className="border border-border rounded-sm px-5 py-4 flex gap-4">
            <span className="text-xs font-mono text-text-tertiary mt-0.5 flex-shrink-0">{s.step}</span>
            <div>
              <p className="text-sm font-medium text-text-primary mb-1">{s.label}</p>
              <p className="text-xs text-text-secondary">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Link href="/for-lenders" className="text-sm text-orange-400 hover:text-orange-300 transition-colors">
          Learn more about joining TAFM as a provider →
        </Link>
      </div>
    </div>
  )
}
