-- CreateEnum
CREATE TYPE "ObservationType" AS ENUM ('ASKING_PRICE', 'SALE_PRICE', 'AUCTION_RESULT', 'DEALER_PRICE', 'LISTED_PRICE', 'USER_SUPPLIED', 'VALUATION', 'TRADE_PRICE');

-- CreateEnum
CREATE TYPE "DataSourceType" AS ENUM ('MANUFACTURER', 'DEALER', 'AUCTION', 'MARKETPLACE', 'FINANCE_PROVIDER', 'PUBLIC_DATA', 'USER_SUBMITTED', 'PARTNER', 'INTERNAL_RESEARCH', 'MANUAL');

-- CreateEnum
CREATE TYPE "DataSourceStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'TESTING');

-- CreateEnum
CREATE TYPE "ImportJobStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'COMPLETED_WITH_ERRORS', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ImportFormat" AS ENUM ('MANUAL', 'CSV', 'JSON', 'API', 'WEBHOOK');

-- CreateEnum
CREATE TYPE "ProviderApplicationStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'INCOMPLETE');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFYING', 'CONVERTED', 'DISQUALIFIED');

-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('WEBSITE', 'FOR_LENDERS', 'FOR_SUPPLIERS', 'FOR_PROVIDERS', 'REFERRAL', 'DIRECT', 'OTHER');

-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('ASSET_GUIDE', 'FINANCE_GUIDE', 'BUYING_GUIDE', 'MARKET_GUIDE', 'PROVIDER_GUIDE');

-- CreateEnum
CREATE TYPE "ResourceStatus" AS ENUM ('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "OpportunityStatus" ADD VALUE 'AWAITING_INFORMATION';
ALTER TYPE "OpportunityStatus" ADD VALUE 'READY_TO_SUBMIT';

-- AlterTable
ALTER TABLE "lenders" ADD COLUMN     "isPubliclyListed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "providerApplicationId" TEXT,
ADD COLUMN     "verificationStatus" "DataStatus" NOT NULL DEFAULT 'UNKNOWN';

-- AlterTable
ALTER TABLE "manufacturers" ADD COLUMN     "aliases" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "description" TEXT,
ADD COLUMN     "sourceId" TEXT,
ADD COLUMN     "verificationStatus" "DataStatus" NOT NULL DEFAULT 'UNKNOWN';

-- AlterTable
ALTER TABLE "market_observations" ADD COLUMN     "observationType" "ObservationType" NOT NULL DEFAULT 'ASKING_PRICE',
ADD COLUMN     "sourceId" TEXT;

-- CreateTable
CREATE TABLE "data_sources" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sourceType" "DataSourceType" NOT NULL,
    "baseUrl" TEXT,
    "status" "DataSourceStatus" NOT NULL DEFAULT 'ACTIVE',
    "trustLevel" INTEGER NOT NULL DEFAULT 1,
    "updateFrequency" TEXT,
    "lastSuccessfulImportAt" TIMESTAMP(3),
    "lastAttemptAt" TIMESTAMP(3),
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "data_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_jobs" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "sourceId" TEXT,
    "format" "ImportFormat" NOT NULL,
    "status" "ImportJobStatus" NOT NULL DEFAULT 'PENDING',
    "entityType" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "recordsSeen" INTEGER NOT NULL DEFAULT 0,
    "recordsCreated" INTEGER NOT NULL DEFAULT 0,
    "recordsUpdated" INTEGER NOT NULL DEFAULT 0,
    "recordsRejected" INTEGER NOT NULL DEFAULT 0,
    "recordsNeedingReview" INTEGER NOT NULL DEFAULT 0,
    "errors" JSONB,
    "notes" TEXT,
    "triggeredBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "import_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "role" TEXT,
    "type" TEXT NOT NULL,
    "message" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "source" "LeadSource" NOT NULL DEFAULT 'WEBSITE',
    "qualifiedAt" TIMESTAMP(3),
    "convertedToOpportunityId" TEXT,
    "assignedToId" TEXT,
    "internalNotes" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provider_applications" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyNumber" TEXT,
    "contactName" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT,
    "website" TEXT,
    "providerType" TEXT NOT NULL,
    "description" TEXT,
    "financeProducts" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "assetSpecialisms" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "geographyUK" BOOLEAN NOT NULL DEFAULT true,
    "geographyNotes" TEXT,
    "typicalDealMin" DECIMAL(15,2),
    "typicalDealMax" DECIMAL(15,2),
    "currency" TEXT NOT NULL DEFAULT 'GBP',
    "supportingDocuments" JSONB,
    "status" "ProviderApplicationStatus" NOT NULL DEFAULT 'SUBMITTED',
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,
    "reviewNotes" TEXT,
    "convertedToLenderId" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "provider_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provider_criteria_versions" (
    "id" TEXT NOT NULL,
    "lenderId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "criteria" JSONB NOT NULL,
    "effectiveFrom" TIMESTAMP(3) NOT NULL,
    "effectiveTo" TIMESTAMP(3),
    "changedBy" TEXT,
    "reason" TEXT,
    "source" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "provider_criteria_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resources" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "resourceType" "ResourceType" NOT NULL,
    "status" "ResourceStatus" NOT NULL DEFAULT 'DRAFT',
    "summary" TEXT,
    "body" TEXT,
    "authorId" TEXT,
    "publishedAt" TIMESTAMP(3),
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,
    "sources" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "relatedCategoryIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "relatedManufacturerIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "isIndexable" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "data_sources_slug_key" ON "data_sources"("slug");

-- CreateIndex
CREATE INDEX "data_sources_sourceType_idx" ON "data_sources"("sourceType");

-- CreateIndex
CREATE INDEX "data_sources_status_idx" ON "data_sources"("status");

-- CreateIndex
CREATE UNIQUE INDEX "import_jobs_reference_key" ON "import_jobs"("reference");

-- CreateIndex
CREATE INDEX "import_jobs_sourceId_idx" ON "import_jobs"("sourceId");

-- CreateIndex
CREATE INDEX "import_jobs_status_idx" ON "import_jobs"("status");

-- CreateIndex
CREATE INDEX "import_jobs_entityType_idx" ON "import_jobs"("entityType");

-- CreateIndex
CREATE UNIQUE INDEX "leads_reference_key" ON "leads"("reference");

-- CreateIndex
CREATE INDEX "leads_status_idx" ON "leads"("status");

-- CreateIndex
CREATE INDEX "leads_source_idx" ON "leads"("source");

-- CreateIndex
CREATE INDEX "leads_email_idx" ON "leads"("email");

-- CreateIndex
CREATE UNIQUE INDEX "provider_applications_reference_key" ON "provider_applications"("reference");

-- CreateIndex
CREATE INDEX "provider_applications_status_idx" ON "provider_applications"("status");

-- CreateIndex
CREATE INDEX "provider_applications_contactEmail_idx" ON "provider_applications"("contactEmail");

-- CreateIndex
CREATE INDEX "provider_criteria_versions_lenderId_idx" ON "provider_criteria_versions"("lenderId");

-- CreateIndex
CREATE INDEX "provider_criteria_versions_isActive_idx" ON "provider_criteria_versions"("isActive");

-- CreateIndex
CREATE INDEX "provider_criteria_versions_effectiveFrom_idx" ON "provider_criteria_versions"("effectiveFrom");

-- CreateIndex
CREATE UNIQUE INDEX "resources_slug_key" ON "resources"("slug");

-- CreateIndex
CREATE INDEX "resources_resourceType_idx" ON "resources"("resourceType");

-- CreateIndex
CREATE INDEX "resources_status_idx" ON "resources"("status");

-- CreateIndex
CREATE INDEX "resources_isIndexable_idx" ON "resources"("isIndexable");

-- CreateIndex
CREATE INDEX "lenders_status_idx" ON "lenders"("status");

-- CreateIndex
CREATE INDEX "lenders_verificationStatus_idx" ON "lenders"("verificationStatus");

-- CreateIndex
CREATE INDEX "manufacturers_slug_idx" ON "manufacturers"("slug");

-- CreateIndex
CREATE INDEX "manufacturers_verificationStatus_idx" ON "manufacturers"("verificationStatus");

-- CreateIndex
CREATE INDEX "market_observations_observationType_idx" ON "market_observations"("observationType");

-- CreateIndex
CREATE INDEX "market_observations_sourceId_idx" ON "market_observations"("sourceId");

-- AddForeignKey
ALTER TABLE "manufacturers" ADD CONSTRAINT "manufacturers_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "data_sources"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "market_observations" ADD CONSTRAINT "market_observations_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "data_sources"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider_criteria" ADD CONSTRAINT "provider_criteria_lenderId_fkey" FOREIGN KEY ("lenderId") REFERENCES "lenders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_jobs" ADD CONSTRAINT "import_jobs_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "data_sources"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider_criteria_versions" ADD CONSTRAINT "provider_criteria_versions_lenderId_fkey" FOREIGN KEY ("lenderId") REFERENCES "lenders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
