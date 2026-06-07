// src/app/[locale]/(shop)/blog/[slug]/page.tsx
// Детальная страница статьи (Блог)
// MASTER_CONTEXT v1.2 §12

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { isValidLocale } from '@/i18n/request'
import { articles } from '@/lib/articles'
import { prisma } from '@/lib/prisma'
import { productCardSelect, mapProductDecimals } from '@/queries/products'
import ProductCard from '@/components/product/product-card'
import Breadcrumbs from '@/components/layout/breadcrumbs'
import { Calendar, Clock, ArrowLeft, Sparkles } from 'lucide-react'
import type { Locale } from '@/types'
import { isFeatureEnabled } from '@/lib/features'
import { getSiteUrl } from '@/lib/utils'
import { ArticleSchema } from '@/components/seo/article-schema'

export async function generateStaticParams() {
  const locales = ['uk', 'ru'] as const
  return articles.flatMap((art) =>
    locales.map((locale) => ({ locale, slug: art.slug }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isValidLocale(locale)) return {}

  const art = articles.find((a) => a.slug === slug)
  if (!art) return {}

  return {
    title: `${art.title[locale as 'uk' | 'ru']} | Блог Electronom`,
    description: art.summary[locale as 'uk' | 'ru'],
    alternates: {
      canonical: `/${locale}/blog/${slug}`,
    },
  }
}

// Полноразмерный контент для каждой статьи на двух языках
const articleContents: Record<string, { uk: string; ru: string }> = {
  'yak-obraty-avtomatychy-vymykach': {
    uk: `
      <p>Вибір автоматичного вимикача (в побуті — "автомата") — це ключовий крок у забезпеченні електробезпеки вашого будинку чи квартири. Головне завдання цього пристрою — захистити електропроводку від перевантаження та короткого замикання, які можуть призвести до пожежі.</p>
      
      <h3>1. Розрахунок номінального струму</h3>
      <p>Найпоширеніша помилка — вибір автомата "із запасом" (наприклад, 25А замість 16А на звичайні розетки). Автомат підбирається виключно під перетин кабелю, а не під сумарну потужність приладів! Для стандартної мідної жилки перетином 2.5 мм² встановлюється автомат максимум на 16А. Якщо встановити автомат більшого номіналу, кабель почне плавитися раніше, ніж спрацює захист.</p>
      
      <h3>2. Класи відключення (час-струмові характеристики)</h3>
      <ul>
        <li><strong>Характеристика B</strong> — підходить для освітлення та довгих ліній без великих пускових струмів.</li>
        <li><strong>Характеристика C</strong> — універсальний вибір для квартир та будинків. Справляється з пусковими струмами побутової техніки (холодильники, кондиціонери).</li>
        <li><strong>Характеристика D</strong> — використовується для ліній з потужними двигунами та зварювальними апаратами (частіше в гаражах або майстернях).</li>
      </ul>

      <h3>3. Кількість полюсів</h3>
      <p>Для однофазної мережі зазвичай використовують 1-полюсні автомати на окремі групи або 2-полюсні на загальний ввід. Для трифазної мережі — 3-полюсні або 4-полюсні автомати.</p>

      <h3>4. Якого виробника обрати?</h3>
      <p>Рекомендуємо обирати перевірені європейські бренди, такі як <strong>Hager</strong> (Німеччина), <strong>ABB</strong> (Швеція/Швейцарія) або <strong>Schneider Electric</strong> (Франція). Вони гарантують точність спрацьовування та тривалий термін експлуатації.</p>
    `,
    ru: `
      <p>Выбор автоматического выключателя (в обиходе — "автомата") — это ключевой шаг в обеспечении электробезопасности вашего дома или квартиры. Главная задача этого устройства — защитить электропроводку от перегрузки и короткого замыкания, которые могут привести к пожару.</p>
      
      <h3>1. Расчет номинального тока</h3>
      <p>Самая распространенная ошибка — выбор автомата "с запасом" (например, 25А вместо 16А на обычные розетки). Автомат подбирается исключительно под сечение кабеля, а не под суммарную мощность приборов! Для стандартной медной жилы сечением 2.5 мм² устанавливается автомат максимум на 16А. Если установить автомат большего номинала, кабель начнет плавиться раньше, чем сработает защита.</p>
      
      <h3>2. Классы отключения (время-токовые характеристики)</h3>
      <ul>
        <li><strong>Характеристика B</strong> — подходит для освещения и длинных линий без больших пусковых токов.</li>
        <li><strong>Характеристика C</strong> — универсальный выбор для квартир и домов. Справляется с пусковыми токами бытовой техники (холодильники, кондиционеры).</li>
        <li><strong>Характеристика D</strong> — используется для линий с мощными двигателями и сварочными аппаратами (чаще в гаражах или мастерских).</li>
      </ul>

      <h3>3. Количество полюсов</h3>
      <p>Для однофазной сети обычно используют 1-полюсные автоматы на отдельные группы или 2-полюсные на общий ввод. Для трехфазной сети — 3-полюсные или 4-полюсные автоматы.</p>

      <h3>4. Какого производителя выбрать?</h3>
      <p>Рекомендуем выбирать проверенные европейские бренды, такие как <strong>Hager</strong> (Германия), <strong>ABB</strong> (Швеция/Швейцария) или <strong>Schneider Electric</strong> (Франция). Они гарантируют точность срабатывания и длительный срок эксплуатации.</p>
    `
  },
  'rozrahunok-peretinu-kabelyu': {
    uk: `
      <p>Правильний розрахунок перетину кабелю — це основа безпеки будь-якої електричної системи. Недостатній перетин призведе до нагрівання кабелю, оплавлення ізоляції та ризику виникнення пожежі.</p>
      
      <h3>1. Чому тільки мідь?</h3>
      <p>Згідно з діючими нормами ПУЕ, для внутрішньої проводки в житлових приміщеннях дозволено використовувати виключно мідні кабелі. Вони мають кращу провідність, гнучкість та менше піддаються окисленню порівняно з алюмінієвими.</p>

      <h3>2. Золоте правило для квартири та будинку</h3>
      <p>Для більшості стандартних завдань побутової проводки застосовуються два типи кабелю (наприклад, ВВГнг або ВВГнг-LS):</p>
      <ul>
        <li><strong>Освітлення:</strong> мідний дріт перетином <strong>1.5 мм²</strong> (захищається автоматом 10А).</li>
        <li><strong>Розеткові групи:</strong> мідний дріт перетином <strong>2.5 мм²</strong> (захищається автоматом 16А).</li>
        <li><strong>Потужні споживачі (плита, бойлер):</strong> кабель перетином <strong>4 мм² або 6 мм²</strong> (автомат 25А або 32А відповідно).</li>
      </ul>

      <h3>3. Розрахунок по навантаженню</h3>
      <p>Для розрахунку струму використовують просту формулу: <strong>I = P / U</strong> (Струм = Потужність у Ватах / 220 Вольт). Наприклад, для бойлера потужністю 2000 Вт струм дорівнює: 2000 / 220 ≈ 9.1 А. Мідний кабель 1.5 мм² витримує до 19А при відкритій прокладці, тому його номінально достатньо, але з міркувань механічної міцності та довговічності на розетки завжди прокладають 2.5 мм².</p>
    `,
    ru: `
      <p>Правильный расчет сечения кабеля — это основа безопасности любой электрической системы. Недостаточное сечение приведет к нагреву кабеля, оплавлению изоляции и риску возникновения пожара.</p>
      
      <h3>1. Почему только медь?</h3>
      <p>Согласно действующим нормам ПУЭ, для внутренней проводки в жилых помещениях разрешено использовать исключительно медные кабели. Они обладают лучшей проводимостью, гибкостью и меньше подвержены окислению по сравнению с алюминиевыми.</p>

      <h3>2. Золотое правило для квартиры и дома</h3>
      <p>Для большинства стандартных задач бытовой проводки применяются два типа кабеля (например, ВВГнг или ВВГнг-LS):</p>
      <ul>
        <li><strong>Освещение:</strong> медный провод сечением <strong>1.5 мм²</strong> (защищается автоматом 10А).</li>
        <li><strong>Розеточные группы:</strong> медный провод сечением <strong>2.5 мм²</strong> (защищается автоматом 16А).</li>
        <li><strong>Мощные потребители (плита, бойлер):</strong> кабель сечением <strong>4 мм² или 6 мм²</strong> (автомат 25А или 32А соответственно).</li>
      </ul>

      <h3>3. Расчет по нагрузке</h3>
      <p>Для расчета тока используют простую формулу: <strong>I = P / U</strong> (Ток = Мощность в Ваттах / 220 Вольт). Например, для бойлера мощностью 2000 Вт ток равен: 2000 / 220 ≈ 9.1 А. Медный кабель 1.5 мм² выдерживает до 19А при открытой прокладке, поэтому его номинально достаточно, но из соображений механической прочности и долговечности на розетки всегда прокладывают 2.5 мм².</p>
    `
  },
  'vybir-led-osvitlennya': {
    uk: `
      <p>Сучасне світлодіодне освітлення дозволяє не лише економити електроенергію, а й створювати затишну робочу чи домашню атмосферу. Давайте розберемося з ключовими характеристиками при виборі LED-панелей та світильників.</p>
      
      <h3>1. Колірна температура (Kelvin)</h3>
      <ul>
        <li><strong>2700K – 3000K (Тепле біле світло):</strong> ідеально для спальні, вітальні та створення затишної, розслаблюючої атмосфери.</li>
        <li><strong>4000K – 4500K (Нейтральне/денне світло):</strong> оптимально для кухні, кабінету, ванної кімнати. Підвищує концентрацію та не втомлює очі.</li>
        <li><strong>6000K – 6500K (Холодне біле світло):</strong> використовується в офісах, на виробництвах, складах та для підсвічування робочих зон.</li>
      </ul>

      <h3>2. Світловий потік (Люмен)</h3>
      <p>Забудьте про Вати! Світлодіодні світильники різної якості при тій самій потужності можуть світити з різною яскравістю. Звертайте увагу на Люмени (Lm) — саме вони показують кількість випромінюваного світла. Ефективний світильник повинен видавати не менше 80-100 Lm на 1 Вт потужності.</p>
    `,
    ru: `
      <p>Современное светодиодное освещение позволяет не только экономить электроэнергию, но и создавать уютную рабочую или домашнюю атмосферу. Давайте разберемся с ключевыми характеристиками при выборе LED-панелей и светильников.</p>
      
      <h3>1. Цветовая температура (Kelvin)</h3>
      <ul>
        <li><strong>2700K – 3000K (Теплый белый свет):</strong> идеально для спальни, гостиной и создания уютной, расслабляющей атмосферы.</li>
        <li><strong>4000K – 4500K (Нейтральный/дневной свет):</strong> оптимально для кухни, кабинета, ванной комнаты. Повышает концентрацию и не утомляет глаза.</li>
        <li><strong>6000K – 6500K (Холодный белый свет):</strong> используется в офисах, на производствах, складах и для подсветки рабочих зон.</li>
      </ul>

      <h3>2. Световой поток (Люмен)</h3>
      <p>Забудьте о Ваттах! Светодиодные светильники разного качества при одной и той же мощности могут светить с разной яркостью. Обращайте внимание на Люмены (Lm) — именно они показывают количество излучаемого света. Эффективный светильник должен выдавать не менее 80-100 Lm на 1 Вт мощности.</p>
    `
  },
  'dzherela-bezperebiynogo-zhivlennya-routera': {
    uk: `
      <p>Під час тривалих відключень світла наявність автономного інтернету та резервного живлення для котла є життєво необхідними. Для цього використовуються ДБЖ (джерела безперебійного живлення) та ємні акумулятори.</p>
      
      <h3>1. Живлення для роутера та ONU-терміналу</h3>
      <p>Роутер та термінал споживають небагато — зазвичай від 6 до 15 Вт. Для їх роботи найкраще підходять міні-ДБЖ з виходами DC 9V/12V або акумуляторні станції з USB/Type-C. Такий пристрій може підтримувати мережу до 6–10 годин поспіль.</p>

      <h3>2. Чому LiFePO4 акумулятори кращі за гелеві?</h3>
      <p>Літій-залізо-фосфатні (LiFePO4) акумулятори — це передова технологія, що має величезні переваги:</p>
      <ul>
        <li><strong>Ресурс роботи:</strong> понад 4000 циклів заряду-розряду (проти 300–500 у свицево-кислотних).</li>
        <li><strong>Швидкість зарядки:</strong> заряджаються до 100% за 2-3 години.</li>
        <li><strong>Безпека:</strong> не виділяють газів, не вибухають та стабільно тримають напругу.</li>
      </ul>
    `,
    ru: `
      <p>Во время длительных отключений света наличие автономного интернета и резервного питания для котла жизненно необходимы. Для этого используются ИБП (источники бесперебойного питания) и емкие аккумуляторы.</p>
      
      <h3>1. Питание для роутера и ONU-терминала</h3>
      <p>Роутер и терминал потребляют немного — обычно от 6 до 15 Вт. Для их работы лучше всего подходят мини-ИБП с выходами DC 9V/12V или аккумуляторные станции с USB/Type-C. Такое устройство может поддерживать сеть до 6–10 часов подряд.</p>

      <h3>2. Почему LiFePO4 аккумуляторы лучше гелевых?</h3>
      <p>Литий-железо-фосфатные (LiFePO4) аккумуляторы — это передовая технология, имеющая огромные преимущества:</p>
      <ul>
        <li><strong>Ресурс работы:</strong> более 4000 циклов заряда-разряда (против 300–500 у свинцово-кислотных).</li>
        <li><strong>Скорость зарядки:</strong> заряжаются до 100% за 2-3 часа.</li>
        <li><strong>Безопасность:</strong> не выделяют газов, не взрываются и стабильно держат напряжение.</li>
      </ul>
    `
  },
  'vybir-ruchnogo-ta-electroi-nstrumentu': {
    uk: `
      <p>Обираючи інструмент для дому чи професійної роботи, важливо розуміти різницю між класами обладнання та орієнтуватися на перевірені бренди.</p>
      
      <h3>1. Побутовий чи професійний?</h3>
      <p>Побутові інструменти розраховані на періодичну роботу (до 2-3 годин на день з перервами). Вони дешевші, але мають пластикові шестерні та менший ресурс. Професійні інструменти (наприклад, Bosch Blue, Makita, DeWALT) розраховані на важкі умови праці протягом робочої зміни.</p>

      <h3>2. Акумуляторна лінійка — вигода єдиного стандарту</h3>
      <p>Сучасний тренд — купівля інструментів однієї лінійки, де один і той самий акумулятор (наприклад, 18V LXT у Makita чи 18V XR у DeWALT) підходить до шуруповерта, болгарки, лобзика та перфоратора. Це дозволяє економити до 50% вартості на покупці каркасів інструменту без АКБ.</p>
    `,
    ru: `
      <p>Выбирая инструмент для дома или профессиональной работы, важно понимать разницу между классами оборудования и ориентироваться на проверенные бренды.</p>
      
      <h3>1. Бытовой или профессиональный?</h3>
      <p>Бытовые инструменты рассчитаны на периодическую работу (до 2-3 часов в день с перерывами). Они дешевле, но имеют пластиковые шестерни и меньший ресурс. Профессиональные инструменты (например, Bosch Blue, Makita, DeWALT) рассчитаны на тяжелые условия работы в течение всей смены.</p>

      <h3>2. Аккумуляторная линейка — выгода единого стандарта</h3>
      <p>Современный тренд — покупка инструментов одной линейки, где один и тот же аккумулятор (например, 18V LXT у Makita или 18V XR у DeWALT) подходит к шуруповерту, болгарке, лобзику и перфоратору. Это позволяет экономить до 50% стоимости на покупке каркасов инструмента без АКБ.</p>
    `
  }
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  if (!isValidLocale(locale)) return null
  const isUk = locale === 'uk'

  const art = articles.find((a) => a.slug === slug)
  if (!art) notFound()

  const content = articleContents[slug] ?? { uk: '<p>Стаття знаходиться в процесі написання...</p>', ru: '<p>Статья находится в процессе написания...</p>' }

  const breadcrumbs = [
    { name: isUk ? 'Головна' : 'Главная', url: '/' },
    { name: isUk ? 'Блог та статті' : 'Блог и статьи', url: '/blog' as never },
    { name: art.title[locale as 'uk' | 'ru'] },
  ]

  // Поиск товаров по ключевым словам статьи
  const keywordConditions = art.productKeywords.map(keyword => ({
    OR: [
      {
        translations: {
          some: {
            locale,
            name: {
              contains: keyword,
              mode: 'insensitive' as const
            }
          }
        }
      },
      {
        sku: {
          contains: keyword,
          mode: 'insensitive' as const
        }
      }
    ]
  }))

  const rawProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: keywordConditions
    },
    take: 4,
    select: productCardSelect
  })

  const relatedProducts = rawProducts.map(mapProductDecimals)

  const schemaUrl = `${getSiteUrl()}/${locale}/blog/${slug}`
  const schemaImage = art.image.startsWith('http') ? art.image : `${getSiteUrl()}${art.image}`

  return (
    <div className="max-w-[960px] mx-auto px-4 py-6">
      {isFeatureEnabled('alpha12_article_schema_enabled') && (
        <ArticleSchema
          title={art.title[locale as 'uk' | 'ru']}
          description={art.summary[locale as 'uk' | 'ru']}
          url={schemaUrl}
          image={schemaImage}
          datePublished={art.date}
          dateModified={art.dateModified}
          locale={locale as 'uk' | 'ru'}
          type={art.type}
        />
      )}
      <Breadcrumbs items={breadcrumbs} locale={locale} />

      {/* Back button */}
      <Link 
        href={`/${locale}/blog` as never}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-muted hover:text-accent transition-colors mt-6"
      >
        <ArrowLeft className="size-4" />
        <span>{isUk ? 'Назад до статей' : 'Назад к статьям'}</span>
      </Link>

      <article className="mt-6 bg-surface-white border border-border rounded-3xl overflow-hidden shadow-xs">
        {/* Cover Image */}
        <div className="relative h-[320px] sm:h-[420px] w-full bg-surface-alt">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={art.image} 
            alt={art.title[locale as 'uk' | 'ru']}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <span className="bg-accent text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
              {art.categoryKeywords[0]}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-3 text-white">
              {art.title[locale as 'uk' | 'ru']}
            </h1>
            <div className="flex items-center gap-4 text-xs text-white/90 mt-4 font-medium">
              <span className="flex items-center gap-1">
                <Calendar className="size-3.5" />
                {art.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" />
                {art.readTime[locale as 'uk' | 'ru']}
              </span>
            </div>
          </div>
        </div>

        {/* Article Body */}
        <div className="p-6 sm:p-10">
          <p className="text-base sm:text-lg font-medium text-text-muted italic border-l-4 border-accent pl-4 mb-6 leading-relaxed">
            {art.summary[locale as 'uk' | 'ru']}
          </p>

          <div 
            className="prose prose-blue max-w-none text-text-primary text-sm sm:text-base leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: content[locale as 'uk' | 'ru'] }}
          />
        </div>
      </article>

      {/* Related Products from Electronom store */}
      {relatedProducts.length > 0 && (
        <section className="mt-12 pt-8 border-t border-border">
          <div className="flex items-center gap-2 mb-6">
            <div className="size-8 rounded-lg bg-accent text-white flex items-center justify-center shadow-sm">
              <Sparkles className="size-4" />
            </div>
            <h2 className="text-xl font-extrabold tracking-tight text-text-primary">
              {isUk ? 'Рекомендоване обладнання' : 'Рекомендуемое оборудование'}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((prod) => (
              <ProductCard 
                key={prod.id} 
                product={prod as never} 
                locale={locale as Locale} 
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
