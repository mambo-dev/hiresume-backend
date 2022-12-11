/*
  Warnings:

  - A unique constraint covering the columns `[freelancer_id]` on the table `Bid` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[freelancer_id]` on the table `Education` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[freelancer_id]` on the table `Experience` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[freelancer_id]` on the table `Skill` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Bid_freelancer_id_key" ON "Bid"("freelancer_id");

-- CreateIndex
CREATE UNIQUE INDEX "Education_freelancer_id_key" ON "Education"("freelancer_id");

-- CreateIndex
CREATE UNIQUE INDEX "Experience_freelancer_id_key" ON "Experience"("freelancer_id");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_freelancer_id_key" ON "Skill"("freelancer_id");
