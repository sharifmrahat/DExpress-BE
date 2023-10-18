/*
  Warnings:

  - The values [PENDING,BOOKED,CANCELLED,REJECT,COMPLETED] on the enum `BookingStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [AVAILABLE,BOOKED,NOTAVAILABLE] on the enum `LorryStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [LARGE,MEDIUM,SMALL] on the enum `Type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BookingStatus_new" AS ENUM ('Pending', 'Booked', 'Cancelled', 'Rejected', 'Completed');
ALTER TABLE "bookings" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "bookings" ALTER COLUMN "status" TYPE "BookingStatus_new" USING ("status"::text::"BookingStatus_new");
ALTER TYPE "BookingStatus" RENAME TO "BookingStatus_old";
ALTER TYPE "BookingStatus_new" RENAME TO "BookingStatus";
DROP TYPE "BookingStatus_old";
ALTER TABLE "bookings" ALTER COLUMN "status" SET DEFAULT 'Pending';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "LorryStatus_new" AS ENUM ('Available', 'Booked', 'Not_Available');
ALTER TABLE "lorries" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "lorries" ALTER COLUMN "status" TYPE "LorryStatus_new" USING ("status"::text::"LorryStatus_new");
ALTER TYPE "LorryStatus" RENAME TO "LorryStatus_old";
ALTER TYPE "LorryStatus_new" RENAME TO "LorryStatus";
DROP TYPE "LorryStatus_old";
ALTER TABLE "lorries" ALTER COLUMN "status" SET DEFAULT 'Available';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Type_new" AS ENUM ('Large', 'Medium', 'Small');
ALTER TABLE "lorries" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "lorries" ALTER COLUMN "type" TYPE "Type_new" USING ("type"::text::"Type_new");
ALTER TYPE "Type" RENAME TO "Type_old";
ALTER TYPE "Type_new" RENAME TO "Type";
DROP TYPE "Type_old";
ALTER TABLE "lorries" ALTER COLUMN "type" SET DEFAULT 'Small';
COMMIT;

-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "status" SET DEFAULT 'Pending';

-- AlterTable
ALTER TABLE "lorries" ALTER COLUMN "type" SET DEFAULT 'Small',
ALTER COLUMN "status" SET DEFAULT 'Available';
