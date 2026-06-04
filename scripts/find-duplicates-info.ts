import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  const slugs = [
    "power-bank", "poverbanky",
    "heneratory", "heneratory-1",
    "kabeli-droty", "kabeli-i-roz-yemy", "kabel-ta-provid",
    "tepla-pidloha", "tepla-pidloha-zubr-dc"
  ];

  const categories = await prisma.category.findMany({
    where: {
      slug: { in: slugs }
    },
    include: {
      _count: {
        select: { products: true }
      },
      children: {
        select: { id: true, slug: true }
      }
    }
  });

  console.log("=== DUPLICATE CATEGORIES DETAIL ===");
  for (const cat of categories) {
    console.log(`Slug: [${cat.slug}]`);
    console.log(`  ID: ${cat.id}`);
    console.log(`  Name (Uk/Ru): "${cat.nameUk}" / "${cat.nameRu}"`);
    console.log(`  Is Active: ${cat.isActive}`);
    console.log(`  Parent ID: ${cat.parentId}`);
    console.log(`  Direct Products: ${cat._count.products}`);
    console.log(`  Children: ${cat.children.map(c => c.slug).join(", ") || "none"}`);
    console.log("-----------------------------------------");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
