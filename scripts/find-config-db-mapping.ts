import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  const categories = await prisma.category.findMany({
    where: { parentId: null }
  });

  console.log("=== DB TOP LEVEL CATEGORIES ===");
  categories.forEach(c => {
    console.log(`- Slug: [${c.slug}], Name: "${c.nameUk}" / "${c.nameRu}"`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
