// app/(admin)/admin/market-data/page.tsx
import { db } from '@/lib/db/client'

export const revalidate = 0

export default async function AdminMarketDataPage() {
  const [totalObservations, sources, importJobs, byType] = await Promise.all([
    db.marketObservation.count({ where: { isActive: true } }),
    db.dataSource.findMany({ orderBy: [{ trustLevel: 'desc' }, { name: 'asc' }] }),
    db.importJob.findMany({ orderBy: { createdAt: 'desc' }, take: 20 }),
    db.marketObservation.groupBy({
      by: ['observationType'],
      where: { isActive: true },
      _count: true,
    }),
  ])

  const JOB_STATUS_STYLES: Record<string, string> = {
    PENDING:               'text-text-tertiary border-border',
    RUNNING:               'text-blue-400 border-blue-400/30',
    COMPLETED:             'text-emerald-400 border-emerald-400/30',
    COMPLETED_WITH_ERRORS: 'text-amber-400 border-amber-400/30',
    FAILED:                'text-red-400 border-red-400/30',
    CANCELLED:             'text-text-tertiary border-border',
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-lg font-extralight text-text-primary">Market Data</h1>
        <p className="text-text-tertiary text-sm mt-1">
          All market observations, data sources, and import jobs. Every price figure must be traceable to a source.
        </p>
      </div>

      {/* Observation totals */}
      <section>
        <h2 className="text-xs tracking-widest text-text-tertiary uppercase mb-4">Observations</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="border border-border p-4 text-center">
            <p className="text-2xl font-extralight text-text-primary">{totalObservations}</p>
            <p className="text-xs text-text-tertiary mt-1">Total active</p>
          </div>
          {byType.map(group => (
            <div key={group.observationType} className="border border-border p-4 text-center">
              <p className="text-xl font-extralight text-text-primary">{group._count}</p>
              <p className="text-xs text-text-tertiary mt-1">{group.observationType.replace(/_/g, ' ')}</p>
            </div>
          ))}
        </div>
        {totalObservations === 0 && (
          <p className="text-text-tertiary text-xs mt-3">
            No market observations recorded yet. Market observations are the foundation of the valuation engine.
            ASKING PRICE and SALE PRICE observations are always stored separately — they must never be conflated.
          </p>
        )}
      </section>

      {/* Data sources */}
      <section>
        <h2 className="text-xs tracking-widest text-text-tertiary uppercase mb-4">Data Sources</h2>
        {sources.length === 0 ? (
          <div className="border border-border p-8 text-center">
            <p className="text-text-tertiary text-sm">No data sources configured.</p>
            <p className="text-text-tertiary text-xs mt-1">
              Data sources define where market observations come from.
              Every observation must be linked to a source.
            </p>
          </div>
        ) : (
          <div className="border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="px-4 py-3 text-left text-xs text-text-tertiary font-normal">Source</th>
                  <th className="px-4 py-3 text-left text-xs text-text-tertiary font-normal">Type</th>
                  <th className="px-4 py-3 text-left text-xs text-text-tertiary font-normal">Trust</th>
                  <th className="px-4 py-3 text-left text-xs text-text-tertiary font-normal">Status</th>
                  <th className="px-4 py-3 text-left text-xs text-text-tertiary font-normal">Last import</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sources.map(source => (
                  <tr key={source.id} className="hover:bg-surface-secondary/50">
                    <td className="px-4 py-3">
                      <p className="text-text-primary">{source.name}</p>
                      {source.baseUrl && (
                        <p className="text-text-tertiary text-xs">{source.baseUrl}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-text-tertiary text-xs">{source.sourceType.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-text-primary text-sm">{source.trustLevel}</span>
                        <span className="text-text-tertiary text-xs">/5</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs border px-2 py-0.5 ${
                        source.status === 'ACTIVE'   ? 'text-emerald-400 border-emerald-400/30' :
                        source.status === 'TESTING'  ? 'text-blue-400 border-blue-400/30' :
                        source.status === 'SUSPENDED'? 'text-amber-400 border-amber-400/30' :
                        'text-text-tertiary border-border'
                      }`}>
                        {source.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-tertiary text-xs">
                      {source.lastSuccessfulImportAt
                        ? source.lastSuccessfulImportAt.toLocaleDateString('en-GB')
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Import jobs */}
      <section>
        <h2 className="text-xs tracking-widest text-text-tertiary uppercase mb-4">Recent Import Jobs</h2>
        {importJobs.length === 0 ? (
          <div className="border border-border p-8 text-center">
            <p className="text-text-tertiary text-sm">No import jobs yet.</p>
          </div>
        ) : (
          <div className="border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="px-4 py-3 text-left text-xs text-text-tertiary font-normal">Reference</th>
                  <th className="px-4 py-3 text-left text-xs text-text-tertiary font-normal">Entity</th>
                  <th className="px-4 py-3 text-left text-xs text-text-tertiary font-normal">Format</th>
                  <th className="px-4 py-3 text-left text-xs text-text-tertiary font-normal">Status</th>
                  <th className="px-4 py-3 text-right text-xs text-text-tertiary font-normal">Created</th>
                  <th className="px-4 py-3 text-right text-xs text-text-tertiary font-normal">Rejected</th>
                  <th className="px-4 py-3 text-left text-xs text-text-tertiary font-normal">Started</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {importJobs.map(job => (
                  <tr key={job.id} className="hover:bg-surface-secondary/50">
                    <td className="px-4 py-3 text-text-tertiary text-xs font-mono">
                      {job.reference.slice(0, 12)}…
                    </td>
                    <td className="px-4 py-3 text-text-secondary text-xs">{job.entityType}</td>
                    <td className="px-4 py-3 text-text-tertiary text-xs">{job.format}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs border px-2 py-0.5 ${JOB_STATUS_STYLES[job.status] ?? 'text-text-tertiary border-border'}`}>
                        {job.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-text-tertiary text-xs">{job.recordsCreated}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-xs ${job.recordsRejected > 0 ? 'text-amber-400' : 'text-text-tertiary'}`}>
                        {job.recordsRejected}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-tertiary text-xs">
                      {job.createdAt.toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
