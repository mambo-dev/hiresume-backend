/*
  Warnings:

  - You are about to drop the column `freelancer_contract_id` on the `Freelancer` table. All the data in the column will be lost.
  - Added the required column `contract_client_signed` to the `Contract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contract_date_signed` to the `Contract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contract_freelancer_signed` to the `Contract` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `contract_start` on the `Contract` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `contract_end` on the `Contract` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Freelancer" DROP CONSTRAINT "Freelancer_freelancer_contract_id_fkey";

-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "contract_client_signed" TEXT NOT NULL,
ADD COLUMN     "contract_date_signed" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "contract_freelancer_id" INTEGER,
ADD COLUMN     "contract_freelancer_signed" TEXT NOT NULL,
DROP COLUMN "contract_start",
ADD COLUMN     "contract_start" TIMESTAMP(3) NOT NULL,
DROP COLUMN "contract_end",
ADD COLUMN     "contract_end" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Freelancer" DROP COLUMN "freelancer_contract_id";

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_contract_freelancer_id_fkey" FOREIGN KEY ("contract_freelancer_id") REFERENCES "Freelancer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
