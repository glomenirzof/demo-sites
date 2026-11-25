/* =============================================================
   shop.js — DEMO-страница магазина CRAZY BULL (shop.html)

   Подключается ПОСЛЕ data/shop.js и script.js и пользуется общим
   механизмом сайта: тексты лежат в TEXTS[язык].shop,
   в HTML стоят data-i18n="shop.…".

   ВАЖНО: это только имитация на странице. Никаких платежей,
   никаких запросов на сервер. Введённые имя, телефон и email
   никуда не отправляются и не сохраняются: после «оплаты» форма
   очищается. В памяти браузера (localStorage) хранится только
   содержимое корзины, чтобы оно не пропадало при обновлении.

   ЧАСТЬ 1. ТЕКСТЫ СТРАНИЦЫ (LV / RU / EN)
   ЧАСТЬ 2. ЛОГИКА — обычно трогать не нужно
   Товары и цены — в data/shop.js
   ============================================================= */


/* =============================================================
   ЧАСТЬ 1. ТЕКСТЫ
   {place} в тексте заменяется на SHOP_SETTINGS.pickupPlace и адрес
   ============================================================= */
const SHOP_TEXTS = {
  lv: {
    meta: {
      title: "CRAZY BULL, kosmētika barbershopā",
      description: "CRAZY BULL kosmētika, DONT TELL MOM BARBERSHOP, Rīga.",
    },
    back: "← Uz sākumlapu",
    hero: {
      eyebrow: "Kosmētika barbershopā",
      text: "To pašu lietojam krēslā. Pasūti un paņem pēc griezuma.",
      cta: "Uz precēm",
      photoAlt: "Barbershopa foto",
    },
    products: {
      label: "Veikals",
      title: "Preces",
    },
    buy: "Pirkt",
    added: "Grozā ✓",
    addedLive: "Pievienots grozam",
    cart: {
      open: "Grozs",
      title: "Grozs",
      close: "Aizvērt",
      empty: "Grozs pagaidām ir tukšs.",
      emptyCta: "Uz precēm",
      items: "Preces",
      delivery: "Piegāde",
      total: "Kopā",
      free: "bez maksas",
      remove: "Noņemt",
      less: "Mazāk",
      more: "Vairāk",
      checkout: "Noformēt pasūtījumu",
      order: "Pasūtījums",
    },
    steps: { label: "Pasūtījuma soļi", s1: "Grozs", s2: "Piegāde", s3: "Apmaksa", next: "Tālāk", back: "Atpakaļ" },
    delivery: {
      label: "Kā saņemt",
      contacts: "Kontaktinformācija",
      name: "Vārds",
      phone: "Tālrunis",
      email: "E-pasts",
      free: "bez maksas",
      costNote: "Piegādes cena tiks precizēta",
      totalNoDelivery: "Kopā bez piegādes",
    },
    errors: {
      summary: "Pārbaudiet atzīmētos laukus.",
      required: "Aizpildiet šo lauku.",
      name: "Ierakstiet vārdu (vismaz 2 burti).",
      phone: "Ierakstiet tālruni, piemēram, +371 20000000.",
      email: "Ierakstiet e-pastu, piemēram, vards@example.com.",
    },
    payment: {
      label: "Apmaksa",
      text: "Šeit klients izvēlēsies apmaksu: karte, Apple Pay / Google Pay vai bankas pārskaitījums.",
      card: "Karte",
      wallet: "Apple Pay / Google Pay",
      bank: "Bankas pārskaitījums",
      pay: "Apmaksāt",
      onSiteLabel: "Apmaksa uz vietas",
      onSiteText: "Apmaksa uz vietas. Pasūtījums jūs gaidīs {place}.",
      onSiteHow: "Var maksāt skaidrā naudā vai ar karti.",
      reserve: "Rezervēt",
    },
    secure: {
      label: "Droša apmaksa",
      text: "Apmaksa notiek maksājumu sistēmas lapā, kartes dati vietnē netiek glabāti.",
    },
    help: {
      label: "Palīdzība izvēlē",
      text: "Nezināt, kas der? Jautājiet meistaram barbershopā, un mēs palīdzēsim izvēlēties kopšanas līdzekli.",
    },
    done: {
      title: "Paldies, pasūtījums pieņemts",
      order: "Pasūtījums",
      next: "Kas notiks tālāk",
      plusDelivery: "+ piegāde",
      pickup1: "Sazināsimies ar jums, kad pasūtījums būs gatavs.",
      pickup2: "Paņemiet to barbershopā: {place}.",
      pickup3: "Apmaksa uz vietas skaidrā naudā vai ar karti.",
      delivery1: "Apstiprinājums atnāks uz norādīto e-pastu.",
      delivery2: "Sazināsimies, lai precizētu piegādes cenu un laiku.",
      delivery3: "{carrier} paziņos, kad paka būs saņemšanas vietā.",
      back: "Atpakaļ uz veikalu",
    },
    how: {
      label: "Kā tas strādā",
      title: "Trīs soļi",
      s1title: "Izvēlies",
      s1text: "Pievieno grozam to, kas tev der. Ja šaubies, pajautā meistaram.",
      s2title: "Samaksā",
      s2text: "Tiešsaistē vai uz vietas, ja saņemat barbershopā.",
      s3title: "Paņem",
      s3text: "Barbershopā pēc griezuma vai ar piegādi uz pakomātu vai adresi.",
    },
    tiles: { label: "Vēl vērts apskatīt", book: "Pierakstīties pie Daniela", team: "Meistari", instagram: "Instagram" },
  },

  ru: {
    meta: {
      title: "CRAZY BULL, косметика в барбершопе",
      description: "Косметика CRAZY BULL, DONT TELL MOM BARBERSHOP, Рига.",
    },
    back: "← На главную",
    hero: {
      eyebrow: "Косметика в барбершопе",
      text: "Тем же пользуемся в кресле. Закажите и заберите после стрижки.",
      cta: "Перейти к товарам",
      photoAlt: "Фото барбершопа",
    },
    products: {
      label: "Магазин",
      title: "Товары",
    },
    buy: "Купить",
    added: "В корзине ✓",
    addedLive: "Добавлено в корзину",
    cart: {
      open: "Корзина",
      title: "Корзина",
      close: "Закрыть",
      empty: "В корзине пока пусто.",
      emptyCta: "Перейти к товарам",
      items: "Товары",
      delivery: "Доставка",
      total: "Итого",
      free: "бесплатно",
      remove: "Убрать",
      less: "Меньше",
      more: "Больше",
      checkout: "Оформить заказ",
      order: "Заказ",
    },
    steps: { label: "Шаги заказа", s1: "Корзина", s2: "Доставка", s3: "Оплата", next: "Далее", back: "Назад" },
    delivery: {
      label: "Как получить",
      contacts: "Контакты",
      name: "Имя",
      phone: "Телефон",
      email: "Email",
      free: "бесплатно",
      costNote: "Стоимость доставки уточняется",
      totalNoDelivery: "Итого без доставки",
    },
    errors: {
      summary: "Проверьте отмеченные поля.",
      required: "Заполните это поле.",
      name: "Напишите имя (хотя бы 2 буквы).",
      phone: "Напишите телефон, например +371 20000000.",
      email: "Напишите email, например name@example.com.",
    },
    payment: {
      label: "Оплата",
      text: "Здесь клиент выберет оплату: карта, Apple Pay / Google Pay или банковский перевод.",
      card: "Карта",
      wallet: "Apple Pay / Google Pay",
      bank: "Банковский перевод",
      pay: "Оплатить",
      onSiteLabel: "Оплата на месте",
      onSiteText: "Оплата на месте. Заказ будет ждать вас в {place}.",
      onSiteHow: "Можно оплатить наличными или картой.",
      reserve: "Забронировать",
    },
    secure: {
      label: "Безопасная оплата",
      text: "Оплата проходит на странице платёжной системы, данные карты на сайте не хранятся.",
    },
    help: {
      label: "Помощь с выбором",
      text: "Не знаете, что подойдёт? Спросите мастера в барбершопе, поможем подобрать средство.",
    },
    done: {
      title: "Спасибо, заказ принят",
      order: "Заказ",
      next: "Что дальше",
      plusDelivery: "+ доставка",
      pickup1: "Мы свяжемся с вами, когда заказ будет готов.",
      pickup2: "Заберите его в барбершопе: {place}.",
      pickup3: "Оплата на месте наличными или картой.",
      delivery1: "Подтверждение придёт на указанный email.",
      delivery2: "Мы свяжемся с вами, чтобы уточнить стоимость и срок доставки.",
      delivery3: "{carrier} сообщит, когда посылка будет в пункте выдачи.",
      back: "Вернуться в магазин",
    },
    how: {
      label: "Как это работает",
      title: "Три шага",
      s1title: "Выбрали",
      s1text: "Добавьте в корзину то, что вам подходит. Сомневаетесь? Спросите мастера.",
      s2title: "Оплатили",
      s2text: "Онлайн или на месте, если забираете в барбершопе.",
      s3title: "Забрали",
      s3text: "В барбершопе после стрижки или с доставкой в пакомат или по адресу.",
    },
    tiles: { label: "Ещё стоит заглянуть", book: "Записаться к Daniels", team: "Мастера", instagram: "Instagram" },
  },

  en: {
    meta: {
      title: "CRAZY BULL, grooming at the barbershop",
      description: "CRAZY BULL grooming products, DONT TELL MOM BARBERSHOP, Riga.",
    },
    back: "← Back to home",
    hero: {
      eyebrow: "Grooming at the barbershop",
      text: "What we use in the chair. Order online, pick up after your cut.",
      cta: "Shop products",
      photoAlt: "Barbershop photo",
    },
    products: {
      label: "Shop",
      title: "Products",
    },
    buy: "Buy",
    added: "In cart ✓",
    addedLive: "Added to cart",
    cart: {
      open: "Cart",
      title: "Cart",
      close: "Close",
      empty: "Your cart is empty.",
      emptyCta: "Shop products",
      items: "Items",
      delivery: "Delivery",
      total: "Total",
      free: "free",
      remove: "Remove",
      less: "Less",
      more: "More",
      checkout: "Checkout",
      order: "Your order",
    },
    steps: { label: "Order steps", s1: "Cart", s2: "Delivery", s3: "Payment", next: "Continue", back: "Back" },
    delivery: {
      label: "How to receive",
      contacts: "Your details",
      name: "Name",
      phone: "Phone",
      email: "Email",
      free: "free",
      costNote: "Delivery cost to be confirmed",
      totalNoDelivery: "Total excl. delivery",
    },
    errors: {
      summary: "Please check the marked fields.",
      required: "Please fill in this field.",
      name: "Enter your name (at least 2 letters).",
      phone: "Enter a phone number, e.g. +371 20000000.",
      email: "Enter an email, e.g. name@example.com.",
    },
    payment: {
      label: "Payment",
      text: "Here the customer will choose how to pay: card, Apple Pay / Google Pay or bank transfer.",
      card: "Card",
      wallet: "Apple Pay / Google Pay",
      bank: "Bank transfer",
      pay: "Pay",
      onSiteLabel: "Pay on site",
      onSiteText: "Pay on site. Your order will be waiting at {place}.",
      onSiteHow: "Cash or card are both fine.",
      reserve: "Reserve",
    },
    secure: {
      label: "Secure payment",
      text: "Payment happens on the payment provider's page. Card details are never stored on this site.",
    },
    help: {
      label: "Help choosing",
      text: "Not sure what suits you? Ask a barber in the shop and we'll help you pick the right product.",
    },
    done: {
      title: "Thank you, order received",
      order: "Order",
      next: "What happens next",
      plusDelivery: "+ delivery",
      pickup1: "We'll contact you when the order is ready.",
      pickup2: "Collect it at the barbershop: {place}.",
      pickup3: "Pay on site by cash or card.",
      delivery1: "A confirmation will arrive at your email.",
      delivery2: "We'll contact you to confirm the delivery cost and time.",
      delivery3: "{carrier} will let you know when the parcel reaches the pickup point.",
      back: "Back to the shop",
    },
    how: {
      label: "How it works",
      title: "Three steps",
      s1title: "Choose",
      s1text: "Add what suits you to the cart. Not sure? Ask your barber.",
      s2title: "Pay",
      s2text: "Online, or on site if you pick up at the barbershop.",
      s3title: "Pick up",
      s3text: "At the barbershop after your cut, or delivered to a locker or address.",
    },
    tiles: { label: "Also worth a look", book: "Book with Daniels", team: "Barbers", instagram: "Instagram" },
  },
};


/* =============================================================
   ЧАСТЬ 2. ЛОГИКА
   ============================================================= */

// Добавляем тексты магазина к общим текстам сайта: TEXTS.ru.shop = SHOP_TEXTS.ru и т.д.
for (const lang in SHOP_TEXTS) {
  TEXTS[lang].shop = SHOP_TEXTS[lang];
}

const CART_KEY = "crazybull-cart-demo";

// Корзина: { "matte-paste": 2, "beard-oil": 1 } — id товара и количество
let cart = loadCart();
let step = 1;                 // 1 — корзина, 2 — доставка, 3 — оплата, "done" — спасибо
let method = SHOP_DELIVERY[0].id;   // способ получения: id из SHOP_DELIVERY (data/shop.js)
let lastOrder = null;         // номер и сумма последнего (демо) заказа для экрана «Спасибо»

// Кнопки «Купить» в стиле версии сайта: в v2 и v3 — круглые (btn--pill)
const PILL = document.body.dataset.pill === "true" ? " btn--pill" : "";


/* ---------- Корзина в памяти браузера ----------
   localStorage может быть недоступен (инкогнито, запрет сайта) —
   тогда корзина просто живёт до перезагрузки страницы */
function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || "{}");
    const clean = {};
    for (const id in saved) {
      const qty = Math.floor(Number(saved[id]));
      if (productById(id) && qty > 0) clean[id] = Math.min(qty, 99);
    }
    return clean;
  } catch (e) {
    return {};
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (e) {}
}


/* ---------- Подсчёты ---------- */
function productById(id) {
  return SHOP_PRODUCTS.find((p) => p.id === id);
}

function cartItems() {
  return Object.keys(cart).map((id) => ({ product: productById(id), qty: cart[id] }));
}

function cartCount() {
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
}

function cartSubtotal() {
  return cartItems().reduce((sum, item) => sum + item.product.price * item.qty, 0);
}

// Выбранный способ получения и признак «самовывоз»
function carrier(id = method) {
  return SHOP_DELIVERY.find((c) => c.id === id) || SHOP_DELIVERY[0];
}

function isPickup(id = method) {
  return Boolean(carrier(id).pickup);
}

// Цена: €18 или €21,50 (в английском — €21.50)
function money(value) {
  const rounded = Math.round(value * 100) / 100;
  const text = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
  return "€" + (currentLang === "en" ? text : text.replace(".", ","));
}

// Кавычки и спецсимволы из данных не ломают HTML
function esc(text) {
  return String(text).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

const pickupPlace = () => `${SHOP_SETTINGS.pickupPlace}, ${SHOP_SETTINGS.pickupAddress}`;


/* ---------- Сетка товаров ---------- */
function renderProducts() {
  const list = document.getElementById("sp-products");
  if (!list) return;

  list.innerHTML = SHOP_PRODUCTS.map((p) => {
    const name = esc(p.name[currentLang]);
    return `
    <li class="sp-product">
      <div class="sp-product__media">
        <img class="sp-product__photo" src="${esc(p.photo)}" alt="${name}" width="800" height="1000" loading="lazy">
      </div>
      <div class="sp-product__row">
        <h3 class="sp-product__name">${name}</h3>
        <strong class="sp-product__price">${money(p.price)}</strong>
      </div>
      <p class="sp-product__volume">${esc(p.volume)}</p>
      <p class="sp-product__desc">${esc(p.description[currentLang])}</p>
      <button type="button" class="sp-product__buy" data-add="${esc(p.id)}" aria-label="${t("shop.buy")}: ${name}">${t("shop.buy")}</button>
    </li>`;
  }).join("");
}


/* ---------- Содержимое корзины, итоги, счётчик в шапке ---------- */
// Итоги. Цену доставки не показываем: только «стоимость уточняется (демо)»
function summaryHtml(withDelivery) {
  const subtotal = money(cartSubtotal());
  let html = `<div><dt>${t("shop.cart.items")}</dt><dd>${subtotal}</dd></div>`;
  let totalLabel = t("shop.cart.total");

  if (withDelivery && isPickup()) {
    html += `<div><dt>${t("shop.cart.delivery")}</dt><dd>${t("shop.delivery.free")}</dd></div>`;
  } else if (withDelivery) {
    html += `<div class="sp-sum__note"><dt>${t("shop.cart.delivery")}</dt><dd>${t("shop.delivery.costNote")}</dd></div>`;
    totalLabel = t("shop.delivery.totalNoDelivery");
  }
  return html + `<div class="sp-sum__total"><dt>${totalLabel}</dt><dd>${subtotal}</dd></div>`;
}

function renderCart() {
  const items = cartItems();
  const empty = items.length === 0;

  document.getElementById("sp-cart-list").innerHTML = items.map(({ product: p, qty }) => {
    const name = esc(p.name[currentLang]);
    return `
    <li class="sp-item">
      <img class="sp-item__photo" src="${esc(p.photo)}" alt="${name}" width="80" height="100">
      <div class="sp-item__info">
        <p class="sp-item__name">${name}</p>
        <p class="sp-item__meta">${esc(p.volume)} · ${money(p.price)}</p>
        <div class="sp-qty">
          <button type="button" class="sp-qty__btn" data-qty="-1" data-id="${esc(p.id)}" aria-label="${t("shop.cart.less")}: ${name}">−</button>
          <span class="sp-qty__num">${qty}</span>
          <button type="button" class="sp-qty__btn" data-qty="1" data-id="${esc(p.id)}" aria-label="${t("shop.cart.more")}: ${name}">+</button>
        </div>
      </div>
      <div class="sp-item__side">
        <strong>${money(p.price * qty)}</strong>
        <button type="button" class="sp-item__remove" data-remove="${esc(p.id)}">${t("shop.cart.remove")}</button>
      </div>
    </li>`;
  }).join("");

  document.getElementById("sp-cart-empty").hidden = !empty;
  document.getElementById("sp-cart-filled").hidden = empty;
  document.getElementById("sp-sum-1").innerHTML = summaryHtml(false);
  document.getElementById("sp-sum-2").innerHTML = summaryHtml(true);
  document.getElementById("sp-sum-3").innerHTML = summaryHtml(true);

  // Счётчик на иконке корзины в шапке
  const count = cartCount();
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = count;
  });
  document.querySelectorAll("[data-cart-open]").forEach((btn) => {
    btn.setAttribute("aria-label", `${t("shop.cart.open")}: ${count}`);
  });
}


/* ---------- Шаги оформления ---------- */
function showStep(next) {
  // Пустую корзину дальше первого шага не пускаем
  if (next !== 1 && next !== "done" && cartCount() === 0) next = 1;
  step = next;

  // Заголовок панели: «Корзина» на первом шаге, дальше — «Заказ»
  document.getElementById("sp-cart-title").textContent = t(step === 1 ? "shop.cart.title" : "shop.cart.order");

  document.querySelectorAll("[data-step]").forEach((el) => {
    el.hidden = String(el.dataset.step) !== String(step);
  });

  // Индикатор: пройденные шаги отмечены, текущий — aria-current
  const current = step === "done" ? 4 : step;
  document.querySelectorAll("[data-step-ind]").forEach((el) => {
    const n = Number(el.dataset.stepInd);
    el.classList.toggle("is-done", n < current);
    el.classList.toggle("is-active", n === current);
    if (n === current) el.setAttribute("aria-current", "step");
    else el.removeAttribute("aria-current");
  });

  // Панель прокручиваем к началу, чтобы новый шаг был виден сверху
  const body = document.getElementById("sp-drawer-body");
  if (body) body.scrollTop = 0;
}

/* ---------- Шаг 2: способы получения (из SHOP_DELIVERY) ---------- */
function renderDelivery() {
  document.getElementById("sp-options-list").innerHTML = SHOP_DELIVERY.map((c) => `
    <label class="sp-option">
      <input type="radio" name="sp-method" value="${esc(c.id)}"${c.id === method ? " checked" : ""}>
      <span>
        <span class="sp-option__title">${esc(c.name[currentLang])}</span>
        <span class="sp-option__note">${esc(c.note[currentLang])}</span>
      </span>
    </label>
  `).join("");
  updatePointLabel();
}

// Подпись поля пункта выдачи — своя у каждой службы
function updatePointLabel() {
  const c = carrier();
  if (c.field) document.getElementById("sp-point-label").textContent = c.field[currentLang];
}

// Самовывоз: только имя и телефон. Доставка: ещё email и пункт выдачи / адрес.
// Скрытые поля выключаем (disabled), чтобы их не проверять
function setMethod(value) {
  method = carrier(value).id;
  const pickup = isPickup();

  ["sp-email", "sp-point"].forEach((id) => {
    const input = document.getElementById(id);
    input.disabled = pickup;
    input.closest(".sp-field").hidden = pickup;
  });

  // Шаг 3: «оплата на месте» или «выбор оплаты»
  document.querySelectorAll("[data-pay]").forEach((el) => {
    el.hidden = (el.dataset.pay === "pickup") !== pickup;
  });

  // Отмечаем нужный вариант (список не перерисовываем, чтобы не сбить фокус клавиатуры)
  const radio = document.querySelector(`input[name="sp-method"][value="${method}"]`);
  if (radio) radio.checked = true;

  clearErrors();
  updatePointLabel();
  renderCart();
}


/* ---------- Проверка полей (только в браузере) ----------
   Своя проверка вместо всплывающих подсказок браузера:
   сообщение появляется под полем на языке сайта */
const PHONE_RE = /^\+?[0-9 ()-]{7,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function fieldError(input) {
  const value = input.value.trim();
  if (!value) return "required";
  if (input.id === "sp-name" && value.length < 2) return "name";
  if (input.id === "sp-phone" && (!PHONE_RE.test(value) || value.replace(/\D/g, "").length < 7)) return "phone";
  if (input.id === "sp-email" && !EMAIL_RE.test(value)) return "email";
  return "";
}

function showError(input, key) {
  const box = document.getElementById(input.id + "-error");
  input.setAttribute("aria-invalid", key ? "true" : "false");
  input.closest(".sp-field").classList.toggle("is-invalid", Boolean(key));
  box.dataset.error = key;
  box.textContent = key ? t("shop.errors." + key) : "";
}

function clearErrors() {
  document.querySelectorAll("#sp-delivery .sp-field input").forEach((input) => showError(input, ""));
  document.getElementById("sp-form-error").hidden = true;
}

// Проверяет все видимые поля; возвращает true, если всё заполнено верно
function validateForm() {
  let first = null;
  document.querySelectorAll("#sp-delivery .sp-field input:not(:disabled)").forEach((input) => {
    const key = fieldError(input);
    showError(input, key);
    if (key && !first) first = input;
  });
  document.getElementById("sp-form-error").hidden = !first;
  if (first) first.focus();
  return !first;
}

// При смене языка переводим уже показанные сообщения
function translateErrors() {
  document.querySelectorAll(".sp-field__error").forEach((box) => {
    if (box.dataset.error) box.textContent = t("shop.errors." + box.dataset.error);
  });
}

// Экран «Спасибо»: что будет дальше
function renderDone() {
  if (!lastOrder) return;
  const pickup = isPickup(lastOrder.method);
  const extra = pickup ? "" : " " + t("shop.done.plusDelivery");
  document.getElementById("sp-order-no").textContent = `${lastOrder.no} · ${money(lastOrder.total)}${extra}`;

  const keys = pickup
    ? ["done.pickup1", "done.pickup2", "done.pickup3"]
    : ["done.delivery1", "done.delivery2", "done.delivery3"];
  const c = carrier(lastOrder.method);
  const carrierName = c.short || c.name[currentLang];

  document.getElementById("sp-next").innerHTML = keys.map((key, i) => `
    <li><span class="sp-next__num">${String(i + 1).padStart(2, "0")}</span>
    <span>${esc(t("shop." + key).replace("{place}", pickupPlace()).replace("{carrier}", carrierName))}</span></li>
  `).join("");
}

// «Оплатить (демо)» и «Забронировать (демо)»: ничего не отправляем,
// только показываем экран «Спасибо»
function finishDemoOrder() {
  lastOrder = {
    no: "CB-" + String(Math.floor(1000 + Math.random() * 9000)),
    total: cartSubtotal(),
    method,
  };

  // Очищаем всё введённое и корзину
  cart = {};
  saveCart();
  document.getElementById("sp-delivery").reset();
  setMethod(SHOP_DELIVERY[0].id);

  renderDone();
  showStep("done");
}


/* ---------- Панель корзины: открыть / закрыть ---------- */
// Пока панель открыта, остальная страница «выключена» для мыши,
// клавиши Tab и экранных читалок (атрибут inert)
const PAGE_PARTS = ["header", ".menu", ".sp-demo", "main", "footer"];

function setCart(open) {
  const drawer = document.getElementById("sp-cart");
  if (document.body.classList.contains("sp-cart-open") === open) return;

  document.body.classList.toggle("sp-cart-open", open);
  drawer.setAttribute("aria-hidden", !open);
  document.querySelectorAll(PAGE_PARTS.join(",")).forEach((el) => {
    el.inert = open;
  });

  if (open) {
    showStep(step === "done" ? 1 : step);
    void drawer.offsetWidth;          // сразу применяем стили, чтобы поставить фокус
    document.getElementById("sp-cart-close").focus();
  } else {
    if (step === "done") step = 1;
    const opener = document.querySelector("[data-cart-open]");
    if (opener) opener.focus({ preventScroll: true });
  }
}


/* ---------- Действия ---------- */
function addToCart(id, button) {
  cart[id] = Math.min((cart[id] || 0) + 1, 99);
  saveCart();
  renderCart();

  // Подсказка: «В корзине ✓» на кнопке и мигание счётчика
  if (button) {
    button.textContent = t("shop.added");
    button.classList.add("is-added");
    setTimeout(() => {
      button.textContent = t("shop.buy");
      button.classList.remove("is-added");
    }, 1600);
  }
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.classList.remove("is-bump");
    void el.offsetWidth;
    el.classList.add("is-bump");
  });

  const product = productById(id);
  document.getElementById("sp-live").textContent = `${t("shop.addedLive")}: ${product.name[currentLang]}`;
}

function changeQty(id, delta) {
  const qty = (cart[id] || 0) + delta;
  if (qty <= 0) delete cart[id];
  else cart[id] = Math.min(qty, 99);
  saveCart();
  renderCart();
}

function initShop() {
  // Клики по кнопкам внутри списков ловим на документе:
  // карточки и строки корзины перерисовываются при смене языка
  document.addEventListener("click", (e) => {
    const add = e.target.closest("[data-add]");
    if (add) return addToCart(add.dataset.add, add);

    const qty = e.target.closest("[data-qty]");
    if (qty) return changeQty(qty.dataset.id, Number(qty.dataset.qty));

    const remove = e.target.closest("[data-remove]");
    if (remove) return changeQty(remove.dataset.remove, -Infinity);

    if (e.target.closest("[data-cart-open]")) return setCart(true);
    if (e.target.closest("[data-cart-close]")) return setCart(false);

    const go = e.target.closest("[data-go]");
    if (go) return showStep(Number(go.dataset.go));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setCart(false);
  });

  // Шаг 2: выбор способа получения (варианты перерисовываются, поэтому слушаем документ)
  document.addEventListener("change", (e) => {
    if (e.target.name === "sp-method") setMethod(e.target.value);
  });

  // Пока человек исправляет поле, сообщение об ошибке убираем
  document.querySelectorAll("#sp-delivery .sp-field input").forEach((input) => {
    input.addEventListener("input", () => {
      if (input.getAttribute("aria-invalid") === "true" && !fieldError(input)) showError(input, "");
    });
  });

  // Шаг 2 → 3. preventDefault не даёт форме никуда отправиться
  document.getElementById("sp-delivery").addEventListener("submit", (e) => {
    e.preventDefault();
    if (validateForm()) showStep(3);
  });

  document.getElementById("sp-pay").addEventListener("click", finishDemoOrder);
  document.getElementById("sp-reserve").addEventListener("click", finishDemoOrder);

  // Ссылки мастера внизу страницы (запись, Instagram)
  const links = { booking: SHOP_SETTINGS.bookingUrl, instagram: SHOP_SETTINGS.instagramUrl };
  document.querySelectorAll("[data-shop-href]").forEach((el) => {
    el.href = links[el.dataset.shopHref];
    el.target = "_blank";
    el.rel = "noopener noreferrer";
  });

  // Название бренда и место самовывоза из data/shop.js
  document.querySelectorAll("[data-shop]").forEach((el) => {
    el.textContent = el.dataset.shop === "pickup" ? pickupPlace() : SHOP_SETTINGS[el.dataset.shop];
  });

  renderDelivery();
  setMethod(SHOP_DELIVERY[0].id);
  showStep(1);
}

// При каждой смене языка перерисовываем то, что строит JS
function applyShopLanguage() {
  document.title = t("shop.meta.title");
  document.querySelector('meta[name="description"]').content = t("shop.meta.description");
  renderProducts();
  document.getElementById("sp-onsite-text").textContent = t("shop.payment.onSiteText").replace("{place}", pickupPlace());
  renderDelivery();
  renderCart();
  renderDone();
  translateErrors();
  showStep(step);
}

document.addEventListener("langchange", applyShopLanguage);

// Если что-то пойдёт не так, ошибка появится в консоли (F12 → Console), а страница останется
try {
  initShop();
} catch (e) {
  console.error("Ошибка в initShop:", e);
}
// script.js уже показал страницу, но тогда текстов магазина ещё не было — показываем заново
setLanguage(currentLang);
