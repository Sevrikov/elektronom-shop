import { prisma } from '../lib/prisma'

async function main() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: { id: true, slug: true, parentId: true },
  })

  const childrenMap = new Map<string, string[]>()
  let targetId: string | null = null

  for (const cat of categories) {
    if (cat.slug === 'avtomatychni-vymykachi') {
      targetId = cat.id
    }
    if (cat.parentId) {
      const list = childrenMap.get(cat.parentId) || []
      list.push(cat.id)
      childrenMap.set(cat.parentId, list)
    }
  }

  if (!targetId) {
    console.log('Category not found')
    return
  }

  const subtreeIds: string[] = []
  const queue: string[] = [targetId]

  while (queue.length > 0) {
    const currentId = queue.shift()!
    subtreeIds.push(currentId)
    const children = childrenMap.get(currentId)
    if (children) {
      queue.push(...children)
    }
  }

  console.log('Subtree category IDs:', subtreeIds)

  const products = await prisma.product.findMany({
    where: {
      categoryId: { in: subtreeIds },
      isActive: true
    },
    take: 10,
    select: {
      id: true,
      sku: true,
      attributes: true
    }
  })

  console.log('Sample product attributes:')
  for (const p of products) {
    console.log(`- SKU: ${p.sku}, attributes:`, JSON.stringify(p.attributes))
  }
}

main()
  .catch((e) => console.error(e))
