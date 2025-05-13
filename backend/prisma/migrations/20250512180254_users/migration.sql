/*
  Warnings:

  - Added the required column `userId` to the `Ask` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ask" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Ask" ADD CONSTRAINT "Ask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
