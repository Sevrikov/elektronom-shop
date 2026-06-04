import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Starting GTIN/MPN synchronization from SupplierInventory...");

  const supplierItems = await prisma.supplierInventory.findMany({
    where: {
      mpn: { not: null, not: "" }
    },
    select: {
      sku: true,
      mpn: true,
    }
  });

  console.log(`Found ${supplierItems.length} items in SupplierInventory with MPN.`);

  let updatedCount = 0;

  for (const item of supplierItems) {
    if (!item.mpn) continue;

    const product = await prisma.product.findUnique({
      where: { sku: item.sku },
      select: { id: true, mpn: true }
    });

    if (product) {
      if (product.mpn !== item.mpn) {
        await prisma.product.update({
          where: { id: product.id },
          data: { mpn: item.mpn }
        });
        updatedCount++;
      }
    }
  }

  console.log(`Synchronization finished. Updated ${updatedCount} products.`);
}

main()
  .catch((err) => {
    console.error("Error during sync:", err);
  });
