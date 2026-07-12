-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "targetLength" INTEGER NOT NULL DEFAULT 5;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "credits" INTEGER NOT NULL DEFAULT 20;

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "planId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "credits" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
