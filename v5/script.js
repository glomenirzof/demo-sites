/* =============================================================
   script.js — данные сайта и логика

   Файл разделён на две части:
   ЧАСТЬ 1. ДАННЫЕ — всё, что вы будете менять под клиента
            (название, ссылки, цены, мастера, отзывы, тексты).
   ЧАСТЬ 2. ЛОГИКА — код, который берёт данные и показывает их
            на странице. Его обычно трогать не нужно.
   ============================================================= */


/* =============================================================
   ЧАСТЬ 1. ДАННЫЕ
   ============================================================= */

/* ---------- 1.1 Основные настройки ----------
   Название, адрес, ссылки, телефон, часы, услуги и мастера — в data/site.js.
   Здесь только собираем их в CONFIG для страницы */
const CONFIG = {
  name: SITE.salon.name,
  shortName: SITE.salon.shortName,
  bookingUrl: SITE.salon.freshaLink,   // запасная ссылка, если JavaScript выключен
  phone: SITE.salon.phone,
  phoneRaw: SITE.salon.phoneRaw,
  whatsapp: SITE.salon.whatsapp,
  instagramUrl: SITE.salon.instagramUrl,
  instagramHandle: SITE.salon.instagramHandle,
  address: SITE.salon.address,
  mapsUrl: SITE.salon.mapsUrl,
  mapEmbedUrl: SITE.salon.mapEmbedUrl,
  hours: SITE.hours,

  // Язык, который открывается первым
  defaultLanguage: "lv",
};

// Путь к корню сайта: на главной "", на странице мастера "../" (body data-root)
const ROOT = document.body.dataset.root || "";

// Инициалы для мастеров без фото: "Daniels" → "D"
function initials(name) {
  return name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}


/* ---------- Цены ----------
   У каждого мастера свои цены (SITE.masters[].prices), три состояния:
   { p, from } — цена; null — делает, цена неизвестна; нет ключа — НЕ делает услугу */
function serviceById(id) {
  return SITE.services.find((s) => s.id === id);
}

function masterBySlug(slug) {
  return SITE.masters.find((m) => m.slug === slug);
}

// Делает ли мастер эту услугу
function offers(master, service) {
  return !!master.prices && Object.prototype.hasOwnProperty.call(master.prices, service.id);
}

// Цена услуги у мастера: { price, from, known } или null, если мастер её не делает
function priceFor(master, service) {
  if (!offers(master, service)) return null;
  const value = master.prices[service.id];
  return value == null
    ? { price: null, from: true, known: false }
    : { price: value.p, from: value.from, known: true };
}

// Мастера, которые делают ВСЕ выбранные услуги
function mastersFor(serviceIds) {
  return SITE.masters.filter((m) => serviceIds.every((id) => offers(m, serviceById(id))));
}

// Фото услуги: services[].image — путь или { src, isReal }. Возвращает { src, real } или null
function serviceImage(service) {
  const img = service.image;
  if (!img) return null;
  return typeof img === "string" ? { src: img, real: false } : { src: img.src, real: img.isReal === true };
}

// Минимальная цена услуги по салону: по известным ценам мастеров, иначе fromPrice
function minPrice(service, masters = SITE.masters) {
  const known = masters.map((m) => priceFor(m, service)).filter((p) => p && p.known).map((p) => p.price);
  return known.length ? Math.min(...known) : service.fromPrice;
}

// Сумма услуг у мастера: { price, from, known } или null, если он делает не всё
function sumFor(master, serviceIds) {
  let price = 0;
  let from = false;
  let known = true;
  for (const id of serviceIds) {
    const p = priceFor(master, serviceById(id));
    if (!p) return null;
    if (!p.known) { known = false; continue; }
    price += p.price;
    if (p.from) from = true;
  }
  return { price, from, known };
}

// «Любой мастер»: самая низкая сумма среди тех, кто делает всё выбранное.
// null — такого мастера нет
function sumAny(serviceIds) {
  const able = mastersFor(serviceIds);
  if (!able.length) return null;
  const sums = able.map((m) => sumFor(m, serviceIds)).filter((x) => x.known);
  if (!sums.length) return { price: null, from: true, known: false };
  return { price: Math.min(...sums.map((x) => x.price)), from: true, known: true };
}

// Сумма в евро: «15 €» (LV/RU) или «€15» (EN)
function money(value) {
  return currentLang === "en" ? `€${value}` : `${value} €`;
}

// «от 15 €», «20 €» (фиксированная) или «цену уточнить»
function priceText(p) {
  if (!p.known) return t("common.priceUnknown");
  return (p.from ? t("common.from") + " " : "") + money(p.price);
}

/* Длительность услуги — всегда в минутах, без часов:
   formatDuration(25, 60) → «25–60 min», formatDuration(60, 60) → «60 min».
   Одна функция для главной, страниц мастеров и окна записи */
const MINUTES = { lv: "min", ru: "мин", en: "min" };

function formatDuration(min, max, lang = currentLang) {
  const unit = MINUTES[lang] || MINUTES.en;
  return min === max || max == null ? `${min} ${unit}` : `${min}-${max} ${unit}`;
}


/* ---------- 1.4 Галерея работ: просто список файлов ---------- */
const GALLERY = [
  "images/gallery-1.jpg",
  "images/gallery-2.jpg",
  "images/gallery-3.jpg",
  "images/gallery-4.jpg",
  "images/gallery-5.jpg",
  "images/gallery-6.jpg",
  "images/gallery-7.jpg",
  "images/gallery-8.jpg",
];


/* ---------- 1.5 Отзывы ----------
   Отзывы, рейтинг и пометка «пример» — в data/site.js (SITE.reviews) */


/* ---------- 1.6 Тексты сайта на трёх языках ----------
   В HTML у элемента стоит, например, data-i18n="hero.title".
   Скрипт находит здесь TEXTS[язык].hero.title и вставляет текст.
   Чтобы поменять фразу — меняйте её здесь во всех трёх языках.
*/
const TEXTS = {
  /* ===== LATVIEŠU ===== */
  lv: {
    meta: {
      title: "Dont Tell Mom Barbershop, Rīga",
      description: "Vīriešu frizūras, fade un bārdas kopšana Rīgas centrā. Pieraksts tiešsaistē minūtes laikā.",
    },
    common: { book: "Pierakstīties", min: "min", h: "st.", from: "no", priceUnknown: "cena jāprecizē" },
    roles: { senior: "Vecākais bārddzinis", barber: "Bārddzinis", junior: "Jaunākais bārddzinis" },
    nav: {
      about: "Par mums", services: "Pakalpojumi", team: "Meistari",
      gallery: "Darbi", reviews: "Atsauksmes", contacts: "Kontakti", shop: "Veikals",
      open: "Atvērt izvēlni",
    },
    hero: {
      eyebrow: "Barbershop · Rīga",
      title: "Vīriešu frizūras Rīgas centrā",
      text: "Fade, klasiskie griezumi un bārda. Pieraksts tiešsaistē, kafija gaidot.",
      prices: "Pakalpojumi un cenas",
    },
    about: {
      label: "Par mums",
      title: "Barbershop Avotu ielā 34",
      p1: "Dont Tell Mom ir vīriešu frizētava Rīgas centrā. Pirms griešanas pajautājam, kā jūs ieveidojat matus un cik laika tam veltāt, un tikai tad izvēlamies formu.",
      p2: "Gribat parunāties, parunāsim. Gribat klusumu, arī labi.",
      photoAlt: "Meistars darbā Dont Tell Mom salonā",
    },
    principles: {
      label: "Mūsu principi",
      title: "Kā mēs strādājam",
      p1title: "Bez konveijera",
      p1text: "Katram klientam pietiekami daudz laika. Mēs nesteidzamies pie nākamā.",
      p2title: "Padoms, ne tikai frizūra",
      p2text: "Godīgi pateiksim, kas piestāv jūsu sejai un matu tipam, pat ja plānojāt ko citu.",
      p3title: "Vienmēr tīrs",
      p3text: "Dezinficēti instrumenti un tīrs dvielis katram klientam. Bez izņēmumiem.",
      p4title: "Viegli pierakstīties",
      p4text: "Pieraksts tiešsaistē minūtes laikā jebkurā diennakts laikā. Kavējat? Vienkārši uzrakstiet mums.",
    },
    services: {
      label: "Pakalpojumi",
      title: "Pakalpojumi un cenas",
      note: "Cenas no. Precīza cena atkarīga no meistara.",
      shop: "CRAZY BULL kosmētika, veikals",
      shopNote: "Matu un bārdas kopšanas līdzekļi, ko lietojam paši",
      tabHaircut: "Matu griezumi", tabBeard: "Bārda", tabExtras: "Papildus",
    },
    team: { label: "Komanda", title: "Mūsu meistari", page: "Meistara lapa" },
    gallery: { label: "Portfolio", title: "Mūsu darbi", alt: "Frizūra" },
    reviews: {
      label: "Atsauksmes", title: "Ko saka klienti",
      ratingText: "vidējais vērtējums",
    },
    insta: {
      title: "Jauni darbi katru nedēļu",
      text: "Foto pirms un pēc, jaunas frizūras un brīvie laiki mūsu Instagram.",
    },
    contacts: {
      label: "Kontakti", title: "Kā mūs atrast",
      address: "Adrese", hours: "Darba laiks", phone: "Tālrunis",
      whatsapp: "Rakstīt WhatsApp",
      mapShow: "Rādīt karti",
      mapNote: "Ielādējot karti, Google var saglabāt sīkdatnes.",
      mapOpen: "Atvērt Google Maps",
    },
    days: { monFri: "P-Pk", sat: "Sestdiena", sun: "Svētdiena" },
    footer: { tagline: "Barbershop Rīgas centrā" },
  },

  /* ===== РУССКИЙ ===== */
  ru: {
    meta: {
      title: "Dont Tell Mom Barbershop, Рига",
      description: "Мужские стрижки, фейды и уход за бородой в центре Риги. Онлайн-запись за минуту.",
    },
    common: { book: "Записаться", min: "мин", h: "ч", from: "от", priceUnknown: "цену уточнить" },
    roles: { senior: "Старший барбер", barber: "Барбер", junior: "Младший барбер" },
    nav: {
      about: "О нас", services: "Услуги", team: "Мастера",
      gallery: "Работы", reviews: "Отзывы", contacts: "Контакты", shop: "Магазин",
      open: "Открыть меню",
    },
    hero: {
      eyebrow: "Барбершоп · Рига",
      title: "Мужские стрижки в центре Риги",
      text: "Фейды, классические стрижки и борода. Запись онлайн, кофе пока ждёте.",
      prices: "Услуги и цены",
    },
    about: {
      label: "О нас",
      title: "Барбершоп на Avotu iela 34",
      p1: "Dont Tell Mom, мужской барбершоп в центре Риги. Перед стрижкой спросим, как вы укладываете волосы и сколько времени на это тратите, и только потом выберем форму.",
      p2: "Хотите поговорить, поговорим. Хотите помолчать, тоже хорошо.",
      photoAlt: "Мастер за работой в Dont Tell Mom",
    },
    principles: {
      label: "Наши принципы",
      title: "Как мы работаем",
      p1title: "Без конвейера",
      p1text: "Каждому клиенту хватает времени. Мы не торопимся к следующему.",
      p2title: "Совет, а не только стрижка",
      p2text: "Честно скажем, что подойдёт к вашему лицу и типу волос, даже если вы планировали другое.",
      p3title: "Всегда чисто",
      p3text: "Продезинфицированные инструменты и свежее полотенце для каждого клиента. Без исключений.",
      p4title: "Легко записаться",
      p4text: "Онлайн-запись за минуту в любое время суток. Опаздываете? Просто напишите нам.",
    },
    services: {
      label: "Услуги",
      title: "Услуги и цены",
      note: "Цены от. Точная цена зависит от мастера.",
      shop: "Косметика CRAZY BULL, магазин",
      shopNote: "Средства для волос и бороды, которыми работаем сами",
      tabHaircut: "Стрижки", tabBeard: "Борода", tabExtras: "Дополнительно",
    },
    team: { label: "Команда", title: "Наши мастера", page: "Страница мастера" },
    gallery: { label: "Портфолио", title: "Наши работы", alt: "Стрижка" },
    reviews: {
      label: "Отзывы", title: "Что говорят клиенты",
      ratingText: "средняя оценка",
    },
    insta: {
      title: "Новые работы каждую неделю",
      text: "Фото до и после, новые стрижки и свободные окошки в нашем Instagram.",
    },
    contacts: {
      label: "Контакты", title: "Как нас найти",
      address: "Адрес", hours: "Часы работы", phone: "Телефон",
      whatsapp: "Написать в WhatsApp",
      mapShow: "Показать карту",
      mapNote: "При загрузке карты Google может сохранить cookie.",
      mapOpen: "Открыть в Google Maps",
    },
    days: { monFri: "Пн-Пт", sat: "Суббота", sun: "Воскресенье" },
    footer: { tagline: "Барбершоп в центре Риги" },
  },

  /* ===== ENGLISH ===== */
  en: {
    meta: {
      title: "Dont Tell Mom Barbershop, Riga",
      description: "Men's haircuts, fades and beard care in central Riga. Book online in a minute.",
    },
    common: { book: "Book now", min: "min", h: "h", from: "from", priceUnknown: "price TBC" },
    roles: { senior: "Senior Barber", barber: "Barber", junior: "Junior Barber" },
    nav: {
      about: "About", services: "Services", team: "Barbers",
      gallery: "Work", reviews: "Reviews", contacts: "Contact", shop: "Shop",
      open: "Open menu",
    },
    hero: {
      eyebrow: "Barbershop · Riga",
      title: "Men's haircuts in central Riga",
      text: "Fades, classic cuts and beards. Book online, coffee while you wait.",
      prices: "Services & prices",
    },
    about: {
      label: "About us",
      title: "Barbershop on Avotu iela 34",
      p1: "Dont Tell Mom is a men's barbershop in central Riga. Before we start, we ask how you style your hair and how much time you spend on it, then pick the cut.",
      p2: "Feel like talking? Let's talk. Prefer some quiet? That's fine too.",
      photoAlt: "Barber at work in Dont Tell Mom",
    },
    principles: {
      label: "Our principles",
      title: "How we work",
      p1title: "No conveyor belt",
      p1text: "Every client gets enough time. We never rush to the next one.",
      p2title: "Advice, not just a cut",
      p2text: "We'll tell you honestly what suits your face and hair type, even if you planned something else.",
      p3title: "Clean, always",
      p3text: "Disinfected tools and a fresh towel for every client. No exceptions.",
      p4title: "Easy to book",
      p4text: "Book online in a minute, day or night. Running late? Just send us a message.",
    },
    services: {
      label: "Services",
      title: "Services & prices",
      note: "Prices start from. The exact price depends on the barber.",
      shop: "CRAZY BULL grooming, shop",
      shopNote: "Hair and beard products we use ourselves",
      tabHaircut: "Haircuts", tabBeard: "Beard", tabExtras: "Extras",
    },
    team: { label: "Team", title: "Our barbers", page: "Barber page" },
    gallery: { label: "Portfolio", title: "Our work", alt: "Haircut" },
    reviews: {
      label: "Reviews", title: "What clients say",
      ratingText: "average rating",
    },
    insta: {
      title: "Fresh cuts every week",
      text: "Before-and-after photos, new styles and open slots on our Instagram.",
    },
    contacts: {
      label: "Contact", title: "Find us",
      address: "Address", hours: "Opening hours", phone: "Phone",
      whatsapp: "Message on WhatsApp",
      mapShow: "Show map",
      mapNote: "Loading the map lets Google set cookies.",
      mapOpen: "Open in Google Maps",
    },
    days: { monFri: "Mon-Fri", sat: "Saturday", sun: "Sunday" },
    footer: { tagline: "Barbershop in central Riga" },
  },
};


/* =============================================================
   ЧАСТЬ 2. ЛОГИКА (обычно менять не нужно)
   ============================================================= */

// Текущий язык и выбранная вкладка услуг
let currentLang = CONFIG.defaultLanguage;
let currentCategory = "haircut";

// Берёт текст по ключу вида "hero.title" для текущего языка
function t(key) {
  const parts = key.split(".");          // "hero.title" → ["hero", "title"]
  let value = TEXTS[currentLang];
  for (const part of parts) {
    value = value ? value[part] : undefined;
  }
  return value ?? key;                   // если текста нет — покажем сам ключ
}

// Ссылки из CONFIG. В HTML: data-href="booking" → href = bookingUrl
const LINKS = {
  booking:   CONFIG.bookingUrl,
  tel:       "tel:" + CONFIG.phoneRaw,
  whatsapp:  "https://wa.me/" + CONFIG.whatsapp,
  instagram: CONFIG.instagramUrl,
  maps:      CONFIG.mapsUrl,
};

// Расставляет ссылки и данные из CONFIG (вызывается один раз)
function applyConfig() {
  document.querySelectorAll("[data-href]").forEach((el) => {
    const key = el.dataset.href;
    el.href = LINKS[key];
    // Внешние сайты открываем в новой вкладке (кроме звонка)
    if (key !== "tel") {
      el.target = "_blank";
      el.rel = "noopener";
    }
  });

  // data-config="phone" → текст из CONFIG.phone
  document.querySelectorAll("[data-config]").forEach((el) => {
    el.textContent = CONFIG[el.dataset.config];
  });

  // Год в подвале обновляется сам
  document.getElementById("year").textContent = new Date().getFullYear();
}

// Вставляет тексты текущего языка во все элементы с data-i18n
function applyTexts() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  // Подписи картинок (alt) и подсказки для кнопок (aria-label)
  document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
    el.alt = t(el.dataset.i18nAlt);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    el.setAttribute("aria-label", t(el.dataset.i18nAria));
  });

  // Заголовок вкладки, описание и язык страницы
  document.title = t("meta.title");
  document.querySelector('meta[name="description"]').content = t("meta.description");
  document.documentElement.lang = currentLang;
}

// Защита от спецсимволов при вставке текста в HTML
function esc(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Карточка услуги: фото, название, время, цена «от».
// Вся карточка — кнопка: открывает запись с этой услугой (booking.js).
// master — slug мастера на его странице (тогда мастер уже выбран)
function serviceCard(s, master) {
  const name = esc(s.name[currentLang]);
  return `
    <li class="service-card">
      <button type="button" class="service-card__link" data-book data-book-service="${s.id}"${master ? ` data-book-master="${master}"` : ""}>
        <span class="service-card__media">
          <img class="service-card__photo" src="${ROOT}${esc(serviceImage(s) ? serviceImage(s).src : "")}" alt="${name}" width="600" height="750" loading="lazy">
        </span>
        <span class="service-card__name">${name}</span>
        <span class="service-card__meta"><span>${formatDuration(s.min, s.max)}</span> <strong>${t("common.from")} ${money(minPrice(s))}</strong></span>
        <span class="service-card__book">${t("common.book")}</span>
      </button>
    </li>`;
}

// Строит карточки услуг выбранной вкладки
function renderServices() {
  const list = document.getElementById("services-list");
  list.innerHTML = SITE.services
    .filter((s) => s.category === currentCategory)
    .map((s) => serviceCard(s))
    .join("");
}

// Аватар мастера: фото, если есть, иначе инициалы
function masterAvatar(m, className) {
  return m.photo
    ? `<img class="${className}" src="${ROOT}${esc(m.photo)}" alt="" width="800" height="1000" loading="lazy">`
    : `<span class="${className} initials" aria-hidden="true">${esc(initials(m.name))}</span>`;
}

// Плитки мастеров. Каждая ведёт на страницу мастера (<slug>/)
function renderMasters() {
  document.getElementById("team-list").innerHTML = SITE.masters.map((m) => `
    <a class="master" href="${ROOT}${m.slug}/">
      ${masterAvatar(m, "master__photo")}
      <span class="master__name">${esc(m.name)}</span>
      <span class="master__about">${t("roles." + m.role)}</span>
      <span class="master__page">${t("team.page")}&nbsp;→</span>
    </a>
  `).join("");
}

// Строит сетку галереи (loading="lazy" = картинка грузится, когда до неё долистали)
function renderGallery() {
  document.getElementById("gallery-list").innerHTML = GALLERY.map((src) => `
    <img src="${src}" alt="${t("gallery.alt")}" width="800" height="800" loading="lazy">
  `).join("");
}

// Отзывы из SITE.reviews. Если хоть один — пример, над блоком видна пометка,
// а у рейтинга вместо подписи — «пример»
function renderReviews() {
  document.getElementById("rating-value").textContent = String(SITE.rating).replace(".", currentLang === "en" ? "." : ",");
  document.getElementById("rating-text").textContent =
    t("reviews.ratingText") + (SITE.reviewsCount ? ` (${SITE.reviewsCount})` : "");

  document.getElementById("reviews-list").innerHTML = SITE.reviews.map((r) => `
    <article class="review">
      <p class="stars" aria-label="5/5">★★★★★</p>
      <p class="review__text">${esc(r.text[currentLang])}</p>
      <p class="review__name">${esc(r.author)}${r.source ? ` · ${esc(r.source)}` : ""}</p>
    </article>
  `).join("");
}

// Строит строки часов работы
function renderHours() {
  document.getElementById("hours-list").innerHTML = CONFIG.hours.map((h) => `
    <li><span>${t("days." + h.days)}</span><span>${h.time}</span></li>
  `).join("");
}

// Главная функция: показывает весь сайт на выбранном языке
function setLanguage(lang) {
  currentLang = lang;
  applyTexts();

  // Блоки главной страницы. На других страницах (shop.html) их нет — пропускаем
  if (document.getElementById("services-list")) {
    renderServices();
    renderMasters();
    renderGallery();
    renderReviews();
    renderHours();
  }

  // Подсвечиваем кнопку выбранного языка
  document.querySelectorAll(".lang__btn").forEach((btn) => {
    const active = btn.dataset.lang === lang;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-pressed", active);
  });

  // Если карта уже открыта — переводим её подпись для экранных читалок
  const iframe = document.querySelector("#map iframe");
  if (iframe) iframe.title = t("contacts.mapShow");

  // Сообщаем другим скриптам (shop.js), что язык сменился
  document.dispatchEvent(new Event("langchange"));
}


/* ---------- Запоминание языка ----------
   localStorage — маленькое хранилище в браузере посетителя.
   Это не cookie и никуда не отправляется. try/catch нужен потому,
   что в режиме «инкогнито» хранилище бывает недоступно.
*/
function loadSavedLanguage() {
  try {
    const saved = localStorage.getItem("lang");
    if (saved && TEXTS[saved]) return saved;
  } catch (e) {}
  return CONFIG.defaultLanguage;
}

function saveLanguage(lang) {
  try {
    localStorage.setItem("lang", lang);
  } catch (e) {}
}


/* ---------- Переключатель языков ---------- */
function initLanguageSwitcher() {
  document.querySelectorAll(".lang__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      setLanguage(btn.dataset.lang);
      saveLanguage(btn.dataset.lang);
    });
  });
}


/* ---------- Меню на телефоне (бургер) ---------- */
function initMenu() {
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");

  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", open);
    document.body.classList.toggle("menu-open", open);   // запрещаем прокрутку под меню
  }

  // Клик по бургеру: открыть, если закрыто, и наоборот
  burger.addEventListener("click", () => {
    setMenu(!nav.classList.contains("is-open"));
  });

  // Клик по пункту меню — закрываем меню (страница прокрутится к разделу)
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  // Клавиша Esc тоже закрывает меню
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  // Если экран стал широким (повернули планшет) — закрываем мобильное меню
  window.matchMedia("(min-width: 1100px)").addEventListener("change", () => setMenu(false));
}


/* ---------- Вкладки услуг ---------- */
function initTabs() {
  const buttons = document.querySelectorAll(".tabs__btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentCategory = btn.dataset.category;
      renderServices();

      // Активной становится только нажатая вкладка
      buttons.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-selected", active);
      });
    });
  });
}


/* ---------- Карта: настоящая карта Google грузится только по клику ----------
   Пока посетитель не нажал кнопку, сайт не обращается к Google
   и Google не ставит cookie.
*/
function initMap() {
  const button = document.getElementById("map-load");

  button.addEventListener("click", () => {
    const map = document.getElementById("map");
    const iframe = document.createElement("iframe");
    iframe.src = CONFIG.mapEmbedUrl;
    iframe.title = t("contacts.mapShow");
    iframe.loading = "lazy";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    iframe.allowFullscreen = true;

    map.querySelector(".map__overlay").remove();   // убираем кнопку и подпись
    map.appendChild(iframe);
  });
}


/* ---------- Анимации при прокрутке ----------
   IntersectionObserver — встроенный в браузер «наблюдатель»: он сообщает,
   когда элемент появился на экране. Тогда мы добавляем класс is-visible,
   а саму анимацию описывает CSS (раздел «Анимации» в style.css).
*/

// Что появляется целиком
const REVEAL_ITEMS = [
  ".label", ".title", ".about__photo", ".about__text p",
  ".services__note", ".tabs", ".reviews__rating", ".insta p",
  ".contacts__list", ".contacts__actions", ".map",
  ".reviews .btn", ".insta .btn",
];

// Сетки, где карточки появляются по очереди
const REVEAL_GROUPS = [
  ".principles__grid", ".services__list", ".team__grid",
  ".gallery__grid", ".reviews__grid", ".insta__grid",
  ".sp-products", ".tiles__grid",   // страница магазина (shop.html)
];

function initReveal() {
  // Если человек попросил в системе «уменьшить движение» или браузер
  // слишком старый — ничего не прячем, просто показываем страницу
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) return;

  // То, что видно сразу при открытии страницы (например, переход из магазина
  // прямо к «Par mums»), показываем без анимации — иначе после перехода
  // секунду видна пустая страница. Анимируется только то, до чего долистали.
  // Если браузер заранее подготовил страницу (prerender), отсчёт идёт с момента показа
  let shownAt = performance.now();
  if (document.prerendering) {
    document.addEventListener("prerenderingchange", () => { shownAt = performance.now(); }, { once: true });
  }

  function showNow(el) {
    el.classList.add("no-anim", "is-visible");
    // через два кадра возвращаем анимации (для наведения и т.п.)
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove("no-anim")));
  }

  const observer = new IntersectionObserver((entries) => {
    const atOpen = performance.now() - shownAt < 600;
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (atOpen) showNow(entry.target);
        else entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);   // анимируем только один раз
      }
    });
  }, {
    rootMargin: "0px 0px -10% 0px",   // срабатывает чуть раньше низа экрана
  });

  // Блок уже на экране при открытии — классы «спрятан» и «показан» ставим вместе,
  // поэтому он сразу виден, без анимации и без пустого кадра
  const onScreen = (el) => {
    const r = el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  };

  document.querySelectorAll(REVEAL_ITEMS.join(",")).forEach((el) => {
    el.classList.add("reveal");
    if (onScreen(el)) el.classList.add("is-visible");
    else observer.observe(el);
  });

  document.querySelectorAll(REVEAL_GROUPS.join(",")).forEach((el) => {
    el.classList.add("reveal-stagger");
    if (onScreen(el)) el.classList.add("is-visible");
    else observer.observe(el);
  });
}


/* ---------- Плавный переход на другую страницу сайта ----------
   Клик по ссылке на другую страницу (index.html ↔ shop.html):
   страница гаснет за 0.15 секунды (класс is-leaving, см. style.css),
   затем открывается новая, которая плавно проявляется.
   Ссылки на другие сайты, якоря (#services) и клики с Ctrl/Cmd не трогаем
*/
function initPageFade() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  document.addEventListener("click", (e) => {
    const link = e.target.closest("a[href]");
    if (!link || e.defaultPrevented || e.button !== 0) return;
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    if (link.target && link.target !== "_self") return;

    const url = new URL(link.href, location.href);
    const samePage = url.pathname === location.pathname && url.search === location.search;
    if (url.origin !== location.origin || samePage) return;

    e.preventDefault();
    document.documentElement.classList.add("is-leaving");
    setTimeout(() => {
      location.href = url.href;
    }, 150);
  });

  // Кнопка «Назад» может вернуть страницу из памяти браузера уже погасшей —
  // тогда снова показываем её
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) document.documentElement.classList.remove("is-leaving");
  });
}


/* ---------- Открытие страницы сразу на нужном разделе ----------
   Ссылка вида index.html#about (например, из меню магазина): у сайта включена
   плавная прокрутка, и браузер сначала показал бы верх страницы, а потом
   поехал бы вниз. Здесь сразу ставим страницу на раздел, без прокрутки
*/
function jumpToHash() {
  const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (!target) return;
  const html = document.documentElement;
  html.style.scrollBehavior = "auto";
  target.scrollIntoView();
  // после первого кадра возвращаем плавную прокрутку для кликов по меню
  requestAnimationFrame(() => requestAnimationFrame(() => { html.style.scrollBehavior = ""; }));
}


/* ---------- Старт: когда страница загрузилась ---------- */
applyConfig();
setLanguage(loadSavedLanguage());
initLanguageSwitcher();
initMenu();
initTabs();
if (document.getElementById("map-load")) initMap();   // карта есть только на главной
jumpToHash();
initReveal();
initPageFade();

// Плавная прокрутка только для кликов по меню и кнопкам: включаем её уже после загрузки,
// чтобы при обновлении страницы браузер вернул прежнее место сразу, а не прокручивал к нему
window.addEventListener("load", () => {
  setTimeout(() => document.documentElement.classList.add("is-smooth"), 300);
});
