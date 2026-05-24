-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "idempotencyKey" TEXT;

-- AlterTable
ALTER TABLE "product_images" ADD COLUMN     "format" TEXT,
ADD COLUMN     "height" INTEGER,
ADD COLUMN     "provider" TEXT NOT NULL DEFAULT 'LOCAL',
ADD COLUMN     "publicId" TEXT,
ADD COLUMN     "size" INTEGER,
ADD COLUMN     "width" INTEGER;

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "advantages" TEXT,
ADD COLUMN     "disadvantages" TEXT,
ADD COLUMN     "verifiedPurchase" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "isVisible" SET DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "orders_idempotencyKey_key" ON "orders"("idempotencyKey");

