/*
  Warnings:

  - A unique constraint covering the columns `[title,universityId]` on the table `degree` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,universityId]` on the table `unit` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "faculty" ADD COLUMN     "api_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "degree_title_universityId_key" ON "degree"("title", "universityId");

-- CreateIndex
CREATE UNIQUE INDEX "unit_name_universityId_key" ON "unit"("name", "universityId");
