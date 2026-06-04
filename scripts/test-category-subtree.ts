import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { getFilteredProducts } from "../src/queries/products";
import { getCategorySubtreeIds } from "../src/queries/categories";

async function runTests() {
  console.log("Running category subtree integration and regression tests...");

  // 1. Find the target parent category "elektryka"
  const targetParent = await prisma.category.findFirst({
    where: {
      slug: "elektryka",
      isActive: true,
    },
    select: {
      id: true,
      slug: true,
    }
  });

  if (!targetParent) {
    console.error("FAIL: Target category 'elektryka' not found in database.");
    process.exit(1);
  }

  console.log(`Target parent category: "${targetParent.slug}" (ID: ${targetParent.id})`);

  // 2. Count products directly in the parent category
  const directCount = await prisma.product.count({
    where: { categoryId: targetParent.id, isActive: true }
  });
  console.log(`Direct products in parent category: ${directCount}`);

  // 3. Count products in the entire subtree recursively
  const subtreeIds = await getCategorySubtreeIds(targetParent.slug);
  console.log(`Resolved subtree category IDs count: ${subtreeIds.length}`);

  const expectedTotal = await prisma.product.count({
    where: { categoryId: { in: subtreeIds }, isActive: true }
  });
  console.log(`Total expected products in subtree (recursive): ${expectedTotal}`);

  if (expectedTotal === 0) {
    console.error("FAIL: Expected total products in target subtree is 0. Cannot verify subtree query behavior.");
    process.exit(1);
  }

  // 4. Test getFilteredProducts
  console.log("\nTesting getFilteredProducts...");
  const filteredResult = await getFilteredProducts({
    categorySlug: targetParent.slug,
    locale: "uk",
    pageSize: 100
  });

  console.log(`getFilteredProducts returned total: ${filteredResult.total}`);
  if (filteredResult.total !== expectedTotal) {
    console.error(`FAIL: getFilteredProducts total (${filteredResult.total}) does not match expected total (${expectedTotal})`);
    process.exit(1);
  } else {
    console.log("PASS: getFilteredProducts returns correct total including subtree products.");
  }

  console.log("\nAll category subtree tests passed successfully!");
}

runTests().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
}).finally(() => prisma.$disconnect());
