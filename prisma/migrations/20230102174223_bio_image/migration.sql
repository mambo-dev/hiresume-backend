/*
  Warnings:

  - Added the required column `bio_image_url` to the `Bio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bio" ADD COLUMN     "bio_image_url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Freelancer" ADD COLUMN     "freelancer_contract_id" INTEGER;

-- CreateTable
CREATE TABLE "Contract" (
    "id" SERIAL NOT NULL,
    "contract_job_id" INTEGER NOT NULL,
    "contract_details" TEXT NOT NULL,
    "contract_start" TEXT NOT NULL,
    "contract_end" TEXT NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Freelancer" ADD CONSTRAINT "Freelancer_freelancer_contract_id_fkey" FOREIGN KEY ("freelancer_contract_id") REFERENCES "Contract"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_contract_job_id_fkey" FOREIGN KEY ("contract_job_id") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
