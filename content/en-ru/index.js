/* ============================================================
   COURSE — Английский для русскоговорящих (en-ru).
   Манифест курса: движок не знает про времена и аспекты,
   он знает только про этот объект.
   ============================================================ */
import { GROUPS, LESSONS } from './lessons.js';
import { QUESTIONS, TESTS } from './tests.js';

/* Категории курса = «цветовой словарь». Ключ живёт в контенте (поле aspect),
   движок берёт отсюда только цвет и подпись. Для другого языка — свой набор. */
const CATEGORIES = [
  { key: 'simple',     label: 'SIMPLE',           short: 'Simple',              color: 'var(--c-blue)'   },
  { key: 'continuous', label: 'CONTINUOUS',       short: 'Continuous',          color: 'var(--c-green)'  },
  { key: 'perfect',    label: 'PERFECT',          short: 'Perfect',             color: 'var(--c-orange)' },
  { key: 'perfcont',   label: 'PERF. CONTINUOUS', short: 'Perfect Continuous',  color: 'var(--c-purple)' },
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
      { k:'perfcont',   tag:'perfect continuous', form:'I have <span class="k-perfcont">been doing</span>',  hint:'делаю уже сколько-то', lesson:null },
    ]},
    { key: 'past', label: 'past', tint: 'var(--c-orange)', rows: [
      { k:'simple',     tag:'simple',             form:'I <span class="k-simple">did</span>',                hint:'факт в прошлом',       lesson:'past-simple' },
      { k:'continuous', tag:'continuous',         form:'I was <span class="k-continuous">doing</span>',      hint:'делал в тот момент',   lesson:'past-continuous' },
      { k:'perfect',    tag:'perfect',            form:'I had <span class="k-perfect">done</span>',          hint:'до другого момента',   lesson:'past-perfect' },
      { k:'perfcont',   tag:'perfect continuous', form:'I had <span class="k-perfcont">been doing</span>',   hint:'тянулось до момента',  lesson:null },
    ]},
    { key: 'future', label: 'future', tint: 'var(--c-purple)', rows: [
      { k:'simple',     tag:'simple',             form:'I will <span class="k-simple">do</span>',                  hint:'решение, факт',      lesson:'future-will-going' },
      { k:'continuous', tag:'continuous',         form:'I will be <span class="k-continuous">doing</span>',        hint:'буду делать тогда',  lesson:'future-perfect-cont' },
      { k:'perfect',    tag:'perfect',            form:'I will have <span class="k-perfect">done</span>',          hint:'сделаю к моменту',   lesson:'future-perfect-cont' },
      { k:'perfcont',   tag:'perfect continuous', form:'I will have <span class="k-perfcont">been doing</span>',   hint:'буду делать уже сколько-то', lesson:null },
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
  /* курс тащит свою палитру классов (k-simple, row-perfect и т.п.) */
  stylesheet: 'content/en-ru/course.css',
};
