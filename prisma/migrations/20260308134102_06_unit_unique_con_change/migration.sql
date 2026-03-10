/*
  Warnings:

  - A unique constraint covering the columns `[code,universityId]` on the table `unit` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "unit_name_universityId_key";

-- CreateIndex
CREATE UNIQUE INDEX "unit_code_universityId_key" ON "unit"("code", "universityId");
