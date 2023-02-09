-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "contract_client_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_contract_client_id_fkey" FOREIGN KEY ("contract_client_id") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
