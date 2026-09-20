import React from 'react'
import Link from 'next/link'

export default function AccountAssetsPage() {
  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extralight text-text-primary mb-2">My assets</h1>
          <p className="text-sm text-text-secondary">Assets you have registered with TAFM.</p>
        </div>
        <Link href="/asset-intelligence" className="px-4 py-2 border border-border rounded-sm text-sm text-text-secondary hover:border-orange-500/50 hover:text-orange-400 transition-colors">
          Analyse an asset
        </Link>
      </div>
      <div className="border border-blue-900/40 bg-blue-950/20 rounded-sm px-5 py-4">
        <p className="text-sm text-blue-300 font-medium mb-1">Available when signed in</p>
        <p className="text-xs text-blue-200/70">
          Your registered assets will appear here. You can use the Asset Intelligence tool now 
          to analyse an asset — it does not require sign-in.
        </p>
      </div>
    </div>
  )
}
