-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ApplicationStatus" ADD VALUE 'CONTRACT_SENT';
ALTER TYPE "ApplicationStatus" ADD VALUE 'VISA_PROCESSING';
ALTER TYPE "ApplicationStatus" ADD VALUE 'FLIGHT_BOOKED';
ALTER TYPE "ApplicationStatus" ADD VALUE 'ARRIVED';

-- AlterTable
ALTER TABLE "job_applications" ADD COLUMN     "arrivedAt" TIMESTAMP(3),
ADD COLUMN     "contractSentAt" TIMESTAMP(3),
ADD COLUMN     "contractSigned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "flightBookedAt" TIMESTAMP(3),
ADD COLUMN     "goodConductVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "interviewDate" TIMESTAMP(3),
ADD COLUMN     "medicalVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "passportVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "visaAppliedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "application_documents" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "documentUrl" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_documents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "application_documents" ADD CONSTRAINT "application_documents_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "job_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
