// src/lib/articles.ts
// База полезных статей (Блог) для интеграции в категории и товары
// MASTER_CONTEXT v1.2 §12

export interface Article {
  slug: string
  title: { uk: string; ru: string }
  summary: { uk: string; ru: string }
  image: string
  readTime: { uk: string; ru: string }
  date: string
  dateModified?: string
  type?: 'BlogPosting' | 'TechArticle'
  categoryKeywords: string[]
  productKeywords: string[]
}

export const articles: Article[] = [
  {
    slug: 'yak-obraty-avtomatychy-vymykach',
    title: {
      uk: 'Як правильно вибрати автоматичний вимикач для будинку',
      ru: 'Как правильно выбрать автоматический выключатель для дома'
    },
    summary: {
      uk: 'Детальний посібник з підбору номіналу, класу відключення та виробника автоматичного вимикача.',
      ru: 'Подробное руководство по подбору номинала, класса отключения и производителя автоматического выключателя.'
    },
    image: 'https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&w=600&q=80',
    readTime: { uk: '6 хв', ru: '6 мин' },
    date: '2026-05-10',
    categoryKeywords: ['avtomatyka', 'elektrika', 'electrika', 'schyty-elektrychni'],
    productKeywords: ['avtomat', 'vymykach', 'sh202', 'hager', 'abb', 'eaton', 'schneider']
  },
  {
    slug: 'rozrahunok-peretinu-kabelyu',
    title: {
      uk: 'Розрахунок перетину кабелю по потужності та струму',
      ru: 'Расчет сечения кабеля по мощности и току'
    },
    summary: {
      uk: 'Таблиці розрахунку для мідних та алюмінієвих дротів. Як уникнути перегріву проводки.',
      ru: 'Таблицы расчета для медных и алюминиевых проводов. Как избежать перегрева проводки.'
    },
    image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=600&q=80',
    readTime: { uk: '8 хв', ru: '8 мин' },
    date: '2026-05-14',
    categoryKeywords: ['kabel-ta-provid', 'elektrika', 'electrika'],
    productKeywords: ['vvg', 'kabel', 'provid', 'провод', 'кабель', 'ввг']
  },
  {
    slug: 'vybir-led-osvitlennya',
    title: {
      uk: 'Вибір LED освітлення: колірна температура та світловий потік',
      ru: 'Выбор LED освещения: цветовая температура и световой поток'
    },
    summary: {
      uk: 'Як підібрати світлодіодні панелі та лампи для дому та офісу. Секрети комфортного світла.',
      ru: 'Как подобрать светодиодные панели и лампы для дома и офиса. Секреты комфортного света.'
    },
    image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=600&q=80',
    readTime: { uk: '5 хв', ru: '5 мин' },
    date: '2026-05-18',
    categoryKeywords: ['osvitlennya-led', 'lighting'],
    productKeywords: ['led', 'panel', 'світильник', 'светодиод', 'philips', 'iek']
  },
  {
    slug: 'dzherela-bezperebiynogo-zhivlennya-routera',
    title: {
      uk: 'ДБЖ для роутера та котла опалення: що потрібно знати',
      ru: 'ИБП для роутера и котла отопления: что нужно знать'
    },
    summary: {
      uk: 'Розрахунок ємності акумулятора LiFePO4 та потужності інвертора для тривалої автономної роботи.',
      ru: 'Расчет емкости аккумулятора LiFePO4 и мощности инвертора для длительной автономной работы.'
    },
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    readTime: { uk: '7 хв', ru: '7 мин' },
    date: '2026-05-22',
    categoryKeywords: ['dbzh', 'akumulyatory', 'rozumnyy-dim', 'heaters', 'stabilizatory'],
    productKeywords: ['lifepo4', 'trinix', 'ats', 'kraft', 'акумулятор', 'аккумулятор', 'бп', 'дбж', 'ибп']
  },
  {
    slug: 'vybir-ruchnogo-ta-electroi-nstrumentu',
    title: {
      uk: 'Професійний інструмент: огляд та правила безпечного вибору',
      ru: 'Профессиональный инструмент: обзор и правила безопасного выбора'
    },
    summary: {
      uk: 'Порівняння брендів Bosch, Makita та DeWALT. На що звертати увагу при купівлі перфоратора чи дриля.',
      ru: 'Сравнение брендов Bosch, Makita и DeWALT. На что обращать внимание при покупке перфоратора или дрели.'
    },
    image: 'https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?auto=format&fit=crop&w=600&q=80',
    readTime: { uk: '6 хв', ru: '6 мин' },
    date: '2026-05-25',
    categoryKeywords: ['instrumenty', 'instrument-ruchnyy', 'instrument-elektrychnyy'],
    productKeywords: ['bosch', 'makita', 'dewalt', 'dryl', 'shurupovert', 'дрель', 'ключ', 'перфоратор']
  }
]

/**
 * Получить статьи, подходящие для конкретной категории (по slug)
 */
export function getArticlesForCategory(categorySlug: string): Article[] {
  const normalized = categorySlug.toLowerCase()
  // Фильтруем статьи, у которых хотя бы один ключевой тег категории совпадает с текущим slug
  const matched = articles.filter(art =>
    art.categoryKeywords.some(keyword => normalized.includes(keyword) || keyword.includes(normalized))
  )
  // Если подходящих статей нет, возвращаем первые 2 общие статьи
  return matched.length > 0 ? matched : articles.slice(0, 2)
}

/**
 * Получить статьи, подходящие для конкретного товара (по названию или SKU)
 */
export function getArticlesForProduct(productName: string, productSku: string): Article[] {
  const normName = productName.toLowerCase()
  const normSku = productSku.toLowerCase()
  
  const matched = articles.filter(art =>
    art.productKeywords.some(keyword => 
      normName.includes(keyword) || 
      normSku.includes(keyword) || 
      keyword.includes(normName)
    )
  )
  // Если подходящих нет, возвращаем статьи по категории или просто последние 2 статьи
  return matched.length > 0 ? matched : articles.slice(0, 2)
}
