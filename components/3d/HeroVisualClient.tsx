'use client'

import dynamic from 'next/dynamic'

// ─── HeroVisual client wrapper ─────────────────────────────────────────────────
//
// dynamic() with ssr: false MUST live inside a Client Component.
// This thin wrapper is imported by the Server Component page.

const HeroVisualDynamic = dynamic(
  () => import('@/components/3d/HeroVisual').then((m) => m.HeroVisual),
  {
    ssr: false,
    loading: () => <div className="w-full h-full" aria-hidden="true" />,
  },
)

export function HeroVisualClient() {
  return <HeroVisualDynamic />
}
