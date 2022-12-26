-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "payment_client_id" INTEGER,
    "payment_amount" INTEGER NOT NULL,
    "payment_freelancer_id" INTEGER,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_payment_client_id_fkey" FOREIGN KEY ("payment_client_id") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_payment_freelancer_id_fkey" FOREIGN KEY ("payment_freelancer_id") REFERENCES "Freelancer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
