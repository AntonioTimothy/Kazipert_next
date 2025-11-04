-- CreateEnum
CREATE TYPE "AvailableFromType" AS ENUM ('IMMEDIATELY', 'ONE_MONTH', 'TWO_MONTHS', 'SPECIFIC_DATE');

-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "agreeToTerms" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "agreeToTruth" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "availableFromType" "AvailableFromType";
