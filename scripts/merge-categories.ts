import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { syncProductIndex } from "../src/actions/search";

async function main() {
  const merges = [
    {
      sourceSlug: "power-bank",
      sourceId: "j3a5fmdeqpu6iqwqeh2md78i",
      targetSlug: "poverbanky",
      targetId: "xw1mg3yezfqquaqhctg7s6qs"
    },
    {
      sourceSlug: "heneratory-1",
      sourceId: "taiod6rb3tghxg75tj39eucu",
      targetSlug: "heneratory",
      targetId: "zs0068misjcuyp0m7jv67cbv"
    },
    {
      sourceSlug: "tepla-pidloha-zubr-dc",
      sourceId: "uuq7xua1d55timtyzqz9edzj",
      targetSlug: "tepla-pidloha",
      targetId: "ohiadmpe50zi5nkd3br0lhkn"
    },
    {
      sourceSlug: "kabeli-i-roz-yemy",
      sourceId: "jsihpdgfw6ri3o1noq6yo97b",
      targetSlug: "kabeli-droty",
      targetId: "ng4gdx1jh6fjya5t82ji9fm3"
    }
  ];

  for (const m of merges) {
    console.log(`\nMerging [${m.sourceSlug}] into [${m.targetSlug}]...`);

    // 1. Move products to the target category
    const updateResult = await prisma.product.updateMany({
      where: { categoryId: m.sourceId },
      data: { categoryId: m.targetId }
    });
    console.log(`- Moved ${updateResult.count} products to target category.`);

    // 2. Deactivate the old category
    await prisma.category.update({
      where: { id: m.sourceId },
      data: { isActive: false }
    });
    console.log(`- Deactivated old category [${m.sourceSlug}].`);

    // 3. Re-sync all products of the target category to Algolia
    const products = await prisma.product.findMany({
      where: { categoryId: m.targetId },
      select: { id: true }
    });

    console.log(`- Syncing ${products.length} products to Algolia...`);
    let successCount = 0;
    for (const p of products) {
      try {
        const syncRes = await syncProductIndex(p.id);
        if (syncRes.success) {
          successCount++;
        } else {
          console.error(`  - Failed to sync product ${p.id}:`, syncRes.error);
        }
      } catch (err) {
        console.error(`  - Error syncing product ${p.id}:`, err);
      }
    }
    console.log(`- Successfully synced ${successCount}/${products.length} products to Algolia.`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
