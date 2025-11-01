/*
  Warnings:

  - You are about to drop the column `steps` on the `onboarding_progress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "onboarding_progress" DROP COLUMN "steps",
ADD COLUMN     "data" JSONB;
