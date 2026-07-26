// scripts/test-catalog-binding.ts
// End-to-end check: enriched DB products → engineering catalog → BOM auto-matching for the default calculator graph.
import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { buildEngineeringGraph, defaultEngineeringInput, buildLoads } from '../src/lib/engineering/calculators'
import { computeBOMAndTotals } from '../src/lib/engineering/bom'
import { passesQualityGate, findCompatibleProductsForNode } from '../src/lib/engineering/catalog-binding'
import type { EngineeringCatalogProduct } from '../src/lib/engineering/types'

let passed = true
function assert(condition: boolean, message: string) {
  if (!condition) { console.error(`FAIL: ${message}`); passed = false }
  else console.log(`PASS: ${message}`)
}

async function loadCatalog(): Promise<EngineeringCatalogProduct[]> {
  // Same shape as getEngineeringCatalogProducts but without 'use cache' (plain script)
  const roleFilter = ['breaker', 'rcd', 'voltage_relay', 'cable', 'panel', 'meter', 'busbar', 'ats', 'terminal']
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: roleFilter.map((role) => ({ attributes: { path: ['engineeringRole'], equals: role } })),
    },
    select: {
      id: true, slug: true, sku: true, price: true, stock: true, attributes: true,
      translations: { where: { locale: 'uk' }, select: { name: true }, take: 1 },
      brand: { select: { name: true } },
      category: { select: { slug: true } },
      images: { select: { url: true }, orderBy: { sortOrder: 'asc' }, take: 1 },
    },
    orderBy: [{ stock: 'desc' }, { sortOrder: 'asc' }],
    take: 600,
  })
  return products.map((p) => ({
    id: p.id, slug: p.slug, sku: p.sku,
    name: p.translations[0]?.name ?? p.slug,
    price: Number(p.price), stock: p.stock,
    categorySlug: p.category.slug,
    brandName: p.brand?.name ?? null,
    imageUrl: p.images[0]?.url ?? null,
    attributes: (p.attributes as Record<string, unknown>) ?? {},
  }))
}

async function main() {
  const catalog = await loadCatalog()
  console.log(`Catalog products with engineeringRole: ${catalog.length}`)
  assert(catalog.length >= 300, 'At least 300 enriched products fetched')

  // Quality gate stats
  const gateFails = new Map<string, number>()
  let gatePassed = 0
  for (const p of catalog) {
    const gate = passesQualityGate(p)
    if (gate.passes) gatePassed++
    else for (const r of gate.reasons) gateFails.set(r, (gateFails.get(r) ?? 0) + 1)
  }
  console.log(`Quality gate passed: ${gatePassed}/${catalog.length}`)
  console.log('Gate fail reasons:', Object.fromEntries(gateFails))

  // Default calculator graph (the one users see on /calculators)
  const input = { ...defaultEngineeringInput, loads: buildLoads(defaultEngineeringInput) }
  const graph = buildEngineeringGraph(input, 'uk')
  const { bom, totals } = computeBOMAndTotals(graph, catalog)

  const matched = bom.filter((item) => !item.missing)
  const missing = bom.filter((item) => item.missing)
  console.log(`\nBOM items: ${bom.length}, matched: ${matched.length}, missing: ${missing.length}`)
  console.log(`Estimated cost: ${totals.estimatedCost} грн`)
  for (const item of bom) {
    console.log(`  [${item.missing ? 'MISS' : ' OK '}] ${item.role.padEnd(13)} ${item.name.slice(0, 60)} x${item.qty} = ${item.total} грн`)
  }

  assert(matched.length > 0, 'At least one BOM item auto-matched to a real product')
  assert(bom.filter((i) => i.role === 'breaker' && !i.missing).length > 0, 'Breakers matched to real products')
  assert(totals.estimatedCost > 0, 'Estimated cost is non-zero')

  // Role guard: a busbar node must never match a breaker product
  const busbarMatches = findCompatibleProductsForNode(
    { id: 'bus-test', type: 'busbar_n', label: 'N bus', properties: {} },
    catalog,
  )
  const wrongRole = busbarMatches.filter((m) => (m.product.attributes.engineeringRole as string) !== 'busbar')
  assert(wrongRole.length === 0, `busbar_n matches only busbar products (${busbarMatches.length} matches, ${wrongRole.length} wrong-role)`)

  await prisma.$disconnect()
  console.log(`\nCatalog binding tests done. All passed: ${passed}`)
  process.exit(passed ? 0 : 1)
}

main().catch((e) => { console.error(e); process.exit(1) })
