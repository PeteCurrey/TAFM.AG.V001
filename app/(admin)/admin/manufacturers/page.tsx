// app/(admin)/admin/manufacturers/page.tsx
import { db } from '@/lib/db/client'
import Link from 'next/link'

export const revalidate = 0

export default async function AdminManufacturersPage() {
  const manufacturers = await db.manufacturer.findMany({
    include: {
      _count: { select: { assets: true, assetModels: true } },
    },
    orderBy: { name: 'asc' },
  })

  const verifiedCount   = manufacturers.filter(m => m.verificationStatus === 'VERIFIED').length
  const provisionalCount = manufacturers.filter(m => m.verificationStatus === 'PROVISIONAL').length
  const unknownCount    = manufacturers.filter(m => m.verificationStatus === 'UNKNOWN').length
  const noAliasCount    = manufacturers.filter(m => !m.aliases || m.aliases.length === 0).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-extralight text-text-primary">Manufacturers</h1>
        <p className="text-text-tertiary text-sm mt-1">
          {manufacturers.length} manufacturer{manufacturers.length !== 1 ? 's' : ''} in the system.
          Aliases are critical for normalisation — without them, the same manufacturer may be recorded multiple times.
        </p>
      </div>

      {/* Quality summary */}
      <div className="grid grid-cols-4 gap-3">
        <div className="border border-border p-3 text-center">
          <p className="text-xl font-extralight text-emerald-400">{verifiedCount}</p>
          <p className="text-xs text-text-tertiary mt-1">Verified</p>
        </div>
        <div className="border border-border p-3 text-center">
          <p className="text-xl font-extralight text-amber-400">{provisionalCount}</p>
          <p className="text-xs text-text-tertiary mt-1">Provisional</p>
        </div>
        <div className="border border-border p-3 text-center">
          <p className="text-xl font-extralight text-text-tertiary">{unknownCount}</p>
          <p className="text-xs text-text-tertiary mt-1">Unknown</p>
        </div>
        <div className="border border-border p-3 text-center">
          <p className={`text-xl font-extralight ${noAliasCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {noAliasCount}
          </p>
          <p className="text-xs text-text-tertiary mt-1">No aliases</p>
        </div>
      </div>

      {manufacturers.length === 0 ? (
        <div className="border border-border p-10 text-center">
          <p className="text-text-tertiary text-sm">No manufacturers yet.</p>
          <p className="text-text-tertiary text-xs mt-2">
            Manufacturers are added via import jobs or manual entry.
            Each manufacturer record must be verified before use in matching.
          </p>
        </div>
      ) : (
        <div className="border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-secondary">
                <th className="px-4 py-3 text-left text-xs text-text-tertiary font-normal">Manufacturer</th>
                <th className="px-4 py-3 text-left text-xs text-text-tertiary font-normal">Country</th>
                <th className="px-4 py-3 text-left text-xs text-text-tertiary font-normal">Verification</th>
                <th className="px-4 py-3 text-left text-xs text-text-tertiary font-normal">Aliases</th>
                <th className="px-4 py-3 text-left text-xs text-text-tertiary font-normal">Models</th>
                <th className="px-4 py-3 text-left text-xs text-text-tertiary font-normal">Assets</th>
                <th className="px-4 py-3 text-left text-xs text-text-tertiary font-normal">Public</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {manufacturers.map(mfr => (
                <tr key={mfr.id} className="hover:bg-surface-secondary/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-text-primary">{mfr.name}</p>
                    <p className="text-text-tertiary text-xs font-mono">{mfr.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-text-tertiary text-xs">
                    {mfr.countryOfOrigin ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs border px-2 py-0.5 ${
                      mfr.verificationStatus === 'VERIFIED'    ? 'text-emerald-400 border-emerald-400/30' :
                      mfr.verificationStatus === 'PROVISIONAL' ? 'text-amber-400 border-amber-400/30' :
                      'text-text-tertiary border-border'
                    }`}>
                      {mfr.verificationStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {mfr.aliases && mfr.aliases.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {mfr.aliases.slice(0, 3).map(a => (
                          <code key={a} className="text-xs text-text-tertiary bg-surface-secondary px-1">
                            {a}
                          </code>
                        ))}
                        {mfr.aliases.length > 3 && (
                          <span className="text-xs text-text-tertiary">+{mfr.aliases.length - 3}</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-amber-400">None</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-text-tertiary text-xs">{mfr._count.assetModels}</td>
                  <td className="px-4 py-3 text-text-tertiary text-xs">{mfr._count.assets}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/manufacturers/${mfr.slug}`}
                      className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
                      target="_blank"
                      rel="noopener"
                    >
                      ↗
                    </Link>
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
