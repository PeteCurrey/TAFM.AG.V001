'use client'

import React, { useTransition, useState } from 'react'
import { updateProviderVerification, addProviderUser } from '@/app/actions/admin-provider'

interface Props {
  lender: {
    id: string
    name: string
    status: string
    companyVerified: boolean
    websiteVerified: boolean
    contactVerified: boolean
    productsVerified: boolean
    criteriaVerified: boolean
    profileApproved: boolean
    isPubliclyListed: boolean
    notes?: string | null
    memberships?: Array<{
      role: string
      user: { id: string; email: string; firstName: string; lastName: string }
    }>
  }
}

export function ProviderVerificationPanel({ lender }: Props) {
  const [isPending, startTransition] = useTransition()
  const [companyVerified, setCompanyVerified] = useState(lender.companyVerified)
  const [websiteVerified, setWebsiteVerified] = useState(lender.websiteVerified)
  const [contactVerified, setContactVerified] = useState(lender.contactVerified)
  const [productsVerified, setProductsVerified] = useState(lender.productsVerified)
  const [criteriaVerified, setCriteriaVerified] = useState(lender.criteriaVerified)
  const [profileApproved, setProfileApproved] = useState(lender.profileApproved)
  const [status, setStatus] = useState(lender.status)
  const [isPubliclyListed, setIsPubliclyListed] = useState(lender.isPubliclyListed)
  const [notes, setNotes] = useState(lender.notes ?? '')

  const [userEmail, setUserEmail] = useState('')
  const [userRole, setUserRole] = useState('MEMBER')

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const handleSaveChecklist = (e: React.FormEvent) => {
    e.preventDefault()
    setFeedback(null)
    startTransition(async () => {
      const formData = new FormData()
      formData.set('lenderId', lender.id)
      formData.set('companyVerified', String(companyVerified))
      formData.set('websiteVerified', String(websiteVerified))
      formData.set('contactVerified', String(contactVerified))
      formData.set('productsVerified', String(productsVerified))
      formData.set('criteriaVerified', String(criteriaVerified))
      formData.set('profileApproved', String(profileApproved))
      formData.set('status', status)
      formData.set('isPubliclyListed', String(isPubliclyListed))
      formData.set('notes', notes)

      const res = await updateProviderVerification(formData)
      if (res.success) {
        setFeedback({ type: 'success', message: 'Verification checklist updated and logged.' })
      } else {
        setFeedback({ type: 'error', message: res.error ?? 'Update failed.' })
      }
    })
  }

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userEmail) return
    setFeedback(null)
    startTransition(async () => {
      const formData = new FormData()
      formData.set('lenderId', lender.id)
      formData.set('email', userEmail)
      formData.set('role', userRole)

      const res = await addProviderUser(formData)
      if (res.success) {
        setFeedback({ type: 'success', message: `User ${userEmail} linked to provider.` })
        setUserEmail('')
      } else {
        setFeedback({ type: 'error', message: res.error ?? 'Failed to link user.' })
      }
    })
  }

  return (
    <div className="space-y-6">
      {feedback && (
        <div
          className={`p-3 text-xs border ${
            feedback.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
              : 'bg-red-950/40 border-red-800 text-red-300'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Verification Checklist Form */}
      <form onSubmit={handleSaveChecklist} className="border border-[var(--color-border-dark)] bg-[#0d0d0d] p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--color-border-dark)]">
          <div>
            <p className="text-[10px] text-[#FF6A1A] font-mono uppercase tracking-widest">PHASE 5 VERIFICATION</p>
            <h3 className="text-sm font-medium text-white">Compliance &amp; Verification Checklist</h3>
          </div>
          <span className="font-mono text-xs text-[var(--color-text-on-dark-muted)]">
            Status: <strong className="text-white uppercase">{status}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <label className="flex items-center gap-3 p-3 bg-[#121212] border border-[var(--color-border-dark)] cursor-pointer">
            <input
              type="checkbox"
              checked={companyVerified}
              onChange={(e) => setCompanyVerified(e.target.checked)}
              className="accent-[#FF6A1A]"
            />
            <span className="text-xs text-white">Company verified (Companies House)</span>
          </label>

          <label className="flex items-center gap-3 p-3 bg-[#121212] border border-[var(--color-border-dark)] cursor-pointer">
            <input
              type="checkbox"
              checked={websiteVerified}
              onChange={(e) => setWebsiteVerified(e.target.checked)}
              className="accent-[#FF6A1A]"
            />
            <span className="text-xs text-white">Website &amp; domain verified</span>
          </label>

          <label className="flex items-center gap-3 p-3 bg-[#121212] border border-[var(--color-border-dark)] cursor-pointer">
            <input
              type="checkbox"
              checked={contactVerified}
              onChange={(e) => setContactVerified(e.target.checked)}
              className="accent-[#FF6A1A]"
            />
            <span className="text-xs text-white">Primary contact verified</span>
          </label>

          <label className="flex items-center gap-3 p-3 bg-[#121212] border border-[var(--color-border-dark)] cursor-pointer">
            <input
              type="checkbox"
              checked={productsVerified}
              onChange={(e) => setProductsVerified(e.target.checked)}
              className="accent-[#FF6A1A]"
            />
            <span className="text-xs text-white">Finance products verified</span>
          </label>

          <label className="flex items-center gap-3 p-3 bg-[#121212] border border-[var(--color-border-dark)] cursor-pointer">
            <input
              type="checkbox"
              checked={criteriaVerified}
              onChange={(e) => setCriteriaVerified(e.target.checked)}
              className="accent-[#FF6A1A]"
            />
            <span className="text-xs text-white">Lending criteria verified</span>
          </label>

          <label className="flex items-center gap-3 p-3 bg-[#121212] border border-[var(--color-border-dark)] cursor-pointer">
            <input
              type="checkbox"
              checked={profileApproved}
              onChange={(e) => setProfileApproved(e.target.checked)}
              className="accent-[#FF6A1A]"
            />
            <span className="text-xs text-white">Public profile approved</span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-[11px] font-mono uppercase text-[var(--color-text-on-dark-muted)] mb-1">
              Provider Operational Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-[#121212] border border-[var(--color-border-dark)] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6A1A]"
            >
              <option value="APPLIED">APPLIED</option>
              <option value="UNDER_REVIEW">UNDER_REVIEW</option>
              <option value="VERIFIED">VERIFIED</option>
              <option value="ACTIVE">ACTIVE (Eligible for matching)</option>
              <option value="SUSPENDED">SUSPENDED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-[var(--color-text-on-dark-muted)] mb-1">
              Public Directory Visibility
            </label>
            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPubliclyListed}
                  onChange={(e) => setIsPubliclyListed(e.target.checked)}
                  className="accent-[#FF6A1A]"
                />
                <span className="text-xs text-white">List publicly in TAFM Provider Directory</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-[11px] font-mono uppercase text-[var(--color-text-on-dark-muted)] mb-1">
            Verification Notes / Audit Rationale
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. FCA checked, primary telephone call completed with Managing Director"
            className="w-full bg-[#121212] border border-[var(--color-border-dark)] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6A1A]"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="bg-[#FF6A1A] hover:bg-[#ff7d3b] text-white text-xs font-mono uppercase py-2 px-5 transition-colors disabled:opacity-50"
        >
          {isPending ? 'Saving...' : 'Save verification status'}
        </button>
      </form>

      {/* Provider User Membership Management */}
      <div className="border border-[var(--color-border-dark)] bg-[#0d0d0d] p-6">
        <h3 className="text-sm font-medium text-white mb-2">Provider User Memberships</h3>
        <p className="text-xs text-[var(--color-text-on-dark-muted)] mb-4">
          Users authorized to review opportunities and submit credit decisions for {lender.name}.
        </p>

        {/* Existing members */}
        <div className="space-y-2 mb-6">
          {lender.memberships && lender.memberships.length > 0 ? (
            lender.memberships.map((m, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 bg-[#121212] border border-[var(--color-border-dark)] text-xs">
                <div>
                  <span className="text-white font-medium">{m.user.firstName} {m.user.lastName}</span>
                  <span className="text-[var(--color-text-on-dark-muted)] font-mono ml-2">({m.user.email})</span>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-blue-950/60 border border-blue-800/40 text-blue-300">
                  {m.role}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-[var(--color-text-on-dark-muted)] italic">No user accounts linked to this provider yet.</p>
          )}
        </div>

        {/* Add user form */}
        <form onSubmit={handleAddUser} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            placeholder="underwriter@provider.co.uk"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            className="flex-1 bg-[#121212] border border-[var(--color-border-dark)] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6A1A]"
          />
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
            className="bg-[#121212] border border-[var(--color-border-dark)] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6A1A]"
          >
            <option value="MEMBER">MEMBER</option>
            <option value="UNDERWRITER">UNDERWRITER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <button
            type="submit"
            disabled={isPending}
            className="bg-[#1e1e1e] hover:bg-[#282828] border border-[var(--color-border-dark)] text-white text-xs font-mono uppercase px-4 py-2 transition-colors disabled:opacity-50"
          >
            Link user
          </button>
        </form>
      </div>
    </div>
  )
}
