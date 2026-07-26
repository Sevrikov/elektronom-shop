// scripts/list-engineering-categories.ts — read-only: find categories relevant to the panel calculator
import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
  const cats = await prisma.category.findMany({
    where: { isActive: true },
    select: {
      slug: true,
      translations: { where: { locale: 'uk' }, select: { name: true }, take: 1 },
      _count: { select: { products: true } },
    },
    take: 1000,
  })
  const re = /(avtomat|vymykach|pzv|uzo|dyf|dif|rele|kabel|provid|shchyt|boks|korpus|lichyl|kontaktor|klem|nakonechnyk|avdt|modul|shyn)/i
  const rows = cats
    .filter((c) => re.test(c.slug) && c._count.products > 0)
    .sort((a, b) => b._count.products - a._count.products)
  for (const c of rows) {
    console.log(`${c._count.products}\t${c.slug}\t${c.translations[0]?.name ?? ''}`)
  }
  console.log(`\nMatched categories: ${rows.length}`)
  await prisma.$disconnect()
}

main().catch((e) => { console.error(e); process.exit(1) })
