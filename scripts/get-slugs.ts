import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
  const products = await prisma.product.findMany({
    take: 10,
    select: {
      id: true,
      sku: true,
      slug: true
    }
  })
  console.log(JSON.stringify(products, null, 2))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
