'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { ProgressIndicator } from '@/components/forms/ProgressIndicator'
import { FormField } from '@/components/forms/FormField'
import { Input } from '@/components/forms/Input'
import { CurrencyInput } from '@/components/forms/CurrencyInput'
import { Select } from '@/components/forms/Select'
import { submitApplication } from '@/app/actions/apply'
import Link from 'next/link'

// ─── Application steps ────────────────────────────────────────────────────────

const STEPS = [
  { label: 'Asset',     description: 'Tell us about the asset you want to finance' },
  { label: 'Business',  description: 'Tell us about your business' },
  { label: 'Finance',   description: 'Tell us what finance you need' },
  { label: 'Review',    description: 'Review your application before submitting' },
]

const ASSET_CONDITIONS = [
  { value: 'USED', label: 'Used / Pre-owned' },
  { value: 'NEW', label: 'Brand New' },
  { value: 'REFURBISHED', label: 'Refurbished' },
  { value: 'FOR_PARTS', label: 'For Parts / Spares' },
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
      <FormField label="Asset condition" htmlFor="asset-condition" required hint="Current condition of the asset.">
        <Select
          id="asset-condition"
          options={ASSET_CONDITIONS}
          value={data.assetCondition ?? 'USED'}
          onChange={e => onUpdate({ assetCondition: e.target.value })}
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
      <FormField label="Contact full name" htmlFor="contact-name" required hint="Your primary contact person for this application.">
        <Input
          id="contact-name"
          type="text"
          value={data.contactName ?? ''}
          onChange={e => onUpdate({ contactName: e.target.value })}
          placeholder="e.g. Alex Morgan"
          autoComplete="name"
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
    ['Asset condition', ASSET_CONDITIONS.find(c => c.value === data.assetCondition)?.label ?? 'Used / Pre-owned'],
    ['Asset value', data.assetValue ? `£${Number(data.assetValue).toLocaleString('en-GB')}` : undefined],
    ['Supplier', data.supplierName],
    ['Business name', data.businessName],
    ['Contact name', data.contactName],
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
        Please review your application details below. Once submitted, your requirement will be matched against eligible commercial asset finance providers.
      </p>

      <div className="border border-[var(--color-border-light)] rounded-[var(--radius-md)] overflow-hidden">
        <table className="w-full">
          <tbody className="divide-y divide-[var(--color-border-light)]">
            {rows.filter(([, v]) => v).map(([label, value]) => (
              <tr key={label} className="hover:bg-[var(--color-surface-off-white)]">
                <td className="px-4 py-3 text-body-sm text-[var(--color-text-on-light-muted)] w-44 align-top">{label}</td>
                <td className="px-4 py-3 text-body-sm font-light text-[var(--color-text-on-light-2)]">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-5 border border-zinc-300 bg-zinc-50 rounded-[var(--radius-md)] space-y-3">
        <h4 className="text-xs font-semibold text-zinc-900 uppercase font-mono tracking-wider">
          Marketplace Transparency & Role Disclosure
        </h4>
        <p className="text-body-sm font-light text-zinc-700 leading-relaxed">
          <strong>TAFM (The Asset Finance Marketplace)</strong> operates as an independent commercial marketplace and digital infrastructure platform connecting UK businesses with accredited asset finance providers.
        </p>
        <ul className="text-xs text-zinc-600 space-y-1 list-disc list-inside">
          <li><strong>TAFM is NOT a direct lender</strong> and does not lend capital or make credit underwriting decisions.</li>
          <li>Commercial providers independently assess and underwrite applications according to their specific commercial appetite and risk policies.</li>
          <li>Initial provider matching or expressions of interest indicate preliminary commercial appetite only and <strong>do not constitute a credit approval, binding loan offer, or commitment to lend</strong>.</li>
          <li>All finance facilities remain strictly subject to formal underwriter review, asset inspection, KYC/AML compliance, and mutually agreed legal documentation.</li>
        </ul>
      </div>
    </div>
  )
}

// ─── Application data type ────────────────────────────────────────────────────

interface ApplicationData {
  assetCategory: string
  assetDescription: string
  assetCondition: string
  assetValue: string
  supplierName: string
  businessName: string
  businessType: string
  companyNumber: string
  yearsTrading: string
  contactName: string
  contactEmail: string
  contactPhone: string
  financeType: string
  financeAmount: string
  deposit: string
  termMonths: string
  notes: string
}

// ─── Apply page ───────────────────────────────────────────────────────────────

function ApplyForm() {
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<Partial<ApplicationData>>({
    assetCondition: 'USED',
  })

  useEffect(() => {
    const category = searchParams.get('category')
    const asset = searchParams.get('asset')
    const structure = searchParams.get('structure')

    const updates: Partial<ApplicationData> = {}
    if (category) updates.assetCategory = category
    if (asset) updates.assetDescription = asset
    if (structure) {
      const s = structure.toLowerCase()
      if (s.includes('hire purchase')) updates.financeType = 'HIRE_PURCHASE'
      else if (s.includes('finance lease')) updates.financeType = 'FINANCE_LEASE'
      else if (s.includes('operating lease')) updates.financeType = 'OPERATING_LEASE'
      else if (s.includes('refinance')) updates.financeType = 'ASSET_REFINANCE'
    }
    if (Object.keys(updates).length > 0) {
      setData((prev) => ({ ...prev, ...updates }))
    }
  }, [searchParams])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ reference?: string; opportunityId?: string } | null>(null)

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
      const formData = new FormData()
      formData.set('assetCategory', data.assetCategory || 'commercial-equipment')
      formData.set('assetDescription', data.assetDescription || '')
      formData.set('assetCondition', data.assetCondition || 'USED')
      formData.set('purchasePrice', data.assetValue || '0')
      if (data.supplierName) formData.set('supplierName', data.supplierName)
      
      formData.set('businessName', data.businessName || '')
      formData.set('businessStructure', data.businessType || 'LIMITED_COMPANY')
      if (data.companyNumber) formData.set('companyNumber', data.companyNumber)
      if (data.yearsTrading) formData.set('yearsTrading', data.yearsTrading)
      
      formData.set('contactName', data.contactName || data.businessName || 'Representative')
      formData.set('contactEmail', data.contactEmail || '')
      if (data.contactPhone) formData.set('contactPhone', data.contactPhone)

      if (data.financeType) formData.set('financeStructure', data.financeType)
      formData.set('requestedAmount', data.financeAmount || data.assetValue || '0')
      if (data.deposit) formData.set('depositAmount', data.deposit)
      if (data.termMonths) formData.set('termMonths', data.termMonths)
      if (data.notes) formData.set('notes', data.notes)

      const res = await submitApplication(null, formData)
      if (!res.success) {
        setError(res.error || 'Submission could not be completed. Please review required fields.')
      } else {
        setResult({
          reference: res.reference,
          opportunityId: res.opportunityId,
        })
        setIsSubmitted(true)
      }
    } catch {
      setError('Your application could not be submitted. Please check your connection and try again.')
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
          <span className="inline-block px-3 py-1 bg-green-50 text-green-700 text-xs font-mono font-medium rounded-full mb-3">
            Reference: {result?.reference || 'TAFM-CONFIRMED'}
          </span>
          <h1 className="text-heading-xl font-light text-[var(--color-text-on-light-primary)] mb-4">Requirement Submitted</h1>
          <p className="text-body font-light text-[var(--color-text-on-light-3)] leading-relaxed mb-6">
            Your asset finance requirement has been logged into the TAFM matching engine and evaluated against active commercial lender criteria.
          </p>
          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-[var(--radius-md)] text-left mb-6 text-xs text-zinc-600 space-y-2">
            <p className="font-semibold text-zinc-800">What happens next:</p>
            <p>1. Matching providers are notified of your anonymous requirement overview.</p>
            <p>2. Interested providers review specifications and submit preliminary appetite or formal terms.</p>
            <p>3. You can monitor progress, respond to requests, and upload verification documents in your account workspace.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <Link
              href="/account"
              className="w-full sm:w-auto px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-[var(--radius-md)] transition-colors text-center"
            >
              Go to Borrower Workspace &rarr;
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 border border-zinc-200 hover:bg-zinc-100 text-zinc-700 text-sm font-medium rounded-[var(--radius-md)] transition-colors text-center"
            >
              Return to Homepage
            </Link>
          </div>
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

export default function ApplyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
      <ApplyForm />
    </Suspense>
  )
}
