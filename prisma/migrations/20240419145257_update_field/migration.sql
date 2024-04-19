/*
  Warnings:

  - You are about to drop the column `updateAt` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `bookingLogs` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `feedbacks` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `packages` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `users` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `articles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `bookingLogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `feedbacks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `packages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "articles" DROP COLUMN "updateAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "bookingLogs" DROP COLUMN "updateAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "updateAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "feedbacks" DROP COLUMN "updateAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "packages" DROP COLUMN "updateAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "updateAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "services" DROP COLUMN "updateAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "updateAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
