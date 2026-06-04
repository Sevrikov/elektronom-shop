// scripts/backfill-sanitize.ts
import { prisma } from '../src/lib/prisma';
import { sanitizeHtml } from '../src/lib/sanitize';

async function main() {
  console.log('Starting HTML description backfill with batching...');

  const translations = await prisma.productTranslation.findMany({
    where: {
      description: {
        not: null,
        not: '',
      },
    },
    select: {
      productId: true,
      locale: true,
      description: true,
    },
  });

  console.log(`Found ${translations.length} translations to process.`);

  let updatedCount = 0;
  const batchSize = 100;
  let promises = [];

  for (let i = 0; i < translations.length; i++) {
    const trans = translations[i];
    if (!trans) continue;
    if (!trans.description) continue;

    const cleanHtml = sanitizeHtml(trans.description);
    if (cleanHtml !== trans.description) {
      promises.push(
        prisma.productTranslation.update({
          where: {
            productId_locale: {
              productId: trans.productId,
              locale: trans.locale,
            },
          },
          data: {
            description: cleanHtml,
          },
        })
      );
      updatedCount++;
    }

    if (promises.length >= batchSize) {
      await Promise.all(promises);
      promises = [];
      console.log(`Processed ${i + 1} / ${translations.length} translations. Real database updates: ${updatedCount}`);
    }
  }

  if (promises.length > 0) {
    await Promise.all(promises);
  }

  console.log(`Backfill complete. Cleaned and updated ${updatedCount} translations in total.`);
}

main()
  .catch((e) => {
    console.error('Error running backfill:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
