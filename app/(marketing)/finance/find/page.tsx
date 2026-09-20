// app/(marketing)/finance/find/page.tsx
import { generateMetadata as genMeta } from '@/lib/seo/metadata'
import Link from 'next/link'

export const metadata = genMeta({
  title: 'Find Asset Finance',
  description: 'TAFM matches asset finance requirements to verified providers using deterministic criteria — not guesswork. Find out how the process works.',
})

const STEPS = [
  {
    step: '01',
    title: 'Submit your requirement',
    body: 'Tell TAFM about your asset and finance requirement. Asset type, value, term, deposit — as much detail as you have. More information produces better matching.',
  },
  {
    step: '02',
    title: 'Requirement assessed',
    body: 'TAFM assesses your requirement against the recorded criteria of providers in the network. This is a deterministic process — not AI guesswork. Provider criteria are versioned and dated.',
  },
  {
    step: '03',
    title: 'Potential matches identified',
    body: 'Where provider criteria are met, a potential match is identified. Where criteria are unknown or partially met, this is explicitly stated — TAFM does not assume eligibility.',
  },
  {
    step: '04',
    title: 'Additional information may be requested',
    body: 'Some requirements need more information before matching can proceed. TAFM will ask — clearly and specifically — what is needed.',
  },
  {
    step: '05',
    title: 'Provider engagement',
    body: 'Where a credible match exists, TAFM facilitates contact with the provider. This does not constitute an application or guarantee any offer.',
  },
  {
    step: '06',
    title: 'Decision by the provider',
    body: 'All credit decisions are made by the finance provider — not by TAFM. TAFM does not approve or decline applications.',
  },
]

export default function FindFinancePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <p className="text-xs tracking-widest text-text-tertiary uppercase mb-4">
            Asset finance
          </p>
          <h1 className="text-4xl font-extralight text-text-primary mb-6">
            Find Asset Finance
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed max-w-2xl">
            TAFM collects your finance requirement. TAFM assesses it against verified provider
            criteria. Potential matches are identified — transparently.
          </p>
          <div className="mt-10">
            <Link
              href="/apply"
              className="inline-block border border-orange-500 text-orange-500 px-8 py-3 hover:bg-orange-500 hover:text-white transition-colors"
            >
              Start finance request
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-xs tracking-widest text-text-tertiary uppercase mb-10">
          How the process works
        </h2>
        <div className="space-y-0">
          {STEPS.map((step, i) => (
            <div key={step.step} className="grid grid-cols-[64px_1fr] gap-6 py-8 border-b border-border last:border-0">
              <div>
                <span className="text-2xl font-extralight text-text-tertiary">{step.step}</span>
              </div>
              <div>
                <h3 className="text-text-primary font-light mb-2">{step.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What TAFM is not */}
      <section className="border-t border-border">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-xs tracking-widest text-text-tertiary uppercase mb-8">
            What TAFM is not
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              ['Not a lender', 'TAFM does not lend money. We match requirements to providers who do.'],
              ['Not a broker', 'TAFM does not act as a regulated credit broker. We are a platform.'],
              ['Not a guarantee', 'A potential match does not mean an approval. All decisions rest with providers.'],
              ['Not a marketplace', 'TAFM does not list live finance offers. Matching is requirement-driven.'],
            ].map(([title, body]) => (
              <div key={title} className="border border-border p-5">
                <p className="text-text-primary text-sm font-light mb-2">{title}</p>
                <p className="text-text-tertiary text-xs leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 p-5 border border-border">
            <p className="text-text-tertiary text-xs leading-relaxed">
              TAFM distinguishes between potential matches (criteria met), partial matches (criteria
              partially known or met), and unknown eligibility (criteria not recorded).
              We do not claim to represent every lender in the market. Provider coverage grows as
              the network expands.{' '}
              <Link href="/trust" className="underline hover:text-text-secondary">
                Read our data and trust policy
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Providers CTA */}
      <section className="border-t border-border bg-surface-secondary">
        <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-text-primary font-light mb-1">Are you a finance provider?</p>
            <p className="text-text-tertiary text-sm">Apply to join the TAFM provider network.</p>
          </div>
          <Link
            href="/for-providers"
            className="shrink-0 border border-border text-text-secondary px-6 py-2.5 text-sm hover:border-text-secondary hover:text-text-primary transition-colors"
          >
            Provider application →
          </Link>
        </div>
      </section>
    </main>
  )
}
