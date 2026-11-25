/* =============================================================
   booking.js — запись-гибрид: Услуги › Мастер › Время на Fresha

   На сайте клиент выбирает услуги и мастера (цены — этого мастера),
   затем кнопка «Продолжить на Fresha» открывает Fresha, где он выбирает
   время и подтверждает запись по SMS. Ссылка — по порядку из data/site.js:
   links.pairs → мастер → услуга → салон.
   Запасной путь «Оставьте заявку» — DEMO-форма: ничего не отправляет.

   Открывают окно кнопки:
     data-book                     — любая кнопка «Записаться»
     data-href="booking"           — ссылки записи в шапке/подвале (без JS ведут на Fresha)
     data-book-service="buzz"      — сразу выбрать услугу (id из data/site.js)
     data-book-master="daniels"    — сразу выбрать мастера
   На странице мастера (body data-master="…") мастер выбран заранее, его шаг пропускается.

   ВАЖНО: никаких запросов к серверам, iframe и автоматизации Fresha,
   ничего не сохраняется (ни localStorage, ни cookie). Всё в памяти страницы.

   Подключается ПОСЛЕ data/site.js и script.js (SITE, TEXTS, t, currentLang, цены).
   ============================================================= */

(function () {

/* ---------- Тексты окна на трёх языках ---------- */
const BK_TEXTS = {
  lv: {
    steps: { services: "Pakalpojumi", master: "Meistars", fresha: "Laiks Fresha" },
    title: {
      services: "Izvēlieties pakalpojumus", master: "Izvēlieties meistaru",
      fresha: "Palicis viens solis: izvēlēties laiku", request: "Atstājiet pieteikumu",
      done: "Pieteikums pieņemts",
    },
    back: "Atpakaļ", close: "Aizvērt", next: "Turpināt", dialog: "Pieraksts",
    add: "Pievienot", added: "Izvēlēts",
    groups: { haircut: "Matu griezumi", beard: "Bārda" },
    sum: { empty: "Izvēlieties vismaz vienu pakalpojumu", total: "Kopā" },
    master: {
      any: "Jebkurš meistars", anyNote: "Pirmais brīvais meistars", pick: "Izvēlēties", picked: "Izvēlēts",
      unavailable: "Nesniedz izvēlēto pakalpojumu",
      noneAll: "Šī pakalpojumu kombinācija nav pieejama pie visiem meistariem, izvēlieties citu.",
    },
    fresha: {
      text: "Brīvais laiks un pieraksta apstiprināšana ar SMS atveras Fresha, tas aizņems minūti.",
      go: "Turpināt uz Fresha",
      newTab: "atveras jaunā cilnē",
      copy: "Nokopēt manu izvēli",
      copied: "Izvēle nokopēta, varat to ielīmēt Fresha komentārā.",
      copyFail: "Neizdevās nokopēt. Jūsu izvēle: ",
      hint: "Fresha atkārtoti izvēlieties tos pašus pakalpojumus un meistaru, ja tie nav atzīmēti.",
      wait: "Nav piemērota laika? Atstājiet pieteikumu",
    },
    form: {
      name: "Vārds", phone: "Tālrunis", comment: "Kad jums būtu ērti?",
      commentHint: "Piemēram: piektdien pēc 17:00 vai sestdien no rīta.",
      consent: "Piekrītu, ka mani dati tiek izmantoti tikai šī pieteikuma apstrādei.",
      submit: "Nosūtīt pieteikumu", required: "obligāti",
    },
    err: {
      name: "Ievadiet vārdu (vismaz 2 burti).",
      phone: "Ievadiet tālruni, piemēram, +371 20 000 000.",
      comment: "Uzrakstiet, kad jums būtu ērti.",
      consent: "Lai turpinātu, nepieciešama piekrišana.",
      summary: "Pārbaudiet iezīmētos laukus.",
    },
    done: {
      thanks: "Paldies, {name}!",
      note: "Paldies. Barberis sazināsies ar jums.",
      close: "Aizvērt",
    },
    labels: { services: "Pakalpojumi", master: "Meistars", total: "Kopā" },
  },

  ru: {
    steps: { services: "Услуги", master: "Мастер", fresha: "Время на Fresha" },
    title: {
      services: "Выберите услуги", master: "Выберите мастера",
      fresha: "Остался один шаг: выбрать время", request: "Оставьте заявку",
      done: "Заявка принята",
    },
    back: "Назад", close: "Закрыть", next: "Продолжить", dialog: "Запись",
    add: "Добавить", added: "Выбрано",
    groups: { haircut: "Стрижки", beard: "Борода" },
    sum: { empty: "Выберите хотя бы одну услугу", total: "Итого" },
    master: {
      any: "Любой мастер", anyNote: "Первый свободный мастер", pick: "Выбрать", picked: "Выбран",
      unavailable: "Не оказывает выбранную услугу",
      noneAll: "Эта комбинация услуг доступна не у всех мастеров, выберите другую.",
    },
    fresha: {
      text: "Свободное время и подтверждение записи по SMS открываются на Fresha, это займёт минуту.",
      go: "Продолжить на Fresha",
      newTab: "откроется в новой вкладке",
      copy: "Скопировать мой выбор",
      copied: "Выбор скопирован, можно вставить его в комментарий на Fresha.",
      copyFail: "Не удалось скопировать. Ваш выбор: ",
      hint: "Если на Fresha услуги и мастер не отмечены, выберите их там ещё раз.",
      wait: "Не нашли время? Оставьте заявку",
    },
    form: {
      name: "Имя", phone: "Телефон", comment: "Когда вам удобно?",
      commentHint: "Например: в пятницу после 17:00 или в субботу утром.",
      consent: "Согласен, что мои данные используются только для обработки этой заявки.",
      submit: "Отправить заявку", required: "обязательно",
    },
    err: {
      name: "Введите имя (минимум 2 буквы).",
      phone: "Введите телефон, например +371 20 000 000.",
      comment: "Напишите, когда вам удобно.",
      consent: "Чтобы продолжить, нужно согласие.",
      summary: "Проверьте отмеченные поля.",
    },
    done: {
      thanks: "Спасибо, {name}!",
      note: "Спасибо. Барбер свяжется с вами.",
      close: "Закрыть",
    },
    labels: { services: "Услуги", master: "Мастер", total: "Итого" },
  },

  en: {
    steps: { services: "Services", master: "Barber", fresha: "Time on Fresha" },
    title: {
      services: "Choose services", master: "Choose a barber",
      fresha: "One step left: pick a time", request: "Leave a request",
      done: "Request received",
    },
    back: "Back", close: "Close", next: "Continue", dialog: "Booking",
    add: "Add", added: "Added",
    groups: { haircut: "Haircuts", beard: "Beard" },
    sum: { empty: "Choose at least one service", total: "Total" },
    master: {
      any: "Any barber", anyNote: "First available barber", pick: "Choose", picked: "Chosen",
      unavailable: "Doesn't offer the selected service",
      noneAll: "This combination of services isn't available from every barber, please choose another.",
    },
    fresha: {
      text: "Free times and SMS booking confirmation open on Fresha. It takes a minute.",
      go: "Continue on Fresha",
      newTab: "opens in a new tab",
      copy: "Copy my choice",
      copied: "Choice copied, you can paste it into the Fresha comment.",
      copyFail: "Couldn't copy. Your choice: ",
      hint: "If the services and barber aren't selected on Fresha, pick them there again.",
      wait: "Can't find a time? Leave a request",
    },
    form: {
      name: "Name", phone: "Phone", comment: "When would suit you?",
      commentHint: "For example: Friday after 17:00 or Saturday morning.",
      consent: "I agree that my data is used only to process this request.",
      submit: "Send request", required: "required",
    },
    err: {
      name: "Enter your name (at least 2 letters).",
      phone: "Enter a phone number, e.g. +371 20 000 000.",
      comment: "Tell us when would suit you.",
      consent: "Consent is required to continue.",
      summary: "Please check the highlighted fields.",
    },
    done: {
      thanks: "Thank you, {name}!",
      note: "Thank you. The barber will contact you.",
      close: "Close",
    },
    labels: { services: "Services", master: "Barber", total: "Total" },
  },
};

for (const lang in BK_TEXTS) TEXTS[lang].bk = BK_TEXTS[lang];

const STEPS = ["services", "master", "fresha"];   // в индикаторе
const PAGE_MASTER = document.body.dataset.master || "";


/* ---------- Состояние (только в памяти) ---------- */
let state = null;     // null — окно закрыто
let opener = null;    // кнопка, которая открыла окно (вернём на неё фокус)
let el = {};          // части окна


/* ---------- Цены и ссылка Fresha ---------- */
// Выбранный мастер (объект) или null для «Любой мастер»
function chosenMaster() {
  return state.master && state.master !== "any" ? masterBySlug(state.master) : null;
}

function masterName(slug) {
  return !slug || slug === "any" ? t("bk.master.any") : masterBySlug(slug).name;
}

// Итог: «от X €», «X €» или «цену уточнить»; null — выбранное никто не делает
function priceHtml(sum) {
  return sum ? priceText(sum) : "-";
}

// Итог по выбранному мастеру; без мастера и для «Любой мастер» — минимум по тем, кто делает всё
function currentSum() {
  const m = chosenMaster();
  return m ? sumFor(m, state.services) : sumAny(state.services);
}

// Цена одной услуги в списках: у выбранного мастера или минимальная среди подходящих
function linePrice(service) {
  const m = chosenMaster();
  if (m) return priceFor(m, service);
  const able = mastersFor(state.services.length ? state.services : [service.id]);
  return { price: minPrice(service, able.length ? able : SITE.masters), from: true, known: true };
}

/* Ссылка Fresha по порядку:
   1) links.pairs["услуга:мастер"]  2) ссылка мастера  3) ссылка услуги  4) салон.
   При нескольких услугах — ссылка мастера или салона */
function freshaUrl() {
  const m = chosenMaster();
  const single = state.services.length === 1 ? serviceById(state.services[0]) : null;
  const pairs = (SITE.links && SITE.links.pairs) || {};
  if (single && m && pairs[`${single.id}:${m.slug}`]) return pairs[`${single.id}:${m.slug}`];
  if (m && m.freshaLink) return m.freshaLink;
  if (single && single.freshaLink) return single.freshaLink;
  return SITE.salon.freshaLink;
}

// Текст для «Скопировать мой выбор»
function choiceText() {
  const names = state.services.map((id) => serviceById(id).name[currentLang]).join(", ");
  return `${t("bk.labels.services")}: ${names}; ${t("bk.labels.master").toLowerCase()}: ${masterName(state.master)}`;
}


/* ---------- Мелочи для HTML ---------- */
function avatar(m) {
  if (!m) return `<span class="bk-avatar bk-avatar--any" aria-hidden="true">⇄</span>`;
  return m.photo
    ? `<img class="bk-avatar" src="${ROOT}${esc(m.photo)}" alt="" width="48" height="48">`
    : `<span class="bk-avatar" aria-hidden="true">${esc(initials(m.name))}</span>`;
}


/* ---------- Каркас окна (создаём один раз) ---------- */
function build() {
  const root = document.createElement("div");
  root.className = "bk";
  root.id = "bk";
  root.hidden = true;
  root.setAttribute("role", "dialog");
  root.setAttribute("aria-modal", "true");
  root.setAttribute("aria-labelledby", "bk-title");
  root.innerHTML = `
    <div class="bk__top">
      <button type="button" class="bk__icon" data-bk="back"><span aria-hidden="true">←</span></button>
      <ol class="bk__steps"></ol>
      <button type="button" class="bk__icon" data-bk="close"><span aria-hidden="true">✕</span></button>
    </div>
    <div class="bk__body">
      <div class="bk__main">
        <h2 class="bk__title" id="bk-title" tabindex="-1"></h2>
        <div class="bk__content"></div>
      </div>
      <aside class="bk__sum" aria-live="polite"></aside>
    </div>`;
  document.body.appendChild(root);

  el = {
    root,
    back: root.querySelector('[data-bk="back"]'),
    close: root.querySelector('[data-bk="close"]'),
    steps: root.querySelector(".bk__steps"),
    title: root.querySelector(".bk__title"),
    content: root.querySelector(".bk__content"),
    sum: root.querySelector(".bk__sum"),
  };

  el.close.addEventListener("click", close);
  el.back.addEventListener("click", goBack);
  root.addEventListener("click", onClick);
  root.addEventListener("input", onInput);
  root.addEventListener("change", onInput);
  root.addEventListener("submit", onSubmit);
  root.addEventListener("keydown", onKeydown);
}


/* ---------- Отрисовка ---------- */
function render() {
  const step = state.step;
  el.root.dataset.step = step;
  el.root.setAttribute("aria-label", t("bk.dialog"));
  el.back.setAttribute("aria-label", t("bk.back"));
  el.close.setAttribute("aria-label", t("bk.close"));
  el.back.hidden = step === "done";

  // «Заявка» и «Готово» — внутри третьего шага индикатора
  const current = step === "request" || step === "done" ? 2 : STEPS.indexOf(step);
  el.steps.innerHTML = STEPS.map((s, i) => {
    const done = i < current || step === "done";
    const canJump = done && step !== "done" && !(s === "master" && state.locked);
    const cls = i === current && step !== "done" ? "is-current" : done ? "is-done" : "";
    const label = t("bk.steps." + s);
    const inner = canJump ? `<button type="button" data-jump="${s}">${label}</button>` : `<span>${label}</span>`;
    return `<li class="${cls}"${i === current ? ' aria-current="step"' : ""}>${inner}</li>`;
  }).join("");

  el.title.textContent = t("bk.title." + step);
  el.content.innerHTML = VIEWS[step]();
  renderSummary();
}

const VIEWS = {
  services() {
    return ["haircut", "beard"].map((g) => `
      <h3 class="bk-group">${t("bk.groups." + g)}</h3>
      <ul class="bk-list">
        ${SITE.services.filter((s) => s.category === g && (!state.locked || offers(chosenMaster(), s))).map(serviceRow).join("")}
      </ul>`).join("");
  },

  master() {
    // sum = null — мастер делает не все выбранные услуги: строка неактивна
    const row = (slug, m, name, note, sum) => `
      <li class="bk-master${state.master === slug ? " is-picked" : ""}${sum ? "" : " is-disabled"}">
        ${avatar(m)}
        <span class="bk-master__info">
          <span class="bk-master__name">${esc(name)}</span>
          <span class="bk-master__role">${note}</span>
          <span class="bk-master__price">${sum ? priceHtml(sum) : t("bk.master.unavailable")}</span>
        </span>
        ${pickButton(slug, !sum)}
      </li>`;
    const anySum = sumAny(state.services);
    const any = row("any", null, t("bk.master.any"), t("bk.master.anyNote"), anySum);
    const list = SITE.masters.map((m) => row(m.slug, m, m.name, t("roles." + m.role), sumFor(m, state.services))).join("");
    const none = anySum ? "" : `<p class="bk-empty" role="status">${t("bk.master.noneAll")}</p>`;
    return `${none}<ul class="bk-list bk-list--masters">${any}${list}</ul>`;
  },

  fresha() {
    return `
      <div class="bk-recap">${recapHtml()}</div>
      <p class="bk-lead">${t("bk.fresha.text")}</p>
      <div class="bk-actions">
        <a class="btn btn--dark bk-go" href="${esc(freshaUrl())}" target="_blank" rel="noopener noreferrer">
          ${t("bk.fresha.go")}&nbsp;<span aria-hidden="true">↗︎</span><span class="visually-hidden">(${t("bk.fresha.newTab")})</span>
        </a>
        <button type="button" class="btn btn--outline" data-bk="copy">${t("bk.fresha.copy")}</button>
      </div>
      <p class="bk-status" id="bk-status" role="status" aria-live="polite"></p>
      <p class="bk-hint">${t("bk.fresha.hint")}</p>
      <p class="bk-wait"><button type="button" class="bk-link" data-bk="request">${t("bk.fresha.wait")}</button></p>`;
  },

  request() {
    const f = state.form;
    const e = state.errors;
    const req = ` <span class="bk-req">(${t("bk.form.required")})</span>`;
    const field = (name, type, label, extra = "") => `
      <div class="bk-field${e[name] ? " has-error" : ""}">
        <label for="bk-${name}">${label}</label>
        <input id="bk-${name}" name="${name}" type="${type}" value="${esc(f[name])}" ${extra}
          ${e[name] ? `aria-invalid="true" aria-describedby="bk-${name}-err"` : ""}>
        ${e[name] ? `<p class="bk-error" id="bk-${name}-err">${t("bk.err." + name)}</p>` : ""}
      </div>`;
    return `
      <div class="bk-recap">${recapHtml()}</div>
      <form class="bk-form" novalidate>
        ${Object.keys(e).length ? `<p class="bk-error bk-error--top" role="alert">${t("bk.err.summary")}</p>` : ""}
        ${field("name", "text", t("bk.form.name") + req, 'autocomplete="name" required')}
        ${field("phone", "tel", t("bk.form.phone") + req, 'autocomplete="tel" inputmode="tel" required placeholder="+371"')}
        <div class="bk-field${e.comment ? " has-error" : ""}">
          <label for="bk-comment">${t("bk.form.comment")}${req}</label>
          <p class="bk-hint" id="bk-comment-hint">${t("bk.form.commentHint")}</p>
          <textarea id="bk-comment" name="comment" rows="3"
            aria-describedby="bk-comment-hint${e.comment ? " bk-comment-err" : ""}"${e.comment ? ' aria-invalid="true"' : ""}>${esc(f.comment)}</textarea>
          ${e.comment ? `<p class="bk-error" id="bk-comment-err">${t("bk.err.comment")}</p>` : ""}
        </div>
        <div class="bk-field bk-field--check${e.consent ? " has-error" : ""}">
          <input id="bk-consent" name="consent" type="checkbox"${f.consent ? " checked" : ""}
            ${e.consent ? 'aria-invalid="true" aria-describedby="bk-consent-err"' : ""}>
          <label for="bk-consent">${t("bk.form.consent")}</label>
          ${e.consent ? `<p class="bk-error" id="bk-consent-err">${t("bk.err.consent")}</p>` : ""}
        </div>
        <!-- Ловушка для ботов: человек это поле не видит и не заполняет -->
        <div class="bk-trap" aria-hidden="true">
          <label for="bk-website">Website</label>
          <input id="bk-website" name="website" type="text" tabindex="-1" autocomplete="off" value="${esc(f.website)}">
        </div>
        <button type="submit" class="btn btn--dark bk-submit">${t("bk.form.submit")}</button>
      </form>`;
  },

  done() {
    return `
      <p class="bk-done__lead">${t("bk.done.thanks").replace("{name}", esc(state.form.name.trim()))}</p>
      <div class="bk-recap">${recapHtml()}</div>
      <p class="bk-done__note">${t("bk.done.note")}</p>
      <button type="button" class="btn btn--dark" data-bk="close">${t("bk.done.close")}</button>`;
  },
};

// Карточка услуги с отметкой (как чекбокс): цена «от» минимальная по салону
function serviceRow(s) {
  const on = state.services.includes(s.id);
  const p = linePrice(s) || { price: s.fromPrice, from: true, known: true };
  return `
    <li>
      <button type="button" class="bk-svc${on ? " is-on" : ""}" data-service="${s.id}" role="checkbox" aria-checked="${on}">
        ${serviceImage(s) ? `<img class="bk-svc__photo" src="${ROOT}${esc(serviceImage(s).src)}" alt="" width="96" height="120" loading="lazy">` : `<span class="bk-svc__photo" aria-hidden="true"></span>`}
        <span class="bk-svc__info">
          <span class="bk-svc__name">${esc(s.name[currentLang])}</span>
          <span class="bk-svc__dur">${formatDuration(s.min, s.max)}</span>
          <span class="bk-svc__price">${priceText(p)}</span>
        </span>
        <span class="bk-svc__mark" aria-hidden="true">${on ? "✓" : "+"}</span>
      </button>
    </li>`;
}

function pickButton(slug, disabled) {
  const on = state.master === slug && !disabled;
  return `<button type="button" class="btn ${on ? "btn--dark" : "btn--outline"} bk-pick" data-master="${slug}" aria-pressed="${on}"${disabled ? " disabled" : ""}>${on ? t("bk.master.picked") : t("bk.master.pick")}</button>`;
}

// Сводка выбора: услуги (цены выбранного мастера), мастер, итого
function recapHtml() {
  const lines = state.services.map((id) => {
    const s = serviceById(id);
    const p = linePrice(s);
    return `${esc(s.name[currentLang])}${p ? " · " + priceText(p) : ""}`;
  });
  return `
    <dl class="bk-dl">
      <dt>${t("bk.labels.services")}</dt><dd>${lines.join("<br>")}</dd>
      <dt>${t("bk.labels.master")}</dt><dd>${esc(masterName(state.master))}</dd>
      <dt>${t("bk.labels.total")}</dt><dd><strong>${priceHtml(currentSum())}</strong></dd>
    </dl>`;
}

// Правая колонка (компьютер) / нижняя панель (телефон) — на шагах «Услуги» и «Мастер»
function renderSummary() {
  if (state.step !== "services" && state.step !== "master") {
    el.sum.innerHTML = "";
    return;
  }
  const m = chosenMaster();
  const sum = currentSum();
  const items = state.services.map((id) => {
    const s = serviceById(id);
    const p = linePrice(s);
    return `<li><span>${esc(s.name[currentLang])}<small>${formatDuration(s.min, s.max)}</small></span>
            <span>${p ? priceText(p) : "-"}</span></li>`;
  }).join("");
  const ready = canEnter(nextStep());

  el.sum.innerHTML = `
    <div class="bk-sum__head">
      <p class="bk-sum__salon">${esc(SITE.salon.name)}</p>
      <p class="bk-sum__addr">${esc(SITE.salon.address)}</p>
    </div>
    ${state.master ? `<p class="bk-sum__master">${avatar(m)}<span>${esc(masterName(state.master))}</span></p>` : ""}
    ${state.services.length ? `<ul class="bk-sum__list">${items}</ul>` : `<p class="bk-sum__empty">${t("bk.sum.empty")}</p>`}
    <p class="bk-sum__total">
      <span>${t("bk.sum.total")}${state.services.length ? ` <small>(${state.services.length})</small>` : ""}</span>
      <strong>${state.services.length ? priceHtml(sum) : "-"}</strong>
    </p>
    <button type="button" class="btn btn--dark bk-next" data-bk="next"${ready ? "" : " disabled"}>${t("bk.next")} →</button>`;
}


/* ---------- Переходы между шагами ---------- */
function nextStep() {
  if (state.step === "services") return state.locked ? "fresha" : "master";
  if (state.step === "master") return "fresha";
  return null;
}

function prevStep() {
  if (state.step === "master") return "services";
  if (state.step === "fresha") return state.locked ? "services" : "master";
  if (state.step === "request") return "fresha";
  return null;
}

function canEnter(step) {
  const hasServices = state.services.length > 0;
  if (step === "services") return true;
  if (step === "master") return hasServices;
  // Мастер (или «Любой мастер») должен делать все выбранные услуги
  if (step === "fresha" || step === "request") return hasServices && !!state.master && currentSum() !== null;
  return false;
}

/* История браузера: каждый шаг — запись в истории, поэтому
   кнопка «Назад» в браузере/на телефоне ведёт на прошлый шаг,
   а с первого шага закрывает окно */
let depth = 0;            // сколько записей истории добавило окно
let pendingBack = false;  // окно закрыто, браузер ещё убирает его записи из истории
let queuedOpen = null;    // нажали «Записаться», пока история не убралась — откроем после

function go(step, { push = true, focusTitle = true } = {}) {
  state.step = step;
  if (push) {
    depth++;
    history.pushState({ bk: step, i: depth }, "");
  } else {
    history.replaceState({ bk: step, i: depth }, "");
  }
  state.history[depth - 1] = step;
  render();
  el.root.scrollTop = 0;
  if (focusTitle) el.title.focus();
}

function goBack() {
  const prev = prevStep();
  if (!prev || state.step === "done") return close();
  const entry = history.state;
  if (entry && entry.i > 1 && state.history[entry.i - 2] === prev) history.back();
  else go(prev, { push: false });
}

function onPopState(e) {
  if (pendingBack) {
    pendingBack = false;
    if (queuedOpen) {
      const options = queuedOpen;
      queuedOpen = null;
      open(options);
    }
    return;
  }
  if (!state) return;
  const s = e.state;
  if (s && s.bk && state.step === "done") {
    // «Назад» после отправки заявки: закрываем окно и убираем оставшиеся шаги из истории
    finishClose();
    pendingBack = true;
    history.go(-s.i);
  } else if (s && s.bk) {
    depth = s.i;
    state.step = s.bk;
    state.errors = {};
    render();
    el.title.focus();
  } else {
    finishClose();
  }
}


/* ---------- Действия ---------- */
function onClick(e) {
  const btn = e.target.closest("button");
  if (!btn || btn.disabled) return;

  if (btn.dataset.service) {
    const id = btn.dataset.service;
    const i = state.services.indexOf(id);
    if (i === -1) state.services.push(id);
    else state.services.splice(i, 1);
    // Выбранный мастер не делает новую услугу — снимаем выбор, он выберется заново
    const m = chosenMaster();
    if (m && !state.locked && !sumFor(m, state.services)) state.master = null;
    btn.parentElement.outerHTML = serviceRow(serviceById(id));
    el.content.querySelector(`[data-service="${id}"]`).focus();
    renderSummary();
    return;
  }

  if (btn.dataset.master) {
    state.master = btn.dataset.master;
    go("fresha");
    return;
  }

  if (btn.dataset.jump) {
    go(btn.dataset.jump);
    return;
  }

  const action = btn.dataset.bk;
  if (action === "next" && canEnter(nextStep())) go(nextStep());
  if (action === "close") close();
  if (action === "copy") copyChoice();
  if (action === "request") go("request");
}

/* «Скопировать мой выбор»: буфер обмена, если браузер не дал —
   запасной способ через скрытое поле, если и он не сработал — показываем текст */
async function copyChoice() {
  const text = choiceText();
  const status = document.getElementById("bk-status");
  let ok = false;
  try {
    await navigator.clipboard.writeText(text);
    ok = true;
  } catch (err) {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    el.root.appendChild(area);
    area.select();
    try { ok = document.execCommand("copy"); } catch (err2) { ok = false; }
    area.remove();
  }
  if (status) status.textContent = ok ? t("bk.fresha.copied") : t("bk.fresha.copyFail") + text;
}

function onInput(e) {
  const target = e.target;
  if (!target.name || !(target.name in state.form)) return;
  state.form[target.name] = target.type === "checkbox" ? target.checked : target.value;
}

function validate() {
  const f = state.form;
  const errors = {};
  if (f.name.trim().length < 2) errors.name = true;
  const digits = f.phone.replace(/\D/g, "");
  if (!/^[+\d\s()-]+$/.test(f.phone.trim()) || digits.length < 7 || digits.length > 15) errors.phone = true;
  if (f.comment.trim().length < 3) errors.comment = true;
  if (!f.consent) errors.consent = true;
  return errors;
}

function onSubmit(e) {
  e.preventDefault();
  state.errors = validate();
  const first = ["name", "phone", "comment", "consent"].find((k) => state.errors[k]);
  if (first) {
    el.content.innerHTML = VIEWS.request();
    document.getElementById("bk-" + first).focus();
    return;
  }
  // Поле-ловушка заполнено — это бот. В демо ничего не делаем, но показываем тот же экран
  state.step = "done";
  history.replaceState({ bk: "done", i: depth }, "");
  render();
  el.title.focus();
}

function onKeydown(e) {
  if (e.key === "Escape") {
    e.preventDefault();
    close();
    return;
  }
  // Фокус не уходит из окна: Tab с последнего элемента — на первый и наоборот
  if (e.key === "Tab") {
    const items = [...el.root.querySelectorAll("button, a[href], input, select, textarea, [tabindex]:not([tabindex='-1'])")]
      .filter((x) => !x.disabled && !x.closest(".bk-trap") && x.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
}


/* ---------- Открыть / закрыть ---------- */
function open(options = {}) {
  if (pendingBack) {
    queuedOpen = options;
    return;
  }
  if (state) return;
  if (!el.root) build();

  const pageMaster = PAGE_MASTER && masterBySlug(PAGE_MASTER) ? PAGE_MASTER : "";
  const presetMaster = options.master && masterBySlug(options.master) ? options.master : pageMaster;
  const service = options.service && serviceById(options.service) ? options.service : "";

  state = {
    step: "services",
    services: service ? [service] : [],
    master: presetMaster || null,
    locked: !!pageMaster,
    form: { name: "", phone: "", comment: "", consent: false, website: "" },
    errors: {},
    history: [],
  };
  opener = options.opener || null;

  // Страница под окном недоступна для Tab и экранных читалок
  [...document.body.children].forEach((child) => {
    if (child !== el.root) child.inert = true;
  });
  document.body.classList.add("bk-open");
  el.root.hidden = false;
  requestAnimationFrame(() => el.root.classList.add("is-open"));

  depth = 0;
  // Услуга выбрана → «Мастер» (или сразу Fresha, если мастер известен)
  let first = "services";
  if (service) first = state.master ? "fresha" : "master";
  if (first !== "services") go("services", { focusTitle: false });   // чтобы «назад» вело к услугам
  go(first);
}

function close() {
  if (!state) return;
  // Окно прячем сразу, а свои записи из истории браузер уберёт чуть позже (popstate)
  const steps = depth;
  finishClose();
  if (steps > 0) {
    pendingBack = true;
    history.go(-steps);
  }
}

function finishClose() {
  if (!state) return;
  state = null;
  depth = 0;
  el.root.classList.remove("is-open");
  el.root.hidden = true;
  el.content.innerHTML = "";
  el.sum.innerHTML = "";
  [...document.body.children].forEach((child) => { child.inert = false; });
  document.body.classList.remove("bk-open");
  if (opener && document.contains(opener)) opener.focus();
  opener = null;
}

window.addEventListener("popstate", onPopState);

// Смена языка при открытом окне — перерисовываем текущий шаг
document.addEventListener("langchange", () => {
  if (state) render();
});

// Все кнопки «Записаться» на странице открывают окно
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-book], [data-href='booking']");
  if (!btn || e.ctrlKey || e.metaKey || e.shiftKey) return;
  e.preventDefault();
  const nav = document.getElementById("nav");
  if (nav && nav.classList.contains("is-open")) document.getElementById("burger").click();
  open({ service: btn.dataset.bookService, master: btn.dataset.bookMaster, opener: btn });
});

})();
