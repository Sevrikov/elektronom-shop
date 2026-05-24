/* global React */
/* uses globals: UI.* (from banner-ui.jsx) */
const { useState: _bUseState, useEffect: _bUseEffect } = React;
const useState = _bUseState;
const useEffect = _bUseEffect;
const {
  IconArrowRight, IconChevronRight, IconChevronLeft, IconCheck,
  IconZap, IconShield, IconBattery, IconCpu, IconBox, IconTruck,
  IconFlame, IconStar, IconCar,
  BgGrid, BgCircuit, BgSurge, BgPanel,
  ProductRelay, ProductRCCB, ProductBattery, ProductBatteryAGM,
  ProductJackStand, ProductATS, ProductRivetGun,
  ProductTrio, ProductPhoto,
} = window.UI;

// Real product photos served from elektronom.com.ua / prom.ua CDN.
// Replace these URLs when the team supplies higher-res transparent cutouts.
const PHOTOS = {
  relay:   'https://images.prom.ua/3761061081_w640_h640_rele-promezhutochnoe-ly2.jpg',
  rccb:    null, // ⚠ product URL/photo not yet confirmed for UTrust A0010210136
  battery: 'https://images.prom.ua/7352901500_w640_h640_akumulyator-128v-12v20ah.jpg',
  ats:     'https://images.prom.ua/6335425546_w640_h640_avtomatichnij-peremikach-avr.jpg',
  jack:    'https://images.prom.ua/7138921733_w640_h640_podstavka-pod-mashinu.jpg',
  rivet:   null, // ⚠ elektronom URL/photo not yet confirmed for STORM RT-0020
  agm:     null, // ⚠ elektronom URL/photo not yet confirmed for Trinix AGM 44-00049
};
// Image sizes per variant (max bounding box for the product photo)
const PSIZE = { desktop: 420, compact: 320, tablet: 220, mobile: 130 };

// ---------- carousel chrome shared piece ----------
function Chrome({ active = 0, total = 4 }) {
  return (
    <>
      <button className="eb__arrow eb__arrow--l" aria-label="Попередній">
        <IconChevronLeft size={18}/>
      </button>
      <button className="eb__arrow eb__arrow--r" aria-label="Наступний">
        <IconChevronRight size={18}/>
      </button>
      <div className="eb__dots">
        {Array.from({length: total}).map((_, i) => (
          <span key={i} className={"eb__dot" + (i === active ? " eb__dot--active" : "")}/>
        ))}
      </div>
    </>
  );
}

// ============================================================
// A · Реле LY2 — Автоматика
// ============================================================
function BannerAutomation({ variant = "desktop", showChrome = true }) {
  const modifier = variant === "compact" ? "eb--compact"
                 : variant === "tablet"  ? "eb--tablet"
                 : variant === "mobile"  ? "eb--mobile"
                 : "";
  const isMobile = variant === "mobile";
  return (
    <div className={"eb " + modifier}>
      <BgGrid/>
      <div className="eb__content">
        <div className="eb__copy">
          <span className="eb__badge">
            <span className="dot"/>Топ продажів
          </span>
          <h1 className="eb__h1">
            Автоматика, що тримає <span className="em">живлення</span> під контролем
          </h1>
          <p className="eb__sub">
            ПЗВ, реле, перемикачі та модульне обладнання для стабільної роботи електромережі.
          </p>
          <div className="eb__chips">
            <span className="eb__chip eb__chip--num"><strong>AC 220 V</strong></span>
            <span className="eb__chip eb__chip--num"><strong>10 A</strong> комутації</span>
            {!isMobile && <span className="eb__chip">2CO / DPDT</span>}
            {!isMobile && <span className="eb__chip"><span className="ico"><IconCpu size={13}/></span>Для автоматики</span>}
            <span className="eb__chip eb__chip--success">
              <span className="ico"><IconCheck size={13}/></span>В наявності
            </span>
          </div>
          <div className="eb__cta-row">
            <a className="eb__btn" href="#">
              Перейти до товарів
              <IconArrowRight size={16}/>
            </a>
            {!isMobile && <a className="eb__link" href="#">Дивитись каталог</a>}
          </div>
          {!isMobile && (
            <div className="eb__trust">
              <span className="ico"><IconCheck size={14}/></span>
              <span><strong style={{ color: '#1A1F2B', fontVariantNumeric: 'tabular-nums' }}>від 77,25 ₴/шт</strong> при замовленні від 100 шт</span>
            </div>
          )}
        </div>
        <div className="eb__stage">
          <div className="eb__product">
                        <ProductPhoto src={PHOTOS.relay} alt="Реле LY2 АСКО-УКРЕМ" fallback="relay" width={PSIZE[variant]} height={PSIZE[variant]}/>
            {!isMobile && (
              <>
                <div className="eb__stat" style={{ top: '14%', right: '4%' }}>
                  <span className="lbl">Напруга</span>
                  <span className="val">220<em> V AC</em></span>
                </div>
                <div className="eb__stat" style={{ bottom: '18%', right: '2%' }}>
                  <span className="lbl">Струм</span>
                  <span className="val">10<em> A</em></span>
                </div>
              </>
            )}
          </div>
          {!isMobile && <div className="eb__placeholder-note">Фото — elektronom.com.ua</div>}
        </div>
      </div>
      {showChrome && !isMobile && <Chrome active={0}/>}
      {showChrome && isMobile && <MobileChrome active={0}/>}
    </div>
  );
}

// ============================================================
// B · ПЗВ UTrust — Захист
// ============================================================
function BannerProtection({ variant = "desktop", showChrome = true }) {
  const modifier = variant === "compact" ? "eb--compact"
                 : variant === "tablet"  ? "eb--tablet"
                 : variant === "mobile"  ? "eb--mobile"
                 : "";
  const isMobile = variant === "mobile";
  return (
    <div className={"eb " + modifier}>
      <BgCircuit/>
      <div className="eb__content">
        <div className="eb__copy">
          <span className="eb__badge eb__badge--accent">
            <span className="dot"/>Новинка
          </span>
          <h1 className="eb__h1">
            Захист електромережі без зайвих <span className="em">компромісів</span>
          </h1>
          <p className="eb__sub">
            ПЗВ, реле напруги та модульна автоматика для дому і бізнесу — підбір під ваш щит.
          </p>
          <div className="eb__chips">
            <span className="eb__chip eb__chip--num"><strong>40 A</strong></span>
            <span className="eb__chip eb__chip--num"><strong>30 mA</strong></span>
            <span className="eb__chip">Тип A</span>
            {!isMobile && <span className="eb__chip"><span className="ico"><IconShield size={13}/></span>Захист лінії</span>}
          </div>
          <div className="eb__cta-row">
            <a className="eb__btn" href="#">
              Підібрати модуль
              <IconArrowRight size={16}/>
            </a>
            {!isMobile && <a className="eb__link" href="#">Каталог автоматики</a>}
          </div>
        </div>
        <div className="eb__stage">
          <div className="eb__product">
                        <ProductPhoto src={PHOTOS.rccb} alt="ПЗВ UTrust 1P+N" fallback="rccb" width={PSIZE[variant]} height={PSIZE[variant] * 1.15}/>
            {!isMobile && (
              <>
                <div className="eb__stat" style={{ top: '8%', left: '0%' }}>
                  <span className="lbl">Чутливість</span>
                  <span className="val">30<em> mA</em></span>
                </div>
                <div className="eb__stat" style={{ bottom: '14%', right: '0%' }}>
                  <span className="lbl">Номінал</span>
                  <span className="val">40<em> A</em></span>
                </div>
              </>
            )}
          </div>
          {!isMobile && <div className="eb__placeholder-note">⚠ Фото — placeholder, URL товару підтвердити</div>}
        </div>
      </div>
      {showChrome && !isMobile && <Chrome active={1}/>}
      {showChrome && isMobile && <MobileChrome active={1}/>}
    </div>
  );
}

// ============================================================
// C · Акумулятор Trinix — Резервне живлення
// ============================================================
function BannerBackup({ variant = "desktop", showChrome = true }) {
  const modifier = variant === "compact" ? "eb--compact"
                 : variant === "tablet"  ? "eb--tablet"
                 : variant === "mobile"  ? "eb--mobile"
                 : "";
  const isMobile = variant === "mobile";
  return (
    <div className={"eb " + modifier}>
      <BgSurge/>
      <div className="eb__content">
        <div className="eb__copy">
          <span className="eb__badge"><span className="dot"/>Серія Trinix</span>
          <h1 className="eb__h1">
            Резервне живлення, коли воно <span className="em">справді</span> потрібне
          </h1>
          <p className="eb__sub">
            Акумулятори, ДБЖ та рішення для стабільної роботи обладнання — від охоронних систем до котлів.
          </p>
          <div className="eb__chips">
            <span className="eb__chip eb__chip--num"><strong>12.8 V</strong></span>
            <span className="eb__chip eb__chip--num"><strong>20 Ah</strong></span>
            {!isMobile && <span className="eb__chip">LiFePO4</span>}
            {!isMobile && <span className="eb__chip eb__chip--num">&gt; <strong>4000</strong> циклів</span>}
            <span className="eb__chip eb__chip--success">
              <span className="ico"><IconCheck size={13}/></span>В наявності
            </span>
          </div>
          <div className="eb__cta-row">
            <a className="eb__btn" href="#">
              До акумуляторів
              <IconArrowRight size={16}/>
            </a>
            {!isMobile && <a className="eb__link" href="#">Решта серії Trinix</a>}
          </div>
        </div>
        <div className="eb__stage">
          <div className="eb__product">
                        <ProductPhoto src={PHOTOS.battery} alt="Акумулятор Trinix LFP 12V20Ah LiFePO4" fallback="battery" width={PSIZE[variant]} height={PSIZE[variant] * 0.85}/>
            {!isMobile && (
              <>
                <div className="eb__stat" style={{ top: '10%', right: '0%' }}>
                  <span className="lbl">Енергія</span>
                  <span className="val">256<em> Вт·год</em></span>
                </div>
                <div className="eb__stat" style={{ bottom: '16%', left: '0%' }}>
                  <span className="lbl">Ресурс</span>
                  <span className="val">&gt;4000<em> циклів</em></span>
                </div>
              </>
            )}
          </div>
          {!isMobile && <div className="eb__placeholder-note">Фото — elektronom.com.ua</div>}
        </div>
      </div>
      {showChrome && !isMobile && <Chrome active={2}/>}
      {showChrome && isMobile && <MobileChrome active={2}/>}
    </div>
  );
}

// ============================================================
// D · Категорійний — Автоматика та резервне живлення
// ============================================================
function BannerCategory({ variant = "desktop", showChrome = true }) {
  const modifier = variant === "compact" ? "eb--compact"
                 : variant === "tablet"  ? "eb--tablet"
                 : variant === "mobile"  ? "eb--mobile"
                 : "";
  const isMobile = variant === "mobile";
  return (
    <div className={"eb " + modifier}>
      <BgPanel/>
      <div className="eb__content">
        <div className="eb__copy">
          <span className="eb__badge"><span className="dot"/>Популярні позиції тижня</span>
          <h1 className="eb__h1">
            Автоматика та резервне живлення для <span className="em">дому і бізнесу</span>
          </h1>
          <p className="eb__sub">
            Перевірені товари з наявності та швидкою доставкою Новою поштою по Україні.
          </p>
          <div className="eb__chips">
            <span className="eb__chip"><span className="ico"><IconCpu size={13}/></span>Автоматика</span>
            <span className="eb__chip"><span className="ico"><IconShield size={13}/></span>ПЗВ</span>
            <span className="eb__chip"><span className="ico"><IconBattery size={13}/></span>Акумулятори</span>
            {!isMobile && <span className="eb__chip"><span className="ico"><IconTruck size={13}/></span>Швидка доставка</span>}
          </div>
          <div className="eb__cta-row">
            <a className="eb__btn" href="#">
              Перейти до товарів
              <IconArrowRight size={16}/>
            </a>
            {!isMobile && <a className="eb__link" href="#">Дивитись усі категорії</a>}
          </div>
        </div>
        <div className="eb__stage" style={{ flex: '0 0 50%' }}>
          <div className="eb__product">
            <ProductTrio scale={variant === "compact" ? 0.85 : variant === "tablet" ? 0.72 : variant === "mobile" ? 0.6 : 1}/>
          </div>
          {!isMobile && <div className="eb__placeholder-note">Композиція — фото реальних товарів</div>}
        </div>
      </div>
      {showChrome && !isMobile && <Chrome active={3}/>}
      {showChrome && isMobile && <MobileChrome active={3}/>}
    </div>
  );
}

// ============================================================
// Mobile carousel chrome — inline dots only
// ============================================================
function MobileChrome({ active = 0, total = 4 }) {
  return (
    <div style={{
      position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
      display: 'flex', gap: 4, zIndex: 5,
    }}>
      {Array.from({length: total}).map((_, i) => (
        <span key={i} style={{
          width: i === active ? 16 : 5, height: 5, borderRadius: 3,
          background: i === active ? '#3B7BD9' : '#D5DCE5',
          transition: 'width 120ms',
        }}/>
      ))}
    </div>
  );
}

// ============================================================
// E · Спецпропозиція — INTERTOOL GT0401 (top by revenue)
// ============================================================
function BannerOfferJack({ variant = "desktop", showChrome = true, active = 4 }) {
  const modifier = variant === "compact" ? "eb--compact"
                 : variant === "tablet"  ? "eb--tablet"
                 : variant === "mobile"  ? "eb--mobile"
                 : "";
  const isMobile = variant === "mobile";
  return (
    <div className={"eb " + modifier}>
      <BgPanel/>
      <div className="eb__content">
        <div className="eb__copy">
          <span className="eb__badge eb__badge--offer">
            <span className="dot"/>Спецпропозиція − 50%
          </span>
          <h1 className="eb__h1">
            <span className="em">INTERTOOL GT0401</span> — підставка під машину 3 т за пів ціни
          </h1>
          <p className="eb__sub">
            Реєчна підставка з регулюванням висоти 288–430 мм. Готова до відправки — акція діє ще 8 днів.
          </p>
          <div className="eb__chips">
            <span className="eb__chip eb__chip--num"><strong>3 т</strong></span>
            <span className="eb__chip eb__chip--num"><strong>288–430</strong> мм</span>
            {!isMobile && <span className="eb__chip">Сталь · 5 кг</span>}
            {!isMobile && <span className="eb__chip"><span className="ico"><IconCar size={13}/></span>Авто-сервіс</span>}
            <span className="eb__chip eb__chip--success">
              <span className="ico"><IconCheck size={13}/></span>Готово до відправки
            </span>
          </div>
          <div className="eb__cta-row">
            <a className="eb__btn" href="https://elektronom.com.ua/p2952960074-podstavka-pod-mashinu.html">
              Купити за 500 ₴
              <IconArrowRight size={16}/>
            </a>
            {!isMobile && <a className="eb__link" href="#">Каталог автоінструменту</a>}
          </div>
          {!isMobile && (
            <div className="eb__trust">
              <span className="ico"><IconCheck size={14}/></span>
              <span>Артикул <strong style={{ color: '#1A1F2B' }}>GT0401</strong> · <s style={{ color: '#6A7280' }}>999 ₴</s> <strong style={{ color: '#C13B3B', fontVariantNumeric: 'tabular-nums' }}>500 ₴</strong> · економія 499 ₴</span>
            </div>
          )}
        </div>
        <div className="eb__stage">
          <div className="eb__product">
            <ProductPhoto src={PHOTOS.jack} alt="Підставка під машину 3т INTERTOOL GT0401" fallback="jack" width={PSIZE[variant]} height={PSIZE[variant] * 1.05}/>
            {!isMobile && (
              <>
                <div className="eb__stat" style={{ top: '8%', right: '0%', background: '#C13B3B', borderColor: 'transparent', color: '#fff' }}>
                  <span className="lbl" style={{ color: 'rgba(255,255,255,0.85)' }}>Знижка</span>
                  <span className="val" style={{ color: '#fff' }}>− 50<em style={{ color: 'rgba(255,255,255,0.7)' }}>%</em></span>
                </div>
                <div className="eb__stat" style={{ bottom: '14%', left: '0%' }}>
                  <span className="lbl">Висота</span>
                  <span className="val">288–430<em> мм</em></span>
                </div>
              </>
            )}
          </div>
          {!isMobile && <div className="eb__placeholder-note">Фото — elektronom.com.ua</div>}
        </div>
      </div>
      {showChrome && !isMobile && <Chrome active={active}/>}
      {showChrome && isMobile && <MobileChrome active={active}/>}
    </div>
  );
}

// ============================================================
// F · АВР Kraft KRF-ATS100A — автоматичне резервування
// ============================================================
function BannerATS({ variant = "desktop", showChrome = true, active = 5 }) {
  const modifier = variant === "compact" ? "eb--compact"
                 : variant === "tablet"  ? "eb--tablet"
                 : variant === "mobile"  ? "eb--mobile"
                 : "";
  const isMobile = variant === "mobile";
  return (
    <div className={"eb " + modifier}>
      <BgCircuit/>
      <div className="eb__content">
        <div className="eb__copy">
          <span className="eb__badge eb__badge--dark">
            <span className="dot"/>Новинка тижня
          </span>
          <h1 className="eb__h1">
            АВР Kraft: <span className="em">резервування за 50 мс</span>
          </h1>
          <p className="eb__sub">
            Автоматичний перемикач мережа/генератор KRF-ATS100A/2p — для дому, офісу, серверної та малого виробництва.
          </p>
          <div className="eb__chips">
            <span className="eb__chip eb__chip--num"><strong>100 A</strong></span>
            <span className="eb__chip eb__chip--num"><strong>400 V</strong> AC</span>
            {!isMobile && <span className="eb__chip eb__chip--num"><strong>50 мс</strong> перемикання</span>}
            {!isMobile && <span className="eb__chip">2 полюси · DIN</span>}
            <span className="eb__chip eb__chip--success">
              <span className="ico"><IconCheck size={13}/></span>Готово до відправки
            </span>
          </div>
          <div className="eb__cta-row">
            <a className="eb__btn" href="https://elektronom.com.ua/ua/p2393369424-avtomaticheskij-pereklyuchatel-avr.html">
              До товару
              <IconArrowRight size={16}/>
            </a>
            {!isMobile && <a className="eb__link" href="#">Категорія АВР</a>}
          </div>
          {!isMobile && (
            <div className="eb__trust">
              <span className="ico"><IconCheck size={14}/></span>
              <span>Артикул <strong style={{ color: '#1A1F2B' }}>51-00100</strong> · <strong style={{ color: '#1A1F2B' }}>1 400 ₴</strong> · гарантія 12 міс</span>
            </div>
          )}
        </div>
        <div className="eb__stage">
          <div className="eb__product">
            <ProductPhoto src={PHOTOS.ats} alt="АВР Kraft KRF-ATS100A/2p" fallback="ats" width={PSIZE[variant]} height={PSIZE[variant] * 1.05}/>
            {!isMobile && (
              <>
                <div className="eb__stat" style={{ top: '8%', left: '0%' }}>
                  <span className="lbl">Номінал</span>
                  <span className="val">100<em> A</em></span>
                </div>
                <div className="eb__stat" style={{ bottom: '14%', right: '0%' }}>
                  <span className="lbl">Перемикання</span>
                  <span className="val">50<em> мс</em></span>
                </div>
              </>
            )}
          </div>
          {!isMobile && <div className="eb__placeholder-note">Фото — elektronom.com.ua</div>}
        </div>
      </div>
      {showChrome && !isMobile && <Chrome active={active}/>}
      {showChrome && isMobile && <MobileChrome active={active}/>}
    </div>
  );
}

// ============================================================
// G · Заклепковий пістолет INTERTOOL Storm RT-0020
// ============================================================
function BannerRivetGun({ variant = "desktop", showChrome = true, active = 6 }) {
  const modifier = variant === "compact" ? "eb--compact"
                 : variant === "tablet"  ? "eb--tablet"
                 : variant === "mobile"  ? "eb--mobile"
                 : "";
  const isMobile = variant === "mobile";
  return (
    <div className={"eb " + modifier}>
      <BgGrid/>
      <div className="eb__content">
        <div className="eb__copy">
          <span className="eb__badge">
            <span className="dot"/>STORM серія
          </span>
          <h1 className="eb__h1">
            Storm — професійна <span className="em">заклепка</span> від M3 до M10
          </h1>
          <p className="eb__sub">
            Заклепковий пістолет для різьбових заклепок 360 мм. Робота однією рукою, шість змінних головок у комплекті.
          </p>
          <div className="eb__chips">
            <span className="eb__chip eb__chip--num"><strong>M3 – M10</strong></span>
            <span className="eb__chip eb__chip--num"><strong>360</strong> мм</span>
            {!isMobile && <span className="eb__chip">6 насадок</span>}
            <span className="eb__chip eb__chip--success">
              <span className="ico"><IconCheck size={13}/></span>В наявності
            </span>
          </div>
          <div className="eb__cta-row">
            <a className="eb__btn" href="#">
              До товару
              <IconArrowRight size={16}/>
            </a>
            {!isMobile && <a className="eb__link" href="#">Решта серії Storm</a>}
          </div>
          {!isMobile && (
            <div className="eb__trust">
              <span className="ico"><IconCheck size={14}/></span>
              <span>Артикул <strong style={{ color: '#1A1F2B' }}>RT-0020</strong> · в наявності 7 шт</span>
            </div>
          )}
        </div>
        <div className="eb__stage">
          <div className="eb__product">
            <ProductPhoto src={null} alt="Заклепковий пістолет Storm INTERTOOL RT-0020" fallback="rivet" width={PSIZE[variant] * 1.2} height={PSIZE[variant] * 0.8}/>
          </div>
          {!isMobile && <div className="eb__placeholder-note">⚠ Фото — placeholder, додати реальне</div>}
        </div>
      </div>
      {showChrome && !isMobile && <Chrome active={active}/>}
      {showChrome && isMobile && <MobileChrome active={active}/>}
    </div>
  );
}

// ============================================================
// Live carousel — animated transitions between selected slides
// ============================================================
function Carousel({ slides, variant = "desktop", autoplay = false, intervalMs = 6500 }) {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState(null);
  const total = slides.length;

  const go = (next) => {
    if (next === active) return;
    setPrev(active);
    setActive(next);
    setTimeout(() => setPrev(null), 520);
  };
  const nextSlide = () => go((active + 1) % total);
  const prevSlide = () => go((active - 1 + total) % total);

  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(nextSlide, intervalMs);
    return () => clearInterval(id);
  }, [active, autoplay, intervalMs]);

  return (
    <div className="carousel">
      <div className="carousel__track">
        {slides.map((SlideComp, i) => (
          <div
            key={i}
            className={
              "carousel__slide" +
              (i === active ? " carousel__slide--active" : "") +
              (i === prev ? " carousel__slide--exit" : "")
            }
            aria-hidden={i !== active}
          >
            <SlideComp variant={variant} showChrome={false}/>
          </div>
        ))}
      </div>
      {/* Chrome */}
      <button className="eb__arrow eb__arrow--l" onClick={prevSlide} aria-label="Попередній">
        <IconChevronLeft size={18}/>
      </button>
      <button className="eb__arrow eb__arrow--r" onClick={nextSlide} aria-label="Наступний">
        <IconChevronRight size={18}/>
      </button>
      <div className="eb__dots">
        {slides.map((_, i) => (
          <span
            key={i}
            className={"eb__dot" + (i === active ? " eb__dot--active" : "")}
            onClick={() => go(i)}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </div>
    </div>
  );
}

window.Banners = {
  BannerAutomation, BannerProtection, BannerBackup, BannerCategory,
  BannerOfferJack, BannerATS, BannerRivetGun,
  Carousel,
};
