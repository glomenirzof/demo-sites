/* =============================================================
   data/site.js — ВСЕ данные салона в одном файле (v5)

   Отсюда берут данные: сайт (script.js), окно записи (booking.js),
   страницы мастеров (master.js) и генератор (tools/generate.js, Node).

   ---------- КАК ЗАПОЛНЯТЬ ЦЕНЫ ПО МАСТЕРАМ ----------
   Цены Fresha, октябрь 2026 (собраны 29.10.2026), могут измениться.
   На странице записи Fresha салона: выбрать услугу → шаг «Специалист» —
   там у каждого мастера его цена.

   У каждого мастера prices — по id услуги, три состояния:
     buzz: { p: 15, from: true }   — цена мастера; from: true = на Fresha «от 15 €»,
                                     from: false = цена без «от» (фиксированная)
     buzz: null                    — мастер услугу делает, но цена неизвестна
     ключа нет                     — мастер эту услугу НЕ делает: её нет на его
                                     странице, и в записи его нельзя выбрать для неё
   В services у каждой услуги fromPrice — минимальная цена «от» по салону.
   Ничего не выдумывайте: чего нет на Fresha — того нет и здесь.

   ---------- ССЫЛКИ FRESHA ----------
   Кнопка «Продолжить на Fresha» выбирает ссылку по порядку:
     1) links.pairs["<id услуги>:<slug мастера>"] — услуга сразу у этого мастера
     2) freshaLink мастера   3) freshaLink услуги   4) ссылка салона
   При нескольких услугах — ссылка мастера или салона.
   Пустая строка "" = ссылки нет, берётся следующая по порядку.

   Добавить мастера: скопируйте запись в masters, затем  node tools/generate.js
   Всё, что помечено «пример», — заглушки: замените на настоящее.
   ============================================================= */

const SITE = {

  /* ---------- Салон ---------- */
  salon: {
    name: "DONT TELL MOM BARBERSHOP",
    shortName: "DONT TELL MOM",        // в шапке, чтобы влезало на телефоне
    address: "Avotu iela 34, Rīga",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Avotu+iela+34+Riga",
    mapEmbedUrl: "https://www.google.com/maps?q=Avotu+iela+34+Riga&output=embed",
    freshaLink: "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q",
    instagramUrl: "https://www.instagram.com/dtm.barbershop/",
    instagramHandle: "@dtm.barbershop",

    // ПРИМЕР — заменить на настоящий телефон и WhatsApp
    phone: "+371 20 000 000",
    phoneRaw: "+37120000000",
    whatsapp: "37120000000",
  },

  // Строки часов в «Контактах» (days — ключ из TEXTS.days)
  hours: [
    { days: "monFri", time: "10:00-20:00" },
    { days: "sat",    time: "10:00-18:00" },
    { days: "sun",    time: "11:00-16:00" },
  ],

  /* ---------- Услуги ----------
     Как на странице записи Fresha салона (октябрь 2026).
     id:         короткое имя латиницей (в ценах мастеров и ссылках)
     category:   "haircut" или "beard" — вкладки на главной
     min / max:  длительность в минутах
     fromPrice:  минимальная цена «от» по салону, €
     image:      фото на карточке: путь или { src: "images/…", isReal: true }.
                 Пока isReal не true, на фото подпись «Пример, сгенерировано ИИ»
                 (сейчас все фото — примеры). Нет image — услуга показывается строкой
     freshaLink: ссылка Fresha на эту услугу (пусто — нет) */
  services: [
    { id: "buzz",       category: "haircut", min: 25, max: 60,  fromPrice: 15, image: "images/service-buzz.jpg",       freshaLink: "",
      name: { lv: "Buzz cut", ru: "Buzz cut", en: "Buzz cut" } },
    { id: "skinfade",   category: "haircut", min: 60, max: 90,  fromPrice: 10, image: "images/service-fade.jpg",       freshaLink: "",
      name: { lv: "Skinfade", ru: "Skinfade", en: "Skinfade" } },
    { id: "taper",      category: "haircut", min: 60, max: 120, fromPrice: 10, image: "images/service-taper.jpg",      freshaLink: "",
      name: { lv: "Taper fade", ru: "Taper fade", en: "Taper fade" } },
    { id: "mod",        category: "haircut", min: 60, max: 90,  fromPrice: 15, image: "images/service-mod.jpg",        freshaLink: "",
      name: { lv: "Mod cut", ru: "Mod cut", en: "Mod cut" } },
    { id: "mullet",     category: "haircut", min: 60, max: 60,  fromPrice: 15, image: "images/service-mullet.jpg",     freshaLink: "",
      name: { lv: "Mullet", ru: "Маллет", en: "Mullet" } },
    { id: "long",       category: "haircut", min: 60, max: 60,  fromPrice: 20, image: "images/service-long.jpg",       freshaLink: "",
      name: { lv: "Gari mati", ru: "Длинные волосы", en: "Long hair" } },
    { id: "beard",      category: "beard",   min: 30, max: 90,  fromPrice: 10, image: "images/service-beard.jpg",      freshaLink: "",
      name: { lv: "Bārda", ru: "Борода", en: "Beard" } },
    { id: "buzz-beard", category: "beard",   min: 60, max: 120, fromPrice: 20, image: "images/service-buzz-beard.jpg", freshaLink: "",
      name: { lv: "Buzz cut + bārda", ru: "Buzz cut + борода", en: "Buzz cut + beard" } },
    { id: "cut-beard",  category: "beard",   min: 90, max: 150, fromPrice: 25, image: "images/service-cut-beard.jpg",  freshaLink: "",
      name: { lv: "Matu griezums + bārda", ru: "Стрижка + борода", en: "Haircut + beard" } },
  ],

  /* ---------- Мастера ----------
     slug:       имя папки страницы мастера (латиница)
     role:       "senior", "barber" или "junior" — как подпись на Fresha
     employeeId: номер мастера на Fresha (для ссылок «услуга + мастер»)
     photo:      фото, которое дал сам мастер. Пусто — инициалы
     freshaLink: личная ссылка Fresha (пусто — ссылка салона)
     instagram:  личный Instagram (пусто — Instagram салона)
     prices:     цены по id услуги: { p, from }, null или нет ключа (см. начало файла)
     bio:        ПРИМЕР — заменить на настоящий текст
     skills:     теги специализаций (пример): строка или { lv, ru, en }
     workPhotos: НЕОБЯЗАТЕЛЬНО — свои фото работ мастера по id услуги:
                   workPhotos: { mod: ["images/daniels-mod.jpg"], buzz: ["images/…"] }
                 На его странице берётся первое фото вместо общего фото услуги
                 (подписи «пример» на нём нет) */
  masters: [
    { slug: "daniels", name: "Daniels", role: "senior", photo: "images/daniels-work.png",
      freshaLink: "https://www.fresha.com/ru/p/daniels-4339684",
      instagram: "https://www.instagram.com/kazhisbarber/", instagramHandle: "@kazhisbarber",
      employeeId: 5107882,
      prices: {
        buzz: { p: 25, from: true },
        skinfade: { p: 30, from: false },
        taper: { p: 30, from: false },
        mod: { p: 30, from: false },
        mullet: { p: 30, from: false },
        long: { p: 30, from: false },
        beard: { p: 25, from: false },
        "buzz-beard": { p: 45, from: false },
        "cut-beard": { p: 50, from: false },
      },
      skills: ["Fade", "Mullet", { lv: "Bārda", ru: "Борода", en: "Beard" }],
      bio: {
        lv: "Bārddzinis DONT TELL MOM. Šeit būs īss stāsts: kā sāka, ko griež visbiežāk un kā notiek apmeklējums.",
        ru: "Барбер DONT TELL MOM. Здесь будет короткий рассказ: как начинал, что стрижёт чаще всего и как проходит визит.",
        en: "Barber at DONT TELL MOM. A short story goes here: how he started, the cuts he does most and what a visit looks like.",
      } },
    { slug: "roberts", name: "Roberts", role: "junior", photo: "", freshaLink: "", instagram: "", instagramHandle: "",
      employeeId: 5447600,
      prices: {
        buzz: { p: 15, from: true },
        skinfade: { p: 15, from: true },
        taper: { p: 15, from: true },
        mod: { p: 15, from: true },
        mullet: { p: 15, from: true },
      },
      skills: ["Fade", "Buzz cut"],
      bio: {
        lv: "Jaunākais bārddzinis. Šeit būs īss stāsts par meistaru.",
        ru: "Младший барбер. Здесь будет короткий рассказ о мастере.",
        en: "Junior barber. A short story about the barber goes here.",
      } },
    { slug: "rinat", name: "Rinat", role: "barber", photo: "", freshaLink: "", instagram: "", instagramHandle: "",
      employeeId: 5117921,
      prices: {
        buzz: { p: 20, from: true },
        skinfade: { p: 20, from: false },
        taper: { p: 20, from: false },
        mod: { p: 15, from: false },
        beard: { p: 10, from: false },
        "buzz-beard": { p: 20, from: false },
        "cut-beard": { p: 25, from: false },
      },
      skills: ["Taper fade", "Mod cut"],
      bio: {
        lv: "Bārddzinis. Šeit būs īss stāsts par meistaru.",
        ru: "Барбер. Здесь будет короткий рассказ о мастере.",
        en: "Barber. A short story about the barber goes here.",
      } },
    { slug: "tomass", name: "Tomass", role: "barber", photo: "", freshaLink: "", instagram: "", instagramHandle: "",
      employeeId: 5613837,
      prices: {
        buzz: { p: 20, from: true },
        skinfade: { p: 25, from: true },
        taper: { p: 25, from: true },
        mod: { p: 25, from: true },
        mullet: { p: 25, from: false },
        long: { p: 25, from: true },
      },
      skills: ["Skinfade", { lv: "Bārda", ru: "Борода", en: "Beard" }],
      bio: {
        lv: "Bārddzinis. Šeit būs īss stāsts par meistaru.",
        ru: "Барбер. Здесь будет короткий рассказ о мастере.",
        en: "Barber. A short story about the barber goes here.",
      } },
    { slug: "valts", name: "Valts", role: "barber", photo: "", freshaLink: "", instagram: "", instagramHandle: "",
      employeeId: 5447605,
      prices: {
        buzz: { p: 15, from: true },
        skinfade: { p: 20, from: true },
        taper: { p: 20, from: true },
        mod: { p: 20, from: true },
        mullet: { p: 20, from: true },
        long: { p: 20, from: true },
      },
      skills: ["Fade", { lv: "Gari mati", ru: "Длинные волосы", en: "Long hair" }],
      bio: {
        lv: "Bārddzinis. Šeit būs īss stāsts par meistaru.",
        ru: "Барбер. Здесь будет короткий рассказ о мастере.",
        en: "Barber. A short story about the barber goes here.",
      } },
    { slug: "garik", name: "Garik", role: "barber", photo: "", freshaLink: "", instagram: "", instagramHandle: "",
      employeeId: 5108826,
      prices: {
        buzz: { p: 20, from: true },
        skinfade: { p: 25, from: false },
        taper: { p: 25, from: false },
        mod: { p: 25, from: false },
        mullet: { p: 25, from: false },
        long: { p: 25, from: false },
      },
      skills: [{ lv: "Klasika", ru: "Классика", en: "Classic" }, { lv: "Bārda", ru: "Борода", en: "Beard" }],
      bio: {
        lv: "Bārddzinis. Šeit būs īss stāsts par meistaru.",
        ru: "Барбер. Здесь будет короткий рассказ о мастере.",
        en: "Barber. A short story about the barber goes here.",
      } },
    { slug: "patriks", name: "Patriks", role: "junior", photo: "", freshaLink: "", instagram: "", instagramHandle: "",
      employeeId: 5613844,
      prices: {
        buzz: { p: 15, from: true },
        skinfade: { p: 10, from: true },
        taper: { p: 10, from: true },
      },
      skills: ["Buzz cut", "Taper fade"],
      bio: {
        lv: "Jaunākais bārddzinis. Šeit būs īss stāsts par meistaru.",
        ru: "Младший барбер. Здесь будет короткий рассказ о мастере.",
        en: "Junior barber. A short story about the barber goes here.",
      } },
    // На Fresha два мастера Patriks: Junior Barber (выше) и Barber (этот) — разные люди
    { slug: "patriks-2", name: "Patriks", role: "barber", photo: "", freshaLink: "", instagram: "", instagramHandle: "",
      employeeId: 5107982,
      prices: {
        buzz: { p: 15, from: true },
        skinfade: { p: 20, from: false },
        taper: { p: 20, from: false },
        mod: { p: 20, from: false },
        mullet: { p: 20, from: false },
        long: { p: 20, from: false },
      },
      skills: ["Fade", "Mod cut"],
      bio: {
        lv: "Bārddzinis. Šeit būs īss stāsts par meistaru.",
        ru: "Барбер. Здесь будет короткий рассказ о мастере.",
        en: "Barber. A short story about the barber goes here.",
      } },
  ],

  /* ---------- Ссылки Fresha «услуга + мастер» ----------
     Ключ "<id услуги>:<slug мастера>". Открывают Fresha, где услуга и мастер уже выбраны.
     Ссылка = booking?offerItemId=s:<номер услуги>&employeeId=<номер мастера>.
     Номер услуги общий для всех мастеров (проверено 29.10.2026 на Roberts, Rinat,
     Patriks (Barber), Tomass; Daniels — 28.10.2026). Пары только там, где мастер
     делает эту услугу. Номер Mullet — s:23080302
     Номер услуги (offerItemId) меняется, если её пересоздать на Fresha —
     тогда возьмите новую ссылку в кабинете Fresha (Link builder) */
  links: {
    pairs: {
      "buzz:daniels":        "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23225229&employeeId=5107882",
      "skinfade:daniels":    "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23080305&employeeId=5107882",
      "taper:daniels":       "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23080304&employeeId=5107882",
      "mod:daniels":         "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23080303&employeeId=5107882",
      "mullet:daniels":      "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23080302&employeeId=5107882",
      "long:daniels":        "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23149281&employeeId=5107882",
      "beard:daniels":       "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23149284&employeeId=5107882",
      "buzz-beard:daniels":  "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23149395&employeeId=5107882",
      "cut-beard:daniels":   "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23149287&employeeId=5107882",

      "buzz:roberts":        "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23225229&employeeId=5447600",
      "skinfade:roberts":    "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23080305&employeeId=5447600",
      "taper:roberts":       "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23080304&employeeId=5447600",
      "mod:roberts":         "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23080303&employeeId=5447600",
      "mullet:roberts":      "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23080302&employeeId=5447600",

      "buzz:rinat":          "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23225229&employeeId=5117921",
      "skinfade:rinat":      "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23080305&employeeId=5117921",
      "taper:rinat":         "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23080304&employeeId=5117921",
      "mod:rinat":           "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23080303&employeeId=5117921",
      "beard:rinat":         "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23149284&employeeId=5117921",
      "buzz-beard:rinat":    "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23149395&employeeId=5117921",
      "cut-beard:rinat":     "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23149287&employeeId=5117921",

      "buzz:tomass":         "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23225229&employeeId=5613837",
      "skinfade:tomass":     "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23080305&employeeId=5613837",
      "taper:tomass":        "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23080304&employeeId=5613837",
      "mod:tomass":          "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23080303&employeeId=5613837",
      "mullet:tomass":       "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23080302&employeeId=5613837",
      "long:tomass":         "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23149281&employeeId=5613837",

      "buzz:valts":          "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23225229&employeeId=5447605",
      "skinfade:valts":      "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23080305&employeeId=5447605",
      "taper:valts":         "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23080304&employeeId=5447605",
      "mod:valts":           "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23080303&employeeId=5447605",
      "mullet:valts":        "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23080302&employeeId=5447605",
      "long:valts":          "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23149281&employeeId=5447605",

      "buzz:garik":          "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23225229&employeeId=5108826",
      "skinfade:garik":      "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23080305&employeeId=5108826",
      "taper:garik":         "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23080304&employeeId=5108826",
      "mod:garik":           "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23080303&employeeId=5108826",
      "mullet:garik":        "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23080302&employeeId=5108826",
      "long:garik":          "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23149281&employeeId=5108826",

      "buzz:patriks":        "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23225229&employeeId=5613844",
      "skinfade:patriks":    "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23080305&employeeId=5613844",
      "taper:patriks":       "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23080304&employeeId=5613844",

      "buzz:patriks-2":      "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23225229&employeeId=5107982",
      "skinfade:patriks-2":  "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23080305&employeeId=5107982",
      "taper:patriks-2":     "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23080304&employeeId=5107982",
      "mod:patriks-2":       "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23080303&employeeId=5107982",
      "mullet:patriks-2":    "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23080302&employeeId=5107982",
      "long:patriks-2":      "https://www.fresha.com/ru/a/dont-tell-mom-barbershop-riga-latgalskoe-predmeste-riga-avotu-iela-34-n8xudq6q/booking?offerItemId=s%3A23149281&employeeId=5107982",
    },
  },

  /* ---------- Отзывы ----------
     Сейчас ПРИМЕРЫ (isExample: true) — над блоком автоматически видна пометка.
     Настоящие отзывы вставляйте только с согласия клиентов, isExample: false.
     rating — тоже пример, пока нет настоящих.
     reviewsCount — сколько отзывов (null — не показывать) */
  rating: 4.9,
  reviewsCount: null,
  reviews: [
    { author: "Jānis K.", source: "Google", isExample: true,
      text: { lv: "Beidzot bārddzinis, kurš vispirms pajautā un tikai tad griež. Labākais fade, kāds man Rīgā bijis.",
              ru: "Наконец-то барбер, который сначала спрашивает, а потом стрижёт. Лучший фейд, что у меня был в Риге.",
              en: "Finally a barber who asks before he cuts. Best fade I've had in Riga." } },
    { author: "Andrejs S.", source: "Google", isExample: true,
      text: { lv: "Pierakstījos tiešsaistē divās minūtēs, gaidīt nemaz nevajadzēja. Mierīga atmosfēra un laba kafija.",
              ru: "Записался онлайн за две минуты, ждать не пришлось совсем. Спокойная атмосфера и хороший кофе.",
              en: "Booked online in two minutes and didn't wait at all. Calm place, good coffee." } },
    { author: "Tom W.", source: "Google", isExample: true,
      text: { lv: "Biju Rīgā darba darīšanās un vajadzēja ātri apgriezties. Rezultātā labākā bārdas forma manā mūžā.",
              ru: "Был в Риге по работе, нужно было быстро подстричься. В итоге получил лучшую форму бороды в жизни.",
              en: "In Riga for work and needed a quick cut. Walked out with the best beard shape I've ever had." } },
    { author: "Mārtiņš L.", source: "Google", isExample: true,
      text: { lv: "Vedu šurp arī dēlu. Ar bērniem ir pacietīgi, un rezultāts vienmēr ir kārtīgs.",
              ru: "Вожу сюда и сына. С детьми терпеливы, а результат всегда аккуратный.",
              en: "I bring my son here too. They're patient with kids and the result is always neat." } },
  ],
};

// Для генератора страниц (Node). В браузере module нет — строка пропускается
if (typeof module !== "undefined") module.exports = SITE;
