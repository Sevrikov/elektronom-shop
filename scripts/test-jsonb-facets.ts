// scripts/test-jsonb-facets.ts
import dotenv from 'dotenv'
dotenv.config()

import { prisma } from '../src/lib/prisma'

// Mock Next.js 16 cache functions for raw script execution context
;(global as any).cacheLife = () => {}
;(global as any).cacheTag = () => {}

import { getCategoryFacets } from '../src/queries/categories'
import { getFilteredProducts } from '../src/queries/products'

async function runTest() {
  console.log('🚀 Starting JSONB Facets Integration Test...')

  const testCategorySlug = 'test-jsonb-category'
  const testBrandSlug = 'test-brand'

  // Clean up any stale test data first
  await cleanup(testCategorySlug, testBrandSlug)

  console.log('📦 Seeding test Brand and Category...')
  const brand = await prisma.brand.create({
    data: {
      slug: testBrandSlug,
      name: 'Test Brand',
      logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aba9', // generic fallback logo
    },
  })

  const category = await prisma.category.create({
    data: {
      slug: testCategorySlug,
      translations: {
        create: {
          locale: 'uk',
          name: 'Тестова Категорія',
        },
      },
    },
  })

  console.log('📦 Seeding test Products with string/number/boolean/array attributes...')

  // Product 1: wifi=true (boolean), poles=2 (number), standards=["ip20", "din"] (array)
  const p1 = await prisma.product.create({
    data: {
      slug: 'test-product-1',
      sku: 'test-sku-1',
      categoryId: category.id,
      brandId: brand.id,
      price: 100.0,
      stock: 10,
      isActive: true,
      attributes: {
        poles: 2,
        wifi: true,
        standards: ['ip20', 'din'],
      },
      translations: {
        create: {
          locale: 'uk',
          name: 'Тестовий товар 1',
        },
      },
    },
  })

  // Product 2: wifi=false (boolean), poles=4 (number), standards=["ip44"] (array)
  const p2 = await prisma.product.create({
    data: {
      slug: 'test-product-2',
      sku: 'test-sku-2',
      categoryId: category.id,
      brandId: brand.id,
      price: 200.0,
      stock: 5,
      isActive: true,
      attributes: {
        poles: 4,
        wifi: false,
        standards: ['ip44'],
      },
      translations: {
        create: {
          locale: 'uk',
          name: 'Тестовий товар 2',
        },
      },
    },
  })

  // Product 3: wifi=true (boolean), poles=2 (number), standards=["ip20"] (array), stock=0 (out of stock)
  const p3 = await prisma.product.create({
    data: {
      slug: 'test-product-3',
      sku: 'test-sku-3',
      categoryId: category.id,
      brandId: brand.id,
      price: 300.0,
      stock: 0,
      isActive: true,
      attributes: {
        poles: 2,
        wifi: true,
        standards: ['ip20'],
      },
      translations: {
        create: {
          locale: 'uk',
          name: 'Тестовий товар 3',
        },
      },
    },
  })

  let passed = true

  try {
    // ----------------------------------------------------
    // Test 1: Get facets with no active filters (total count, price ranges, attributes)
    // ----------------------------------------------------
    console.log('\n🔍 Running Test 1: Empty filters (absolute limits & initial counts)...')
    const facetsEmpty = await getCategoryFacets({
      categorySlug: testCategorySlug,
      activeFilters: {},
      locale: 'uk',
    })

    console.log(`- Total count: ${facetsEmpty.total} (expected 3)`)
    if (facetsEmpty.total !== 3) {
      console.error(`❌ FAIL: Expected total facets to be 3, got ${facetsEmpty.total}`)
      passed = false
    }

    // Check poles attribute options
    const polesEmpty = facetsEmpty.attributes['poles'] || []
    console.log('- Poles options empty:', JSON.stringify(polesEmpty))
    const optionPoles2 = polesEmpty.find((o) => o.value === '2')
    const optionPoles4 = polesEmpty.find((o) => o.value === '4')

    if (!optionPoles2 || optionPoles2.count !== 2) {
      console.error(`❌ FAIL: Expected poles=2 count to be 2, got ${optionPoles2?.count}`)
      passed = false
    }
    if (!optionPoles4 || optionPoles4.count !== 1) {
      console.error(`❌ FAIL: Expected poles=4 count to be 1, got ${optionPoles4?.count}`)
      passed = false
    }

    // Check wifi attribute options
    const wifiEmpty = facetsEmpty.attributes['wifi'] || []
    console.log('- Wifi options empty:', JSON.stringify(wifiEmpty))
    const optionWifiTrue = wifiEmpty.find((o) => o.value === 'true')
    const optionWifiFalse = wifiEmpty.find((o) => o.value === 'false')

    if (!optionWifiTrue || optionWifiTrue.count !== 2) {
      console.error(`❌ FAIL: Expected wifi=true count to be 2, got ${optionWifiTrue?.count}`)
      passed = false
    }
    if (!optionWifiFalse || optionWifiFalse.count !== 1) {
      console.error(`❌ FAIL: Expected wifi=false count to be 1, got ${optionWifiFalse?.count}`)
      passed = false
    }

    // Check standards attribute options (array checks)
    const standardsEmpty = facetsEmpty.attributes['standards'] || []
    console.log('- Standards options empty:', JSON.stringify(standardsEmpty))
    const optionStdIp20 = standardsEmpty.find((o) => o.value === 'ip20')
    const optionStdDin = standardsEmpty.find((o) => o.value === 'din')
    const optionStdIp44 = standardsEmpty.find((o) => o.value === 'ip44')

    if (!optionStdIp20 || optionStdIp20.count !== 2) {
      console.error(`❌ FAIL: Expected standards=ip20 count to be 2, got ${optionStdIp20?.count}`)
      passed = false
    }
    if (!optionStdDin || optionStdDin.count !== 1) {
      console.error(`❌ FAIL: Expected standards=din count to be 1, got ${optionStdDin?.count}`)
      passed = false
    }
    if (!optionStdIp44 || optionStdIp44.count !== 1) {
      console.error(`❌ FAIL: Expected standards=ip44 count to be 1, got ${optionStdIp44?.count}`)
      passed = false
    }

    // ----------------------------------------------------
    // Test 2: Filter products on number attribute
    // ----------------------------------------------------
    console.log('\n🔍 Running Test 2: Filtering on dynamic number attribute [poles=2]...')
    const filteredPoles2 = await getFilteredProducts({
      categorySlug: testCategorySlug,
      activeFilters: { poles: ['2'] },
      locale: 'uk',
    })

    console.log(`- Products count: ${filteredPoles2.products.length} (expected 2)`)
    if (filteredPoles2.products.length !== 2) {
      console.error(`❌ FAIL: Expected 2 products with poles=2, got ${filteredPoles2.products.length}`)
      passed = false
    }
    const hasP1 = filteredPoles2.products.some((p) => p.slug === 'test-product-1')
    const hasP3 = filteredPoles2.products.some((p) => p.slug === 'test-product-3')
    if (!hasP1 || !hasP3) {
      console.error(`❌ FAIL: Expected products list to contain test-product-1 and test-product-3`)
      passed = false
    } else {
      console.log('✅ PASS: poles=2 successfully returned correct products')
    }

    // ----------------------------------------------------
    // Test 3: Filter products on boolean attribute
    // ----------------------------------------------------
    console.log('\n🔍 Running Test 3: Filtering on dynamic boolean attribute [wifi=true]...')
    const filteredWifiTrue = await getFilteredProducts({
      categorySlug: testCategorySlug,
      activeFilters: { wifi: ['true'] },
      locale: 'uk',
    })

    console.log(`- Products count: ${filteredWifiTrue.products.length} (expected 2)`)
    if (filteredWifiTrue.products.length !== 2) {
      console.error(`❌ FAIL: Expected 2 products with wifi=true, got ${filteredWifiTrue.products.length}`)
      passed = false
    }
    const hasP1Wifi = filteredWifiTrue.products.some((p) => p.slug === 'test-product-1')
    const hasP3Wifi = filteredWifiTrue.products.some((p) => p.slug === 'test-product-3')
    if (!hasP1Wifi || !hasP3Wifi) {
      console.error(`❌ FAIL: Expected products list to contain test-product-1 and test-product-3 for wifi=true`)
      passed = false
    } else {
      console.log('✅ PASS: wifi=true successfully returned correct products')
    }

    // ----------------------------------------------------
    // Test 4: Filter products on array item match
    // ----------------------------------------------------
    console.log('\n🔍 Running Test 4: Filtering on dynamic array-item attribute [standards=din]...')
    const filteredDin = await getFilteredProducts({
      categorySlug: testCategorySlug,
      activeFilters: { standards: ['din'] },
      locale: 'uk',
    })

    console.log(`- Products count: ${filteredDin.products.length} (expected 1)`)
    if (filteredDin.products.length !== 1) {
      console.error(`❌ FAIL: Expected 1 product with standards=din, got ${filteredDin.products.length}`)
      passed = false
    }
    if (filteredDin.products[0]?.slug !== 'test-product-1') {
      console.error(`❌ FAIL: Expected product with standards=din to be test-product-1, got ${filteredDin.products[0]?.slug}`)
      passed = false
    } else {
      console.log('✅ PASS: standards=din successfully returned correct products')
    }

    // ----------------------------------------------------
    // Test 5: Verify reactive facets with multi-filters and inStock exclusion
    // ----------------------------------------------------
    console.log('\n🔍 Running Test 5: Check inStock filter reaction on counts...')
    const facetsInStock = await getCategoryFacets({
      categorySlug: testCategorySlug,
      activeFilters: { inStock: true },
      locale: 'uk',
    })

    // Product 3 is out of stock (stock: 0), so it should be excluded. Product 1 and 2 are in stock.
    // So poles=2 count should drop to 1 (since Product 3 is excluded)
    const polesInStock = facetsInStock.attributes['poles'] || []
    const countPoles2InStock = polesInStock.find((o) => o.value === '2')?.count
    const countPoles4InStock = polesInStock.find((o) => o.value === '4')?.count

    console.log(`- In stock - poles=2 count: ${countPoles2InStock} (expected 1)`)
    console.log(`- In stock - poles=4 count: ${countPoles4InStock} (expected 1)`)

    if (countPoles2InStock !== 1) {
      console.error(`❌ FAIL: Expected poles=2 count to drop to 1 when inStock=true, got ${countPoles2InStock}`)
      passed = false
    }
    if (countPoles4InStock !== 1) {
      console.error(`❌ FAIL: Expected poles=4 count to be 1 when inStock=true, got ${countPoles4InStock}`)
      passed = false
    } else {
      console.log('✅ PASS: inStock filters reactive count update works correctly')
    }

  } catch (err) {
    console.error('❌ CRITICAL ERROR DURING TEST EXECUTION:', err)
    passed = false
  } finally {
    console.log('\n🧹 Cleaning up test data...')
    await cleanup(testCategorySlug, testBrandSlug)
  }

  if (passed) {
    console.log('\n🎉 ALL JSONB INTEGRATION TESTS PASSED SUCCESSFULY!')
    process.exit(0)
  } else {
    console.error('\n🔴 ONE OR MORE INTEGRATION TEST VERIFICATIONS FAILED.')
    process.exit(1)
  }
}

async function cleanup(categorySlug: string, brandSlug: string) {
  // Delete products
  await prisma.product.deleteMany({
    where: {
      category: { slug: categorySlug },
    },
  })

  // Delete category translation
  await prisma.categoryTranslation.deleteMany({
    where: {
      category: { slug: categorySlug },
    },
  })

  // Delete category
  await prisma.category.deleteMany({
    where: {
      slug: categorySlug,
    },
  })

  // Delete brand
  await prisma.brand.deleteMany({
    where: {
      slug: brandSlug,
    },
  })
}

runTest()
