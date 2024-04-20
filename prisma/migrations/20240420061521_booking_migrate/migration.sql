/*
  Warnings:

  - The values [Processing,In_Transit] on the enum `BookingStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [Card,Bank] on the enum `PaymentMethod` will be removed. If these variants are still used in the database, this will fail.
  - Made the column `bkId` on table `bookings` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BookingStatus_new" AS ENUM ('Created', 'Confirmed', 'Cancelled', 'Shipped', 'Delivered');
ALTER TABLE "bookings" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "bookings" ALTER COLUMN "status" TYPE "BookingStatus_new" USING ("status"::text::"BookingStatus_new");
ALTER TABLE "bookingLogs" ALTER COLUMN "currentStatus" TYPE "BookingStatus_new" USING ("currentStatus"::text::"BookingStatus_new");
ALTER TYPE "BookingStatus" RENAME TO "BookingStatus_old";
ALTER TYPE "BookingStatus_new" RENAME TO "BookingStatus";
DROP TYPE "BookingStatus_old";
ALTER TABLE "bookings" ALTER COLUMN "status" SET DEFAULT 'Created';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentMethod_new" AS ENUM ('COD', 'Stripe', 'SSLCommerze');
ALTER TABLE "bookings" ALTER COLUMN "paymentMethod" DROP DEFAULT;
ALTER TABLE "bookings" ALTER COLUMN "paymentMethod" TYPE "PaymentMethod_new" USING ("paymentMethod"::text::"PaymentMethod_new");
ALTER TYPE "PaymentMethod" RENAME TO "PaymentMethod_old";
ALTER TYPE "PaymentMethod_new" RENAME TO "PaymentMethod";
DROP TYPE "PaymentMethod_old";
ALTER TABLE "bookings" ALTER COLUMN "paymentMethod" SET DEFAULT 'COD';
COMMIT;

-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "bkId" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'Created';
