/*
  Warnings:

  - You are about to drop the column `userId` on the `bookingLogs` table. All the data in the column will be lost.
  - Added the required column `updatedById` to the `bookingLogs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "bookingLogs" DROP CONSTRAINT "bookingLogs_userId_fkey";

-- AlterTable
ALTER TABLE "bookingLogs" DROP COLUMN "userId",
ADD COLUMN     "updatedById" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "bookingLogs" ADD CONSTRAINT "bookingLogs_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
