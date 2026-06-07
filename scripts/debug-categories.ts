import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  const rootCategories = await prisma.category.findMany({
    where: { parentId: null, isActive: true },
    select: {
      id: true,
      slug: true,
      translations: {
        select: {
          locale: true,
          name: true,
        },
        take: 2,
      },
      children: {
        where: { isActive: true },
        select: {
          id: true,
          slug: true,
          translations: {
            select: {
              locale: true,
              name: true,
            },
            take: 2,
          },
        },
        orderBy: { sortOrder: "asc" },
        take: 100,
      },
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: { sortOrder: "asc" },
    take: 100,
  });

  console.log(`Found ${rootCategories.length} root categories in database.`);
  rootCategories.forEach(root => {
    const rootNameUk = root.translations.find(t => t.locale === "uk")?.name || root.slug;
    const rootNameRu = root.translations.find(t => t.locale === "ru")?.name || root.slug;
    console.log(`\n- ${rootNameUk} (${rootNameRu}) [slug: ${root.slug}, products count: ${root._count.products}]`);
    if (root.children.length > 0) {
      console.log("  Subcategories:");
      root.children.forEach(child => {
        const childNameUk = child.translations.find(t => t.locale === "uk")?.name || child.slug;
        const childNameRu = child.translations.find(t => t.locale === "ru")?.name || child.slug;
        console.log(`    * ${childNameUk} (${childNameRu}) [slug: ${child.slug}]`);
      });
    }
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
