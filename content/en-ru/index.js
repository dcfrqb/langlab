/* ============================================================
   COURSE — Английский для русскоговорящих (en-ru).
   Манифест курса: движок не знает про времена и аспекты,
   он знает только про этот объект.
   ============================================================ */
import { GROUPS, LESSONS } from './lessons.js';
import { QUESTIONS, TESTS } from './tests.js';
import { estimate } from './level.js';

/* Категории курса = «цветовой словарь». Ключ живёт в контенте (поле aspect),
   движок берёт отсюда только цвет и подпись. Для другого языка — свой набор. */
const CATEGORIES = [
  { key: 'simple',     label: 'SIMPLE',           short: 'Simple',             color: 'var(--c-blue)',   ink: 'var(--c-blue-ink)'   },
  { key: 'continuous', label: 'CONTINUOUS',       short: 'Continuous',         color: 'var(--c-green)',  ink: 'var(--c-green-ink)'  },
  { key: 'perfect',    label: 'PERFECT',          short: 'Perfect',            color: 'var(--c-orange)', ink: 'var(--c-orange-ink)' },
  { key: 'perfcont',   label: 'PERF. CONTINUOUS', short: 'Perfect Continuous', color: 'var(--c-purple)', ink: 'var(--c-purple-ink)' },
];

/* Интерактивная карта времён на главной — фишка именно английского курса.
   Курс без такой карты просто не задаёт explorer, и секция не рисуется. */
const EXPLORER = {
  title: 'Прошлое · сейчас · будущее',
  eyebrow: 'карта времён — переключай и смотри',
  lede: 'Жми <b>present / past / future</b> — меняется время. Жми на <b>строку аспекта</b> — ' +
        'таймлайн рисует его «почерк»: волну, стрелку, горку.',
  /* где на оси времени живёт каждая группа (0..100) */
  regions: { present: 52, past: 27, future: 77 },
  whenLabel: { present: 'сейчас', past: 'тогда', future: 'потом' },
  nodes: [
    { key: 'present', label: 'present', highlight: true, rows: [
      { k:'simple',     tag:'simple',             form:'I <span class="k-simple">do</span>',                 hint:'привычка, регулярно',  lesson:'present-simple' },
      { k:'continuous', tag:'continuous',         form:'I\'m <span class="k-continuous">doing</span>',       hint:'прямо сейчас',         lesson:'present-continuous' },
      { k:'perfect',    tag:'perfect',            form:'I have <span class="k-perfect">done</span>',         hint:'результат сейчас',     lesson:'present-perfect' },
      { k:'perfcont',   tag:'perfect continuous', form:'I have <span class="k-perfcont">been doing</span>',  hint:'делаю уже сколько-то', lesson:'perfect-continuous' },
    ]},
    { key: 'past', label: 'past', tint: 'var(--c-orange)', rows: [
      { k:'simple',     tag:'simple',             form:'I <span class="k-simple">did</span>',                hint:'факт в прошлом',       lesson:'past-simple' },
      { k:'continuous', tag:'continuous',         form:'I was <span class="k-continuous">doing</span>',      hint:'делал в тот момент',   lesson:'past-continuous' },
      { k:'perfect',    tag:'perfect',            form:'I had <span class="k-perfect">done</span>',          hint:'до другого момента',   lesson:'past-perfect' },
      { k:'perfcont',   tag:'perfect continuous', form:'I had <span class="k-perfcont">been doing</span>',   hint:'тянулось до момента',  lesson:'perfect-continuous' },
    ]},
    { key: 'future', label: 'future', tint: 'var(--c-purple)', rows: [
      { k:'simple',     tag:'simple',             form:'I will <span class="k-simple">do</span>',                  hint:'решение, факт',      lesson:'future-will-going' },
      { k:'continuous', tag:'continuous',         form:'I will be <span class="k-continuous">doing</span>',        hint:'буду делать тогда',  lesson:'future-perfect-cont' },
      { k:'perfect',    tag:'perfect',            form:'I will have <span class="k-perfect">done</span>',          hint:'сделаю к моменту',   lesson:'future-perfect-cont' },
      { k:'perfcont',   tag:'perfect continuous', form:'I will have <span class="k-perfcont">been doing</span>',   hint:'буду делать уже сколько-то', lesson:'perfect-continuous' },
    ]},
  ],
  /* «почерк» аспекта на таймлайне: форма + где её центр */
  signature(tenseKey, aspectKey) {
    const r = this.regions[tenseKey];
    const when = this.whenLabel[tenseKey];
    if (aspectKey === 'simple')     return { shape:'diamonds', center:r, caption:{ pos:r, text:when } };
    if (aspectKey === 'continuous') return { shape:'wave',     center:r, caption:{ pos:r, text:when } };
    if (aspectKey === 'perfect')    return { shape:'arrow',    from:r - 20, to: tenseKey === 'present' ? 52 : r };
    return { shape:'bump', center:r - 4, bracket:'сколько-то времени' };
  },
};

/* Человеческие имена меток. Метки (`tag` у вопроса) писались как ключи
   фильтров — «prep3», «narr2»; в журнале ошибок такое читать нельзя.
   Имена совпадают с названиями тестов ремонта не случайно: это одни
   и те же зоны, названные один раз. */
const ZONES = {
  narr2: 'Past · нарратив',        narr: 'Past · нарратив',
  prep3: 'Предлоги',               prep2: 'Предлоги',            prep: 'Предлоги',
  perf3: 'Perfect ↔ Past',         perf2: 'Perfect ↔ Past',      perfect: 'Perfect ↔ Past',
  ing2: 'Лишний -ing',             ing: 'Лишний -ing',
  quant2: 'Артикли и кванторы',    quant: 'Артикли и кванторы',
  wgram: 'Грамматика для письма',  wlex: 'Академическая лексика',
  task1: 'Task 1 · графики',       task2: 'Task 2 · аргумент',    ielts: 'Task 1 · графики',
  reg2: 'Регистр',                 formal: 'Регистр',             link: 'Связность',
  cond: 'Условные',                ger: '-ing или to',            passive: 'Пассив',
  reported: 'Косвенная речь',      modal: 'Модальные',            struct2: 'Вопросы и сравнения',
  rel: 'Придаточные',              coll: 'Коллокации',            phrasal: 'Фразовые глаголы',
  wform: 'Словообразование',       confuse: 'Похожие слова',      awl: 'AWL · ядро для эссе',
  habit: 'Привычки',               tense: 'Времена',
};

export const course = {
  id: 'en-ru',
  title: 'Английский',
  brand: { name: 'English', suffix: '.grammar' },
  tagline: 'Английский —<br>как система, а не список правил.',
  eyebrow: 'грамматика · база · каждый день',
  /* подписи таймлайна — у другого языка могут быть свои */
  timeline: { past: 'PAST', future: 'FUTURE', now: 'NOW · СЕЙЧАС' },
  categories: CATEGORIES,
  groups: GROUPS,
  lessons: LESSONS,
  questions: QUESTIONS,
  tests: TESTS,
  explorer: EXPLORER,
  estimate,
  zones: ZONES,
  /* Замер в ежедневную дозу не идёт: он тем и ценен, что его состав
     не встречался больше нигде, — иначе два прохода станет нельзя
     сравнить (см. ROADMAP, «Второе решение: замер отделён от банка»). */
  dailyFilter: q => !q.diag,
  /* Доза дня. Восьми вопросов на день мало — это пять минут, после
     которых остаётся ощущение, что занятие не начиналось. Двенадцать
     держатся в те же десять–пятнадцать минут и уже похожи на подход.
     freshShare — сколько дозы всегда отдано новому: без этой брони
     пройденный подряд десяток тестов забивает очередь повторами на
     месяц вперёд, и каждый день выглядит как вчерашний. Половина —
     не осторожная середина, а замер по живым данным: при 0.4 из
     двенадцати вопросов семь были уже виденными, и это читалось
     как «опять то же самое». */
  dose: 12,
  freshShare: 0.5,
  levelNav: 'Готовность',
  homeLede: 'Программа собрана под твои слабые места, а не по порядку учебника. ' +
    'Листай карточки, проверяй себя тестами, следи за уровнем на «Готовности». Пройдено тем: ',
  testsLede: 'Разделы идут маршрутом: <b>Замер</b> — понять, где сыпется; <b>Ремонт</b> — ' +
    'зоны из журнала ошибок; <b>Мост к IELTS</b> — язык письма и графиков; дальше общая ' +
    'теория B1+ и миксы. Состав каждого теста собирается заново при заходе — кроме «Замера», ' +
    'у него он фиксированный, чтобы два прохода можно было честно сравнить.',
  /* курс тащит свою палитру классов (k-simple, row-perfect и т.п.) */
  stylesheet: 'content/en-ru/course.css',
};
