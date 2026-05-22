-- CreateTable
CREATE TABLE "order_counters" (
    "year" INTEGER NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "order_counters_pkey" PRIMARY KEY ("year")
);
