/* =============================================================
   data/shop.js — данные магазина CRAZY BULL (страница shop.html)

   ВСЁ ЗДЕСЬ — ПРИМЕРЫ. Товары, объёмы, цены, описания и фото
   придуманы для демо. Замените их на настоящие:
   - id:          короткое имя товара латиницей, без пробелов (нужно корзине)
   - name:        название на трёх языках
   - volume:      объём или вес, текстом ("100 ml", "75 g")
   - price:       цена в евро, числом (можно с копейками: 12.5)
   - description: одна строка о товаре на трёх языках
   - photo:       путь к фото в папке images/shop (вертикальное 4:5, ширина ~800px)
   - sample:      true — на карточке видна пометка «пример». У настоящих товаров удалите строку

   Чтобы добавить товар, скопируйте один блок от { id: ... до }, и поменяйте значения.
   ============================================================= */

/* ---------- Настройки магазина ---------- */
const SHOP_SETTINGS = {
  brand: "CRAZY BULL",

  // Где забирают заказ
  pickupPlace: "DONT TELL MOM BARBERSHOP",
  pickupAddress: "Avotu iela 34, Rīga",

  // Мастер: на него ведут плитки «Запись» и «Instagram» внизу страницы
  masterName: "Daniels",
  bookingUrl: "https://www.fresha.com/ru/p/daniels-4339684",
  instagramUrl: "https://www.instagram.com/kazhisbarber/",
};


/* ---------- Способы получения заказа ----------
   Порядок в списке = порядок на странице. Первый — самовывоз.
   - id:     короткое имя латиницей (нужно странице)
   - pickup: true — самовывоз из барбершопа: оплата на месте, нужны только имя и телефон.
             У остальных (доставка) — имя, телефон, email и поле пункта выдачи
   - name:   название на трёх языках
   - note:   короткая подпись под названием
   - field:  подпись поля пункта выдачи / адреса (только для доставки)
   - short:  короткое имя службы для текста «что дальше» (если нет — берётся name)
   Цены доставки здесь нарочно нет: на странице написано «стоимость уточняется (демо)».
   Чтобы убрать службу, удалите её блок; чтобы добавить — скопируйте блок и поменяйте значения.
*/
const POINT_FIELD = {
  lv: "Saņemšanas punkta nosaukums vai adrese",
  ru: "Название пункта выдачи или адрес",
  en: "Pickup point name or address",
};
const ADDRESS_FIELD = {
  lv: "Adrese vai saņemšanas punkts",
  ru: "Адрес или пункт выдачи",
  en: "Address or pickup point",
};
const TIME_TBC = {
  lv: "Piegādes laiks tiks precizēts",
  ru: "Срок доставки уточняется",
  en: "Delivery time to be confirmed",
};

const SHOP_DELIVERY = [
  { id: "pickup", pickup: true,
    name: {
      lv: "Saņemt barbershopā, apmaksa uz vietas skaidrā naudā vai ar karti",
      ru: "Забрать в барбершопе, оплата наличными или картой на месте",
      en: "Pick up at the barbershop, pay cash or card on site",
    },
    note: {
      lv: "Bez maksas. Sazināsimies ar jums, kad pasūtījums būs gatavs.",
      ru: "Бесплатно. Мы свяжемся с вами, когда заказ будет готов.",
      en: "Free. We'll contact you when your order is ready.",
    } },

  { id: "omniva", short: "Omniva",
    name: { lv: "Omniva, pakomāts", ru: "Omniva, пакомат", en: "Omniva parcel locker" },
    note: TIME_TBC, field: POINT_FIELD },

  { id: "dpd", short: "DPD",
    name: { lv: "DPD Pickup / pakomāts", ru: "DPD Pickup / пакомат", en: "DPD Pickup / parcel locker" },
    note: TIME_TBC, field: POINT_FIELD },

  { id: "venipak",
    name: { lv: "Venipak", ru: "Venipak", en: "Venipak" },
    note: TIME_TBC, field: ADDRESS_FIELD },

  { id: "latvijas-pasts",
    name: { lv: "Latvijas Pasts", ru: "Latvijas Pasts", en: "Latvijas Pasts" },
    note: TIME_TBC, field: ADDRESS_FIELD },
];


/* ---------- Товары (все — примеры) ---------- */
const SHOP_PRODUCTS = [
  { id: "matte-paste", volume: "100 ml", price: 18, sample: true,
    photo: "images/shop/product-1.svg",
    name: { lv: "Matēta pasta", ru: "Матовая паста", en: "Matte paste" },
    description: {
      lv: "Stipra fiksācija bez spīduma.",
      ru: "Сильная фиксация без блеска.",
      en: "Strong hold, no shine.",
    } },

  { id: "beard-oil", volume: "30 ml", price: 16, sample: true,
    photo: "images/shop/product-2.svg",
    name: { lv: "Bārdas eļļa", ru: "Масло для бороды", en: "Beard oil" },
    description: {
      lv: "Mīkstina bārdu un ādu zem tās.",
      ru: "Смягчает бороду и кожу под ней.",
      en: "Softens the beard and the skin under it.",
    } },

  { id: "shampoo", volume: "250 ml", price: 14, sample: true,
    photo: "images/shop/product-3.svg",
    name: { lv: "Šampūns ikdienai", ru: "Шампунь на каждый день", en: "Daily shampoo" },
    description: {
      lv: "Maigs šampūns īsiem matiem.",
      ru: "Мягкий шампунь для коротких волос.",
      en: "Gentle shampoo for short hair.",
    } },

  { id: "clay", volume: "75 g", price: 20, sample: true,
    photo: "images/shop/product-4.svg",
    name: { lv: "Matu māls", ru: "Глина для волос", en: "Hair clay" },
    description: {
      lv: "Apjoms un dabiska tekstūra.",
      ru: "Объём и естественная текстура.",
      en: "Volume and a natural texture.",
    } },

  { id: "after-shave", volume: "100 ml", price: 15, sample: true,
    photo: "images/shop/product-5.svg",
    name: { lv: "Balzams pēc skūšanās", ru: "Бальзам после бритья", en: "After-shave balm" },
    description: {
      lv: "Nomierina ādu pēc skūšanās.",
      ru: "Успокаивает кожу после бритья.",
      en: "Calms the skin after shaving.",
    } },

  { id: "sea-salt", volume: "200 ml", price: 17, sample: true,
    photo: "images/shop/product-6.svg",
    name: { lv: "Sāls sprejs", ru: "Солевой спрей", en: "Sea salt spray" },
    description: {
      lv: "Viegla fiksācija pirms žāvēšanas.",
      ru: "Лёгкая фиксация перед сушкой.",
      en: "Light hold before blow-drying.",
    } },
];
