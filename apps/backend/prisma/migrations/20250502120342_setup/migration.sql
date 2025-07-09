-- CreateEnum
CREATE TYPE "ResponseType" AS ENUM ('ai', 'user');

-- CreateTable
CREATE TABLE "Ask" (
    "id" SERIAL NOT NULL,
    "webPage" TEXT NOT NULL,
    "context" TEXT NOT NULL,

    CONSTRAINT "Ask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Response" (
    "id" SERIAL NOT NULL,
    "context" TEXT NOT NULL,
    "type" "ResponseType" NOT NULL,

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);
