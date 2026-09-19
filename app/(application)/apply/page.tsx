'use client'

import { useState } from 'react'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { ProgressIndicator } from '@/components/forms/ProgressIndicator'
import { FormField } from '@/components/forms/FormField'
import { Input } from '@/components/forms/Input'
import { CurrencyInput } from '@/components/forms/CurrencyInput'
import { Select } from '@/components/forms/Select'

// ─── Application steps ────────────────────────────────────────────────────────

const STEPS = [
  { label: 'Asset',     description: 'Tell us about the asset you want to finance' },
  { label: 'Business',  description: 'Tell us about your business' },
  { label: 'Finance',   description: 'Tell us what finance you need' },
  { label: 'Review',    description: 'Review your application before submitting' },
]

const FINANCE_TYPES = [
  { value: '', label: 'Select finance type' },
  { value: 'HIRE_PURCHASE', label: 'Hire Purchase' },
  { value: 'FINANCE_LEASE', label: 'Finance Lease' },
  { value: 'OPERATING_LEASE', label: 'Operating Lease' },
  { value: 'ASSET_REFINANCE', label: 'Asset Refinance' },
  { value: 'COMMERCIAL_LOAN', label: 'Commercial Loan' },
  { value: 'SPECIALIST', label: 'Specialist / Unsure' },
]

const ASSET_CATEGORIES = [
  { value: '', label: 'Select asset category' },
  { value: 'construction-equipment', label: 'Construction Equipment' },
  { value: 'manufacturing-equipment', label: 'Manufacturing Equipment' },
  { value: 'agricultural-equipment', label: 'Agricultural Equipment' },
  { value: 'commercial-vehicles', label: 'Commercial Vehicles' },
  { value: 'heavy-vehicles', label: 'Heavy Vehicles' },
  { value: 'medical-equipment', label: 'Medical Equipment' },
  { value: 'industrial-equipment', label: 'Industrial Equipment' },
  { value: 'technology-it-equipment', label: 'Technology & IT' },
  { value: 'renewable-energy-equipment', label: 'Renewable Energy' },
  { value: 'hospitality-equipment', label: 'Hospitality Equipment' },
  { value: 'specialist-equipment', label: 'Specialist Equipment' },
]

const BUSINESS_TYPES = [
  { value: '', label: 'Select business structure' },
  { value: 'SOLE_TRADER', label: 'Sole Trader' },
  { value: 'PARTNERSHIP', label: 'Partnership' },
  { value: 'LLP', label: 'Limited Liability Partnership (LLP)' },
  { value: 'LIMITED_COMPANY', label: 'Limited Company' },
  { value: 'PLC', label: 'Public Limited Company (PLC)' },
  { value: 'OTHER', label: 'Other' },
]

const TERM_OPTIONS = [
  { value: '', label: 'Select term' },
  { value: '12', label: '12 months (1 year)' },
  { value: '24', label: '24 months (2 years)' },
  { value: '36', label: '36 months (3 years)' },
  { value: '48', label: '48 months (4 years)' },
  { value: '60', label: '60 months (5 years)' },
  { value: '72', label: '72 months (6 years)' },
  { value: '84', label: '84 months (7 years)' },
]

// ─── Step components ──────────────────────────────────────────────────────────

function StepAsset({ data, onUpdate }: { data: Partial<ApplicationData>; onUpdate: (d: Partial<ApplicationData>) => void }) {
  return (
    <div className="space-y-6">
      <FormField label="Asset category" htmlFor="asset-category" required hint="Select the primary category that best describes the asset.">
        <Select
          id="asset-category"
          options={ASSET_CATEGORIES}
          value={data.assetCategory ?? ''}
          onChange={e => onUpdate({ assetCategory: e.target.value })}
        />
      </FormField>
      <FormField label="Asset description" htmlFor="asset-description" required hint="Make, model, year and any key specification details.">
        <textarea
          id="asset-description"
          value={data.assetDescription ?? ''}
          onChange={e => onUpdate({ assetDescription: e.target.value })}
          rows={4}
          placeholder="e.g. 2023 Caterpillar 320 Excavator, 3,200 hours, good condition"
          className="w-full px-4 py-3 text-body font-light border border-[var(--color-border-light)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-orange-500 resize-y"
        />
      </FormField>
      <FormField label="Asset purchase price (£)" htmlFor="asset-value" required hint="The full price you are paying for the asset, before any deposit.">
        <CurrencyInput
          id="asset-value"
          value={data.assetValue ?? ''}
          onValueChange={v => onUpdate({ assetValue: v })}
          placeholder="e.g. 85000"
        />
      </FormField>
      <FormField label="Supplier name" htmlFor="supplier-name" hint="The name of the company selling the asset (if applicable).">
        <Input
          id="supplier-name"
          type="text"
          value={data.supplierName ?? ''}
          onChange={e => onUpdate({ supplierName: e.target.value })}
          placeholder="e.g. Hewden Plant Hire Ltd"
        />
      </FormField>
    </div>
  )
}

function StepBusiness({ data, onUpdate }: { data: Partial<ApplicationData>; onUpdate: (d: Partial<ApplicationData>) => void }) {
  return (
    <div className="space-y-6">
      <FormField label="Business name" htmlFor="business-name" required>
        <Input
          id="business-name"
          type="text"
          value={data.businessName ?? ''}
          onChange={e => onUpdate({ businessName: e.target.value })}
          placeholder="Your company trading name"
          autoComplete="organization"
        />
      </FormField>
      <FormField label="Business structure" htmlFor="business-type" required>
        <Select
          id="business-type"
          options={BUSINESS_TYPES}
          value={data.businessType ?? ''}
          onChange={e => onUpdate({ businessType: e.target.value })}
        />
      </FormField>
      <FormField label="Company number" htmlFor="company-number" hint="UK Companies House registration number (if applicable).">
        <Input
          id="company-number"
          type="text"
          value={data.companyNumber ?? ''}
          onChange={e => onUpdate({ companyNumber: e.target.value })}
          placeholder="e.g. 12345678"
        />
      </FormField>
      <FormField label="Years trading" htmlFor="years-trading" required hint="How many years has the business been actively trading?">
        <Input
          id="years-trading"
          type="number"
          min={0}
          max={200}
          value={data.yearsTrading ?? ''}
          onChange={e => onUpdate({ yearsTrading: e.target.value })}
          placeholder="e.g. 5"
        />
      </FormField>
      <FormField label="Contact email address" htmlFor="contact-email" required>
        <Input
          id="contact-email"
          type="email"
          value={data.contactEmail ?? ''}
          onChange={e => onUpdate({ contactEmail: e.target.value })}
          placeholder="you@yourbusiness.co.uk"
          autoComplete="email"
        />
      </FormField>
      <FormField label="Contact telephone" htmlFor="contact-phone">
        <Input
          id="contact-phone"
          type="tel"
          value={data.contactPhone ?? ''}
          onChange={e => onUpdate({ contactPhone: e.target.value })}
          placeholder="+44 7XXX XXXXXX"
          autoComplete="tel"
        />
      </FormField>
    </div>
  )
}

function StepFinance({ data, onUpdate }: { data: Partial<ApplicationData>; onUpdate: (d: Partial<ApplicationData>) => void }) {
  return (
    <div className="space-y-6">
      <FormField label="Finance type" htmlFor="finance-type" hint="Select the finance structure you are interested in, or Specialist/Unsure if you are not sure.">
        <Select
          id="finance-type"
          options={FINANCE_TYPES}
          value={data.financeType ?? ''}
          onChange={e => onUpdate({ financeType: e.target.value })}
        />
      </FormField>
      <FormField label="Finance required (£)" htmlFor="finance-amount" required hint="The amount you need to finance. This is usually the asset price minus any deposit.">
        <CurrencyInput
          id="finance-amount"
          value={data.financeAmount ?? ''}
          onValueChange={v => onUpdate({ financeAmount: v })}
          placeholder="e.g. 75000"
        />
      </FormField>
      <FormField label="Deposit (£)" htmlFor="deposit" hint="Enter 0 if you are not making a deposit.">
        <CurrencyInput
          id="deposit"
          value={data.deposit ?? ''}
          onValueChange={v => onUpdate({ deposit: v })}
          placeholder="e.g. 10000"
        />
      </FormField>
      <FormField label="Preferred term" htmlFor="term" hint="How long do you want to spread the payments over?">
        <Select
          id="term"
          options={TERM_OPTIONS}
          value={data.termMonths ?? ''}
          onChange={e => onUpdate({ termMonths: e.target.value })}
        />
      </FormField>
      <FormField label="Additional notes" htmlFor="notes" hint="Any additional context about your finance requirement.">
        <textarea
          id="notes"
          value={data.notes ?? ''}
          onChange={e => onUpdate({ notes: e.target.value })}
          rows={3}
          placeholder="e.g. We have been trading for 8 years, have good credit history and are looking for a 5-year HP term."
          className="w-full px-4 py-3 text-body font-light border border-[var(--color-border-light)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-orange-500 resize-y"
        />
      </FormField>
    </div>
  )
}

function StepReview({ data }: { data: Partial<ApplicationData> }) {
  const rows: [string, string | undefined][] = [
    ['Asset category', ASSET_CATEGORIES.find(c => c.value === data.assetCategory)?.label],
    ['Asset description', data.assetDescription],
    ['Asset value', data.assetValue ? `£${Number(data.assetValue).toLocaleString('en-GB')}` : undefined],
    ['Supplier', data.supplierName],
    ['Business name', data.businessName],
    ['Business type', BUSINESS_TYPES.find(b => b.value === data.businessType)?.label],
    ['Company number', data.companyNumber],
    ['Years trading', data.yearsTrading ? `${data.yearsTrading} years` : undefined],
    ['Contact email', data.contactEmail],
    ['Contact phone', data.contactPhone],
    ['Finance type', FINANCE_TYPES.find(f => f.value === data.financeType)?.label],
    ['Finance required', data.financeAmount ? `£${Number(data.financeAmount).toLocaleString('en-GB')}` : undefined],
    ['Deposit', data.deposit ? `£${Number(data.deposit).toLocaleString('en-GB')}` : '£0'],
    ['Term', TERM_OPTIONS.find(t => t.value === data.termMonths)?.label],
    ['Notes', data.notes],
  ]

  return (
    <div className="space-y-6">
      <p className="text-body font-light text-[var(--color-text-on-light-3)] leading-relaxed">
        Please review your application details below. Once submitted, our team will review your application and be in touch.
      </p>

      <div className="border border-[var(--color-border-light)] rounded-[var(--radius-md)] overflow-hidden">
        <table className="w-full">
          <tbody className="divide-y divide-[var(--color-border-light)]">
            {rows.filter(([, v]) => v).map(([label, value]) => (
              <tr key={label} className="hover:bg-[var(--color-surface-off-white)]">
                <td className="px-4 py-3 text-body-sm text-[var(--color-text-on-light-muted)] w-40 align-top">{label}</td>
                <td className="px-4 py-3 text-body-sm font-light text-[var(--color-text-on-light-2)]">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-5 border border-amber-200 bg-amber-50 rounded-[var(--radius-md)]">
        <p className="text-body-sm font-light text-amber-800 leading-relaxed">
          <strong className="font-normal">Important:</strong> Submitting this application does not guarantee finance approval. Your application will be reviewed and assessed by specialist finance providers. Finance is subject to status and eligibility. TAFM does not provide financial advice.
        </p>
      </div>
    </div>
  )
}

// ─── Application data type ────────────────────────────────────────────────────

interface ApplicationData {
  assetCategory: string
  assetDescription: string
  assetValue: string
  supplierName: string
  businessName: string
  businessType: string
  companyNumber: string
  yearsTrading: string
  contactEmail: string
  contactPhone: string
  financeType: string
  financeAmount: string
  deposit: string
  termMonths: string
  notes: string
}

// ─── Apply page ───────────────────────────────────────────────────────────────

export default function ApplyPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<Partial<ApplicationData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateData = (partial: Partial<ApplicationData>) => {
    setData((prev) => ({ ...prev, ...partial }))
  }

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)
    try {
      // TODO: POST to /api/applications when the endpoint is implemented
      // const res = await fetch('/api/applications', { method: 'POST', body: JSON.stringify(data) })
      // if (!res.ok) throw new Error('Submission failed')
      await new Promise((r) => setTimeout(r, 1200)) // Simulated delay
      setIsSubmitted(true)
    } catch {
      setError('Your application could not be submitted. Please try again or contact us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Success state
  if (isSubmitted) {
    return (
      <div className="container-tafm py-20">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-16 h-16 rounded-[var(--radius-lg)] bg-green-100 flex items-center justify-center mx-auto mb-8" aria-hidden="true">
            <svg width="28" height="22" viewBox="0 0 28 22" fill="none" className="text-green-600">
              <path d="M2 11L9.5 18.5L26 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-heading-xl font-light text-[var(--color-text-on-light-primary)] mb-4">Application received</h1>
          <p className="text-body font-light text-[var(--color-text-on-light-3)] leading-relaxed mb-6">
            Thank you. Your finance application has been submitted. We will review your application and be in touch.
          </p>
          <p className="text-body-sm font-light text-[var(--color-text-on-light-muted)] leading-relaxed">
            Finance is subject to status and eligibility. TAFM does not guarantee any finance outcome.
          </p>
          <a href="/" className="inline-block mt-8 text-orange-500 hover:text-orange-600 text-body-sm transition-colors">
            Return to homepage
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full">
      {/* Progress header */}
      <div className="border-b border-[var(--color-border-light)] bg-white sticky top-14 z-[var(--z-above)]">
        <div className="container-tafm py-4">
          <ProgressIndicator steps={STEPS} currentStep={currentStep} variant="horizontal" />
        </div>
      </div>

      {/* Main content */}
      <div className="container-tafm py-12">
        <div className="max-w-2xl mx-auto">
          {/* Step header */}
          <div className="mb-10">
            <p className="text-label text-[var(--color-text-on-light-muted)] mb-2">Step {currentStep + 1} of {STEPS.length}</p>
            <h1 className="text-heading-xl font-light text-[var(--color-text-on-light-primary)] mb-1">{STEPS[currentStep].label}</h1>
            <p className="text-body-sm font-light text-[var(--color-text-on-light-3)]">{STEPS[currentStep].description}</p>
          </div>

          {/* Step content */}
          {currentStep === 0 && <StepAsset data={data} onUpdate={updateData} />}
          {currentStep === 1 && <StepBusiness data={data} onUpdate={updateData} />}
          {currentStep === 2 && <StepFinance data={data} onUpdate={updateData} />}
          {currentStep === 3 && <StepReview data={data} />}

          {/* Error */}
          {error && (
            <div className="mt-6 p-4 border border-red-200 bg-red-50 rounded-[var(--radius-md)]" role="alert">
              <p className="text-body-sm text-red-700 font-light">{error}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-[var(--color-border-light)]">
            <div>
              {currentStep > 0 && (
                <Button variant="ghost" size="md" onClick={handleBack}>← Back</Button>
              )}
            </div>
            <div>
              {currentStep < STEPS.length - 1 ? (
                <Button variant="primary" size="md" onClick={handleNext}>
                  Continue →
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                >
                  Submit application
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
