// scripts/enrich-engineering-attributes.ts
// Derives engineering attributes (engineeringRole, ratedCurrentA, poles, curve, leakageMa,
// cores, sectionMm2, material, capacityModules, standard) for catalog products from their
// category + Ukrainian name + existing transliterated attributes, and merges them into
// Product.attributes (additive: only the keys above are written, nothing else is touched).
//
// Usage:
//   npx tsx scripts/enrich-engineering-attributes.ts --dry-run [--limit 50]
//   npx tsx scripts/enrich-engineering-attributes.ts            # apply
import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

const DRY_RUN = process.argv.includes('--dry-run')
const limitArg = process.argv.indexOf('--limit')
const LIMIT = limitArg > -1 ? Number(process.argv[limitArg + 1]) : undefined

type Role =
  | 'breaker' | 'rcd' | 'voltage_relay' | 'cable' | 'panel'
  | 'meter' | 'busbar' | 'ats' | 'terminal'

/** category slug pattern → engineering role */
const CATEGORY_ROLE_RULES: Array<{ re: RegExp; role: Role }> = [
  { re: /dyferentsialni-avtomatychni-vymykachi/, role: 'rcd' },
  { re: /avtomatychni-vymykachi-zakhystu-dvyhuna/, role: 'breaker' },
  { re: /(modulni-avtomatychni-vymykachi|avtomatychni-vymykachi-seriyi|sylovi-avtomatychni-vymykach)/, role: 'breaker' },
  { re: /(^rele-napruhy$|rele-kontrolyu-napruhy)/, role: 'voltage_relay' },
  { re: /(^kabeli-droty$|vohnestiykyy-kabel|kh-kabel-hnuchkyy)/, role: 'cable' },
  { re: /(shchytky|korpusa-metalevi-light-seriyi-ubox|korpusy-z-montazhnoyu-panellyu)/, role: 'panel' },
  { re: /lichylnyky-elektryky/, role: 'meter' },
  { re: /(shyny-nulovi|nulovi-shyny|nulova-shyna|shyna-nulova)/, role: 'busbar' },
  { re: /avr-avtomatychne-vvedennya-rezervu/, role: 'ats' },
  { re: /(^klemni-bloky$|klemy-shvydkoho-montazhu|klemni-kolodky)/, role: 'terminal' },
]

function roleForCategory(slug: string): Role | null {
  for (const rule of CATEGORY_ROLE_RULES) {
    if (rule.re.test(slug)) return rule.role
  }
  return null
}

function parseNum(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const n = parseFloat(value.replace(',', '.'))
    if (Number.isFinite(n)) return n
  }
  return undefined
}

/**
 * NOTE: JS `\b` only understands ASCII word chars, so it is useless around
 * cyrillic tokens like "2р" or "25А". We use explicit delimiter lookaheads.
 */
const END = /[^0-9A-Za-zА-Яа-яІіЇїЄє]|$/.source

/** "2р", "1p", "3Р" → "2P"; falls back to verbose forms */
function extractPoles(name: string): string | undefined {
  const m = new RegExp(`(\\d)\\s*[рРpP](?=${END})`, 'u').exec(name)
  if (m) {
    const n = Number(m[1])
    if (n >= 1 && n <= 4) return `${n}P`
  }
  if (/однополюсн/iu.test(name)) return '1P'
  if (/двополюсн/iu.test(name)) return '2P'
  if (/трипол|трьохполюсн/iu.test(name)) return '3P'
  if (/чотирипол/iu.test(name)) return '4P'
  return undefined
}

/** rated current in amperes from "…16А…", avoiding the "30мА" leakage token */
function extractCurrentA(name: string): number | undefined {
  const re = new RegExp(`(?:^|[^0-9])(\\d+(?:[.,]\\d+)?)\\s*([мm]?)[АA](?=${END})`, 'gu')
  let m: RegExpExecArray | null = re.exec(name)
  while (m) {
    if (!m[2]) {
      const n = parseFloat((m[1] ?? '').replace(',', '.'))
      if (Number.isFinite(n) && n > 0 && n <= 6300) return n
    }
    m = re.exec(name)
  }
  return undefined
}

/** trip curve B/C/D — standalone token ("16А С 6kА"), combined ("С16"), or "/C" series mark */
function extractCurve(name: string): 'B' | 'C' | 'D' | undefined {
  const CYR: Record<string, 'B' | 'C' | 'D'> = { В: 'B', С: 'C', B: 'B', C: 'C', D: 'D' }
  const standalone = /(?:^|[\s/(])([BCDВС])(?=[\s)]|$|\d)/u.exec(name)
  if (standalone && CYR[standalone[1] ?? '']) return CYR[standalone[1] ?? '']
  const tagged = /(?:х-ка|характеристика|кат\.?|тип)\s*([BCDВС])/iu.exec(name)
  if (tagged && CYR[tagged[1] ?? '']) return CYR[tagged[1] ?? '']
  return undefined
}

function extractLeakageMa(name: string): number | undefined {
  const m = /(\d+)\s*мА/iu.exec(name)
  if (m) {
    const n = Number(m[1])
    if ([6, 10, 30, 100, 300, 500].includes(n)) return n
  }
  return undefined
}

/** "3х2,5" → { cores: 3, sectionMm2: 2.5 } */
function extractCableGeometry(name: string): { cores?: number; sectionMm2?: number } {
  const m = /(\d{1,2})\s*[хx×]\s*(\d+(?:[.,]\d+)?)/iu.exec(name)
  if (!m) return {}
  const cores = Number(m[1])
  const section = parseFloat((m[2] ?? '').replace(',', '.'))
  if (cores >= 1 && cores <= 5 && section > 0 && section <= 300) {
    return { cores, sectionMm2: section }
  }
  return {}
}

/** Aluminium cable marks start with "А" (АВВГ, АПВ); copper: ВВГ, ПВ, ПВС, ШВВП, КГ */
function extractCableMaterial(name: string): 'Cu' | 'Al' | undefined {
  if (/\b(АВВГ|АПВ|АППВ|АВВ)\b/iu.test(name)) return 'Al'
  if (/\b(ВВГ|ПВ-?\d|ПВС|ШВВП|КГ|ПУГВ|ПВ3)\b/iu.test(name)) return 'Cu'
  return undefined
}

function extractModules(name: string): number | undefined {
  const m = /(\d{1,3})\s*мод/iu.exec(name)
  if (m) {
    const n = Number(m[1])
    if (n >= 1 && n <= 144) return n
  }
  return undefined
}

function extractStandard(attrs: Record<string, unknown>): string | undefined {
  const raw = attrs.vidpovidnist_standartam
  if (typeof raw === 'string' && raw.trim()) return raw.trim()
  if (Array.isArray(raw)) {
    const joined = raw.filter((v) => typeof v === 'string').join(', ').trim()
    if (joined) return joined
  }
  return undefined
}

async function main() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: {
      id: true,
      sku: true,
      attributes: true,
      category: { select: { slug: true } },
      translations: { where: { locale: 'uk' }, select: { name: true }, take: 1 },
    },
    take: 20000,
  })

  let candidates = 0
  let updated = 0
  const roleStats = new Map<string, number>()
  const samples: string[] = []

  for (const product of products) {
    const role = roleForCategory(product.category?.slug ?? '')
    if (!role) continue
    const name = product.translations[0]?.name ?? ''

    // Accessories and non-power products living inside engineering categories
    if (/додатков|аксесуар|заглушк|шильдик|расцепитель|розчіплювач|рукоятк|подовжувач полюс/iu.test(name)) continue
    if (role === 'cable' && /патч-корд|оптичн|мережев|utp|ftp|hdmi|usb|аудіо|коаксіал|телефон/iu.test(name)) continue
    if (role === 'breaker' && /контакт(?!ор)/iu.test(name)) continue

    candidates++
    if (LIMIT !== undefined && updated >= LIMIT) break

    const attrs = (product.attributes ?? {}) as Record<string, unknown>

    const derived: Record<string, unknown> = { engineeringRole: role }

    const standard = extractStandard(attrs)
    if (standard) derived.standard = standard

    if (role === 'breaker' || role === 'rcd' || role === 'voltage_relay' || role === 'ats' || role === 'meter') {
      let current = extractCurrentA(name) ?? parseNum(attrs.nominalnyy_robochyy_strum_ie_a)
      if (current === undefined && role === 'voltage_relay') {
        // ZUBR D2-50 / RKV-32 style: trailing number of the model is the amp rating
        const m = /\b[A-ZА-Я]+\d?-(\d{2,3})(?=[^0-9]|$)/u.exec(name)
        if (m) current = Number(m[1])
      }
      if (current !== undefined) derived.ratedCurrentA = current
      const poles = extractPoles(name)
      if (poles) derived.poles = poles
    }
    if (role === 'breaker') {
      const curve = extractCurve(name)
      if (curve) derived.curve = curve
    }
    if (role === 'rcd') {
      const leakage = extractLeakageMa(name)
      if (leakage !== undefined) derived.leakageMa = leakage
    }
    if (role === 'cable') {
      const geometry = extractCableGeometry(name)
      if (geometry.cores !== undefined) derived.cores = geometry.cores
      if (geometry.sectionMm2 !== undefined) derived.sectionMm2 = geometry.sectionMm2
      const material = extractCableMaterial(name)
      if (material) derived.material = material
    }
    if (role === 'panel') {
      const modules = extractModules(name)
      if (modules !== undefined) derived.capacityModules = modules
    }

    roleStats.set(role, (roleStats.get(role) ?? 0) + 1)
    if (samples.length < 30) {
      samples.push(`${product.sku} | ${name.slice(0, 70)} => ${JSON.stringify(derived)}`)
    }

    if (!DRY_RUN) {
      await prisma.product.update({
        where: { id: product.id },
        data: { attributes: { ...attrs, ...derived } },
        select: { id: true },
      })
    }
    updated++
  }

  console.log(`Mode: ${DRY_RUN ? 'DRY-RUN (no writes)' : 'APPLY'}`)
  console.log(`Scanned active products: ${products.length}`)
  console.log(`Candidates in engineering categories: ${candidates}`)
  console.log(`${DRY_RUN ? 'Would update' : 'Updated'}: ${updated}`)
  console.log('By role:', Object.fromEntries(roleStats))
  console.log('\n--- samples ---')
  for (const s of samples) console.log(s)

  await prisma.$disconnect()
}

main().catch((e) => { console.error(e); process.exit(1) })
