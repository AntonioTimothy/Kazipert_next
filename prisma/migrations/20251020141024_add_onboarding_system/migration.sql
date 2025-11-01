/*
  Warnings:

  - You are about to drop the column `documentsVerified` on the `kyc_details` table. All the data in the column will be lost.
  - You are about to drop the column `emergencyContactName` on the `kyc_details` table. All the data in the column will be lost.
  - You are about to drop the column `emergencyContactPhone` on the `kyc_details` table. All the data in the column will be lost.
  - You are about to drop the column `idDocumentUrl` on the `kyc_details` table. All the data in the column will be lost.
  - You are about to drop the column `kraDocumentUrl` on the `kyc_details` table. All the data in the column will be lost.
  - You are about to drop the column `kycVerified` on the `kyc_details` table. All the data in the column will be lost.
  - You are about to drop the column `maritalStatus` on the `kyc_details` table. All the data in the column will be lost.
  - You are about to drop the column `medicalDocumentUrl` on the `kyc_details` table. All the data in the column will be lost.
  - You are about to drop the column `passportDocumentUrl` on the `kyc_details` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "kyc_details" DROP COLUMN "documentsVerified",
DROP COLUMN "emergencyContactName",
DROP COLUMN "emergencyContactPhone",
DROP COLUMN "idDocumentUrl",
DROP COLUMN "kraDocumentUrl",
DROP COLUMN "kycVerified",
DROP COLUMN "maritalStatus",
DROP COLUMN "medicalDocumentUrl",
DROP COLUMN "passportDocumentUrl",
ADD COLUMN     "idDocumentBack" TEXT,
ADD COLUMN     "idDocumentFront" TEXT,
ADD COLUMN     "idVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "kraDocument" TEXT,
ADD COLUMN     "medicalDocument" TEXT,
ADD COLUMN     "medicalVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mpesaNumber" TEXT,
ADD COLUMN     "passportDocument" TEXT,
ADD COLUMN     "paymentStatus" TEXT DEFAULT 'pending',
ADD COLUMN     "paymentVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "profilePicture" TEXT,
ADD COLUMN     "profileVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "transactionCode" TEXT;
