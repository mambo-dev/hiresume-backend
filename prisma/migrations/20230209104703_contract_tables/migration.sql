/*
  Warnings:

  - A unique constraint covering the columns `[contract_accepted_bid_id]` on the table `Contract` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contract_accepted_bid_id` to the `Contract` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "contract_accepted_bid_id" INTEGER NOT NULL,
ADD COLUMN     "contract_amount_agreed_on" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Contract_contract_accepted_bid_id_key" ON "Contract"("contract_accepted_bid_id");

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_contract_accepted_bid_id_fkey" FOREIGN KEY ("contract_accepted_bid_id") REFERENCES "Bid"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
