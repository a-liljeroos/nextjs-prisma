/*
  Warnings:

  - The `contentHistory` column on the `Comment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "contentHistory",
ADD COLUMN     "contentHistory" JSONB;
