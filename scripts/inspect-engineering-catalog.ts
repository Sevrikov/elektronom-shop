// scripts/inspect-engineering-catalog.ts — read-only diagnostic of catalog readiness for engineering binding
import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
  const total = await prisma.product.count({ where: { isActive: true } })

  const sample = await prisma.product.findMany({
    where: { isActive: true },
    select: {
      id: true, sku: true, slug: true, price: true, stock: true, attributes: true,
      category: { select: { slug: true } },
      translations: { where: { locale: 'uk' }, select: { name: true }, take: 1 },
    },
    take: 400,
  })

  let withRole = 0
  const roleCounts = new Map<string, number>()
  const categoryCounts = new Map<string, number>()
  const attributeKeys = new Map<string, number>()

  for (const p of sample) {
    const attrs = (p.attributes ?? {}) as Record<string, unknown>
    for (const key of Object.keys(attrs)) {
      attributeKeys.set(key, (attributeKeys.get(key) ?? 0) + 1)
    }
    const role = attrs.engineeringRole
    if (typeof role === 'string' && role.trim()) {
      withRole++
      roleCounts.set(role, (roleCounts.get(role) ?? 0) + 1)
    }
    const cat = p.category?.slug ?? '(none)'
    categoryCounts.set(cat, (categoryCounts.get(cat) ?? 0) + 1)
  }

  console.log(`Active products total: ${total}, sampled: ${sample.length}`)
  console.log(`With attributes.engineeringRole: ${withRole}`)
  console.log('Roles:', Object.fromEntries(roleCounts))
  console.log('Top attribute keys:', [...attributeKeys.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25))
  console.log('Categories:', [...categoryCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25))

  console.log('\n--- 12 sample products ---')
  for (const p of sample.slice(0, 12)) {
    console.log(JSON.stringify({
      sku: p.sku,
      name: p.translations[0]?.name,
      category: p.category?.slug,
      price: String(p.price),
      stock: p.stock,
      attributes: p.attributes,
    }))
  }

  await prisma.$disconnect()
}

main().catch((e) => { console.error(e); process.exit(1) })
