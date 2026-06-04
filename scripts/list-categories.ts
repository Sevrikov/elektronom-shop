import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      },
      children: {
        include: {
          _count: {
            select: { products: true }
          }
        }
      }
    }
  });

  console.log("=== DB CATEGORIES ===");
  for (const cat of categories) {
    if (!cat.parentId) {
      console.log(`Parent: [${cat.slug}] "${cat.nameUk}" / "${cat.nameRu}" (ID: ${cat.id}) - Products: ${cat._count.products}`);
      for (const child of cat.children) {
        console.log(`  └─ Child: [${child.slug}] "${child.nameUk}" / "${child.nameRu}" (ID: ${child.id}) - Products: ${child._count.products}`);
      }
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
