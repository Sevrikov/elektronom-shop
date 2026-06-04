import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function main() {
  console.log('Connecting to database...');

  const count = await prisma.product.count();
  console.log(`Total products in database: ${count}`);

  const sampleProducts = await prisma.product.findMany({
    take: 10,
    select: {
      sku: true,
      price: true,
      brand: {
        select: {
          name: true,
        },
      },
      translations: {
        where: {
          locale: 'uk',
        },
        select: {
          name: true,
        },
      },
    },
  });

  console.log('Sample products in DB:');
  sampleProducts.forEach(p => {
    console.log(`- SKU: ${p.sku} | Brand: ${p.brand?.name || 'NULL'} | Name: ${p.translations[0]?.name || 'No translation'}`);
  });

  return;

  // 2. Fetch products of these brands
  const brandIds: string[] = [];
  const products = await prisma.product.findMany({
    where: {
      brandId: {
        in: brandIds,
      },
      isActive: true,
      stock: {
        gt: 0,
      },
    },
    select: {
      id: true,
      sku: true,
      price: true,
      costPrice: true,
      stock: true,
      translations: {
        select: {
          locale: true,
          name: true,
        },
      },
      orderItems: {
        select: {
          quantity: true,
        },
      },
    },
  });

  console.log(`Found ${products.length} active in-stock products for АСКО-УКРЕМ.`);

  const processedProducts = products.map(p => {
    const translation = p.translations.find(t => t.locale === 'uk') || p.translations.find(t => t.locale === 'ru') || { name: 'Unknown' };
    const priceNum = Number(p.price);
    const costPriceNum = p.costPrice ? Number(p.costPrice) : 0;
    const margin = priceNum - costPriceNum;
    const marginPercent = priceNum > 0 ? (margin / priceNum) * 100 : 0;
    const salesCount = p.orderItems.reduce((sum, item) => sum + item.quantity, 0);

    return {
      sku: p.sku,
      id: p.id,
      name: translation.name,
      price: priceNum,
      costPrice: costPriceNum,
      margin: margin,
      marginPercent: marginPercent,
      stock: p.stock,
      salesCount: salesCount,
    };
  });

  // Sort by salesCount desc, then by margin desc, then by price desc
  processedProducts.sort((a, b) => {
    if (b.salesCount !== a.salesCount) {
      return b.salesCount - a.salesCount;
    }
    return b.margin - a.margin;
  });

  console.log('\n--- TOP 50 ASKO-UKREM PRODUCTS ---');
  const top50 = processedProducts.slice(0, 50);
  top50.forEach((p, idx) => {
    console.log(`${idx + 1}. SKU: ${p.sku} | Sales: ${p.salesCount} | Margin: ${p.margin.toFixed(2)} UAH (${p.marginPercent.toFixed(1)}%) | Price: ${p.price.toFixed(2)} UAH | Stock: ${p.stock} | Name: ${p.name}`);
  });
}

main()
  .catch(err => {
    console.error('Error running script:', err);
  })
  .finally(async () => {
    // We don't have disconnect in singleton but node will exit
  });
