// @ts-nocheck
'use client'

import { useActionState, useRef } from 'react'
import { submitProviderApplication } from '@/app/actions/provider-application'
import type { ProviderApplicationFormState } from '@/app/actions/provider-application'

const PROVIDER_TYPES = [
  { value: 'BANK',                    label: 'Bank' },
  { value: 'SPECIALIST_LENDER',       label: 'Specialist Lender' },
  { value: 'ASSET_FINANCE_PROVIDER',  label: 'Asset Finance Provider' },
  { value: 'BROKER',                  label: 'Broker / Intermediary' },
  { value: 'MANUFACTURER_FINANCE',    label: 'Manufacturer Finance' },
  { value: 'DEALER_FINANCE',          label: 'Dealer Finance' },
  { value: 'OTHER',                   label: 'Other' },
]

const FINANCE_PRODUCTS = [
  'Hire Purchase', 'Finance Lease', 'Operating Lease', 'Asset Refinance',
  'Commercial Loan', 'Sale and Leaseback', 'Specialist Finance',
]

const ASSET_CATEGORIES = [
  'Commercial Vehicles', 'Plant & Machinery', 'Agricultural Equipment',
  'Construction Equipment', 'Industrial Equipment', 'Technology', 'Marine',
  'Medical Equipment', 'Energy Equipment', 'Specialist / Other',
]

const initialState: ProviderApplicationFormState = { status: 'idle' }

export default function ForProvidersPage() {
  const [state, action, isPending] = useActionState(submitProviderApplication, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  if (state.status === 'success') {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-lg w-full text-center py-24">
          <div className="w-10 h-10 border border-emerald-600 flex items-center justify-center mx-auto mb-6">
            <span className="text-emerald-600 text-lg">✓</span>
          </div>
          <h1 className="text-xl font-extralight text-text-primary mb-4">Application Received</h1>
          {state.reference && (
            <p className="text-text-tertiary text-xs font-mono mb-4">
              Reference: {state.reference}
            </p>
          )}
          <p className="text-text-secondary text-sm leading-relaxed">
            {state.message}
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <p className="text-xs tracking-widest text-text-tertiary uppercase mb-4">
            Provider network
          </p>
          <h1 className="text-3xl font-extralight text-text-primary mb-4">
            Become a TAFM Provider
          </h1>
          <p className="text-text-secondary leading-relaxed max-w-xl">
            TAFM connects businesses with asset finance requirements to verified providers.
            If you are an asset finance lender, broker, or specialist, apply to join the network.
          </p>
          <div className="mt-8 border border-border p-5 space-y-2">
            <p className="text-xs text-text-tertiary">What happens after you apply:</p>
            {[
              'Application reviewed by the TAFM team',
              'Criteria verified against public and provided information',
              'Provider profile created with verified status',
              'Finance requirements matched against your verified criteria',
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3 text-xs text-text-secondary">
                <span className="text-text-tertiary mt-0.5">{i + 1}.</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        {state.status === 'error' && state.message && !state.errors && (
          <div className="border border-red-600/30 bg-red-600/5 p-4 mb-8">
            <p className="text-xs text-red-500">{state.message}</p>
          </div>
        )}

        <form ref={formRef} action={action} className="space-y-10">
          {/* Company details */}
          <fieldset className="space-y-5">
            <legend className="text-xs tracking-widest text-text-tertiary uppercase pb-4 border-b border-border w-full">
              Company Details
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs text-text-tertiary mb-1.5">Company name *</label>
                <input
                  name="companyName"
                  required
                  className="w-full bg-transparent border border-border px-3 py-2.5 text-text-primary text-sm outline-none focus:border-text-secondary"
                  placeholder="Acme Finance Ltd"
                />
                {state.errors?.companyName && (
                  <p className="text-xs text-red-400 mt-1">{state.errors.companyName}</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-text-tertiary mb-1.5">
                  Companies House number
                  <span className="text-text-tertiary ml-1">(optional)</span>
                </label>
                <input
                  name="companyNumber"
                  className="w-full bg-transparent border border-border px-3 py-2.5 text-text-primary text-sm outline-none focus:border-text-secondary font-mono"
                  placeholder="12345678"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-text-tertiary mb-1.5">Website</label>
              <input
                name="website"
                type="url"
                className="w-full bg-transparent border border-border px-3 py-2.5 text-text-primary text-sm outline-none focus:border-text-secondary"
                placeholder="https://www.example.co.uk"
              />
            </div>
            <div>
              <label className="block text-xs text-text-tertiary mb-1.5">Provider type *</label>
              <select
                name="providerType"
                required
                className="w-full bg-background border border-border px-3 py-2.5 text-text-primary text-sm outline-none focus:border-text-secondary"
              >
                <option value="">Select type</option>
                {PROVIDER_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-text-tertiary mb-1.5">Brief description</label>
              <textarea
                name="description"
                rows={3}
                className="w-full bg-transparent border border-border px-3 py-2.5 text-text-primary text-sm outline-none focus:border-text-secondary resize-none"
                placeholder="Describe your organisation and the finance you provide..."
              />
            </div>
          </fieldset>

          {/* Contact */}
          <fieldset className="space-y-5">
            <legend className="text-xs tracking-widest text-text-tertiary uppercase pb-4 border-b border-border w-full">
              Primary Contact
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs text-text-tertiary mb-1.5">Contact name *</label>
                <input
                  name="contactName"
                  required
                  className="w-full bg-transparent border border-border px-3 py-2.5 text-text-primary text-sm outline-none focus:border-text-secondary"
                  placeholder="Jane Smith"
                />
                {state.errors?.contactName && (
                  <p className="text-xs text-red-400 mt-1">{state.errors.contactName}</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-text-tertiary mb-1.5">Email address *</label>
                <input
                  name="contactEmail"
                  type="email"
                  required
                  className="w-full bg-transparent border border-border px-3 py-2.5 text-text-primary text-sm outline-none focus:border-text-secondary"
                  placeholder="jane@example.co.uk"
                />
                {state.errors?.contactEmail && (
                  <p className="text-xs text-red-400 mt-1">{state.errors.contactEmail}</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-xs text-text-tertiary mb-1.5">Phone number</label>
              <input
                name="contactPhone"
                type="tel"
                className="w-full bg-transparent border border-border px-3 py-2.5 text-text-primary text-sm outline-none focus:border-text-secondary"
                placeholder="+44 20 7000 0000"
              />
            </div>
          </fieldset>

          {/* Finance products */}
          <fieldset className="space-y-4">
            <legend className="text-xs tracking-widest text-text-tertiary uppercase pb-4 border-b border-border w-full">
              Finance Products
            </legend>
            <p className="text-xs text-text-tertiary">Select all that apply</p>
            <div className="grid grid-cols-2 gap-3">
              {FINANCE_PRODUCTS.map(product => (
                <label key={product} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="financeProducts"
                    value={product}
                    className="accent-orange-500"
                  />
                  <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                    {product}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Asset specialisms */}
          <fieldset className="space-y-4">
            <legend className="text-xs tracking-widest text-text-tertiary uppercase pb-4 border-b border-border w-full">
              Asset Specialisms
            </legend>
            <p className="text-xs text-text-tertiary">Select all that apply</p>
            <div className="grid grid-cols-2 gap-3">
              {ASSET_CATEGORIES.map(cat => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="assetSpecialisms"
                    value={cat}
                    className="accent-orange-500"
                  />
                  <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                    {cat}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Deal size */}
          <fieldset className="space-y-5">
            <legend className="text-xs tracking-widest text-text-tertiary uppercase pb-4 border-b border-border w-full">
              Typical Deal Size
            </legend>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs text-text-tertiary mb-1.5">Minimum (£)</label>
                <input
                  name="typicalDealMin"
                  type="number"
                  min="0"
                  step="1000"
                  className="w-full bg-transparent border border-border px-3 py-2.5 text-text-primary text-sm outline-none focus:border-text-secondary"
                  placeholder="25000"
                />
              </div>
              <div>
                <label className="block text-xs text-text-tertiary mb-1.5">Maximum (£)</label>
                <input
                  name="typicalDealMax"
                  type="number"
                  min="0"
                  step="10000"
                  className="w-full bg-transparent border border-border px-3 py-2.5 text-text-primary text-sm outline-none focus:border-text-secondary"
                  placeholder="500000"
                />
              </div>
            </div>
          </fieldset>

          {/* Geography */}
          <fieldset className="space-y-4">
            <legend className="text-xs tracking-widest text-text-tertiary uppercase pb-4 border-b border-border w-full">
              Geography
            </legend>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="hidden" name="geographyUK" value="true" />
              <span className="text-sm text-text-secondary">UK-based lending only</span>
            </label>
            <div>
              <label className="block text-xs text-text-tertiary mb-1.5">Geographic notes</label>
              <textarea
                name="geographyNotes"
                rows={2}
                className="w-full bg-transparent border border-border px-3 py-2.5 text-text-primary text-sm outline-none focus:border-text-secondary resize-none"
                placeholder="Any geographic restrictions or preferences..."
              />
            </div>
          </fieldset>

          {/* Submit */}
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-text-tertiary mb-6 leading-relaxed">
              By submitting this application you confirm that the information provided is accurate.
              TAFM will review your application independently. Submission does not guarantee listing.
              No rate or product information is published without verification.
            </p>
            <button
              type="submit"
              disabled={isPending}
              className="border border-orange-500 text-orange-500 px-8 py-3 text-sm hover:bg-orange-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Submitting…' : 'Submit application'}
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}
