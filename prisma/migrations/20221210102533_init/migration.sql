-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "user_password" TEXT NOT NULL,
    "user_role" TEXT NOT NULL,
    "user_country" TEXT NOT NULL,
    "user_profile_id" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "profile_firstname" TEXT NOT NULL,
    "profile_secondname" TEXT NOT NULL,
    "profile_image" TEXT,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "client_id" TEXT NOT NULL,
    "client_user_id" INTEGER,
    "client_company_name" TEXT,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Freelancer" (
    "id" SERIAL NOT NULL,
    "freelancer_id" TEXT NOT NULL,
    "freelancer_user_id" INTEGER,

    CONSTRAINT "Freelancer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bio" (
    "id" SERIAL NOT NULL,
    "freelancer_id" INTEGER,
    "bio_title" TEXT NOT NULL,
    "bio_description" TEXT NOT NULL,
    "bio_hourly_rate" INTEGER NOT NULL,

    CONSTRAINT "Bio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" SERIAL NOT NULL,
    "freelancer_id" INTEGER,
    "experience_company" TEXT NOT NULL,
    "experience_year_from" TIMESTAMP(3) NOT NULL,
    "experience_year_to" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" SERIAL NOT NULL,
    "freelancer_id" INTEGER,
    "education_school" TEXT NOT NULL,
    "education_year_from" TIMESTAMP(3) NOT NULL,
    "education_year_to" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" SERIAL NOT NULL,
    "freelancer_id" INTEGER,
    "skill_name" TEXT,
    "job_id" INTEGER,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "job_title" TEXT NOT NULL,
    "job_description" TEXT NOT NULL,
    "job_length" TEXT NOT NULL,
    "job_hourly_from" INTEGER,
    "job_hourly_to" INTEGER,
    "job_fixed_price" INTEGER,
    "job_level" TEXT NOT NULL,
    "clientId" INTEGER,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bid" (
    "id" SERIAL NOT NULL,
    "bid_rate" INTEGER NOT NULL,
    "bid_coverletter" TEXT NOT NULL,
    "bid_attachments" TEXT[],
    "job_id" INTEGER,
    "freelancer_id" INTEGER,
    "bid_approval_status" BOOLEAN NOT NULL,

    CONSTRAINT "Bid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "admin_id" TEXT NOT NULL,
    "admin_user_id" INTEGER,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FreelancerToJob" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_user_id_key" ON "User"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_user_email_key" ON "User"("user_email");

-- CreateIndex
CREATE UNIQUE INDEX "User_user_profile_id_key" ON "User"("user_profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "Client_client_id_key" ON "Client"("client_id");

-- CreateIndex
CREATE UNIQUE INDEX "Client_client_user_id_key" ON "Client"("client_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Freelancer_freelancer_id_key" ON "Freelancer"("freelancer_id");

-- CreateIndex
CREATE UNIQUE INDEX "Freelancer_freelancer_user_id_key" ON "Freelancer"("freelancer_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Bio_freelancer_id_key" ON "Bio"("freelancer_id");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_admin_id_key" ON "Admin"("admin_id");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_admin_user_id_key" ON "Admin"("admin_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "_FreelancerToJob_AB_unique" ON "_FreelancerToJob"("A", "B");

-- CreateIndex
CREATE INDEX "_FreelancerToJob_B_index" ON "_FreelancerToJob"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_user_profile_id_fkey" FOREIGN KEY ("user_profile_id") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_client_user_id_fkey" FOREIGN KEY ("client_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Freelancer" ADD CONSTRAINT "Freelancer_freelancer_user_id_fkey" FOREIGN KEY ("freelancer_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bio" ADD CONSTRAINT "Bio_freelancer_id_fkey" FOREIGN KEY ("freelancer_id") REFERENCES "Freelancer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_freelancer_id_fkey" FOREIGN KEY ("freelancer_id") REFERENCES "Freelancer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_freelancer_id_fkey" FOREIGN KEY ("freelancer_id") REFERENCES "Freelancer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_freelancer_id_fkey" FOREIGN KEY ("freelancer_id") REFERENCES "Freelancer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_freelancer_id_fkey" FOREIGN KEY ("freelancer_id") REFERENCES "Freelancer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_admin_user_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FreelancerToJob" ADD CONSTRAINT "_FreelancerToJob_A_fkey" FOREIGN KEY ("A") REFERENCES "Freelancer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FreelancerToJob" ADD CONSTRAINT "_FreelancerToJob_B_fkey" FOREIGN KEY ("B") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
