# Elektronom · Перший hero-баннер для головної

Готовий до інтеграції набір баннерів для каруселі промо-зони.
Усі цифри й посилання — з реальних карток товарів elektronom.com.ua.

## Що відкрити в першу чергу

| Файл | Що в ньому |
|---|---|
| **`Banners.html`** | Майстер-канва з усіма 7 концептами + жива карусель з переходами. Відкрити в браузері. |
| **`standalone.html`** | Чисті фінальні баннери (без UI канви) — найкращі 4 з реальними фото, готові до показу замовнику. |
| **`HOMEPAGE_FIRST_BANNER_DESIGN_REPORT.md`** | Повний звіт: композиція, копія, лейєри, dev-нотатки, acceptance checklist. |

## Файлова структура

```
delivery/
├── README.md                          ← цей файл
├── HOMEPAGE_FIRST_BANNER_DESIGN_REPORT.md
├── Banners.html                       ← повна канва (7 концептів + 4 mobile + карусель)
├── standalone.html                    ← чисті preview найкращих 4
├── banner-styles.css                  ← усі токени, layout, transitions
├── banner-ui.jsx                      ← фони, іконки, SVG-плейсхолдери, ProductPhoto
├── banners.jsx                        ← 7 banner-компонентів + Carousel з переходами
└── design-canvas.jsx                  ← canvas-wrapper (тільки для Banners.html)
```

## Реальні фото / реальні дані

| # | Слайд | Фото | Дані з картки | Сторінка товару |
|---|---|---|---|---|
| A | Реле LY2 АСКО-УКРЕМ | ✅ images.prom.ua | AC 220V · 10A · 2CO/DPDT · від 77,25 ₴/шт (від 100 шт) | [p1554670317](https://elektronom.com.ua/p1554670317-rele-promezhutochnoe-ly2.html) |
| E | **Спецпропозиція** GT0401 | ✅ images.prom.ua | 3 т · 288–430 мм · **999 → 500 ₴ (-50%)** | [p2952960074](https://elektronom.com.ua/p2952960074-podstavka-pod-mashinu.html) |
| F | АВР Kraft KRF-ATS100A/2p | ✅ images.prom.ua | 100 A · 400 V · 50 мс · 51-00100 · 1 400 ₴ | [p2393369424](https://elektronom.com.ua/ua/p2393369424-avtomaticheskij-pereklyuchatel-avr.html) |
| C | Trinix LFP 12V20Ah | ✅ images.prom.ua | 12.8V · 20Ah · >4000 циклів · 256 Вт·год · 3 750 ₴ | [p2852315599](https://elektronom.com.ua/ua/p2852315599-akkumulyator-128v-12v20ah.html) |
| B | ПЗВ UTrust A0010210136 | ⚠ SVG-плейсхолдер | потребує підтвердження URL | — |
| G | Storm RT-0020 заклепковий | ⚠ SVG-плейсхолдер | потребує URL для elektronom | — |
| D | Категорійний (3 товари) | ⚠ SVG-плейсхолдер | groupа товарів | — |

> Замінити SVG-плейсхолдер на справжнє фото — це один рядок у `banners.jsx` (об'єкт `PHOTOS`).

## Як вставити в код сайту (швидкий шлях)

### 1. Стилі — додати в основну CSS

Усі змінні токенів і classes у `banner-styles.css`. Вже використовує стандартні `--accent`, `--text-primary` тощо. Можна додати як окремий файл або злити з основним.

### 2. Розмітка одного слайда

```html
<section class="eb" data-banner="A">
  <div class="eb__bg eb__bg--grid"><!-- inline SVG fade + grid --></div>
  <div class="eb__content">
    <div class="eb__copy">
      <span class="eb__badge"><span class="dot"></span>Топ продажів</span>
      <h1 class="eb__h1">Автоматика, що тримає <span class="em">живлення</span> під контролем</h1>
      <p class="eb__sub">ПЗВ, реле, перемикачі та модульне обладнання для стабільної роботи електромережі.</p>
      <div class="eb__chips">
        <span class="eb__chip eb__chip--num"><strong>AC 220 V</strong></span>
        <span class="eb__chip eb__chip--num"><strong>10 A</strong> комутації</span>
        <span class="eb__chip">2CO / DPDT</span>
        <span class="eb__chip eb__chip--success">✓ В наявності</span>
      </div>
      <div class="eb__cta-row">
        <a class="eb__btn" href="/p1554670317-rele-promezhutochnoe-ly2.html">
          Перейти до товарів →
        </a>
        <a class="eb__link" href="/g104766818-modulnoe-oborudovanie">Дивитись каталог</a>
      </div>
      <div class="eb__trust">✓ від 77,25 ₴/шт при замовленні від 100 шт</div>
    </div>
    <div class="eb__stage">
      <img src="https://images.prom.ua/3761061081_w640_h640_rele-promezhutochnoe-ly2.jpg"
           alt="Реле LY2 АСКО-УКРЕМ" style="mix-blend-mode: multiply">
      <div class="eb__stat" style="top:14%; right:4%">
        <span class="lbl">Напруга</span>
        <span class="val">220<em> V AC</em></span>
      </div>
    </div>
  </div>
</section>
```

### 3. Карусель

Стандартна swiper.js / glide.js / власна — підтримує цю розмітку напряму. У `banners.jsx`/`Carousel` компонент рідер показав, як працюють переходи (480 ms fade + slide-X).

CSS уже містить готові класи:
```
.carousel__slide              { opacity:0; transform:translateX(40px) }
.carousel__slide--active      { opacity:1; transform:translateX(0)   }
.carousel__slide--exit        { transform:translateX(-40px)          }
```

### 4. Адаптиви

```css
@media (max-width: 1280px) { /* compact: 1020×320, h1 32px */ }
@media (max-width: 1023px) { /* tablet: 768×320, h1 26px */ }
@media (max-width: 480px)  {
  /* mobile: 390×220, h1 22px,
     ховаємо subtitle, dim secondary link */
  .eb { flex-direction: column }
  .eb__sub { display: none }
}
```

Готові класи `.eb--compact`, `.eb--tablet`, `.eb--mobile` уже в CSS — можна додавати як modifier-клас, якщо не media-queries.

## Інтеграція реальних фото товарів

У `banners.jsx` об'єкт `PHOTOS` — поточні URL з prom.ua CDN. Для:

- **B (UTrust ПЗВ)** — поки `null` → рендериться SVG-плейсхолдер. Передати реальний URL з картки A0010210136.
- **G (Storm RT-0020)** — те саме.
- **D (категорійний)** — рендериться trio SVG, можна замінити на 3 реальні цулі.

Хочете локальні фото з `/public/images/products/`? Підставте локальний URL замість prom.ua — рендериться так само.

## Перелік концептів і коли який ставити

| Тиждень | Перший слайд каруселі | Чому |
|---|---|---|
| Звичайний | **A · Реле LY2** | Тематично точно по сайту: автоматика + B2B опт |
| Акційний | **E · Спецпропозиція GT0401** | Реальна знижка -50% з картки, чіткий CTA "Купити за 500 ₴" |
| Б/н з резервним | **F · АВР Kraft** | Нова актуальна категорія, технічний хук "50 мс" |
| Зима / блекаут | **C · Trinix LFP** | Резервне живлення — сезонна актуальність |

## Що змінювати ОБОВ'ЯЗКОВО перед запуском

- [ ] **`availability` API**: chip "В наявності" має бути динамічним, не статичним.
- [ ] **A · qty-break ціна** "77,25 ₴/шт від 100 шт" — підтвердити, що це досі актуально (вершина опту може змінюватися).
- [ ] **E · GT0401 -50%** — це акція "8 днів". Або зробити CMS-керованою кампанією, або задати дату закінчення.
- [ ] **Артикули в trust-рядку** — link на сторінку товару має вести на конкретний `p…html`.
- [ ] **RU-локалізація** копії всіх 7 слайдів (тексти готові тільки UA).
- [ ] Підтвердити URL для B (UTrust) і G (Storm) — поки SVG-плейсхолдер.

## Файли для дизайнера / Figma

Концепти зроблено в React + SVG inline. Якщо потрібен Figma-файл:
1. Відкрити `Banners.html` у браузері
2. Натиснути на потрібний артборд → іконку розгортання → fullscreen
3. Зробити screenshot або експортувати через DevTools (right click → Inspect → Capture node screenshot)

Або хочете готові PNG — скажіть, можу окремо згенерувати для кожного концепту.

---

**Контакт по дизайну**: цей пакет згенеровано через Claude Design. Усі правки — назад через те саме завдання.
