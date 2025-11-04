-- CreateEnum
CREATE TYPE "JobCategory" AS ENUM ('GENERAL_HOUSE_HELP', 'ELDERLY_CARE', 'CHILD_CARE', 'COOKING_SPECIALIST', 'HOUSE_MANAGER');

-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "category" "JobCategory";
