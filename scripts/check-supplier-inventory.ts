import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  const count = await prisma.supplierInventory.count();
  console.log("Total records in SupplierInventory:", count);
  if (count > 0) {
    const samples = await prisma.supplierInventory.findMany({
      take: 5
    });
    console.log("Samples:", JSON.stringify(samples, null, 2));
  }
}

main().catch(console.error);
