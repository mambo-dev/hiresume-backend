/*
  Warnings:

  - You are about to drop the `_FreelancerToJob` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_FreelancerToJob" DROP CONSTRAINT "_FreelancerToJob_A_fkey";

-- DropForeignKey
ALTER TABLE "_FreelancerToJob" DROP CONSTRAINT "_FreelancerToJob_B_fkey";

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "freelancerId" INTEGER;

-- DropTable
DROP TABLE "_FreelancerToJob";

-- CreateTable
CREATE TABLE "Job_freelancer_table" (
    "job_id" INTEGER NOT NULL,
    "freelancer_id" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,

    CONSTRAINT "Job_freelancer_table_pkey" PRIMARY KEY ("job_id","freelancer_id")
);

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "Freelancer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job_freelancer_table" ADD CONSTRAINT "Job_freelancer_table_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job_freelancer_table" ADD CONSTRAINT "Job_freelancer_table_freelancer_id_fkey" FOREIGN KEY ("freelancer_id") REFERENCES "Freelancer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
