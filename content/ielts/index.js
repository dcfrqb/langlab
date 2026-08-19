/* ============================================================
   COURSE — IELTS Academic, цель 6.5–7.0.
   Манифест курса: движок не знает про band score и overview,
   он знает только про этот объект.
   ============================================================ */
import { GROUPS, LESSONS } from './lessons.js';
import { QUESTIONS, TESTS } from './tests.js';

/* Категории = цветовой словарь курса. Красим по навыку, а не по части:
   человек навигируется вопросом «это про чтение или про письмо», а не
   «это третья часть или четвёртая». */
const CATEGORIES = [
  { key: 'format',  label: 'ФОРМАТ',  short: 'Формат',  color: 'var(--c-now)',    ink: 'var(--c-now-ink)'    },
  { key: 'reading', label: 'ЧТЕНИЕ',  short: 'Чтение',  color: 'var(--c-teal)',   ink: 'var(--c-teal-ink)'   },
  { key: 'writing', label: 'ПИСЬМО',  short: 'Письмо',  color: 'var(--c-purple)', ink: 'var(--c-purple-ink)' },
  { key: 'lexis',   label: 'ЛЕКСИКА', short: 'Лексика', color: 'var(--c-orange)', ink: 'var(--c-orange-ink)' },
  { key: 'grammar', label: 'ПРАВИЛА', short: 'Правила', color: 'var(--c-green)',  ink: 'var(--c-green-ink)'  },
];

/* ------------------------------------------------------------
   ОЦЕНКА ГОТОВНОСТИ

   Что здесь считается и чего здесь НЕ считается — важно развести,
   иначе экран начнёт врать. Наши тесты меряют владение приёмами:
   отличаешь ли False от Not Given, видишь ли подмену типа задания,
   ставишь ли артикли. Они НЕ меряют скорость чтения на сорока
   вопросах за час и совсем не меряют живое письмо — эссе может
   оценить только человек.

   Поэтому цифра называется «ориентир по приёмам», а не «твой band»,
   и рядом с ней всегда стоит оговорка. Обещать балл по викторине —
   способ подвести человека ровно один раз, зато крупно.

   Шкала откалибрована под цель 6.5–7.0: планка «88% и выше — это
   ориентир 7.0» стоит высоко намеренно, потому что на реальном
   экзамене к ошибкам знания добавляются ошибки от усталости
   и нехватки времени, а их здесь нет.
   ------------------------------------------------------------ */

/* Разделы готовности: какие тесты в какой складываются.
   Веса — доля навыка в реальном экзамене для нашей цели:
   письмо тяжелее всего поднимается и чаще всего тянет средний балл вниз. */
const SECTIONS = [
  { key: 'format',  label: 'Формат и баллы', weight: 1,
    tests: ['part1'],
    hint: 'Знание правил игры. Дешевле всего добирается и дальше не проседает.' },
  { key: 'reading', label: 'Чтение',         weight: 3,
    tests: ['part2', 'tfng-drill'],
    hint: 'Приёмы поиска и TFNG. Здесь прибавка приходит быстрее всего.' },
  { key: 'writing', label: 'Письмо',         weight: 3,
    tests: ['part3', 'task1', 'task2'],
    hint: 'Структура Task 1 и Task 2. Поднимается медленнее всего — начинать надо раньше всего.' },
  { key: 'lexis',   label: 'Лексика и чистота', weight: 2,
    tests: ['part4', 'accuracy', 'phrases'],
    hint: 'Шаблоны, регистр, типичные ошибки. Работает и на письмо, и на устную часть.' },
];

/* Ориентир по точности на наших упражнениях → band. Не таблица
   перевода сырых баллов IELTS: та работает только на настоящем тесте. */
const LADDER = [
  { from: 95, band: '7.5+', num: 7.5, cefr: 'C1',    det: '140+',    tone: 'is-good' },
  { from: 88, band: '7.0',  num: 7.0, cefr: 'C1',    det: '130–135', tone: 'is-good' },
  { from: 78, band: '6.5',  num: 6.5, cefr: 'B2',    det: '120–125', tone: 'is-good' },
  { from: 68, band: '6.0',  num: 6.0, cefr: 'B2',    det: '105–115', tone: 'is-ok'   },
  { from: 55, band: '5.5',  num: 5.5, cefr: 'B2',    det: '95–100',  tone: 'is-ok'   },
  { from: 40, band: '5.0',  num: 5.0, cefr: 'B1',    det: '80–90',   tone: 'is-bad'  },
  { from: 0,  band: '4.5',  num: 4.5, cefr: 'B1',    det: '65–75',   tone: 'is-bad'  },
];

const rungFor = pct => LADDER.find(r => pct >= r.from) || LADDER.at(-1);
const toneFor = pct => (pct >= 78 ? 'is-good' : pct >= 55 ? 'is-ok' : 'is-bad');

function estimate(stats) {
  const byId = new Map(stats.tests.map(t => [t.id, t]));

  /* точность по разделу — только по тем тестам, которые реально проходили:
     ноль за непройденный тест сделал бы картину ложно-мрачной */
  const sections = SECTIONS.map(s => {
    const taken = s.tests.map(id => byId.get(id)).filter(t => t?.best);
    const correct = taken.reduce((n, t) => n + t.best.correct, 0);
    const total = taken.reduce((n, t) => n + t.best.total, 0);
    return {
      ...s,
      taken: taken.length,
      of: s.tests.length,
      pct: total ? Math.round((correct / total) * 100) : null,
      correct, total,
      missing: s.tests.filter(id => !byId.get(id)?.best),
    };
  });

  const scored = sections.filter(s => s.pct != null);
  const answered = scored.reduce((n, s) => n + s.total, 0);
  const takenTests = scored.reduce((n, s) => n + s.taken, 0);

  if (takenTests < 2 || answered < 20) {
    return {
      eyebrow: 'готовность к экзамену',
      title: 'Пока не по чему судить.',
      lede: 'Оценка собирается из тестов курса. Пройди любые два — и здесь появится ' +
            'ориентир по баллу, разбивка по разделам и сравнение со шкалой Duolingo.',
      empty: {
        title: 'Нужно хотя бы два теста.',
        note: `Пройдено тестов: ${takenTests} из ${stats.tests.length}, отвечено вопросов: ${answered}. ` +
              'Начни с «Рубеж · Формат и баллы» — он короткий и сразу показывает, ' +
              'где дыры в понимании самого экзамена.',
        href: '#/test/part1',
        cta: 'Начать с формата',
      },
    };
  }

  /* Общий ориентир — среднее по разделам с весами, а не по всем вопросам
     подряд: иначе десять вопросов про формат перевесили бы письмо, а на
     экзамене всё наоборот. */
  const wSum = scored.reduce((n, s) => n + s.weight, 0);
  const pct = Math.round(scored.reduce((n, s) => n + s.pct * s.weight, 0) / wSum);
  const rung = rungFor(pct);

  /* насколько этой цифре вообще можно верить */
  const coverage = Math.round((takenTests / stats.tests.length) * 100);
  const lessonPct = Math.round((stats.lessons.done / stats.lessons.total) * 100);
  const thin = scored.length < 3 || coverage < 40;
  const confidence = thin
    ? 'Оценка пока грубая: закрыто мало тестов.'
    : coverage < 70
      ? 'Оценка средней точности — половина тестов ещё впереди.'
      : 'Данных достаточно, оценка устойчивая.';

  const weakest = [...scored].sort((a, b) => a.pct - b.pct)[0];
  const untouched = sections.filter(s => s.pct == null);

  const headline = pct >= 88 ? 'Приёмы держатся — пора на пробник целиком.'
    : pct >= 78 ? 'Ты в зоне цели по приёмам. Осталось перенести это в реальный формат.'
    : pct >= 68 ? 'База есть, до цели не хватает точности.'
    : pct >= 55 ? 'Приёмы знакомы, но срабатывают через раз.'
    : 'Фундамент ещё собирается — это нормально на старте.';

  /* что делать дальше: сначала непройденные разделы, потом самый слабый */
  const next = [];
  untouched.slice(0, 2).forEach(s => next.push({
    href: `#/test/${s.tests[0]}`,
    title: `Закрыть раздел «${s.label}»`,
    why: 'Он ещё не измерен — без него оценка неполная.',
  }));
  if (weakest && weakest.pct < 85) {
    next.push({
      href: `#/test/${weakest.missing[0] || weakest.tests[0]}`,
      title: `Подтянуть «${weakest.label}» — сейчас ${weakest.pct}%`,
      why: weakest.hint,
    });
  }
  if (lessonPct < 100) {
    next.push({
      href: '#/',
      title: `Пройти оставшиеся темы — ${stats.lessons.done} из ${stats.lessons.total}`,
      why: 'Тесты спрашивают только по темам курса: непройденная тема — это гарантированные промахи.',
    });
  }
  next.push({
    href: '#/lesson/vs-duolingo',
    title: 'Прикинуть, не сдать ли сначала Duolingo',
    why: 'Дешёвый замер за 48 часов — но сначала проверь, принимает ли его твой вуз.',
  });

  return {
    eyebrow: 'готовность к экзамену · цель 6.5–7.0',
    title: 'Где я сейчас.',
    lede: 'Это оценка по упражнениям курса, а не результат экзамена. Она показывает, ' +
          'насколько уверенно у тебя работают <b>приёмы</b> — и ничего не говорит про скорость ' +
          'на реальном тексте и про живое эссе.',

    band: rung.band,
    bandSub: `ориентир · ${pct}%`,
    tone: rung.tone,
    headline,
    sub: `${confidence} Пройдено тестов: ${takenTests} из ${stats.tests.length} · ` +
         `тем: ${stats.lessons.done} из ${stats.lessons.total}.`,
    note: `По нашей шкале это примерно CEFR ${rung.cefr} и ${rung.det} по Duolingo. ` +
          (rung.num >= 6.5
            ? 'Целевая зона достигнута по приёмам — дальше решает перенос в формат и время.'
            : `До цели 6.5 не хватает примерно ${Math.max(1, 78 - pct)} процентных пунктов точности.`),

    scale: {
      from: 4.5, to: 8,
      value: rung.num, valueLabel: rung.band,
      target: { from: 6.5, to: 7, label: 'зелёная зона — цель 6.5–7.0' },
      ticks: [
        { v: 4.5, label: '4.5' }, { v: 5.5, label: '5.5' }, { v: 6.5, label: '6.5' },
        { v: 7, label: '7.0' }, { v: 8, label: '8.0' },
      ],
    },

    bars: sections.map(s => s.pct == null ? {
      label: s.label, pct: 0, value: '—', tone: '',
      meta: `не измерено · ${s.of} ${s.of === 1 ? 'тест' : 'теста'} впереди`,
    } : {
      label: s.label,
      pct: s.pct,
      value: `${s.pct}% · ${rungFor(s.pct).band}`,
      tone: toneFor(s.pct),
      meta: `${s.correct} из ${s.total} верно · пройдено ${s.taken} из ${s.of} · ${s.hint}`,
    }),

    table: {
      title: 'как это соотносится со шкалами',
      cols: ['Точность у нас', 'IELTS (ориентир)', 'CEFR', 'Duolingo'],
      rows: LADDER.map(r => ({
        here: r.band === rung.band,
        cells: [
          r.from ? `${r.from}% и выше` : 'ниже 40%',
          r.band, r.cefr, r.det,
        ],
      })),
      note: 'Колонка Duolingo — официальная таблица соответствия Duolingo English Test и IELTS. ' +
            'Первая колонка — наша шкала, откалиброванная под цель 6.5–7.0; официального ' +
            'статуса у неё нет и быть не может.',
    },

    next,

    caveat: '<b>Что эта цифра НЕ говорит.</b> Наши тесты проверяют приёмы, а не выносливость: ' +
            'на экзамене к ним добавятся сорок вопросов за час и два эссе подряд, и балл почти ' +
            'всегда выходит ниже, чем на спокойных упражнениях. Writing автоматически не ' +
            'оценивается вообще — эссе может оценить только человек. ' +
            'Настоящую цифру даёт один официальный пробник в режиме экзамена ' +
            '(или Duolingo как дешёвый замер). Этот экран нужен для другого: ' +
            'видеть, <b>какой раздел тянет вниз</b> и что делать на этой неделе.',
  };
}

export const course = {
  id: 'ielts',
  title: 'IELTS',
  brand: { name: 'IELTS', suffix: '.academic' },
  tagline: 'IELTS —<br>по приёмам, а не по учебнику целиком.',
  eyebrow: 'Academic · чтение и письмо · цель 6.5–7.0',
  homeLede: 'Каждая тема — один приём: разобрать вопрос, отличить False от Not Given, ' +
            'собрать абзац, описать линию графика. Упражнения короткие и намеренно не в формате ' +
            'экзамена: сорок вопросов за час тренируют выносливость, а приём ставится на одном ' +
            'предложении. Пройдено: ',
  testsLede: 'Вопросы по пройденным темам: выбрать вариант, вписать слово, найти ошибку, ' +
             'собрать предложение. <b>Рубеж</b> — по целой части курса, <b>фокус</b> — по одному навыку.',
  categories: CATEGORIES,
  groups: GROUPS,
  lessons: LESSONS,
  questions: QUESTIONS,
  tests: TESTS,

  /* Опрос на уровень тут не нужен: цель и модуль уже известны,
     а программа — это весь курс по порядку. */
  survey: false,

  /* Тот же экран словаря, но здесь это не термины, а фразы,
     которые вставляешь в собственный текст. */
  termsCopy: {
    nav: 'Фразы',
    eyebrow: 'лексика · шаблоны · обороты',
    title: 'Фразы и шаблоны.',
    lede: 'Всё, что стоит держать наготове, — {n} позиций из тем курса: каркасы предложений, ' +
          'лексика частых тем, язык графиков, смягчения. Ищи по-английски или по-русски.',
    placeholder: 'outweigh · congestion · tend to · overview',
    empty: 'Фразы появляются вместе с темами',
  },

  levelNav: 'Готовность',
  estimate,
};
