/*
  Warnings:

  - Changed the type of `education_year_from` on the `Education` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `education_year_to` on the `Education` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `experience_position` to the `Experience` table without a default value. This is not possible if the table is not empty.
  - Added the required column `experience_tag` to the `Experience` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `experience_year_from` on the `Experience` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `experience_year_to` on the `Experience` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Tag" AS ENUM ('remote', 'full_time', 'part_time');

-- AlterTable
ALTER TABLE "Education" DROP COLUMN "education_year_from",
ADD COLUMN     "education_year_from" TIMESTAMP(3) NOT NULL,
DROP COLUMN "education_year_to",
ADD COLUMN     "education_year_to" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Experience" ADD COLUMN     "experience_position" TEXT NOT NULL,
ADD COLUMN     "experience_tag" "Tag" NOT NULL,
DROP COLUMN "experience_year_from",
ADD COLUMN     "experience_year_from" TIMESTAMP(3) NOT NULL,
DROP COLUMN "experience_year_to",
ADD COLUMN     "experience_year_to" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Freelancer" ADD COLUMN     "freelancer_availability" BOOLEAN NOT NULL DEFAULT false;
