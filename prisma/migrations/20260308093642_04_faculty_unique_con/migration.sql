/*
  Warnings:

  - A unique constraint covering the columns `[title,universityId]` on the table `faculty` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "faculty_title_universityId_key" ON "faculty"("title", "universityId");
