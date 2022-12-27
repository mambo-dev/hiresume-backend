-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "account_user_id" INTEGER NOT NULL,
    "account_password_reset" TEXT,
    "account_verification_code" TEXT,
    "account_two_factor_auth" BOOLEAN NOT NULL DEFAULT false,
    "account_user_verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_account_user_id_key" ON "Account"("account_user_id");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_account_user_id_fkey" FOREIGN KEY ("account_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
