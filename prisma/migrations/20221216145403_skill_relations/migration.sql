/*
  Warnings:

  - You are about to drop the column `freelancer_id` on the `Skill` table. All the data in the column will be lost.
  - You are about to drop the column `job_id` on the `Skill` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Skill" DROP CONSTRAINT "Skill_freelancer_id_fkey";

-- DropForeignKey
ALTER TABLE "Skill" DROP CONSTRAINT "Skill_job_id_fkey";

-- AlterTable
ALTER TABLE "Skill" DROP COLUMN "freelancer_id",
DROP COLUMN "job_id";

-- CreateTable
CREATE TABLE "Skill_Freelancer" (
    "skill_id" INTEGER NOT NULL,
    "freelancer_id" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,

    CONSTRAINT "Skill_Freelancer_pkey" PRIMARY KEY ("skill_id","freelancer_id")
);

-- CreateTable
CREATE TABLE "Skill_Job" (
    "skill_id" INTEGER NOT NULL,
    "job_id" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,

    CONSTRAINT "Skill_Job_pkey" PRIMARY KEY ("skill_id","job_id")
);

-- AddForeignKey
ALTER TABLE "Skill_Freelancer" ADD CONSTRAINT "Skill_Freelancer_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill_Freelancer" ADD CONSTRAINT "Skill_Freelancer_freelancer_id_fkey" FOREIGN KEY ("freelancer_id") REFERENCES "Freelancer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill_Job" ADD CONSTRAINT "Skill_Job_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill_Job" ADD CONSTRAINT "Skill_Job_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
