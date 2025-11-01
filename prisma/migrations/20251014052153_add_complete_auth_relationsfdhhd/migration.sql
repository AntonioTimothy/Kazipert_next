/*
  Warnings:

  - You are about to drop the `login_attempts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."login_attempts" DROP CONSTRAINT "login_attempts_userId_fkey";

-- DropTable
DROP TABLE "public"."login_attempts";
