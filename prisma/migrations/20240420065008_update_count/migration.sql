-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "totalReading" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "packages" ADD COLUMN     "totalBooking" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "totalBooking" INTEGER NOT NULL DEFAULT 0;
