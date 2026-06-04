import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      slug: true,
      translations: {
        select: {
          locale: true,
          name: true,
        }
      }
    }
  });

  console.log("Categories in DB:");
  categories.forEach(c => {
    const ukName = c.translations.find(t => t.locale === "uk")?.name || "";
    console.log(`- Slug: "${c.slug}" | ID: "${c.id}" | Name (uk): "${ukName}"`);
  });
}

main().catch(console.error);
