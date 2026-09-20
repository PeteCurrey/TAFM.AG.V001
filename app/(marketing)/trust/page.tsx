// app/(marketing)/trust/page.tsx
import { generateMetadata as genMeta } from '@/lib/seo/metadata'
import Link from 'next/link'

export const metadata = genMeta({
  title: 'Data, Trust & Transparency',
  description: 'How TAFM handles data — provenance, AI usage, verification, market data, provider information, and what TAFM knows vs what it does not.',
})

const SECTIONS = [
  {
    id: 'data-provenance',
    title: 'Data Provenance',
    body: [
      'TAFM distinguishes between four data states:',
      'VERIFIED — confirmed by an official or authoritative source and recorded with that source.',
      'PROVISIONAL — based on research or publicly available information that has not been independently confirmed.',
      'CALCULATED — derived or computed from other data (e.g. a finance calculation, an AI-extracted value).',
      'UNKNOWN — the information exists in the system but its origin or accuracy has not been established.',
      'Every significant data point carries one of these states. Where information is UNKNOWN or PROVISIONAL, TAFM displays this clearly rather than presenting it as fact.',
    ],
  },
  {
    id: 'ai-usage',
    title: 'AI Usage',
    body: [
      'TAFM uses AI to assist with information extraction, asset classification, document analysis, and content drafting.',
      'AI outputs are never treated as authoritative. They are treated as CALCULATED or PROVISIONAL until reviewed.',
      'AI does not make credit decisions, eligibility determinations, or commercial recommendations.',
      'AI-generated content requires human review before publication.',
      'The AI models used (currently OpenAI) never receive personally identifiable financial data without explicit disclosure.',
      'API keys are never exposed to the browser.',
    ],
  },
  {
    id: 'market-data',
    title: 'Market Data',
    body: [
      'TAFM records market observations — price data points observed from external sources.',
      'ASKING PRICES and SALE PRICES are never conflated. An asking price is not a sale price.',
      'AUCTION RESULTS are separately categorised.',
      'Valuations are never invented. Where insufficient verified market data exists, TAFM says so.',
      'A minimum of 3 verified observations is required before any statistical summary is displayed.',
      'Every market observation is linked to its source. The question "where did this number come from?" always has an answer.',
    ],
  },
  {
    id: 'provider-information',
    title: 'Provider Information',
    body: [
      'Providers appear on TAFM only after a review process.',
      'Where provider information has not been independently verified, TAFM displays an explicit notice.',
      'Provider criteria change. TAFM records versioned, dated criteria — so the question "what criteria applied when this opportunity was matched?" can always be answered.',
      'TAFM does not claim to represent every lender in the market.',
      'A potential match is not an approval. All credit decisions are made by the finance provider.',
    ],
  },
  {
    id: 'verification',
    title: 'Verification',
    body: [
      'Manufacturer profiles are verified before publication.',
      'Provider profiles are verified before public listing.',
      'Asset data submitted by users is treated as PROVISIONAL until reviewed.',
      'Verification status is always displayed — TAFM does not hide data quality.',
    ],
  },
  {
    id: 'privacy-security',
    title: 'Privacy & Security',
    body: [
      'Finance application data is stored securely and never shared without explicit consent.',
      'Private documents are never publicly accessible.',
      'Access to sensitive records is controlled and audited.',
      'TAFM maintains a complete audit log of data changes. This is not deletable.',
      'Rate limiting is applied to all form submissions to prevent abuse.',
    ],
  },
]

export default function TrustPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-20">
          <p className="text-xs tracking-widest text-text-tertiary uppercase mb-4">
            Transparency
          </p>
          <h1 className="text-4xl font-extralight text-text-primary mb-6">
            Data, Trust & Transparency
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed">
            TAFM's credibility depends on being honest about what it knows, what it does not know,
            and how it knows it. This page explains how data is handled.
          </p>
        </div>
      </section>

      {/* Nav */}
      <section className="border-b border-border sticky top-0 bg-background z-10">
        <div className="max-w-3xl mx-auto px-6 py-3 flex gap-6 overflow-x-auto">
          {SECTIONS.map(s => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="text-xs text-text-tertiary hover:text-text-secondary whitespace-nowrap transition-colors"
            >
              {s.title}
            </a>
          ))}
        </div>
      </section>

      {/* Data states callout */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="border border-border p-6 mb-10">
          <p className="text-xs tracking-widest text-text-tertiary uppercase mb-5">Data states</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { state: 'VERIFIED',    desc: 'Confirmed by official source with evidence',   color: 'text-emerald-400' },
              { state: 'PROVISIONAL', desc: 'Research-based, not yet independently confirmed', color: 'text-amber-400' },
              { state: 'CALCULATED',  desc: 'Derived or AI-extracted — not primary data',    color: 'text-blue-400' },
              { state: 'UNKNOWN',     desc: 'Origin or accuracy not established',            color: 'text-text-tertiary' },
            ].map(item => (
              <div key={item.state} className="flex items-start gap-3">
                <code className={`text-xs font-mono ${item.color} shrink-0`}>{item.state}</code>
                <p className="text-text-tertiary text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-12">
          {SECTIONS.map(section => (
            <div key={section.id} id={section.id} className="scroll-mt-16">
              <h2 className="text-xs tracking-widest text-text-tertiary uppercase border-b border-border pb-3 mb-5">
                {section.title}
              </h2>
              <ul className="space-y-3">
                {section.body.map((line, i) => (
                  <li key={i} className={i === 0 && section.id === 'data-provenance' ? 'text-text-primary text-sm' : 'flex items-start gap-3 text-text-secondary text-sm leading-relaxed'}>
                    {i === 0 && section.id === 'data-provenance' ? line : (
                      <>
                        <span className="text-text-tertiary shrink-0 mt-1">·</span>
                        <span>{line}</span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-16 border-t border-border pt-8">
          <p className="text-text-tertiary text-sm">
            Questions about how TAFM handles data?{' '}
            <Link href="/contact" className="text-text-secondary underline hover:text-text-primary">
              Contact us
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
