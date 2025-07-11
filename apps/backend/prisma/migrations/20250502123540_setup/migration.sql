/*
  Warnings:

  - You are about to drop the column `webPage` on the `Ask` table. All the data in the column will be lost.
  - Added the required column `searchTerm` to the `Ask` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ask" DROP COLUMN "webPage",
ADD COLUMN     "searchTerm" TEXT NOT NULL;
