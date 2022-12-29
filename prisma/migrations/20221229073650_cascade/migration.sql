-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_account_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_admin_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Bid" DROP CONSTRAINT "Bid_freelancer_id_fkey";

-- DropForeignKey
ALTER TABLE "Bid" DROP CONSTRAINT "Bid_job_id_fkey";

-- DropForeignKey
ALTER TABLE "Bio" DROP CONSTRAINT "Bio_freelancer_id_fkey";

-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_client_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Education" DROP CONSTRAINT "Education_freelancer_id_fkey";

-- DropForeignKey
ALTER TABLE "Experience" DROP CONSTRAINT "Experience_freelancer_id_fkey";

-- DropForeignKey
ALTER TABLE "Freelancer" DROP CONSTRAINT "Freelancer_freelancer_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_freelancerId_fkey";

-- DropForeignKey
ALTER TABLE "Job_freelancer_table" DROP CONSTRAINT "Job_freelancer_table_freelancer_id_fkey";

-- DropForeignKey
ALTER TABLE "Job_freelancer_table" DROP CONSTRAINT "Job_freelancer_table_job_id_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_payment_client_id_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_payment_freelancer_id_fkey";

-- DropForeignKey
ALTER TABLE "Ratings_Reviews" DROP CONSTRAINT "Ratings_Reviews_client_id_fkey";

-- DropForeignKey
ALTER TABLE "Ratings_Reviews" DROP CONSTRAINT "Ratings_Reviews_freelancer_id_fkey";

-- DropForeignKey
ALTER TABLE "Skill_Freelancer" DROP CONSTRAINT "Skill_Freelancer_freelancer_id_fkey";

-- DropForeignKey
ALTER TABLE "Skill_Freelancer" DROP CONSTRAINT "Skill_Freelancer_skill_id_fkey";

-- DropForeignKey
ALTER TABLE "Skill_Job" DROP CONSTRAINT "Skill_Job_job_id_fkey";

-- DropForeignKey
ALTER TABLE "Skill_Job" DROP CONSTRAINT "Skill_Job_skill_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_user_profile_id_fkey";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_user_profile_id_fkey" FOREIGN KEY ("user_profile_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_account_user_id_fkey" FOREIGN KEY ("account_user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_client_user_id_fkey" FOREIGN KEY ("client_user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Freelancer" ADD CONSTRAINT "Freelancer_freelancer_user_id_fkey" FOREIGN KEY ("freelancer_user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ratings_Reviews" ADD CONSTRAINT "Ratings_Reviews_freelancer_id_fkey" FOREIGN KEY ("freelancer_id") REFERENCES "Freelancer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ratings_Reviews" ADD CONSTRAINT "Ratings_Reviews_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bio" ADD CONSTRAINT "Bio_freelancer_id_fkey" FOREIGN KEY ("freelancer_id") REFERENCES "Freelancer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_freelancer_id_fkey" FOREIGN KEY ("freelancer_id") REFERENCES "Freelancer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_freelancer_id_fkey" FOREIGN KEY ("freelancer_id") REFERENCES "Freelancer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill_Freelancer" ADD CONSTRAINT "Skill_Freelancer_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill_Freelancer" ADD CONSTRAINT "Skill_Freelancer_freelancer_id_fkey" FOREIGN KEY ("freelancer_id") REFERENCES "Freelancer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill_Job" ADD CONSTRAINT "Skill_Job_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill_Job" ADD CONSTRAINT "Skill_Job_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "Freelancer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_payment_client_id_fkey" FOREIGN KEY ("payment_client_id") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_payment_freelancer_id_fkey" FOREIGN KEY ("payment_freelancer_id") REFERENCES "Freelancer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job_freelancer_table" ADD CONSTRAINT "Job_freelancer_table_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job_freelancer_table" ADD CONSTRAINT "Job_freelancer_table_freelancer_id_fkey" FOREIGN KEY ("freelancer_id") REFERENCES "Freelancer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_freelancer_id_fkey" FOREIGN KEY ("freelancer_id") REFERENCES "Freelancer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_admin_user_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
