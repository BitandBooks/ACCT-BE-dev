/*
  Warnings:

  - You are about to drop the column `description` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `endAt` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `startAt` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Event` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titleEn` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titleFr` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "description",
DROP COLUMN "endAt",
DROP COLUMN "startAt",
DROP COLUMN "title",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "descriptionAr" TEXT,
ADD COLUMN     "descriptionEn" TEXT,
ADD COLUMN     "descriptionFr" TEXT,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'draft',
ADD COLUMN     "ticketPrice" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "titleAr" TEXT,
ADD COLUMN     "titleEn" TEXT NOT NULL,
ADD COLUMN     "titleFr" TEXT NOT NULL;
