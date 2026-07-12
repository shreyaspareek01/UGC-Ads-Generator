/*
  Warnings:

  - You are about to drop the column `targetLength` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `credits` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "targetLength";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "credits",
ADD COLUMN     "password" TEXT NOT NULL,
ALTER COLUMN "image" SET DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
