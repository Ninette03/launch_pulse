-- CreateTable
CREATE TABLE "Evaluation" (
    "id" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "marketStrategy" TEXT,
    "competitors" TEXT,
    "challenges" TEXT,
    "employees" TEXT,
    "revenue" TEXT,
    "market_score" INTEGER NOT NULL DEFAULT 0,
    "feasibility_score" INTEGER NOT NULL DEFAULT 0,
    "innovation_score" INTEGER NOT NULL DEFAULT 0,
    "draft" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evaluation_pkey" PRIMARY KEY ("id")
);
