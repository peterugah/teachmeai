/*
  Warnings:

  - You are about to drop the column `responseId` on the `Reports` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Reports" DROP CONSTRAINT "Reports_responseId_fkey";

-- AlterTable
ALTER TABLE "Reports" DROP COLUMN "responseId";
