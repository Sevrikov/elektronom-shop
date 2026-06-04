import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  const terms = ["rozet", "vymyk", "avtomat", "shchit", "shchyt", "instrument", "kabel", "prov", "pzv", "dyf", "bezpereb", "ups", "dbzh", "rele"];
  
  const categories = await prisma.category.findMany({
    where: {
      OR: terms.map(term => ({
        slug: { contains: term, mode: "insensitive" }
      }))
    },
    include: {
      parent: {
        select: { slug: true }
      },
      _count: {
        select: { products: true }
      }
    }
  });

  console.log(`=== FOUND ${categories.length} SIMILAR CATEGORIES ===`);
  categories.forEach(c => {
    console.log(`- Slug: [${c.slug}], Parent: [${c.parent ? c.parent.slug : "none"}], Products: ${c._count.products}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
