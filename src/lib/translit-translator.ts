// src/lib/translit-translator.ts

const TRANSLIT_WORDS: Record<string, { uk: string; ru: string }> = {
  kilkist: { uk: 'кількість', ru: 'количество' },
  kolychestvo: { uk: 'кількість', ru: 'количество' },
  kolichestvo: { uk: 'кількість', ru: 'количество' },
  ustanovchykh: { uk: 'установчих', ru: 'установочных' },
  ustanovochynyh: { uk: 'установчих', ru: 'установочных' },
  gnizd: { uk: 'гнізд', ru: 'гнезд' },
  gnezdo: { uk: 'гніздо', ru: 'гнездо' },
  lynyy: { uk: 'ліній', ru: 'линий' },
  linii: { uk: 'ліній', ru: 'линий' },
  linij: { uk: 'ліній', ru: 'линий' },
  podderzhyvaem: { uk: 'пристроїв, що підтримуються', ru: 'поддерживаемых устройств' },
  podderzhivaem: { uk: 'пристроїв, що підтримуються', ru: 'поддерживаемых устройств' },
  podderzhyvaemykh: { uk: 'пристроїв, що підтримуються', ru: 'поддерживаемых устройств' },
  podderzhivaemykh: { uk: 'пристроїв, що підтримуються', ru: 'поддерживаемых устройств' },
  ustroystv: { uk: 'пристроїв', ru: 'устройств' },
  ustroistv: { uk: 'пристроїв', ru: 'устройств' },
  sht: { uk: 'шт.', ru: 'шт.' },
  kh: { uk: 'кг', ru: 'кг' },
  kg: { uk: 'кг', ru: 'кг' },
  v: { uk: 'в', ru: 'в' },
  yashchyku: { uk: 'упаковці', ru: 'упаковке' },
  yashchyka: { uk: 'упаковки', ru: 'упаковки' },
  yashchike: { uk: 'упаковке', ru: 'упаковке' },
  ves: { uk: 'вага', ru: 'вес' },
  ob: { uk: 'об\'єм', ru: 'объем' },
  yem: { uk: 'об\'єм', ru: 'объем' },
  vidpovidnist: { uk: 'відповідність', ru: 'соответствие' },
  standartam: { uk: 'стандартам', ru: 'стандартам' },
  standard: { uk: 'стандарт', ru: 'стандарт' },
  standart: { uk: 'стандарт', ru: 'стандарт' },
  curve: { uk: 'характеристика', ru: 'характеристика' },
  poles: { uk: 'полюси', ru: 'полюсы' },
  artykul: { uk: 'артикул', ru: 'артикул' },
  artikul: { uk: 'артикул', ru: 'артикул' },
  perevaha: { uk: 'перевага', ru: 'преимущество' },
  fokusnoe: { uk: 'фокусна', ru: 'фокусное' },
  rasstoyanye: { uk: 'відстань', ru: 'расстояние' },
  rasstoyanie: { uk: 'відстань', ru: 'расстояние' },
  dalnist: { uk: 'дальність', ru: 'дальность' },
  pidsvichuvannya: { uk: 'підсвічування', ru: 'подсветки' },
  pidsvitka: { uk: 'підсвічування', ru: 'подсветки' },
  podsvetka: { uk: 'підсвічування', ru: 'подсветки' },
  harantiya: { uk: 'гарантія', ru: 'гарантия' },
  garantiya: { uk: 'гарантія', ru: 'гарантия' },
  klass: { uk: 'клас', ru: 'класс' },
  klas: { uk: 'клас', ru: 'класс' },
  zashchyt: { uk: 'захисту', ru: 'защиты' },
  zashchity: { uk: 'захисту', ru: 'защиты' },
  zahystu: { uk: 'захисту', ru: 'защиты' },
  stepen: { uk: 'ступінь', ru: 'степень' },
  stupin: { uk: 'ступінь', ru: 'степень' },
  nominalna: { uk: 'номінальна', ru: 'номинальная' },
  nominalnyy: { uk: 'номінальний', ru: 'номинальный' },
  nominalnyi: { uk: 'номінальний', ru: 'номинальный' },
  nominalnoe: { uk: 'номінальне', ru: 'номинальное' },
  robocha: { uk: 'робоча', ru: 'рабочая' },
  robochyy: { uk: 'робочий', ru: 'рабочий' },
  robochyi: { uk: 'робочий', ru: 'рабочий' },
  napruha: { uk: 'напруга', ru: 'напряжение' },
  strum: { uk: 'струм', ru: 'ток' },
  tok: { uk: 'струм', ru: 'ток' },
  temperatura: { uk: 'температура', ru: 'температура' },
  ekspluatatsiyi: { uk: 'експлуатації', ru: 'эксплуатации' },
  upakovtsi: { uk: 'упаковці', ru: 'упаковке' },
  upakovka: { uk: 'упаковка', ru: 'упаковка' },
  upakovke: { uk: 'упаковці', ru: 'упаковке' },
  up: { uk: 'уп.', ru: 'уп.' },
  materyal: { uk: 'матеріал', ru: 'материал' },
  material: { uk: 'матеріал', ru: 'материал' },
  korpusa: { uk: 'корпусу', ru: 'корпуса' },
  korpusu: { uk: 'корпусу', ru: 'корпуса' },
  rabochaya: { uk: 'робоча', ru: 'рабочая' },
  moshchnost: { uk: 'потужність', ru: 'мощность' },
  potuzhnist: { uk: 'потужність', ru: 'мощность' },
  razreshenie: { uk: 'роздільна здатність', ru: 'разрешение' },
  razreshenye: { uk: 'роздільна здатність', ru: 'разрешение' },
  matrica: { uk: 'матриця', ru: 'матрица' },
  matritsa: { uk: 'матриця', ru: 'матрица' },
  tip: { uk: 'тип', ru: 'тип' },
  typ: { uk: 'тип', ru: 'тип' },
  ispolnenie: { uk: 'виконання', ru: 'исполнение' },
  ispolnenye: { uk: 'виконання', ru: 'исполнение' },
  vykonannya: { uk: 'виконання', ru: 'исполнение' },
  ustanovka: { uk: 'встановлення', ru: 'установка' },
  vstanovlennya: { uk: 'встановлення', ru: 'установка' },
  kanalov: { uk: 'каналів', ru: 'каналов' },
  kanaliv: { uk: 'каналів', ru: 'каналов' },
  
  // Color/Material value translations
  belyi: { uk: 'білий', ru: 'белый' },
  bely: { uk: 'білий', ru: 'белый' },
  bila: { uk: 'біла', ru: 'белая' },
  bilyi: { uk: 'білий', ru: 'белый' },
  chernyi: { uk: 'чорний', ru: 'черный' },
  cherny: { uk: 'чорний', ru: 'черный' },
  chorna: { uk: 'чорна', ru: 'черная' },
  chornyi: { uk: 'чорний', ru: 'черный' },
  seryi: { uk: 'сірий', ru: 'серый' },
  sery: { uk: 'сірий', ru: 'серый' },
  sira: { uk: 'сіра', ru: 'серая' },
  siryi: { uk: 'сірий', ru: 'серый' },
  metall: { uk: 'метал', ru: 'металл' },
  metal: { uk: 'метал', ru: 'металл' },
  plastik: { uk: 'пластик', ru: 'пластик' },
  plastyk: { uk: 'пластик', ru: 'пластик' },
  alyuminiy: { uk: 'алюміній', ru: 'алюминий' },
  alyuminii: { uk: 'алюміній', ru: 'алюминий' },
  stal: { uk: 'сталь', ru: 'сталь' },
  stalnoy: { uk: 'сталь', ru: 'сталь' },
  med: { uk: 'мідь', ru: 'медь' },
  mednyy: { uk: 'мідь', ru: 'медь' },
  zoloto: { uk: 'золото', ru: 'золото' },
  zolotoy: { uk: 'золотий', ru: 'золотой' },
  steklo: { uk: 'скло', ru: 'стекло' },
  sklo: { uk: 'скло', ru: 'стекло' },
  polikarbonat: { uk: 'полікарбонат', ru: 'поликарбонат' },
}

const ATTR_LABELS_UK: Record<string, string> = {
  poles: 'Кількість полюсів',
  rating_a: 'Номінальний струм, А',
  breaking_ka: 'Відключна здатність, кА',
  voltage_v: 'Номінальна напруга, В',
  curve: 'Характеристика відключення',
  color: 'Колір',
  size: 'Розмір',
  weight_kg: 'Вага, кг',
  ves_kh: 'Вага, кг',
  ves_kg: 'Вага, кг',
  ves: 'Вага, кг',
  ob_yem_kh: 'Об\'єм, м³',
  ob_yem: 'Об\'єм, м³',
  artykul: 'Артикул',
  artikul: 'Артикул',
  standard: 'Стандарт',
  standart: 'Стандарт',
  perevaha_1: 'Перевага 1',
  perevaha_2: 'Перевага 2',
  perevaha_3: 'Перевага 3',
  material: 'Матеріал',
  ip_class: 'Ступінь захисту IP',
  power_w: 'Потужність, Вт',
  frequency_hz: 'Частота, Гц',
  phase: 'Кількість фаз',
  mounting: 'Спосіб монтажу',
  cross_section_mm2: 'Переріз, мм²',
  length_m: 'Довжина, м',
  qty_breaks: 'Оптові ціни',
  
  // Electrical & package additions
  nominalna_robocha_napruha_ue_v: 'Номінальна робоча напруга Ue, В',
  nominalnyy_robochyy_strum_ie_a: 'Номінальний робочий струм Ie, А',
  nominalna_impulsna_napruha_uimp_kv: 'Номінальна імпульсна напруга Uimp, кВ',
  nominalna_napruha_izolyatsiyi_ui_v: 'Номінальна напруга ізоляції Ui, В',
  nominalna_vymykayucha_zdatnist_icn_ka: 'Номінальна вимикаюча здатність Icn, кА',
  pereriz_pid_yednuvalnykh_provodiv_mm_kv: 'Переріз під\'єднувальних проводів, мм²',
  nomynalnoe_rabochee_napryazhenye_po_peremennomu_toku: 'Номінальна робоча напруга змінного струму',
  stepen_zashchyt: 'Ступінь захисту',
  stepen_zashchyt_ip: 'Ступінь захисту IP',
  kolychestvo_moduley: 'Кількість модулів',
  kolychestvo_polyusov: 'Кількість полюсів',
  rezhym_ekspluatatsiyi: 'Режим експлуатації',
  temperatura_ekspluatatsiyi_s: 'Температура експлуатації, °C',
  kharakterystyka_vidklyuchennya: 'Характеристика відключення',
  mekhanycheskaya_yznosostoykost: 'Механічна зносостійкість, циклів',
  vremya_tokov_e_kharakterystyky: 'Час-струмові характеристики',
  kommutatsyonnaya_yznosostoykost: 'Комутаційна зносостійкість, циклів',
  znosostiykist_elektrychna_tsykliv: 'Електрична зносостійкість, циклів',
  znosostiykist_mekhanichna_tsykliv: 'Механічна зносостійкість, циклів',
  kilkist_v_upakovtsi_sht: 'Кількість в упаковці, шт.',
  kilkist_v_yashchyku_sht: 'Кількість в упаковці, шт',
  kilkist_v_yashchyku_up: 'Кількість в упаковці up',
  dielektrychna_mitsnist: 'Діелектрична міцність',
  typ_kontaktov: 'Тип контактів',
  kolychestvo_kontaktov: 'Кількість контактів',
  krayina_vyrobnyk: 'Країна виробник',
}

const ATTR_LABELS_RU: Record<string, string> = {
  poles: 'Количество полюсов',
  rating_a: 'Номинальный ток, А',
  breaking_ka: 'Отключающая способность, кА',
  voltage_v: 'Номинальное напряжение, В',
  curve: 'Характеристика отключения',
  color: 'Цвет',
  size: 'Размер',
  weight_kg: 'Вес, кг',
  ves_kh: 'Вес, кг',
  ves_kg: 'Вес, кг',
  ves: 'Вес, кг',
  ob_yem_kh: 'Объем, м³',
  ob_yem: 'Объем, м³',
  artykul: 'Артикул',
  artikul: 'Артикул',
  standard: 'Стандарт',
  standart: 'Стандарт',
  perevaha_1: 'Преимущество 1',
  perevaha_2: 'Преимущество 2',
  perevaha_3: 'Преимущество 3',
  material: 'Материал',
  ip_class: 'Степень защиты IP',
  power_w: 'Мощность, Вт',
  frequency_hz: 'Частота, Гц',
  phase: 'Количество фаз',
  mounting: 'Способ монтажа',
  cross_section_mm2: 'Сечение, мм²',
  length_m: 'Длина, м',
  qty_breaks: 'Оптовые цены',

  // Electrical & package additions
  nominalna_robocha_napruha_ue_v: 'Номинальное рабочее напряжение Ue, В',
  nominalnyy_robochyy_strum_ie_a: 'Номинальный рабочий ток Ie, А',
  nominalna_impulsna_napruha_uimp_kv: 'Номинальное импульсное напряжение Uimp, кВ',
  nominalna_napruha_izolyatsiyi_ui_v: 'Номинальное напряжение изоляции Ui, В',
  nominalna_vymykayucha_zdatnist_icn_ka: 'Номинальная отключающая способность Icn, кА',
  pereriz_pid_yednuvalnykh_provodiv_mm_kv: 'Сечение подключаемых проводов, мм²',
  nomynalnoe_rabochee_napryazhenye_po_peremennomu_toku: 'Номинальное рабочее напряжение переменного тока',
  stepen_zashchyt: 'Степень защиты',
  stepen_zashchyt_ip: 'Степень защиты IP',
  kolychestvo_moduley: 'Количество модулей',
  kolychestvo_polyusov: 'Количество полюсов',
  rezhym_ekspluatatsiyi: 'Режим эксплуатации',
  temperatura_ekspluatatsiyi_s: 'Температура эксплуатации, °C',
  kharakterystyka_vidklyuchennya: 'Характеристика отключения',
  mekhanycheskaya_yznosostoykost: 'Механическая износостойкость, циклов',
  vremya_tokov_e_kharakterystyky: 'Время-токовые характеристики',
  kommutatsyonnaya_yznosostoykost: 'Коммутационная износостойкость, циклов',
  znosostiykist_elektrychna_tsykliv: 'Электрическая износостойкость, циклов',
  znosostiykist_mekhanichna_tsykliv: 'Механическая износостойкость, циклов',
  kilkist_v_upakovtsi_sht: 'Количество в упаковке, шт.',
  kilkist_v_yashchyku_sht: 'Количество в упаковке, шт',
  kilkist_v_yashchyku_up: 'Количество в упаковке up',
  dielektrychna_mitsnist: 'Диэлектрическая прочность',
  typ_kontaktov: 'Тип контактов',
  kolychestvo_kontaktov: 'Количество контактов',
  krayina_vyrobnyk: 'Страна производитель',
}

export function translateAttributeKey(key: string, locale: 'uk' | 'ru'): string {
  const normKey = key.toLowerCase().trim().replace(/[\s-]+/g, '_')
  const dict = locale === 'ru' ? ATTR_LABELS_RU : ATTR_LABELS_UK
  
  // 1. Direct match on normalized key or raw key
  if (dict[normKey]) return dict[normKey]
  if (dict[key]) return dict[key]

  // 2. Otherwise split key into words, translate each word if found in dictionary
  const words = key.split(/[\s_-]+/)
  const translatedWords = words.map((w) => {
    const norm = w.toLowerCase()
    if (TRANSLIT_WORDS[norm]) {
      return TRANSLIT_WORDS[norm][locale]
    }
    if (w && w.charAt(0) === w.charAt(0).toUpperCase()) {
      return w.charAt(0).toUpperCase() + w.slice(1)
    }
    return w
  })

  const result = translatedWords.join(' ')
  if (result.length > 0) {
    return result.charAt(0).toUpperCase() + result.slice(1)
  }
  return key
}

export function translateAttributeValue(value: unknown, locale: 'uk' | 'ru'): string {
  if (value === null || value === undefined) return '—'
  const str = String(value)
  
  const norm = str.trim().toLowerCase()
  if (TRANSLIT_WORDS[norm]) {
    const translated = TRANSLIT_WORDS[norm][locale]
    const trimmed = str.trim()
    if (trimmed && trimmed.charAt(0) === trimmed.charAt(0).toUpperCase()) {
      return translated.charAt(0).toUpperCase() + translated.slice(1)
    }
    return translated
  }

  if (str.includes(' ') || str.includes('_') || str.includes('-')) {
    const words = str.split(/[\s_-]+/)
    let allTranslated = true
    const translatedWords = words.map((w) => {
      const wNorm = w.toLowerCase()
      if (TRANSLIT_WORDS[wNorm]) {
        const tr = TRANSLIT_WORDS[wNorm][locale]
        if (w && w.charAt(0) === w.charAt(0).toUpperCase()) {
          return tr.charAt(0).toUpperCase() + tr.slice(1)
        }
        return tr
      }
      allTranslated = false
      return w
    })
    if (allTranslated) {
      return translatedWords.join(' ')
    }
  }

  return str
}

const KEY_PRIORITY = [
  'typ_vyrobu',
  'komplektatsiya_vyrobu',
  'typ_montazhu',
  'krayina_vyrobnyk',
  'nominalnyi_strum_a',
  'nominalna_robocha_napruha_ue_v',
  'nominalna_napruha_v',
  'napruga',
  'strum',
  'skorist',
  'klichestvo_polusov',
  'kilkist_polusiv',
  'poles',
  'curve',
  'standard',
  'artykul',
  'ves_kh',
  'ves',
  'ob_yem_kh',
  'kharakterystyka_spratsyovuvannya',
  'vremya_tokov_e_kharakterystyky',
  'nomynalnaia_otkluchaiushchaia_sposobnost_ka',
  'kolychestvo_kontaktov',
  'typ_kontaktov',
  'kontakty',
  'kolir',
  'tsvet',
  'pidsvichuvannya',
  'podsvetka',
  'stupin_zakhystu',
  'stepen_zashchyt',
  'stepen_zashchyt_ip',
  'ip_class',
  'material',
  'srezae',
  'poperechnyi_pereriz_provoda_mm',
  'dyapazon_rabochaia_temperatura_c',
  'temperatura',
  'vaga',
  'razmery',
  'kilkist_v_upakovtsi_sht',
  'kilkist_v_yashchyku_sht',
  'kilkist_v_yashchyku_up',
  'qty_breaks',
]

export function sortAttributeEntries(entries: [string, unknown][]): [string, unknown][] {
  return [...entries].sort(([keyA], [keyB]) => {
    const cleanKeyA = keyA.toLowerCase().trim()
    const cleanKeyB = keyB.toLowerCase().trim()

    let indexA = KEY_PRIORITY.indexOf(cleanKeyA)
    let indexB = KEY_PRIORITY.indexOf(cleanKeyB)

    if (indexA === -1) {
      indexA = KEY_PRIORITY.findIndex(pk => cleanKeyA.includes(pk))
    }
    if (indexB === -1) {
      indexB = KEY_PRIORITY.findIndex(pk => cleanKeyB.includes(pk))
    }

    const valA = indexA === -1 ? 999 : indexA
    const valB = indexB === -1 ? 999 : indexB

    if (valA !== valB) {
      return valA - valB
    }

    return keyA.localeCompare(keyB)
  })
}
