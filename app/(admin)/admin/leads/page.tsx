// app/(admin)/admin/leads/page.tsx
import { db } from '@/lib/db/client'

export const revalidate = 0

const STATUS_STYLES: Record<string, string> = {
  NEW:          'text-blue-400 border-blue-400/30',
  CONTACTED:    'text-amber-400 border-amber-400/30',
  QUALIFYING:   'text-orange-400 border-orange-400/30',
  CONVERTED:    'text-emerald-400 border-emerald-400/30',
  DISQUALIFIED: 'text-text-tertiary border-border',
}

export default async function AdminLeadsPage() {
  const leads = await db.lead.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
  })

  const counts = {
    NEW:          leads.filter(l => l.status === 'NEW').length,
    CONTACTED:    leads.filter(l => l.status === 'CONTACTED').length,
    QUALIFYING:   leads.filter(l => l.status === 'QUALIFYING').length,
    CONVERTED:    leads.filter(l => l.status === 'CONVERTED').length,
    DISQUALIFIED: leads.filter(l => l.status === 'DISQUALIFIED').length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-extralight text-text-primary">Leads</h1>
        <p className="text-text-tertiary text-sm mt-1">
          Initial contacts — not yet qualified as opportunities. Leads must be assessed before becoming opportunities.
        </p>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-5 gap-3">
        {Object.entries(counts).map(([status, count]) => (
          <div key={status} className="border border-border p-3 text-center">
            <p className="text-xl font-extralight text-text-primary">{count}</p>
            <p className="text-xs text-text-tertiary mt-1">{status}</p>
          </div>
        ))}
      </div>

      {leads.length === 0 ? (
        <div className="border border-border p-10 text-center">
          <p className="text-text-tertiary text-sm">No leads yet.</p>
        </div>
      ) : (
        <div className="border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-secondary">
                <th className="px-4 py-3 text-left text-xs text-text-tertiary font-normal">Company</th>
                <th className="px-4 py-3 text-left text-xs text-text-tertiary font-normal">Contact</th>
                <th className="px-4 py-3 text-left text-xs text-text-tertiary font-normal">Type</th>
                <th className="px-4 py-3 text-left text-xs text-text-tertiary font-normal">Source</th>
                <th className="px-4 py-3 text-left text-xs text-text-tertiary font-normal">Status</th>
                <th className="px-4 py-3 text-left text-xs text-text-tertiary font-normal">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leads.map(lead => (
                <tr key={lead.id} className="hover:bg-surface-secondary/50 transition-colors">
                  <td className="px-4 py-3 text-text-primary">{lead.companyName}</td>
                  <td className="px-4 py-3">
                    <p className="text-text-secondary text-xs">{lead.contactName}</p>
                    <p className="text-text-tertiary text-xs">{lead.email}</p>
                  </td>
                  <td className="px-4 py-3 text-text-tertiary text-xs">{lead.type}</td>
                  <td className="px-4 py-3 text-text-tertiary text-xs">{lead.source.replace(/_/g, ' ')}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs border px-2 py-0.5 ${STATUS_STYLES[lead.status] ?? 'text-text-tertiary border-border'}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-tertiary text-xs">
                    {lead.createdAt.toLocaleDateString('en-GB')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
