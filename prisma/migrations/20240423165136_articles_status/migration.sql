/*
  Warnings:

  - The values [Draft] on the enum `ArticleStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ArticleStatus_new" AS ENUM ('Drafted', 'Published', 'Archived');
ALTER TABLE "articles" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "articles" ALTER COLUMN "status" TYPE "ArticleStatus_new" USING ("status"::text::"ArticleStatus_new");
ALTER TYPE "ArticleStatus" RENAME TO "ArticleStatus_old";
ALTER TYPE "ArticleStatus_new" RENAME TO "ArticleStatus";
DROP TYPE "ArticleStatus_old";
ALTER TABLE "articles" ALTER COLUMN "status" SET DEFAULT 'Drafted';
COMMIT;

-- AlterTable
ALTER TABLE "articles" ALTER COLUMN "status" SET DEFAULT 'Drafted';
