/* =============================================================
   master.js — страница мастера (<slug>/index.html)

   Подключается ПОСЛЕ data/site.js и script.js.
   Чья страница — из <body data-master="slug">, данные — из SITE.masters.
   Цены и услуги — только этого мастера (prices): чего он не делает, того нет.
   Тексты лежат в TEXTS[язык].master, в HTML стоят data-i18n="master.…".
   ============================================================= */

const MASTER = SITE.masters.find((m) => m.slug === document.body.dataset.master);

// Фото-примеры для блока «Работы» — те же, что в галерее главной
const WORK_EXAMPLES = ["gallery-1.jpg", "gallery-2.jpg", "gallery-3.jpg", "gallery-4.jpg", "gallery-5.jpg", "gallery-6.jpg"];

const MASTER_TEXTS = {
  lv: {
    back: "← Visi meistari",
    nav: { about: "Par meistaru", works: "Darbi", services: "Pakalpojumi", contacts: "Kontakti", team: "Visi meistari", site: "Uz vietni" },
    about: { label: "Par meistaru", title: "Daži vārdi par sevi" },
    skills: { label: "Specializācija", title: "Ko daru vislabāk" },
    works: { label: "Portfolio", title: "Darbi", alt: "Darbs", more: "Vairāk darbu Instagram" },
    services: {
      label: "Pieraksts", title: "Pakalpojumi un cenas",
      note: "Šī meistara cenas, kā Fresha",
      groupCuts: "Matu griezumi", groupBeard: "Bārda un komplekti",
    },
    contacts: { label: "Kontakti", title: "Kur mani atrast", address: "Adrese", instagram: "Instagram", fresha: "Fresha" },
  },
  ru: {
    back: "← Все мастера",
    nav: { about: "О мастере", works: "Работы", services: "Услуги", contacts: "Контакты", team: "Все мастера", site: "На сайт" },
    about: { label: "О мастере", title: "Пара слов о себе" },
    skills: { label: "Специализации", title: "Что получается лучше всего" },
    works: { label: "Портфолио", title: "Работы", alt: "Работа", more: "Ещё работы в Instagram" },
    services: {
      label: "Запись", title: "Услуги и цены",
      note: "Цены этого мастера, как на Fresha",
      groupCuts: "Стрижки", groupBeard: "Борода и комбо",
    },
    contacts: { label: "Контакты", title: "Где меня найти", address: "Адрес", instagram: "Instagram", fresha: "Fresha" },
  },
  en: {
    back: "← All barbers",
    nav: { about: "About", works: "Work", services: "Services", contacts: "Contact", team: "All barbers", site: "To site" },
    about: { label: "About", title: "A few words about me" },
    skills: { label: "Specialties", title: "What I do best" },
    works: { label: "Portfolio", title: "Work", alt: "Work", more: "More work on Instagram" },
    services: {
      label: "Booking", title: "Services & prices",
      note: "This barber's prices, as on Fresha",
      groupCuts: "Haircuts", groupBeard: "Beard & combos",
    },
    contacts: { label: "Contact", title: "Where to find me", address: "Address", instagram: "Instagram", fresha: "Fresha" },
  },
};

for (const lang in MASTER_TEXTS) TEXTS[lang].master = MASTER_TEXTS[lang];

// Тег специализации: строка или { lv, ru, en }
function skillText(skill) {
  return typeof skill === "string" ? skill : skill[currentLang];
}

// Фото услуги на странице этого мастера: его workPhotos, иначе общее фото услуги.
// { src, real } или null (тогда услуга показывается строкой)
function photoFor(s) {
  const own = MASTER.workPhotos && MASTER.workPhotos[s.id];
  if (own && own.length) return { src: own[0], real: true };
  return serviceImage(s);
}

// Карточка стрижки: фото (с подписью «пример, ИИ», если фото не настоящее),
// название, время, цена мастера. Вся карточка — кнопка записи
function serviceCardFor(s, photo) {
  const p = priceFor(MASTER, s);
  const name = esc(s.name[currentLang]);
  return `
    <li class="service-card">
      <button type="button" class="service-card__link" data-book data-book-service="${s.id}" data-book-master="${MASTER.slug}">
        <span class="service-card__media">
          <img class="service-card__photo" src="${ROOT}${esc(photo.src)}" alt="${name}" width="600" height="750" loading="lazy">
        </span>
        <span class="service-card__name">${name}</span>
        <span class="service-card__meta"><span>${formatDuration(s.min, s.max)}</span> <strong>${priceText(p)}</strong></span>
        <span class="service-card__book">${t("common.book")} ↗︎</span>
      </button>
    </li>`;
}

// Строка услуги как в barber.html v4: номер | название | время | цена | записаться
function serviceRow(s, i) {
  const p = priceFor(MASTER, s);
  return `
    <li class="service">
      <span class="service__num">${String(i + 1).padStart(2, "0")}</span>
      <span class="service__name">${esc(s.name[currentLang])}</span>
      <span class="service__time">${formatDuration(s.min, s.max)}</span>
      <span class="service__price">${priceText(p)}</span>
      <button type="button" class="service__book" data-book data-book-service="${s.id}" data-book-master="${MASTER.slug}">${t("common.book")}</button>
    </li>`;
}

function renderMasterPage() {
  if (!MASTER) return;

  document.title = `${MASTER.name}, ${t("roles." + MASTER.role)}, ${SITE.salon.name}`;
  document.querySelector('meta[name="description"]').content = `${MASTER.name}, ${SITE.salon.name}, ${SITE.salon.address}.`;

  document.querySelectorAll('[data-master-field="role"]').forEach((el) => { el.textContent = t("roles." + MASTER.role); });
  document.querySelectorAll('[data-master-field="bio"]').forEach((el) => { el.textContent = MASTER.bio[currentLang]; });

  document.getElementById("bp-tags").innerHTML = MASTER.skills.map((s) => `<li>${esc(skillText(s))}</li>`).join("");

  document.getElementById("bp-works").innerHTML = WORK_EXAMPLES.map((file) => `
    <img class="bp-work" src="${ROOT}images/${file}" alt="${t("master.works.alt")}" width="800" height="1000" loading="lazy">`).join("");

  renderMasterServices();

  const fresha = MASTER.freshaLink || SITE.salon.freshaLink;
  const insta = MASTER.instagram
    ? { url: MASTER.instagram, handle: MASTER.instagramHandle || MASTER.instagram }
    : { url: SITE.salon.instagramUrl, handle: SITE.salon.instagramHandle };
  document.getElementById("bp-contacts").innerHTML = `
    <dt>${t("master.contacts.address")}</dt>
    <dd>${esc(SITE.salon.name)}<br><a href="${esc(SITE.salon.mapsUrl)}" target="_blank" rel="noopener">${esc(SITE.salon.address)}</a></dd>
    <dt>${t("master.contacts.instagram")}</dt>
    <dd><a href="${esc(insta.url)}" target="_blank" rel="noopener">${esc(insta.handle)}</a></dd>
    <dt>${t("master.contacts.fresha")}</dt>
    <dd><a href="${esc(fresha)}" target="_blank" rel="noopener noreferrer">fresha.com ↗︎</a></dd>`;
}

/* Услуги мастера двумя группами (только то, что он делает; пустая группа не показывается):
   1) стрижки — карточки с фото. Если у двух услуг одно и то же фото,
      карточкой идёт только первая, остальные — строками, чтобы фото не повторялись
   2) борода и комбо — компактные строки */
function renderMasterServices() {
  const mine = SITE.services.filter((s) => offers(MASTER, s));
  const cuts = mine.filter((s) => s.category === "haircut");
  const beard = mine.filter((s) => s.category === "beard");

  const used = new Set();
  const cards = [];
  const cutRows = [];
  for (const s of cuts) {
    const photo = photoFor(s);
    if (photo && !used.has(photo.src)) {
      used.add(photo.src);
      cards.push(serviceCardFor(s, photo));
    } else {
      cutRows.push(s);
    }
  }

  const rows = (list) => `<ul class="services__list">${list.map(serviceRow).join("")}</ul>`;
  const group = (title, body) => `<div class="bp-group-block"><h3 class="bp-group">${title}</h3>${body}</div>`;

  let html = "";
  if (cuts.length) {
    html += group(t("master.services.groupCuts"),
      (cards.length ? `<ul class="bp-cards">${cards.join("")}</ul>` : "") + (cutRows.length ? rows(cutRows) : ""));
  }
  if (beard.length) html += group(t("master.services.groupBeard"), rows(beard));
  document.getElementById("bp-services").innerHTML = html;
}

document.addEventListener("langchange", renderMasterPage);

/* Панель записи внизу экрана (телефон): появляется, когда кнопка
   на первом экране ушла вверх. Положение проверяем не чаще раза за кадр */
function initBookingBar() {
  const bar = document.getElementById("bp-bar");
  const heroBtn = document.querySelector(".bp-hero [data-book]");
  if (!bar || !heroBtn) return;

  function update() {
    bar.classList.toggle("is-visible", heroBtn.getBoundingClientRect().bottom < 0);
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  }

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
}

initBookingBar();
// script.js уже показал страницу, но тогда текстов мастера ещё не было — показываем заново
setLanguage(currentLang);
