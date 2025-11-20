/*
  Warnings:

  - You are about to drop the column `educationCertUrl` on the `kyc_details` table. All the data in the column will be lost.
  - You are about to drop the column `goodConductUrl` on the `kyc_details` table. All the data in the column will be lost.
  - You are about to drop the column `idDocumentBack` on the `kyc_details` table. All the data in the column will be lost.
  - You are about to drop the column `idDocumentFront` on the `kyc_details` table. All the data in the column will be lost.
  - You are about to drop the column `kraDocument` on the `kyc_details` table. All the data in the column will be lost.
  - You are about to drop the column `kraPin` on the `kyc_details` table. All the data in the column will be lost.
  - You are about to drop the column `languages` on the `kyc_details` table. All the data in the column will be lost.
  - You are about to drop the column `medicalDocument` on the `kyc_details` table. All the data in the column will be lost.
  - You are about to drop the column `medicalVerified` on the `kyc_details` table. All the data in the column will be lost.
  - You are about to drop the column `passportDocument` on the `kyc_details` table. All the data in the column will be lost.
  - You are about to drop the column `passportExpiryDate` on the `kyc_details` table. All the data in the column will be lost.
  - You are about to drop the column `passportIssueDate` on the `kyc_details` table. All the data in the column will be lost.
  - You are about to drop the column `passportNumber` on the `kyc_details` table. All the data in the column will be lost.
  - You are about to drop the column `profilePicture` on the `kyc_details` table. All the data in the column will be lost.
  - You are about to drop the column `profileVerified` on the `kyc_details` table. All the data in the column will be lost.
  - You are about to drop the column `skills` on the `kyc_details` table. All the data in the column will be lost.
  - You are about to drop the column `workCertUrl` on the `kyc_details` table. All the data in the column will be lost.
  - You are about to drop the column `workExperience` on the `kyc_details` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "kyc_details" DROP COLUMN "educationCertUrl",
DROP COLUMN "goodConductUrl",
DROP COLUMN "idDocumentBack",
DROP COLUMN "idDocumentFront",
DROP COLUMN "kraDocument",
DROP COLUMN "kraPin",
DROP COLUMN "languages",
DROP COLUMN "medicalDocument",
DROP COLUMN "medicalVerified",
DROP COLUMN "passportDocument",
DROP COLUMN "passportExpiryDate",
DROP COLUMN "passportIssueDate",
DROP COLUMN "passportNumber",
DROP COLUMN "profilePicture",
DROP COLUMN "profileVerified",
DROP COLUMN "skills",
DROP COLUMN "workCertUrl",
DROP COLUMN "workExperience";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false;
