-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "contract_accepted" BOOLEAN,
ALTER COLUMN "contract_freelancer_signed" DROP NOT NULL;
