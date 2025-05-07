/*
  Warnings:

  - The `language` column on the `Ask` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `type` column on the `Response` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Ask" DROP COLUMN "language",
ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'EN';

-- AlterTable
ALTER TABLE "Response" DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'ai';

-- DropEnum
DROP TYPE "Language";

-- DropEnum
DROP TYPE "ResponseType";
