/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `services` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "services_title_key" ON "services"("title");
