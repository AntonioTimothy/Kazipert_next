/*
  Warnings:

  - The values [ACCEPTED,CONTRACT_SENT,FLIGHT_BOOKED,ARRIVED] on the enum `ApplicationStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `arrivedAt` on the `job_applications` table. All the data in the column will be lost.
  - You are about to drop the column `flightBookedAt` on the `job_applications` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ApplicationStep" AS ENUM ('APPLICATION_SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'MEDICAL_REQUESTED', 'MEDICAL_SUBMITTED', 'MEDICAL_APPROVED', 'CONTRACT_SENT', 'CONTRACT_SIGNED', 'VISA_APPLIED', 'VISA_APPROVED', 'FLIGHT_TICKET_SENT', 'FLIGHT_TICKET_RECEIVED', 'DEPLOYMENT_READY');

-- AlterEnum
BEGIN;
CREATE TYPE "ApplicationStatus_new" AS ENUM ('PENDING', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'MEDICAL_PENDING', 'CONTRACT_PENDING', 'VISA_PROCESSING', 'FLIGHT_PENDING', 'READY_FOR_DEPLOYMENT', 'COMPLETED', 'REJECTED', 'WITHDRAWN');
ALTER TABLE "public"."job_applications" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "job_applications" ALTER COLUMN "status" TYPE "ApplicationStatus_new" USING ("status"::text::"ApplicationStatus_new");
ALTER TYPE "ApplicationStatus" RENAME TO "ApplicationStatus_old";
ALTER TYPE "ApplicationStatus_new" RENAME TO "ApplicationStatus";
DROP TYPE "public"."ApplicationStatus_old";
ALTER TABLE "job_applications" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "job_applications" DROP COLUMN "arrivedAt",
DROP COLUMN "flightBookedAt",
ADD COLUMN     "applicationSubmittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "contractDetails" JSONB,
ADD COLUMN     "contractSignedAt" TIMESTAMP(3),
ADD COLUMN     "contractUrl" TEXT,
ADD COLUMN     "currentStep" "ApplicationStep" NOT NULL DEFAULT 'APPLICATION_SUBMITTED',
ADD COLUMN     "deploymentReadyAt" TIMESTAMP(3),
ADD COLUMN     "flightTicketDetails" JSONB,
ADD COLUMN     "flightTicketReceivedAt" TIMESTAMP(3),
ADD COLUMN     "flightTicketSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "flightTicketSentAt" TIMESTAMP(3),
ADD COLUMN     "flightTicketUrl" TEXT,
ADD COLUMN     "interviewNotes" TEXT,
ADD COLUMN     "interviewScheduledAt" TIMESTAMP(3),
ADD COLUMN     "medicalApproved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "medicalApprovedAt" TIMESTAMP(3),
ADD COLUMN     "medicalDocumentUrl" TEXT,
ADD COLUMN     "medicalRequestedAt" TIMESTAMP(3),
ADD COLUMN     "medicalSubmitted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "medicalSubmittedAt" TIMESTAMP(3),
ADD COLUMN     "shortlistedAt" TIMESTAMP(3),
ADD COLUMN     "underReviewAt" TIMESTAMP(3),
ADD COLUMN     "visaApproved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "visaApprovedAt" TIMESTAMP(3);
