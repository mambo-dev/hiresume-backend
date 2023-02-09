/*
  Warnings:

  - A unique constraint covering the columns `[contract_job_id]` on the table `Contract` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Contract_contract_job_id_key" ON "Contract"("contract_job_id");
