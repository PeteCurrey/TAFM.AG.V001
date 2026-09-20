-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('BUSINESS', 'SUPPLIER', 'LENDER', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION');

-- CreateEnum
CREATE TYPE "BusinessStructure" AS ENUM ('SOLE_TRADER', 'PARTNERSHIP', 'LLP', 'LIMITED_COMPANY', 'PLC', 'CIC', 'CHARITY', 'OTHER');

-- CreateEnum
CREATE TYPE "BusinessStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DISSOLVED', 'PENDING_VERIFICATION');

-- CreateEnum
CREATE TYPE "AssetCondition" AS ENUM ('NEW', 'USED', 'REFURBISHED', 'FOR_PARTS');

-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'ACTIVE', 'RESERVED', 'FINANCED', 'INACTIVE', 'SOLD', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "FinanceStructureType" AS ENUM ('HIRE_PURCHASE', 'FINANCE_LEASE', 'OPERATING_LEASE', 'ASSET_REFINANCE', 'COMMERCIAL_LOAN', 'SPECIALIST');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'INFORMATION_REQUESTED', 'DECISION_PENDING', 'CONDITIONALLY_APPROVED', 'APPROVED', 'DECLINED', 'WITHDRAWN', 'EXPIRED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "OfferDecisionStatus" AS ENUM ('PENDING', 'INDICATIVE', 'APPROVED', 'DECLINED', 'REFERRED', 'WITHDRAWN', 'EXPIRED');

-- CreateEnum
CREATE TYPE "DataStatus" AS ENUM ('VERIFIED', 'PROVISIONAL', 'CALCULATED', 'USER_PROVIDED', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('PENDING_UPLOAD', 'UPLOADED', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'DEFAULTED');

-- CreateEnum
CREATE TYPE "SupplierStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING_ONBOARDING', 'SUSPENDED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "LenderStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING_ONBOARDING', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "AIJobType" AS ENUM ('ASSET_CLASSIFICATION', 'SUPPLIER_QUOTE_EXTRACTION', 'DOCUMENT_EXTRACTION', 'FINANCE_APPLICATION_ASSIST', 'LENDER_MATCHING', 'OFFER_NORMALISATION', 'APPLICATION_COMPLETENESS', 'ASSET_DESCRIPTION_GENERATION', 'SEO_CONTENT_GENERATION', 'INSIGHT_GENERATION', 'CUSTOMER_ASSIST', 'INTERNAL_OPERATIONS');

-- CreateEnum
CREATE TYPE "AIJobStatus" AS ENUM ('QUEUED', 'RUNNING', 'COMPLETED', 'FAILED', 'REVIEW_REQUIRED');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'STATUS_CHANGE', 'SUBMIT', 'APPROVE', 'DECLINE', 'WITHDRAW', 'REVIEW', 'EXPORT', 'ACCESS', 'VERIFY', 'REJECT', 'MATCH', 'ASSIGN');

-- CreateEnum
CREATE TYPE "OpportunityStatus" AS ENUM ('DRAFT', 'QUALIFYING', 'MATCHED', 'SUBMITTED', 'UNDER_REVIEW', 'OFFERED', 'COMPLETED', 'DECLINED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "EligibilityStatus" AS ENUM ('ELIGIBLE', 'NOT_ELIGIBLE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "MarketObservationSource" AS ENUM ('DEALER_LISTING', 'AUCTION_RESULT', 'USER_PROVIDED', 'PROVIDER_DATA', 'PUBLIC_RECORD', 'MARKETPLACE_OBSERVATION', 'MANUAL_ENTRY');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'BUSINESS',
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "emailVerifiedAt" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),
    "passwordHash" TEXT,
    "businessId" TEXT,
    "supplierId" TEXT,
    "lenderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "businesses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tradingName" TEXT,
    "structure" "BusinessStructure" NOT NULL,
    "status" "BusinessStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "companyNumber" TEXT,
    "vatNumber" TEXT,
    "isVatRegistered" BOOLEAN NOT NULL DEFAULT false,
    "industry" TEXT,
    "sicCode" TEXT,
    "address" JSONB,
    "website" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "yearsTrading" INTEGER,
    "annualTurnover" DECIMAL(15,2),
    "currency" TEXT NOT NULL DEFAULT 'GBP',
    "ownerId" TEXT NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "businesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "parentId" TEXT,
    "icon" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "asset_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manufacturers" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "countryOfOrigin" TEXT,
    "website" TEXT,
    "logoUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "manufacturers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_models" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "manufacturerId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "description" TEXT,
    "specifications" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "asset_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assets" (
    "id" TEXT NOT NULL,
    "slug" TEXT,
    "categoryId" TEXT NOT NULL,
    "manufacturerId" TEXT,
    "modelId" TEXT,
    "supplierId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "serialNumber" TEXT,
    "yearOfManufacture" INTEGER,
    "condition" "AssetCondition" NOT NULL,
    "isNew" BOOLEAN NOT NULL DEFAULT false,
    "purchasePrice" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'GBP',
    "vatApplicable" BOOLEAN NOT NULL DEFAULT true,
    "vatRate" DECIMAL(5,4),
    "estimatedUsefulLifeYears" INTEGER,
    "residualValueEstimate" DECIMAL(15,2),
    "location" JSONB,
    "locationDescription" TEXT,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "documents" JSONB,
    "specifications" JSONB,
    "status" "AssetStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_valuations" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "valuedAt" TIMESTAMP(3) NOT NULL,
    "valueAmount" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'GBP',
    "valuationType" TEXT NOT NULL,
    "valuedById" TEXT,
    "notes" TEXT,
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "asset_valuations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suppliers" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tradingName" TEXT,
    "supplierType" TEXT NOT NULL,
    "status" "SupplierStatus" NOT NULL DEFAULT 'PENDING_ONBOARDING',
    "address" JSONB,
    "website" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "contactName" TEXT,
    "companyNumber" TEXT,
    "vatNumber" TEXT,
    "isVatRegistered" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "specialisms" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "assetCategories" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "logoUrl" TEXT,
    "coverImageUrl" TEXT,
    "displayPriority" INTEGER NOT NULL DEFAULT 0,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "termsAgreedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lenders" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tradingName" TEXT,
    "lenderType" TEXT NOT NULL,
    "status" "LenderStatus" NOT NULL DEFAULT 'PENDING_ONBOARDING',
    "fcaReference" TEXT,
    "isRegulated" BOOLEAN NOT NULL DEFAULT false,
    "regulatoryBody" TEXT,
    "address" JSONB,
    "website" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "description" TEXT,
    "specialisms" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "eligibleAssetCategories" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "eligibleStructures" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "minLoanAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "maxLoanAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'GBP',
    "minTermMonths" INTEGER NOT NULL DEFAULT 12,
    "maxTermMonths" INTEGER NOT NULL DEFAULT 60,
    "newBusinessAppetite" BOOLEAN NOT NULL DEFAULT true,
    "startupsConsidered" BOOLEAN NOT NULL DEFAULT false,
    "adverseCreditConsidered" BOOLEAN NOT NULL DEFAULT false,
    "ukOnly" BOOLEAN NOT NULL DEFAULT true,
    "apiIntegrationStatus" TEXT NOT NULL DEFAULT 'NONE',
    "apiEndpoint" TEXT,
    "logoUrl" TEXT,
    "displayPriority" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "lenders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_products" (
    "id" TEXT NOT NULL,
    "lenderId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "structureType" "FinanceStructureType" NOT NULL,
    "description" TEXT,
    "eligibleAssetCategories" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "minAmount" DECIMAL(15,2) NOT NULL,
    "maxAmount" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'GBP',
    "minTermMonths" INTEGER NOT NULL,
    "maxTermMonths" INTEGER NOT NULL,
    "minDepositPercent" DECIMAL(5,4),
    "maxDepositPercent" DECIMAL(5,4),
    "requiresPersonalGuarantee" BOOLEAN NOT NULL DEFAULT false,
    "requiresSecurityCharge" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finance_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_applications" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "businessId" TEXT,
    "assetId" TEXT,
    "assetDescription" TEXT,
    "assetValue" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'GBP',
    "supplierId" TEXT,
    "supplierName" TEXT,
    "supplierQuoteReference" TEXT,
    "requestedStructure" "FinanceStructureType",
    "requestedAmount" DECIMAL(15,2) NOT NULL,
    "requestedDepositAmount" DECIMAL(15,2),
    "requestedTermMonths" INTEGER,
    "notes" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'DRAFT',
    "currentStep" TEXT NOT NULL DEFAULT 'ASSET',
    "completedSteps" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "internalNotes" TEXT,
    "assignedToId" TEXT,
    "submittedAt" TIMESTAMP(3),
    "decidedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "finance_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_offers" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "lenderId" TEXT NOT NULL,
    "financeProductId" TEXT,
    "amount" DECIMAL(15,2) NOT NULL,
    "deposit" DECIMAL(15,2) NOT NULL,
    "termMonths" INTEGER NOT NULL,
    "monthlyPayment" DECIMAL(15,2) NOT NULL,
    "balloon" DECIMAL(15,2),
    "interestRate" DECIMAL(8,6),
    "apr" DECIMAL(8,6),
    "totalPayable" DECIMAL(15,2) NOT NULL,
    "amountStatus" "DataStatus" NOT NULL DEFAULT 'UNKNOWN',
    "monthlyPaymentStatus" "DataStatus" NOT NULL DEFAULT 'UNKNOWN',
    "interestRateStatus" "DataStatus" NOT NULL DEFAULT 'UNKNOWN',
    "totalPayableStatus" "DataStatus" NOT NULL DEFAULT 'UNKNOWN',
    "arrangementFee" DECIMAL(15,2),
    "brokerFee" DECIMAL(15,2),
    "otherFees" DECIMAL(15,2),
    "totalFees" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "structureType" "FinanceStructureType" NOT NULL,
    "ownershipTransferOnCompletion" BOOLEAN NOT NULL DEFAULT false,
    "vatTreatment" TEXT,
    "earlySettlementTerms" TEXT,
    "requiresPersonalGuarantee" BOOLEAN NOT NULL DEFAULT false,
    "requiresSecurityCharge" BOOLEAN NOT NULL DEFAULT false,
    "securityDetails" TEXT,
    "decisionStatus" "OfferDecisionStatus" NOT NULL DEFAULT 'PENDING',
    "decisionReason" TEXT,
    "conditions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "validUntil" TIMESTAMP(3),
    "source" TEXT NOT NULL,
    "externalReference" TEXT,
    "confidence" DECIMAL(4,3),
    "requiresReview" BOOLEAN NOT NULL DEFAULT true,
    "aiGenerated" BOOLEAN NOT NULL DEFAULT false,
    "aiJobId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finance_offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_documents" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "status" "DocumentStatus" NOT NULL DEFAULT 'PENDING_UPLOAD',
    "filename" TEXT,
    "mimeType" TEXT,
    "sizeBytes" INTEGER,
    "url" TEXT,
    "uploadedBy" TEXT,
    "reviewedBy" TEXT,
    "reviewNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "application_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "offerId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "lenderId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "supplierId" TEXT,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "commencedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "totalFinanced" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'GBP',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_jobs" (
    "id" TEXT NOT NULL,
    "type" "AIJobType" NOT NULL,
    "status" "AIJobStatus" NOT NULL DEFAULT 'QUEUED',
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "inputReference" TEXT NOT NULL,
    "outputReference" TEXT,
    "error" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "costEstimateGbp" DECIMAL(10,6),
    "promptTokens" INTEGER,
    "completionTokens" INTEGER,
    "totalTokens" INTEGER,
    "initiatedBy" TEXT,
    "entityType" TEXT,
    "entityId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_usage" (
    "id" TEXT NOT NULL,
    "jobId" TEXT,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "promptTokens" INTEGER NOT NULL,
    "completionTokens" INTEGER NOT NULL,
    "totalTokens" INTEGER NOT NULL,
    "costEstimateGbp" DECIMAL(10,6) NOT NULL DEFAULT 0,
    "entityType" TEXT,
    "entityId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "properties" JSONB,
    "userId" TEXT,
    "sessionId" TEXT,
    "path" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "actorId" TEXT,
    "actorType" TEXT NOT NULL DEFAULT 'USER',
    "previousValue" JSONB,
    "newValue" JSONB,
    "source" TEXT,
    "reason" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opportunities" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "assetId" TEXT,
    "applicationId" TEXT,
    "status" "OpportunityStatus" NOT NULL DEFAULT 'DRAFT',
    "statusHistory" JSONB NOT NULL DEFAULT '[]',
    "assignedToId" TEXT,
    "matchedProviderIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "matchAnalysis" JSONB,
    "dataQualityScore" DECIMAL(4,3),
    "internalNotes" TEXT,
    "qualifyingAt" TIMESTAMP(3),
    "matchedAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3),
    "offeredAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "declinedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "market_observations" (
    "id" TEXT NOT NULL,
    "assetId" TEXT,
    "manufacturerId" TEXT,
    "modelId" TEXT,
    "categoryId" TEXT,
    "source" "MarketObservationSource" NOT NULL,
    "observedValue" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'GBP',
    "observedAt" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "condition" "AssetCondition",
    "yearOfAsset" INTEGER,
    "hoursOrMileage" TEXT,
    "sourceUrl" TEXT,
    "sourceReference" TEXT,
    "confidence" DECIMAL(4,3) NOT NULL,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "market_observations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provider_criteria" (
    "id" TEXT NOT NULL,
    "lenderId" TEXT NOT NULL,
    "assetCategories" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "financeStructures" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "minAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "maxAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'GBP',
    "minTermMonths" INTEGER NOT NULL DEFAULT 12,
    "maxTermMonths" INTEGER NOT NULL DEFAULT 84,
    "geographyUKOnly" BOOLEAN NOT NULL DEFAULT true,
    "businessTypes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "maxAssetAgeYears" INTEGER,
    "newAssetsOnly" BOOLEAN NOT NULL DEFAULT false,
    "usedAssetsConsidered" BOOLEAN NOT NULL DEFAULT true,
    "minBusinessAgeMonths" INTEGER,
    "minAnnualTurnover" DECIMAL(15,2),
    "requiresFCA" BOOLEAN NOT NULL DEFAULT false,
    "specialistSectors" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "exclusions" JSONB,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "provider_criteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_intelligence_results" (
    "id" TEXT NOT NULL,
    "jobId" TEXT,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "operationType" TEXT NOT NULL,
    "inputSummary" TEXT,
    "result" JSONB NOT NULL,
    "confidence" DECIMAL(4,3) NOT NULL,
    "dataStatus" "DataStatus" NOT NULL DEFAULT 'UNKNOWN',
    "requiresReview" BOOLEAN NOT NULL DEFAULT true,
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,
    "reviewOutcome" TEXT,
    "isSuperseded" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_intelligence_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_businessId_idx" ON "users"("businessId");

-- CreateIndex
CREATE INDEX "businesses_ownerId_idx" ON "businesses"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "asset_categories_slug_key" ON "asset_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "manufacturers_slug_key" ON "manufacturers"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "asset_models_slug_key" ON "asset_models"("slug");

-- CreateIndex
CREATE INDEX "asset_models_manufacturerId_idx" ON "asset_models"("manufacturerId");

-- CreateIndex
CREATE INDEX "asset_models_categoryId_idx" ON "asset_models"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "assets_slug_key" ON "assets"("slug");

-- CreateIndex
CREATE INDEX "assets_categoryId_idx" ON "assets"("categoryId");

-- CreateIndex
CREATE INDEX "assets_supplierId_idx" ON "assets"("supplierId");

-- CreateIndex
CREATE INDEX "assets_status_idx" ON "assets"("status");

-- CreateIndex
CREATE INDEX "asset_valuations_assetId_idx" ON "asset_valuations"("assetId");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_slug_key" ON "suppliers"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "lenders_slug_key" ON "lenders"("slug");

-- CreateIndex
CREATE INDEX "finance_products_lenderId_idx" ON "finance_products"("lenderId");

-- CreateIndex
CREATE UNIQUE INDEX "finance_applications_reference_key" ON "finance_applications"("reference");

-- CreateIndex
CREATE INDEX "finance_applications_userId_idx" ON "finance_applications"("userId");

-- CreateIndex
CREATE INDEX "finance_applications_status_idx" ON "finance_applications"("status");

-- CreateIndex
CREATE INDEX "finance_offers_applicationId_idx" ON "finance_offers"("applicationId");

-- CreateIndex
CREATE INDEX "finance_offers_lenderId_idx" ON "finance_offers"("lenderId");

-- CreateIndex
CREATE INDEX "application_documents_applicationId_idx" ON "application_documents"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_reference_key" ON "transactions"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_applicationId_key" ON "transactions"("applicationId");

-- CreateIndex
CREATE INDEX "ai_jobs_status_idx" ON "ai_jobs"("status");

-- CreateIndex
CREATE INDEX "ai_jobs_type_idx" ON "ai_jobs"("type");

-- CreateIndex
CREATE INDEX "ai_usage_provider_model_idx" ON "ai_usage"("provider", "model");

-- CreateIndex
CREATE INDEX "events_name_idx" ON "events"("name");

-- CreateIndex
CREATE INDEX "events_userId_idx" ON "events"("userId");

-- CreateIndex
CREATE INDEX "events_createdAt_idx" ON "events"("createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_idx" ON "audit_logs"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "audit_logs_actorId_idx" ON "audit_logs"("actorId");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "opportunities_reference_key" ON "opportunities"("reference");

-- CreateIndex
CREATE INDEX "opportunities_businessId_idx" ON "opportunities"("businessId");

-- CreateIndex
CREATE INDEX "opportunities_status_idx" ON "opportunities"("status");

-- CreateIndex
CREATE INDEX "opportunities_assignedToId_idx" ON "opportunities"("assignedToId");

-- CreateIndex
CREATE INDEX "market_observations_assetId_idx" ON "market_observations"("assetId");

-- CreateIndex
CREATE INDEX "market_observations_manufacturerId_modelId_idx" ON "market_observations"("manufacturerId", "modelId");

-- CreateIndex
CREATE INDEX "market_observations_categoryId_idx" ON "market_observations"("categoryId");

-- CreateIndex
CREATE INDEX "market_observations_observedAt_idx" ON "market_observations"("observedAt");

-- CreateIndex
CREATE UNIQUE INDEX "provider_criteria_lenderId_key" ON "provider_criteria"("lenderId");

-- CreateIndex
CREATE INDEX "provider_criteria_lenderId_idx" ON "provider_criteria"("lenderId");

-- CreateIndex
CREATE INDEX "ai_intelligence_results_entityType_entityId_idx" ON "ai_intelligence_results"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "ai_intelligence_results_jobId_idx" ON "ai_intelligence_results"("jobId");

-- CreateIndex
CREATE INDEX "ai_intelligence_results_dataStatus_idx" ON "ai_intelligence_results"("dataStatus");

-- CreateIndex
CREATE INDEX "ai_intelligence_results_requiresReview_idx" ON "ai_intelligence_results"("requiresReview");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_categories" ADD CONSTRAINT "asset_categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "asset_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_models" ADD CONSTRAINT "asset_models_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "manufacturers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_models" ADD CONSTRAINT "asset_models_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "asset_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "asset_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "manufacturers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "asset_models"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_valuations" ADD CONSTRAINT "asset_valuations_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_products" ADD CONSTRAINT "finance_products_lenderId_fkey" FOREIGN KEY ("lenderId") REFERENCES "lenders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_applications" ADD CONSTRAINT "finance_applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_applications" ADD CONSTRAINT "finance_applications_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_applications" ADD CONSTRAINT "finance_applications_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_offers" ADD CONSTRAINT "finance_offers_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "finance_applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_offers" ADD CONSTRAINT "finance_offers_lenderId_fkey" FOREIGN KEY ("lenderId") REFERENCES "lenders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance_offers" ADD CONSTRAINT "finance_offers_financeProductId_fkey" FOREIGN KEY ("financeProductId") REFERENCES "finance_products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_documents" ADD CONSTRAINT "application_documents_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "finance_applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
