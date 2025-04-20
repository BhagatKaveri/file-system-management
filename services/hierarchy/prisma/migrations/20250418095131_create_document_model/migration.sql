/*
  Warnings:

  - You are about to drop the column `parentFolder` on the `Folder` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Folder` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Folder` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_parentFolder_fkey";

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Folder" DROP COLUMN "parentFolder",
DROP COLUMN "updatedAt",
ADD COLUMN     "parentId" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
