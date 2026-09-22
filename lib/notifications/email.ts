// ─── Transactional Email Delivery (Phase 5) ───────────────────────────────────
//
// Controlled, server-side notification delivery.
// Operates safely in development and test environments (logs structured payload).
// When RESEND_API_KEY is configured in production, dispatches via Resend API.

import { logger } from '@/lib/logging'

export interface EmailMessage {
  to: string
  subject: string
  html: string
  text: string
}

export function buildOpportunityCreatedEmail(opportunityRef: string, businessName: string): EmailMessage {
  return {
    to: 'notifications@tafm.co.uk',
    subject: `[TAFM] Finance Opportunity Created — ${opportunityRef}`,
    text: `A new finance opportunity (${opportunityRef}) has been registered for ${businessName}. Review in the admin console.`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; padding: 20px; background: #050505; color: #fff;">
        <h2 style="color: #FF6A1A; font-weight: 300;">TAFM Opportunity Created</h2>
        <p>A new finance opportunity has been qualified and routed through the matching engine.</p>
        <p><strong>Reference:</strong> ${opportunityRef}</p>
        <p><strong>Business:</strong> ${businessName}</p>
        <a href="https://www.tafm.co.uk/admin/opportunities" style="display: inline-block; background: #FF6A1A; color: #fff; padding: 10px 20px; text-decoration: none; margin-top: 15px;">View in Admin Console</a>
      </div>
    `,
  }
}

export function buildProviderMatchEmail(providerName: string, opportunityRef: string): EmailMessage {
  return {
    to: 'provider@tafm.co.uk',
    subject: `[TAFM] New Matched Opportunity — ${opportunityRef}`,
    text: `Opportunity ${opportunityRef} has been deterministically matched to ${providerName}'s credit criteria.`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; padding: 20px; background: #050505; color: #fff;">
        <h2 style="color: #FF6A1A; font-weight: 300;">New Opportunity Matched</h2>
        <p>Hello <strong>${providerName}</strong>,</p>
        <p>An equipment finance requirement has been matched against your lending criteria.</p>
        <p><strong>Opportunity Reference:</strong> ${opportunityRef}</p>
        <a href="https://www.tafm.co.uk/provider/opportunities" style="display: inline-block; background: #FF6A1A; color: #fff; padding: 10px 20px; text-decoration: none; margin-top: 15px;">Review Opportunity</a>
      </div>
    `,
  }
}

export async function sendEmail(message: EmailMessage): Promise<{ success: boolean; id?: string }> {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    logger.info('Email notification logged (safe dev mode — RESEND_API_KEY not configured)', {
      to: message.to,
      subject: message.subject,
    }, 'app')
    return { success: true, id: `mock-${Date.now()}` }
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || 'TAFM <notifications@tafm.co.uk>',
        to: message.to,
        subject: message.subject,
        html: message.html,
        text: message.text,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      logger.warn('Failed to send email via Resend', { error: err }, 'app')
      return { success: false }
    }

    const data = await res.json()
    return { success: true, id: data.id }
  } catch (err) {
    logger.warn('Exception during email dispatch', {
      error: err instanceof Error ? err.message : String(err),
    }, 'app')
    return { success: false }
  }
}
