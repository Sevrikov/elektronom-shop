// scripts/test-helpers.ts
import { localizedPath, getSiteUrl } from '../src/lib/utils'

console.log('Running helper tests...')

// Test localizedPath
const testCases = [
  { locale: 'uk', path: '/', expected: '/uk' },
  { locale: 'uk', path: '/catalog', expected: '/uk/catalog' },
  { locale: 'uk', path: '/uk', expected: '/uk' },
  { locale: 'uk', path: '/uk/catalog', expected: '/uk/catalog' },
  { locale: 'uk', path: '/ru/catalog', expected: '/uk/catalog' },
  { locale: 'uk', path: 'catalog', expected: '/uk/catalog' },
  { locale: 'uk', path: '//uk//catalog', expected: '/uk/catalog' },
]

let passed = true
for (const tc of testCases) {
  const result = localizedPath(tc.locale, tc.path)
  if (result !== tc.expected) {
    console.error(`FAIL: localizedPath('${tc.locale}', '${tc.path}') => '${result}', expected '${tc.expected}'`)
    passed = false
  } else {
    console.log(`PASS: localizedPath('${tc.locale}', '${tc.path}') => '${result}'`)
  }
}

// Test getSiteUrl
const originalEnv = process.env.NEXT_PUBLIC_SITE_URL
const originalNodeEnv = process.env.NODE_ENV
const originalVercel = process.env.VERCEL
const originalVercelUrl = process.env.VERCEL_URL

try {
  process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000'
  process.env.NODE_ENV = 'production'
  process.env.VERCEL = '1'
  process.env.VERCEL_URL = 'elektronom.vercel.app'

  const siteUrl = getSiteUrl()
  const expectedUrl = 'https://elektronom.vercel.app'
  if (siteUrl !== expectedUrl) {
    console.error(`FAIL: getSiteUrl() in Vercel production => '${siteUrl}', expected '${expectedUrl}'`)
    passed = false
  } else {
    console.log(`PASS: getSiteUrl() in Vercel production => '${siteUrl}'`)
  }
} finally {
  process.env.NEXT_PUBLIC_SITE_URL = originalEnv
  process.env.NODE_ENV = originalNodeEnv
  process.env.VERCEL = originalVercel
  process.env.VERCEL_URL = originalVercelUrl
}

if (!passed) {
  process.exit(1)
} else {
  console.log('All tests passed successfully!')
}
