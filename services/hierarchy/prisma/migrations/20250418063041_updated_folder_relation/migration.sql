/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `parentFolderId` on the `Folder` table. All the data in the column will be lost.
  - You are about to drop the `Version` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_folderId_fkey";

-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_parentFolderId_fkey";

-- DropForeignKey
ALTER TABLE "Version" DROP CONSTRAINT "Version_documentId_fkey";

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "updatedAt",
ALTER COLUMN "content" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Folder" DROP COLUMN "parentFolderId",
ADD COLUMN     "parentFolder" TEXT;

-- DropTable
DROP TABLE "Version";
