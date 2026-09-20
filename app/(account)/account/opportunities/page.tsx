import React from 'react'
import Link from 'next/link'

const OPPORTUNITY_NAV = [
  { href: '/account/opportunities', label: 'Active opportunities' },
]

export default function AccountOpportunitiesPage() {
  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extralight text-text-primary mb-2">Opportunities</h1>
        <p className="text-sm text-text-secondary">Finance opportunities associated with your account.</p>
      </div>
      <div className="border border-blue-900/40 bg-blue-950/20 rounded-sm px-5 py-4 mb-8">
        <p className="text-sm text-blue-300 font-medium mb-1">Available when signed in</p>
        <p className="text-xs text-blue-200/70 leading-relaxed">
          Your opportunities will appear here once account authentication is available. 
          Each opportunity shows the asset, matched providers, and current status.
        </p>
      </div>
      <Link href="/apply" className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-sm transition-colors">
        Start a finance request
      </Link>
    </div>
  )
}
