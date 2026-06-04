import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  const slugs = [
    "rozetky-ta-vymykachi",
    "avtomatyka",
    "dbzh",
    "shchyty-elektrychni",
    "instrument-ruchnyy",
    "pzv-ta-dyf-avtomaty",
    "motornye-masla",
    "akumulyatory",
    "kabeli-i-roz-yemy",
    "kabeli-droty"
  ];

  const categories = await prisma.category.findMany({
    where: {
      slug: { in: slugs }
    },
    include: {
      parent: {
        select: { id: true, slug: true }
      },
      _count: {
        select: { products: true }
      }
    }
  });

  console.log("=== SPECIFIC DB CATEGORIES ===");
  categories.forEach(c => {
    console.log(`- Slug: [${c.slug}]`);
    console.log(`  ID: ${c.id}`);
    console.log(`  Name (Uk/Ru): "${c.nameUk}" / "${c.nameRu}"`);
    console.log(`  Parent: ${c.parent ? c.parent.slug : "none (top-level)"}`);
    console.log(`  Products Count: ${c._count.products}`);
    console.log("-----------------------------------------");
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
