// app/(admin)/admin/providers/page.tsx
import { db } from '@/lib/db/client'
import Link from 'next/link'

export const revalidate = 0

export default async function AdminProvidersPage() {
  const lenders = await db.lender.findMany({
    where: { deletedAt: null },
    include: {
      criteria: { select: { isActive: true } },
      criteriaVersions: { select: { id: true, isActive: true } },
      _count: { select: { financeProducts: true } },
    },
    orderBy: [{ verificationStatus: 'asc' }, { name: 'asc' }],
  })

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-extralight text-text-primary">Providers</h1>
          <p className="text-text-tertiary text-sm mt-1">
            {lenders.length} provider{lenders.length !== 1 ? 's' : ''} in the system.
            Publicly listed providers appear on <code className="text-xs">/providers</code>.
          </p>
        </div>
        <Link
          href="/admin/provider-applications"
          className="text-xs text-text-tertiary border border-border px-3 py-2 hover:border-text-secondary hover:text-text-secondary transition-colors"
        >
          View applications →
        </Link>
      </div>

      {lenders.length === 0 ? (
        <div className="border border-border p-10 text-center">
          <p className="text-text-tertiary text-sm">No providers yet.</p>
          <p className="text-text-tertiary text-xs mt-2">
            Providers are created when a Provider Application is reviewed and approved.
          </p>
        </div>
      ) : (
        <div className="border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-secondary">
                <th className="px-4 py-3 text-left text-xs text-text-tertiary font-normal">Provider</th>
                <th className="px-4 py-3 text-left text-xs text-text-tertiary font-normal">Type</th>
                <th className="px-4 py-3 text-left text-xs text-text-tertiary font-normal">Verification</th>
                <th className="px-4 py-3 text-left text-xs text-text-tertiary font-normal">Criteria</th>
                <th className="px-4 py-3 text-left text-xs text-text-tertiary font-normal">Products</th>
                <th className="px-4 py-3 text-left text-xs text-text-tertiary font-normal">Listed</th>
                <th className="px-4 py-3 text-left text-xs text-text-tertiary font-normal"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {lenders.map(lender => {
                const hasCriteria = !!lender.criteria?.isActive
                const criteriaVersionCount = lender.criteriaVersions.length
                return (
                  <tr key={lender.id} className="hover:bg-surface-secondary/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-text-primary">{lender.tradingName ?? lender.name}</p>
                      <p className="text-text-tertiary text-xs">{lender.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-text-tertiary text-xs">
                      {lender.lenderType.replace(/_/g, ' ')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs border px-2 py-0.5 ${
                        lender.verificationStatus === 'VERIFIED'    ? 'text-emerald-400 border-emerald-400/30' :
                        lender.verificationStatus === 'PROVISIONAL' ? 'text-amber-400 border-amber-400/30' :
                        'text-text-tertiary border-border'
                      }`}>
                        {lender.verificationStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs ${hasCriteria ? 'text-emerald-400' : 'text-red-400'}`}>
                        {hasCriteria ? `✓ Active (${criteriaVersionCount}v)` : '✗ None'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-tertiary text-xs">
                      {lender._count.financeProducts}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs ${lender.isPubliclyListed ? 'text-emerald-400' : 'text-text-tertiary'}`}>
                        {lender.isPubliclyListed ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/providers/${lender.id}`}
                        className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
                      >
                        Manage →
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
