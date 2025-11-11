-- AlterTable
ALTER TABLE "onboarding_progress" ADD COLUMN     "completedSteps" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
