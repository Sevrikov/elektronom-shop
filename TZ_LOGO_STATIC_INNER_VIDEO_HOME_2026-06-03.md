# ТЗ — Логотип: видео только на главной, лёгкая статика на всех остальных страницах

> Дата: 2026-06-03. Правила: `MASTER_CONTEXT v1_02.md` (+addendum), без `any`, `next/image`, `lint`/`tsc`/`build` зелёные.
> Контекст: логотип в шапке сейчас — **анимированное видео `<video preload="auto">` ~1 МБ**, грузится на **каждой** странице сайта.

## 🎯 Проблема (замерено живьём на preview)
Логотип в `header.tsx` — `<video>` с `preload="auto"`:
- `electronom-light-60fps.webm` = **986.7 КБ**, `electronom-dark-60fps.webm` = **1.33 МБ**.
- Шапка глобальная → ~1 МБ тянется **на каждой** странице, целиком и заранее (`preload="auto"`), конкурируя с LCP-контентом. 60fps autoplay-луп = постоянная нагрузка на GPU/батарею.
- Это **самый тяжёлый ассет страницы**, тяжелее всех 24 миниатюр каталога вместе. Сводит на нет недавнюю оптимизацию INP/каталога.

## ✅ Решение
- **Главная** (`/uk`, `/ru`, `/`) — оставить анимированное видео-лого (первое впечатление), но облегчить: `poster` + `preload="none"` + грузить только текущую тему.
- **Все остальные страницы** (каталог, товар, инфо…) — **статичный лёгкий логотип** `next/image`, по теме (light/dark). Бонус: статичный `<img alt="Electronom">` лучше для SEO/доступности, чем `<video>`.

## 📦 Ассеты (УЖЕ в `public/logo/` — создавать не нужно)
Статика сгенерирована и проверена визуально (прозрачность RGBA, без артефактов):

| Файл | Назначение | Вес |
|---|---|---|
| `electronom-light.webp` | статичный лого — **светлая** тема (тёмно-синий) | **26.7 КБ** |
| `electronom-dark.webp` | статичный лого — **тёмная** тема (белый) | **23.1 КБ** |
| `electronom-light-transparent.png` | PNG-фолбэк, светлая (295×117) | 54 КБ |
| `electronom-dark-transparent.png` | PNG-фолбэк, тёмная (296×119) | 67 КБ |
| `electronom-light-60fps.webm` / `…-dark-60fps.webm` | видео — **только главная** + как `poster` берём webp выше | 987 КБ / 1.33 МБ |

> Статика ~23–27 КБ против ~1 МБ видео — **в ~37–58 раз легче** на каждой не-главной странице.

## 🔧 Изменение — один блок в `src/components/layout/header.tsx`

В компоненте уже есть `isDark` и `locale`. Добавить определение главной через `usePathname()` (header — клиентский компонент).

**БЫЛО** (≈ строки 159–172):
```tsx
{/* Full Logo (Desktop & Mobile) */}
<video
  key={isDark ? 'dark' : 'light'}
  src={isDark ? "/logo/electronom-dark-60fps.webm" : "/logo/electronom-light-60fps.webm"}
  autoPlay
  loop
  muted
  playsInline
  preload="auto"
  className="w-full h-full select-none"
  style={{ objectFit: 'contain' }}
/>
```

**СТАЛО:**
```tsx
{isHome ? (
  // Главная: анимированное видео, но с постером и без авто-предзагрузки
  <video
    key={isDark ? 'dark' : 'light'}
    src={isDark ? "/logo/electronom-dark-60fps.webm" : "/logo/electronom-light-60fps.webm"}
    poster={isDark ? "/logo/electronom-dark.webp" : "/logo/electronom-light.webp"}
    autoPlay
    loop
    muted
    playsInline
    preload="none"
    className="w-full h-full select-none"
    style={{ objectFit: 'contain' }}
  />
) : (
  // Остальные страницы: лёгкая статика по теме
  <Image
    src={isDark ? "/logo/electronom-dark.webp" : "/logo/electronom-light.webp"}
    alt="Electronom"
    width={isDark ? 296 : 295}
    height={isDark ? 119 : 117}
    priority
    sizes="180px"
    className="w-full h-full object-contain select-none"
  />
)}
```

Добавить в начало компонента (рядом с существующими хуками):
```tsx
import Image from 'next/image'
import { usePathname } from 'next/navigation'
// ...
const pathname = usePathname()
const isHome = pathname === `/${locale}` || pathname === `/${locale}/` || pathname === '/'
```

Заметки:
- `isDark` берётся из текущей темы как и раньше (поведение при гидрации не меняется — видео уже так работало).
- `priority` на статике — лого в шапке выше сгиба (LCP-кандидат).
- Размеры `<Link>` (`w-36 h-12 sm:w-[180px] sm:h-[64px]`) не трогаем — `w-full h-full object-contain` вписывает и видео, и `<Image>`.

## 🧹 Чистка `public/logo/` (важно — ~40 МБ мусора уходит в git и в каждый деплой)
Проверить `grep`-ом отсутствие ссылок и **удалить**:
- `electronom-dark-120fps (2).webm` — **17.9 МБ**
- `electronom-light-120fps (3).webm` — **16 МБ**
- дубли с суффиксами: `electronom-dark-60fps (1).webm`, `electronom-dark-60fps (2).webm`, `electronom-light-60fps (2).webm`
- `electronom.svg` — **2.1 МБ** (гигантский, вероятно неиспользуемый — проверить и удалить)
- лишние растровые дубли лого: `electronom-dark.png` (640 КБ), `electronom_dark.png` (301 КБ), `electronom-logo-source.png` (179 КБ) — оставить нужное, убрать дубли
- дубли SVG: `electronom-logo.svg`, `electronom_dark.svg`, `electronom-dark.svg` дублируют `electronom-logo-light.svg` — свести к одному набору
> Оставить рабочее: `electronom-{light,dark}.webp`, `electronom-{light,dark}-transparent.png`, `electronom-{light,dark}-60fps.webm`, `electronom-mark.svg`/`favicon.svg`, `Viber.webp`.

## ✅ Приёмка
- [ ] Не-главные страницы (`/ru/catalog/...`, `/ru/product/...`, инфо): лого = `next/image` webp, **< 30 КБ**, правильный по теме (светлая → тёмно-синий, тёмная → белый), чёткий, есть `alt="Electronom"`.
- [ ] В DevTools → Network на странице каталога **нет** запроса `.webm` лого (только webp ~23–27 КБ).
- [ ] Главная: анимация играет; есть `poster` (мгновенно виден лого); `preload="none"`; грузится только webm текущей темы.
- [ ] Светлая тема не показывает белый лого на белом фоне (визуально проверить обе темы).
- [ ] `public/logo/` очищен от многомегабайтного мусора; вес папки упал на ~40 МБ.
- [ ] `lint` / `tsc --noEmit` / `next build` зелёные.

## 📈 Ожидаемый эффект
Каждая не-главная страница: **−960 КБ … −1.3 МБ** на загрузку (лого 1 МБ → ~25 КБ), минус постоянный 60fps-декод. Главная: тот же видеоэффект, но без блокирующей предзагрузки (poster показывает лого сразу).

## Трассировка
Код: `src/components/layout/header.tsx` (блок логотипа, `<Link href={lp('/')}>`). Ассеты: `public/logo/`. Связано: общая работа по перфу (INP/каталог) — этот мегабайт сводил её эффект на нет на каждой загрузке.
