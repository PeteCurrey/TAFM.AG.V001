// app/(admin)/admin/content/page.tsx
import { db } from '@/lib/db/client'

export const revalidate = 0

const STATUS_STYLES: Record<string, string> = {
  DRAFT:     'text-text-tertiary border-border',
  REVIEW:    'text-amber-400 border-amber-400/30',
  PUBLISHED: 'text-emerald-400 border-emerald-400/30',
  ARCHIVED:  'text-text-tertiary border-border',
}

const TYPE_LABELS: Record<string, string> = {
  ASSET_GUIDE:    'Asset Guide',
  FINANCE_GUIDE:  'Finance Guide',
  BUYING_GUIDE:   'Buying Guide',
  MARKET_GUIDE:   'Market Guide',
  PROVIDER_GUIDE: 'Provider Guide',
}

export default async function AdminContentPage() {
  const resources = await db.resource.findMany({
    orderBy: [{ status: 'asc' }, { updatedAt: 'desc' }],
  })

  const counts = {
    DRAFT:     resources.filter(r => r.status === 'DRAFT').length,
    REVIEW:    resources.filter(r => r.status === 'REVIEW').length,
    PUBLISHED: resources.filter(r => r.status === 'PUBLISHED').length,
    ARCHIVED:  resources.filter(r => r.status === 'ARCHIVED').length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-extralight text-text-primary">Content</h1>
        <p className="text-text-tertiary text-sm mt-1">
          Guides and resources. AI can draft — human review required before PUBLISHED.
          No bulk-generated thin content is permitted.
        </p>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-4 gap-3">
        {Object.entries(counts).map(([status, count]) => (
          <div key={status} className="border border-border p-3 text-center">
            <p className={`text-xl font-extralight ${
              status === 'REVIEW' && count > 0 ? 'text-amber-400' :
              status === 'PUBLISHED' ? 'text-emerald-400' : 'text-text-primary'
            }`}>{count}</p>
            <p className="text-xs text-text-tertiary mt-1">{status}</p>
          </div>
        ))}
      </div>

      {resources.length === 0 ? (
        <div className="border border-border p-10 text-center">
          <p className="text-text-tertiary text-sm">No content resources yet.</p>
          <p className="text-text-tertiary text-xs mt-2 max-w-sm mx-auto leading-relaxed">
            Content resources are created as verified data accumulates.
            Each resource requires human review before publishing.
            TAFM does not publish AI-generated content without review.
          </p>
        </div>
      ) : (
        <div className="border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-secondary">
                <th className="px-4 py-3 text-left text-xs text-text-tertiary font-normal">Title</th>
                <th className="px-4 py-3 text-left text-xs text-text-tertiary font-normal">Type</th>
                <th className="px-4 py-3 text-left text-xs text-text-tertiary font-normal">Status</th>
                <th className="px-4 py-3 text-left text-xs text-text-tertiary font-normal">Indexable</th>
                <th className="px-4 py-3 text-left text-xs text-text-tertiary font-normal">Published</th>
                <th className="px-4 py-3 text-left text-xs text-text-tertiary font-normal">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {resources.map(resource => (
                <tr key={resource.id} className="hover:bg-surface-secondary/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-text-primary">{resource.title}</p>
                    <p className="text-text-tertiary text-xs font-mono">{resource.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-text-tertiary text-xs">
                    {TYPE_LABELS[resource.resourceType] ?? resource.resourceType}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs border px-2 py-0.5 ${STATUS_STYLES[resource.status] ?? 'text-text-tertiary border-border'}`}>
                      {resource.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs ${resource.isIndexable ? 'text-emerald-400' : 'text-text-tertiary'}`}>
                      {resource.isIndexable ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-tertiary text-xs">
                    {resource.publishedAt ? resource.publishedAt.toLocaleDateString('en-GB') : '—'}
                  </td>
                  <td className="px-4 py-3 text-text-tertiary text-xs">
                    {resource.updatedAt.toLocaleDateString('en-GB')}
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
