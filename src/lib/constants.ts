import type { ContactInfo, NavLink } from '@/types'

export const contactInfo: ContactInfo = {
  phone: '+380 50 123-45-67',
  viber: '+380672206791',
  email: 'info@elektronom.com.ua',
  address: {
    uk: 'м. Київ, вул. Промислова 12',
    ru: 'г. Киев, ул. Промышленная 12',
  },
  workingHours: {
    uk: '7:00 - 19:00 (ПН - СБ)',
    ru: '7:00 - 19:00 (ПН - СБ)',
  },
}

export const contactPhones = [
  '+380 50 123-45-67',
  '+380 67 123-45-67',
]

export const navLinks: NavLink[] = [
  { label: { uk: 'Каталог', ru: 'Каталог' }, href: '/catalog' },
  { label: { uk: 'Акції', ru: 'Акции' }, href: '/promotions' },
  { label: { uk: 'Доставка і оплата', ru: 'Доставка и оплата' }, href: '/delivery' },
  { label: { uk: 'Про нас', ru: 'О нас' }, href: '/about' },
  { label: { uk: 'Контакти', ru: 'Контакты' }, href: '/contacts' },
]

/** Concept 6 v2 sidebar categories with Lucide icon names */
export interface SidebarCategory {
  id: string
  slug: string
  name: { uk: string; ru: string }
  icon: string
  count: number
}

export const sidebarCategories: SidebarCategory[] = [
  { id: 'breakers', slug: 'avtomatychni-vymykachi', name: { uk: 'Автоматичні вимикачі', ru: 'Автоматические выключатели' }, icon: 'zap', count: 1240 },
  { id: 'sockets', slug: 'rozetky-ta-vymykachi', name: { uk: 'Розетки та вимикачі', ru: 'Розетки и выключатели' }, icon: 'plug', count: 890 },
  { id: 'cables', slug: 'kabel-ta-provid', name: { uk: 'Кабель та провід', ru: 'Кабель и провод' }, icon: 'cable', count: 1850 },
  { id: 'led', slug: 'osvitlennya-led', name: { uk: 'Освітлення LED', ru: 'Освещение LED' }, icon: 'lightbulb', count: 3200 },
  { id: 'starters', slug: 'puskova-aparatura', name: { uk: 'Пускова апаратура', ru: 'Пусковая аппаратура' }, icon: 'power', count: 560 },
  { id: 'panels', slug: 'shchyty-elektrychni', name: { uk: 'Щити електричні', ru: 'Щиты электрические' }, icon: 'server', count: 380 },
  { id: 'hand-tools', slug: 'instrument-ruchnyy', name: { uk: 'Інструмент ручний', ru: 'Инструмент ручной' }, icon: 'wrench', count: 720 },
  { id: 'power-tools', slug: 'instrument-elektrychnyy', name: { uk: 'Інструмент електричний', ru: 'Инструмент электрический' }, icon: 'drill', count: 640 },
  { id: 'meters', slug: 'vymiryuvalni-prylady', name: { uk: 'Вимірювальні прилади', ru: 'Измерительные приборы' }, icon: 'gauge', count: 310 },
  { id: 'counters', slug: 'lichylnyky', name: { uk: 'Лічильники', ru: 'Счётчики' }, icon: 'activity', count: 180 },
  { id: 'rcd', slug: 'pzv-ta-dyf-avtomaty', name: { uk: 'ПЗВ та диф-автомати', ru: 'УЗО и диф-автоматы' }, icon: 'shield', count: 290 },
  { id: 'grounding', slug: 'zazemlennya', name: { uk: 'Заземлення', ru: 'Заземление' }, icon: 'link-2', count: 160 },
  { id: 'cable-channel', slug: 'kabel-kanal', name: { uk: 'Кабель-канал', ru: 'Кабель-канал' }, icon: 'square', count: 220 },
  { id: 'fuses', slug: 'zapobizhnyky', name: { uk: 'Запобіжники', ru: 'Предохранители' }, icon: 'circle', count: 340 },
  { id: 'contactors', slug: 'kontaktory', name: { uk: 'Контактори', ru: 'Контакторы' }, icon: 'toggle-right', count: 270 },
  { id: 'relays', slug: 'rele', name: { uk: 'Реле', ru: 'Реле' }, icon: 'repeat', count: 480 },
  { id: 'transformers', slug: 'transformatory', name: { uk: 'Трансформатори', ru: 'Трансформаторы' }, icon: 'box', count: 190 },
  { id: 'extensions', slug: 'podovzhuvachi', name: { uk: 'Подовжувачі', ru: 'Удлинители' }, icon: 'cable', count: 210 },
  { id: 'smart-home', slug: 'rozumnyy-dim', name: { uk: 'Розумний дім', ru: 'Умный дом' }, icon: 'house', count: 380 },
  { id: 'automation', slug: 'avtomatyka', name: { uk: 'Автоматика', ru: 'Автоматика' }, icon: 'cpu', count: 240 },
  { id: 'alarm', slug: 'sygnalizatsiya', name: { uk: 'Сигналізація', ru: 'Сигнализация' }, icon: 'bell', count: 170 },
  { id: 'cctv', slug: 'videosposterezhennya', name: { uk: 'Відеоспостереження', ru: 'Видеонаблюдение' }, icon: 'video', count: 290 },
  { id: 'welding', slug: 'zvaryuvalne-obladnannya', name: { uk: 'Зварювальне обладнання', ru: 'Сварочное оборудование' }, icon: 'flame', count: 140 },
  { id: 'motors', slug: 'elektrodvyguny', name: { uk: 'Електродвигуни', ru: 'Электродвигатели' }, icon: 'cog', count: 110 },
  { id: 'pumps', slug: 'nasosy', name: { uk: 'Насоси', ru: 'Насосы' }, icon: 'droplet', count: 160 },
  { id: 'ventilation', slug: 'ventylyatsiya', name: { uk: 'Вентиляція', ru: 'Вентиляция' }, icon: 'wind', count: 220 },
  { id: 'heaters', slug: 'obigrivachi', name: { uk: 'Обігрівачі', ru: 'Обогреватели' }, icon: 'thermometer', count: 180 },
  { id: 'stabilizers', slug: 'stabilizatory', name: { uk: 'Стабілізатори', ru: 'Стабилизаторы' }, icon: 'trending-up', count: 90 },
  { id: 'ups', slug: 'dbzh', name: { uk: 'ДБЖ', ru: 'ИБП' }, icon: 'battery-charging', count: 140 },
  { id: 'batteries', slug: 'akumulyatory', name: { uk: 'Акумулятори', ru: 'Аккумуляторы' }, icon: 'battery', count: 220 },
]

/** Demo products for Concept 6 v2 */
export interface DemoProduct {
  id: string
  brand: string
  name: { uk: string; ru: string }
  sku: string
  price: number
  icon: string
  qtyBreak: { uk: string; ru: string }
}

export const topSalesProducts: DemoProduct[] = [
  { id: '1', brand: 'ABB', name: { uk: 'Автоматичний вимикач ABB SH202-C16 2P 16A', ru: 'Автоматический выключатель ABB SH202-C16 2P 16A' }, sku: '2CDS212001R0164', price: 412, icon: 'zap', qtyBreak: { uk: 'від 10 шт −6%', ru: 'от 10 шт −6%' } },
  { id: '2', brand: 'SCHNEIDER', name: { uk: 'Кабель ВВГнг-LS 3×2.5 мм² 100м', ru: 'Кабель ВВГнг-LS 3×2.5 мм² 100м' }, sku: 'ODS-VVG-325-100', price: 3240, icon: 'cable', qtyBreak: { uk: 'від 5 шт −8%', ru: 'от 5 шт −8%' } },
  { id: '3', brand: 'LEGRAND', name: { uk: 'Розетка Legrand Valena Life біла', ru: 'Розетка Legrand Valena Life белая' }, sku: '752820', price: 186, icon: 'plug', qtyBreak: { uk: 'від 20 шт −12%', ru: 'от 20 шт −12%' } },
  { id: '4', brand: 'PHILIPS', name: { uk: 'LED-панель Philips 40W 6500K', ru: 'LED-панель Philips 40W 6500K' }, sku: 'PHL-LP40-65K', price: 1280, icon: 'lightbulb', qtyBreak: { uk: 'від 10 шт −10%', ru: 'от 10 шт −10%' } },
  { id: '5', brand: 'BOSCH', name: { uk: 'Дриль-шуруповерт Bosch GSB 120', ru: 'Дрель-шуруповёрт Bosch GSB 120' }, sku: '06019G8120', price: 3980, icon: 'drill', qtyBreak: { uk: 'від 5 шт −5%', ru: 'от 5 шт −5%' } },
  { id: '6', brand: 'HAGER', name: { uk: 'Щит Hager Volta VA18CN 18 модулів', ru: 'Щит Hager Volta VA18CN 18 модулей' }, sku: 'VA18CN', price: 2140, icon: 'server', qtyBreak: { uk: 'від 5 шт −7%', ru: 'от 5 шт −7%' } },
]

export const newArrivalProducts: DemoProduct[] = [
  { id: '7', brand: 'EATON', name: { uk: 'ПЗВ Eaton PF6-25/2/003 25A 30мА', ru: 'УЗО Eaton PF6-25/2/003 25A 30мА' }, sku: '286499', price: 1480, icon: 'shield', qtyBreak: { uk: 'від 5 шт −7%', ru: 'от 5 шт −7%' } },
  { id: '8', brand: 'WERKEL', name: { uk: 'Розумний вимикач Werkel WL01-SW-2G Wi-Fi', ru: 'Умный выключатель Werkel WL01-SW-2G Wi-Fi' }, sku: 'WL01-SW-2G', price: 2380, icon: 'house', qtyBreak: { uk: 'від 10 шт −8%', ru: 'от 10 шт −8%' } },
  { id: '9', brand: 'DEWALT', name: { uk: 'Набір ключів DeWALT DWMT81534 24 шт', ru: 'Набор ключей DeWALT DWMT81534 24 шт' }, sku: 'DWMT81534', price: 4620, icon: 'wrench', qtyBreak: { uk: 'від 3 шт −5%', ru: 'от 3 шт −5%' } },
  { id: '10', brand: 'IEK', name: { uk: 'LED-світильник IEK ДПО 2001 18W IP54', ru: 'LED-светильник IEK ДПО 2001 18W IP54' }, sku: 'LDPO0-2001-18-65-K01', price: 412, icon: 'lightbulb', qtyBreak: { uk: 'від 20 шт −14%', ru: 'от 20 шт −14%' } },
  { id: '11', brand: 'MAKITA', name: { uk: 'Перфоратор Makita HR2470 780W SDS-Plus', ru: 'Перфоратор Makita HR2470 780W SDS-Plus' }, sku: 'HR2470', price: 5240, icon: 'drill', qtyBreak: { uk: 'від 3 шт −6%', ru: 'от 3 шт −6%' } },
  { id: '12', brand: 'SCHNEIDER', name: { uk: 'Контактор Schneider LC1D09M7 9A 220V', ru: 'Контактор Schneider LC1D09M7 9A 220V' }, sku: 'LC1D09M7', price: 980, icon: 'cpu', qtyBreak: { uk: 'від 10 шт −9%', ru: 'от 10 шт −9%' } },
]

export const trustBrands = [
  'SCHNEIDER ELECTRIC', 'ABB', 'LEGRAND', 'BOSCH',
  'MAKITA', 'DeWALT', 'HAGER', 'IEK', 'EATON', 'WERKEL',
]

export const paymentMethods = ['VISA', 'MASTERCARD', 'ПРИВАТ24', 'МОНО', 'НОВА ПОШТА', 'УКРПОШТА']
