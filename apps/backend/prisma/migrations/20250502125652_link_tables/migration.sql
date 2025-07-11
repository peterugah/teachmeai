/*
  Warnings:

  - Added the required column `askId` to the `Response` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Response" ADD COLUMN     "askId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_askId_fkey" FOREIGN KEY ("askId") REFERENCES "Ask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
