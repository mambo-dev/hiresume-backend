-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "job_has_contract" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "job_open" BOOLEAN NOT NULL DEFAULT true;
