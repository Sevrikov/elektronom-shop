import type { Locale } from "@/types";

export interface CatalogNode {
  id: string;
  slug: string;
  name: Record<Locale, string>;
  image?: string;
  productCount?: number;
  children?: CatalogNode[];
}

export const catalogTree: CatalogNode[] = [
  {
    id: "electricity",
    slug: "elektrika",
    name: { uk: "Електрика", ru: "Электрика" },
    image: "/images/categories/electricity.png",
    productCount: 5013,
    children: [
      {
        id: "wiring-materials",
        slug: "elektromontazhni-materialy",
        name: { uk: "Електромонтажні матеріали", ru: "Электромонтажные материалы" },
        image: "/images/subcategories/wiring.png",
        productCount: 420,
        children: [
          {
            id: "cable-glands",
            slug: "kabelnye-vvody",
            name: { uk: "Кабельні вводи", ru: "Кабельные вводы" },
            productCount: 85,
          },
          {
            id: "junction-boxes",
            slug: "korobky-montazhni",
            name: { uk: "Коробки монтажні", ru: "Коробки монтажные" },
            productCount: 64,
          },
          {
            id: "terminal-blocks",
            slug: "klemni-kolodky",
            name: { uk: "Клемні колодки", ru: "Клеммные колодки" },
            productCount: 92,
          },
          {
            id: "cable-ties",
            slug: "styazhky-kabelni",
            name: { uk: "Стяжки кабельні", ru: "Стяжки кабельные" },
            productCount: 48,
          },
        ],
      },
      {
        id: "installation-devices",
        slug: "elektrovstanovochni-vyroby",
        name: { uk: "Електроустановочні вироби", ru: "Электроустановочные изделия" },
        image: "/images/subcategories/switches.png",
        productCount: 680,
        children: [
          {
            id: "switches-sockets",
            slug: "vymykachi-rozetky",
            name: { uk: "Вимикачі та розетки", ru: "Выключатели и розетки" },
            productCount: 310,
            children: [
              {
                id: "single-switches",
                slug: "odnoklvishni",
                name: { uk: "Одноклавішні вимикачі", ru: "Одноклавишные выключатели" },
                productCount: 45,
              },
              {
                id: "double-switches",
                slug: "dvoklvishni",
                name: { uk: "Двоклавішні вимикачі", ru: "Двухклавишные выключатели" },
                productCount: 38,
              },
              {
                id: "sockets-grounded",
                slug: "rozetky-z-zazemlennyam",
                name: { uk: "Розетки з заземленням", ru: "Розетки с заземлением" },
                productCount: 72,
              },
              {
                id: "dimmer-switches",
                slug: "dymery",
                name: { uk: "Димери", ru: "Диммеры" },
                productCount: 24,
              },
            ],
          },
          {
            id: "frames",
            slug: "ramky",
            name: { uk: "Рамки", ru: "Рамки" },
            productCount: 156,
          },
          {
            id: "adapters",
            slug: "perekhidnyky",
            name: { uk: "Перехідники та подовжувачі", ru: "Переходники и удлинители" },
            productCount: 88,
          },
        ],
      },
      {
        id: "panels-enclosures",
        slug: "shchytky-korposy",
        name: { uk: "Щитки модульні вбудовані UBox", ru: "Щитки модульные встраиваемые UBox" },
        image: "/images/subcategories/panels.png",
        productCount: 95,
      },
      {
        id: "modular-equipment",
        slug: "modulne-obladnannya",
        name: { uk: "Модульне обладнання", ru: "Модульное оборудование" },
        image: "/images/subcategories/breakers.png",
        productCount: 860,
        children: [
          {
            id: "circuit-breakers",
            slug: "avtomatychni-vymykachi",
            name: { uk: "Автоматичні вимикачі", ru: "Автоматические выключатели" },
            productCount: 280,
            children: [
              {
                id: "mcb-1p",
                slug: "mcb-1p",
                name: { uk: "Однополюсні (1P)", ru: "Однополюсные (1P)" },
                productCount: 65,
              },
              {
                id: "mcb-2p",
                slug: "mcb-2p",
                name: { uk: "Двополюсні (2P)", ru: "Двухполюсные (2P)" },
                productCount: 52,
              },
              {
                id: "mcb-3p",
                slug: "mcb-3p",
                name: { uk: "Трьохполюсні (3P)", ru: "Трехполюсные (3P)" },
                productCount: 48,
              },
            ],
          },
          {
            id: "rcds",
            slug: "pzy",
            name: { uk: "ПЗВ (диференційні вимикачі)", ru: "УЗО (дифференциальные выключатели)" },
            productCount: 145,
          },
          {
            id: "surge-protectors",
            slug: "obmezhuvachi-napruhy",
            name: { uk: "Обмежувачі перенапруги", ru: "Ограничители перенапряжения" },
            productCount: 67,
          },
          {
            id: "contactors",
            slug: "kontaktory",
            name: { uk: "Контактори", ru: "Контакторы" },
            productCount: 93,
          },
        ],
      },
      {
        id: "cable-management",
        slug: "ukladannya-kabeliv",
        name: { uk: "Укладання кабелів", ru: "Укладка кабелей" },
        image: "/images/subcategories/cable_tray.png",
        productCount: 340,
        children: [
          {
            id: "cable-channels",
            slug: "kabel-kanaly",
            name: { uk: "Кабель-канали", ru: "Кабель-каналы" },
            productCount: 120,
          },
          {
            id: "corrugated-pipes",
            slug: "gofrotropby",
            name: { uk: "Гофротруби", ru: "Гофротрубы" },
            productCount: 88,
          },
          {
            id: "cable-trays",
            slug: "lotky-kabelni",
            name: { uk: "Лотки кабельні", ru: "Лотки кабельные" },
            productCount: 56,
          },
        ],
      },
      {
        id: "sensors",
        slug: "datchyky",
        name: { uk: "Датчики руху і освітленості", ru: "Датчики движения и освещенности" },
        productCount: 78,
      },
      {
        id: "voltage-relays",
        slug: "rele-napruhy",
        name: { uk: "Реле напруги", ru: "Реле напряжения" },
        productCount: 54,
      },
      {
        id: "batteries-accum",
        slug: "batarejky-akumulyatory",
        name: { uk: "Батарейки та акумулятори", ru: "Батарейки и аккумуляторы" },
        productCount: 180,
      },
    ],
  },
  {
    id: "tools",
    slug: "instrumenty",
    name: { uk: "Інструменти", ru: "Инструменты" },
    image: "/images/categories/tools.png",
    productCount: 3963,
    children: [
      {
        id: "power-tools",
        slug: "elektroinstrument",
        name: { uk: "Електроінструмент і обладнання", ru: "Электроинструмент и оборудование" },
        productCount: 820,
        children: [
          {
            id: "drills",
            slug: "dryli",
            name: { uk: "Дрилі та шуруповерти", ru: "Дрели и шуруповерты" },
            productCount: 145,
          },
          {
            id: "grinders",
            slug: "bolharky",
            name: { uk: "Болгарки (КШМ)", ru: "Болгарки (УШМ)" },
            productCount: 98,
          },
          {
            id: "jigsaws",
            slug: "lobzyky",
            name: { uk: "Лобзики", ru: "Лобзики" },
            productCount: 42,
          },
          {
            id: "perforators",
            slug: "perforatory",
            name: { uk: "Перфоратори", ru: "Перфораторы" },
            productCount: 67,
          },
        ],
      },
      {
        id: "auto-tools",
        slug: "avtoinstrument",
        name: { uk: "Автоінструмент", ru: "Автоинструмент" },
        productCount: 340,
      },
      {
        id: "hand-tools",
        slug: "ruchnyj-instrument",
        name: { uk: "Кріпильний інструмент", ru: "Крепежный инструмент" },
        productCount: 420,
      },
      {
        id: "measuring",
        slug: "vymiriuvalnyj",
        name: { uk: "Вимірювальний інструмент", ru: "Измерительный инструмент" },
        productCount: 215,
      },
      {
        id: "compressors",
        slug: "kompresory",
        name: { uk: "Компресори", ru: "Компрессоры" },
        productCount: 48,
      },
      {
        id: "tool-storage",
        slug: "yashchyky-sumky",
        name: { uk: "Ящики, сумки, пояси", ru: "Ящики, сумки, пояса" },
        productCount: 120,
      },
    ],
  },
  {
    id: "ups",
    slug: "dzhb",
    name: { uk: "Джерела безперебійного живлення", ru: "Источники бесперебойного питания" },
    image: "/images/categories/ups.png",
    productCount: 75,
    children: [
      {
        id: "inverters",
        slug: "invertory",
        name: { uk: "Інвертори", ru: "Инверторы" },
        productCount: 18,
      },
      {
        id: "mini-ups-router",
        slug: "mini-ups-router",
        name: { uk: "Міні UPS (для роутера)", ru: "Мини UPS (для роутера)" },
        productCount: 22,
      },
      {
        id: "ups-main",
        slug: "ups-dzhb",
        name: { uk: "UPS Джерело безперебійного живлення", ru: "UPS Источник бесперебойного питания" },
        productCount: 15,
      },
      {
        id: "mini-ups-din",
        slug: "mini-ups-din",
        name: { uk: "Міні UPS на Din-рейці", ru: "Мини UPS на Din-рейке" },
        productCount: 8,
      },
      {
        id: "ups-box",
        slug: "ups-boks",
        name: { uk: "UPS (ДЖБ) у захисному боксі", ru: "UPS (ДБЖ) в защитном боксе" },
        productCount: 12,
      },
    ],
  },
  {
    id: "batteries",
    slug: "akkumulyatory",
    name: { uk: "Акумуляторні батареї", ru: "Аккумуляторные батареи" },
    image: "/images/categories/batteries.png",
    productCount: 65,
  },
  {
    id: "charging-stations",
    slug: "zaryadni-stantsii",
    name: { uk: "Портативні зарядні станції", ru: "Портативные зарядные станции" },
    image: "/images/categories/charging-stations.png",
    productCount: 44,
  },
  {
    id: "led",
    slug: "led-osvitlennya",
    name: { uk: "LED-освітлення", ru: "LED-освещение" },
    image: "/images/categories/led.png",
    productCount: 320,
    children: [
      {
        id: "led-bulbs",
        slug: "led-lampochky",
        name: { uk: "LED-лампочки", ru: "LED-лампочки" },
        productCount: 145,
      },
      {
        id: "led-strips",
        slug: "strichky-moduli",
        name: { uk: "Стрічки та модулі", ru: "Ленты и модули" },
        productCount: 68,
      },
      {
        id: "led-floodlights",
        slug: "prozhektory",
        name: { uk: "Прожектори вуличні", ru: "Прожекторы уличные" },
        productCount: 52,
      },
      {
        id: "led-fixtures",
        slug: "svitylnyky",
        name: { uk: "Світильники", ru: "Светильники" },
        productCount: 55,
      },
    ],
  },
  {
    id: "welding",
    slug: "zvaryuvalni-materialy",
    name: { uk: "Зварювальне обладнання", ru: "Сварочное оборудование" },
    image: "/images/categories/welding.png",
    productCount: 180,
    children: [
      {
        id: "welding-machines",
        slug: "zvaryuvalni-aparaty",
        name: { uk: "Зварювальні апарати PATON", ru: "Сварочные аппараты PATON" },
        productCount: 45,
      },
      {
        id: "welding-wire",
        slug: "zvaryuvalnyj-drit",
        name: { uk: "Зварювальний дріт", ru: "Сварочная проволока" },
        productCount: 38,
      },
      {
        id: "electrodes",
        slug: "elektrody",
        name: { uk: "Електроди", ru: "Электроды" },
        productCount: 52,
      },
      {
        id: "welding-accessories",
        slug: "zvaryuvalni-aksesukry",
        name: { uk: "Зварювальні аксесуари", ru: "Сварочные аксессуары" },
        productCount: 45,
      },
    ],
  },
  {
    id: "cables",
    slug: "kabeli",
    name: { uk: "Кабелі та дроти", ru: "Кабели и провода" },
    image: "/images/categories/cables.png",
    productCount: 450,
    children: [
      {
        id: "install-wires",
        slug: "montazhni-provody",
        name: { uk: "Установчі та монтажні дроти", ru: "Установочные и монтажные провода" },
        productCount: 180,
      },
      {
        id: "power-cables",
        slug: "sylovi-kabeli",
        name: { uk: "Силові кабелі", ru: "Силовые кабели" },
        productCount: 120,
      },
      {
        id: "network-cables",
        slug: "merezhevyj-kabel",
        name: { uk: "Мережевий кабель", ru: "Сетевой кабель" },
        productCount: 65,
      },
      {
        id: "signal-wires",
        slug: "signalnyj-provid",
        name: { uk: "Сигнальний провід", ru: "Сигнальный провод" },
        productCount: 42,
      },
    ],
  },
  {
    id: "generators",
    slug: "generatory",
    name: { uk: "Генератори", ru: "Генераторы" },
    image: "/images/categories/generators.png",
    productCount: 35,
  },
  {
    id: "solar",
    slug: "sonyachni",
    name: { uk: "Сонячні джерела живлення", ru: "Солнечные источники питания" },
    image: "/images/categories/solar.png",
    productCount: 28,
  },
  {
    id: "surveillance",
    slug: "videonaglyad",
    name: { uk: "Відеоспостереження", ru: "Видеонаблюдение" },
    image: "/images/categories/surveillance.png",
    productCount: 42,
  },
  {
    id: "workwear",
    slug: "spetsodyag",
    name: { uk: "Спецодяг", ru: "Спецодежда" },
    image: "/images/categories/workwear.png",
    productCount: 85,
  },
];
