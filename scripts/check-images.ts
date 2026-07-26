import { prisma } from '../src/lib/prisma'

async function main() {
  try {
    const products = await prisma.product.findMany({
      take: 5,
      include: { images: true },
    })
    console.log('PRODUCTS FOUND:', products.length)
    for (const p of products) {
      console.log('SKU:', p.sku)
      console.log('IMAGES:', p.images)
    }
  } catch (err) {
    console.error('PRISMA ERROR:', err)
  }
}

main().finally(() => process.exit(0))
