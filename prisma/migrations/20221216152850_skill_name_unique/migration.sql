/*
  Warnings:

  - A unique constraint covering the columns `[skill_name]` on the table `Skill` will be added. If there are existing duplicate values, this will fail.
  - Made the column `skill_name` on table `Skill` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Skill" ALTER COLUMN "skill_name" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Skill_skill_name_key" ON "Skill"("skill_name");
