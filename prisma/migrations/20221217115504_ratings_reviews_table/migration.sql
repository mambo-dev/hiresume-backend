-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "job_completion_status" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Ratings_Reviews" (
    "id" SERIAL NOT NULL,
    "rating" INTEGER NOT NULL,
    "review" TEXT NOT NULL,
    "freelancer_id" INTEGER NOT NULL,

    CONSTRAINT "Ratings_Reviews_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ratings_Reviews" ADD CONSTRAINT "Ratings_Reviews_freelancer_id_fkey" FOREIGN KEY ("freelancer_id") REFERENCES "Freelancer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
