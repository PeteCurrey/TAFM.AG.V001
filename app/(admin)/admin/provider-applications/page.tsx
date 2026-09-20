// app/(admin)/admin/provider-applications/page.tsx
import { db } from '@/lib/db/client'

export const revalidate = 0

const STATUS_STYLES: Record<string, string> = {
  SUBMITTED:    'text-blue-400 border-blue-400/30',
  UNDER_REVIEW: 'text-amber-400 border-amber-400/30',
  VERIFIED:     'text-emerald-400 border-emerald-400/30',
  REJECTED:     'text-red-400 border-red-400/30',
  INCOMPLETE:   'text-text-tertiary border-border',
}

export default async function ProviderApplicationsPage() {
  const applications = await db.providerApplication.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  const counts = {
    SUBMITTED:    applications.filter(a => a.status === 'SUBMITTED').length,
    UNDER_REVIEW: applications.filter(a => a.status === 'UNDER_REVIEW').length,
    VERIFIED:     applications.filter(a => a.status === 'VERIFIED').length,
    REJECTED:     applications.filter(a => a.status === 'REJECTED').length,
    INCOMPLETE:   applications.filter(a => a.status === 'INCOMPLETE').length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-extralight text-text-primary">Provider Applications</h1>
        <p className="text-text-tertiary text-sm mt-1">
          Applications to join the TAFM provider network. Human review required before any provider is activated.
        </p>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-5 gap-3">
        {Object.entries(counts).map(([status, count]) => (
          <div key={status} className="border border-border p-3 text-center">
            <p className="text-xl font-extralight text-text-primary">{count}</p>
            <p className="text-xs text-text-tertiary mt-1">{status.replace('_', ' ')}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      {applications.length === 0 ? (
        <div className="border border-border p-10 text-center">
          <p className="text-text-tertiary text-sm">No provider applications yet.</p>
        </div>
      ) : (
        <div className="border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-secondary">
                <th className="px-4 py-3 text-left text-xs text-text-tertiary font-normal">Company</th>
                <th className="px-4 py-3 text-left text-xs text-text-tertiary font-normal">Type</th>
                <th className="px-4 py-3 text-left text-xs text-text-tertiary font-normal">Contact</th>
                <th className="px-4 py-3 text-left text-xs text-text-tertiary font-normal">Status</th>
                <th className="px-4 py-3 text-left text-xs text-text-tertiary font-normal">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {applications.map(app => (
                <tr key={app.id} className="hover:bg-surface-secondary/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-text-primary">{app.companyName}</p>
                    {app.companyNumber && (
                      <p className="text-text-tertiary text-xs font-mono">{app.companyNumber}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-text-tertiary text-xs">
                    {app.providerType.replace(/_/g, ' ')}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-text-secondary text-xs">{app.contactName}</p>
                    <p className="text-text-tertiary text-xs">{app.contactEmail}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs border px-2 py-0.5 ${STATUS_STYLES[app.status] ?? 'text-text-tertiary border-border'}`}>
                      {app.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-tertiary text-xs">
                    {app.submittedAt.toLocaleDateString('en-GB')}
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
