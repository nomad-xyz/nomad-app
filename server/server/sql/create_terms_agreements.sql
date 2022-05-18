-- CreateTable
CREATE TABLE "terms_agreements" (
  "wallet" SERIAL NOT NULL,
  "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "terms_agreements_pkey" PRIMARY KEY ("wallet")
);
