import React from 'react'
import Link from 'next/link'

export default function AccountPage() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extralight text-text-primary mb-2">My account</h1>
        <p className="text-sm text-text-secondary">
          Manage your assets, finance requests, and opportunities.
        </p>
      </div>

      <div className="border border-blue-900/40 bg-blue-950/20 rounded-sm px-5 py-4 mb-8">
        <p className="text-sm text-blue-300 font-medium mb-1">Account access coming soon</p>
        <p className="text-xs text-blue-200/70 leading-relaxed">
          The business account area is under development. When available, you will be able to 
          track your assets, monitor finance requests, and receive updates on opportunities — 
          all from this dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { href: '/account/assets',        label: 'My assets',        desc: 'View and manage assets you have registered' },
          { href: '/account/finance',       label: 'Finance requests', desc: 'Track the status of your finance enquiries' },
          { href: '/account/opportunities', label: 'Opportunities',    desc: 'View your matched finance opportunities' },
          { href: '/apply',                 label: 'New finance request', desc: 'Start a new asset finance application' },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="border border-border rounded-sm p-4 hover:border-orange-500/40 hover:bg-white/[0.02] transition-colors group"
          >
            <p className="text-sm font-medium text-text-primary group-hover:text-orange-400 transition-colors mb-1">{item.label}</p>
            <p className="text-xs text-text-secondary">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
