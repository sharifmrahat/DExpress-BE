/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `packages` will be added. If there are existing duplicate values, this will fail.
  - Made the column `serviceId` on table `packages` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "packages" DROP CONSTRAINT "packages_serviceId_fkey";

-- AlterTable
ALTER TABLE "packages" ALTER COLUMN "serviceId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "packages_title_key" ON "packages"("title");

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
