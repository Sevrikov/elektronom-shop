import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  const cat = await prisma.category.findFirst({
    where: { slug: "elektroustanovochni-vyroby" },
    include: {
      children: true
    }
  });

  console.log("=== TARGET CATEGORY ===");
  console.log(cat);
}

main().catch(console.error).finally(() => prisma.$disconnect());
