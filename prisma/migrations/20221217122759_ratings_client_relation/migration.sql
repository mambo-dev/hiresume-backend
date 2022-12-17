/*
  Warnings:

  - Added the required column `client_id` to the `Ratings_Reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ratings_Reviews" ADD COLUMN     "client_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Ratings_Reviews" ADD CONSTRAINT "Ratings_Reviews_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
