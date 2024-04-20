/*
  Warnings:

  - You are about to drop the column `departureDate` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `pickingAddress` on the `bookings` table. All the data in the column will be lost.
  - Added the required column `billingAddress` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "departureDate",
DROP COLUMN "pickingAddress",
ADD COLUMN     "billingAddress" TEXT NOT NULL;
