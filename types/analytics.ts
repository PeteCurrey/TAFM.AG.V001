// ─── Analytics event types ────────────────────────────────────────────────────

/**
 * Typed analytics event definitions.
 * Events are dispatched through the central analytics abstraction.
 * NEVER include sensitive financial data, PII, or full document content in events.
 */

// ─── Event name registry ──────────────────────────────────────────────────────

export type AnalyticsEventName =
  | 'page_view'
  | 'asset_category_view'
  | 'asset_view'
  | 'finance_calculator_started'
  | 'finance_calculator_completed'
  | 'application_started'
  | 'application_step_completed'
  | 'application_completed'
  | 'supplier_cta_clicked'
  | 'lender_cta_clicked'
  | 'document_uploaded'
  | 'finance_offer_viewed'
  | 'finance_offer_selected'
  | 'contact_submitted'
  | 'navigation_clicked'
  | 'hero_cta_clicked'
  | 'insight_viewed'
  | 'error_displayed'

// ─── Event property maps ──────────────────────────────────────────────────────

export interface PageViewProperties {
  path: string
  title: string
  referrer?: string
}

export interface AssetCategoryViewProperties {
  categorySlug: string
  categoryName: string
}

export interface AssetViewProperties {
  assetId: string
  categorySlug: string
}

export interface CalculatorStartedProperties {
  entryPoint: string
}

export interface CalculatorCompletedProperties {
  assetValueRange: string // e.g. "50000-100000" — no exact values
  structureType: string
  termMonths: number
}

export interface ApplicationStartedProperties {
  entryPoint: string
}

export interface ApplicationStepProperties {
  step: string
  applicationId?: string
}

export interface ApplicationCompletedProperties {
  applicationId?: string
  stepCount: number
}

export interface SupplierCtaProperties {
  location: string // e.g. "homepage_section_6"
  ctaText: string
}

export interface LenderCtaProperties {
  location: string
  ctaText: string
}

export interface DocumentUploadedProperties {
  documentType: string
  // No filename — may contain sensitive info
}

export interface OfferViewedProperties {
  offerId: string
  structureType: string
  // No financial values — analytics must not receive rates or payments
}

export interface OfferSelectedProperties {
  offerId: string
  structureType: string
}

export interface ContactSubmittedProperties {
  reason?: string
}

export interface NavigationClickedProperties {
  item: string
  location: 'header' | 'footer' | 'mobile'
}

export interface HeroCtaClickedProperties {
  ctaType: 'primary' | 'secondary'
  ctaText: string
}

export interface InsightViewedProperties {
  slug: string
  category?: string
}

export interface ErrorDisplayedProperties {
  errorCode?: string
  errorType: string
  path: string
}

// ─── Union type for all events ────────────────────────────────────────────────

export type AnalyticsEvent =
  | { name: 'page_view'; properties: PageViewProperties }
  | { name: 'asset_category_view'; properties: AssetCategoryViewProperties }
  | { name: 'asset_view'; properties: AssetViewProperties }
  | { name: 'finance_calculator_started'; properties: CalculatorStartedProperties }
  | { name: 'finance_calculator_completed'; properties: CalculatorCompletedProperties }
  | { name: 'application_started'; properties: ApplicationStartedProperties }
  | { name: 'application_step_completed'; properties: ApplicationStepProperties }
  | { name: 'application_completed'; properties: ApplicationCompletedProperties }
  | { name: 'supplier_cta_clicked'; properties: SupplierCtaProperties }
  | { name: 'lender_cta_clicked'; properties: LenderCtaProperties }
  | { name: 'document_uploaded'; properties: DocumentUploadedProperties }
  | { name: 'finance_offer_viewed'; properties: OfferViewedProperties }
  | { name: 'finance_offer_selected'; properties: OfferSelectedProperties }
  | { name: 'contact_submitted'; properties: ContactSubmittedProperties }
  | { name: 'navigation_clicked'; properties: NavigationClickedProperties }
  | { name: 'hero_cta_clicked'; properties: HeroCtaClickedProperties }
  | { name: 'insight_viewed'; properties: InsightViewedProperties }
  | { name: 'error_displayed'; properties: ErrorDisplayedProperties }
