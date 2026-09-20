import React from 'react'
import Link from 'next/link'

export default function AccountFinancePage() {
  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extralight text-text-primary mb-2">Finance requests</h1>
          <p className="text-sm text-text-secondary">Track the status of your submitted finance enquiries.</p>
        </div>
        <Link href="/apply" className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-sm transition-colors">
          New request
        </Link>
      </div>
      <div className="border border-blue-900/40 bg-blue-950/20 rounded-sm px-5 py-4">
        <p className="text-sm text-blue-300 font-medium mb-1">Available when signed in</p>
        <p className="text-xs text-blue-200/70">
          Finance requests linked to your account will appear here with their current status, 
          matched providers, and any outstanding information requirements.
        </p>
      </div>
    </div>
  )
}
