/* ============================================================
   ГОТОВНОСТЬ (экран #/level) — где ты сейчас и что мешает.

   Считает курс, а не движок: как превращать проценты по тестам
   в уровень — знание английского курса, платформа про это ничего
   не знает (см. engine/screens/level.js).

   Два правила, из-за которых этот файл выглядит именно так:

   1. Непройденный тест — не ноль, а «неизвестно». Считать нулями
      то, чего человек не открывал, — быстрый способ показать
      «A1» тому, кто просто начал не с той карточки.

   2. Цифра называется ориентиром и говорит, чего она не меряет.
      Тесты здесь — грамматика и лексика по одному предложению.
      Это половина Reading и половина Writing, и ничего из
      Listening и Speaking. Обещать по ним балл IELTS нельзя.
   ============================================================ */

/* Разделы: во что складываются тесты и с каким весом.
   Вес — не «важность темы вообще», а вклад в ближайшую цель
   (уверенный B1 → подступ к IELTS). Поэтому «Ремонт» весит
   столько же, сколько лексика: пока фундамент течёт,
   академические слова не на чем держать. */
const SECTIONS = [
  { key:'fix',   label:'Ремонт базы',      weight:3,
    tests:['fix-past','fix-prep','fix-perf','fix-ing','fix-quant','mine3'],
    hint:'Это зоны из журнала ошибок. Пока они ниже 85%, всё остальное будет сыпаться под нагрузкой.' },
  { key:'gram',  label:'Грамматика B1+',   weight:3,
    tests:['cond','ger','passive','reported','modal','struct2','rel','w-gram'],
    hint:'Конструкции, которые дают Grammatical Range в письме: условные, пассив, косвенная речь, придаточные.' },
  { key:'lex',   label:'Лексика',          weight:3,
    tests:['coll','phrasal','wform','confuse','awl','w-lex'],
    hint:'Объём и точность слов — то, что быстрее всего двигает балл и упирает потолок в чтении.' },
  { key:'exam',  label:'Язык экзамена',    weight:2,
    tests:['w-task1','w-task2','w-reg'],
    hint:'Формулы Task 1, язык аргумента Task 2, регистр и связки. Учится быстро, стоит дорого.' },
];

/* Ступени: процент по тестам курса → уровень и ориентир по IELTS.
   Диапазоны широкие намеренно — сузить их значило бы соврать
   о точности. */
const RUNGS = [
  { to: 45,  cefr:'A2',        ielts:'≈ 4.0–4.5', band:[4.0, 4.5], tone:'is-bad',
    what:'Базовые времена и порядок слов ещё требуют раздумья.' },
  { to: 60,  cefr:'A2+ → B1',  ielts:'≈ 4.5–5.0', band:[4.5, 5.0], tone:'is-bad',
    what:'База держится, но сложные конструкции пока наугад.' },
  { to: 72,  cefr:'B1',        ielts:'≈ 5.0–5.5', band:[5.0, 5.5], tone:'is-ok',
    what:'Понимаешь и строишь обычную речь; в академическом тексте начинает не хватать слов.' },
  { to: 83,  cefr:'B1+ → B2',  ielts:'≈ 5.5–6.0', band:[5.5, 6.0], tone:'is-ok',
    what:'Конструкции знакомы, ошибки — на скорости и в деталях.' },
  { to: 91,  cefr:'B2',        ielts:'≈ 6.0–6.5', band:[6.0, 6.5], tone:'is-good',
    what:'Приёмы работают. Дальше решает не грамматика, а практика письма и речи.' },
  { to: 101, cefr:'B2+',       ielts:'≈ 6.5–7.0', band:[6.5, 7.0], tone:'is-good',
    what:'На упражнениях потолок этого курса. Дальше — только пробники целиком и живое эссе.' },
];

const rungFor = pct => RUNGS.find(r => pct < r.to) || RUNGS.at(-1);

const toneFor = pct => pct >= 85 ? 'is-good' : pct >= 65 ? 'is-ok' : 'is-bad';

export function estimate(stats) {
  const byId = new Map(stats.tests.map(t => [t.id, t]));
  const diag = byId.get('diag')?.best || null;

  const sections = SECTIONS.map(s => {
    const taken = s.tests.map(id => byId.get(id)).filter(t => t?.best);
    const correct = taken.reduce((n, t) => n + t.best.correct, 0);
    const total = taken.reduce((n, t) => n + t.best.total, 0);
    return {
      ...s,
      taken: taken.length,
      pct: total ? Math.round((correct / total) * 100) : null,
      correct, total,
      missing: s.tests.filter(id => !byId.get(id)?.best),
    };
  });

  const scored = sections.filter(s => s.pct != null);
  const answered = scored.reduce((n, s) => n + s.total, 0) + (diag ? diag.total : 0);

  /* --- пусто: зовём именно на замер, а не «на любой тест» --- */
  if (!diag && answered < 20) {
    return {
      eyebrow: 'где ты сейчас',
      title: 'Начни с замера.',
      lede: 'Оценка собирается из тестов курса. Быстрее всего её получить с «Замера» — ' +
            '24 вопроса фиксированного состава, по два-три на каждую зону. ' +
            'Его состав не меняется, поэтому второй проход через месяц честно сравнится с первым.',
      empty: {
        title: 'Пока не по чему судить.',
        note: 'Замер занимает минут десять и сразу показывает, где начинает сыпаться. ' +
              'После него здесь появятся уровень, разбивка по разделам и ориентир по IELTS.',
        href: '#/test/diag',
        cta: 'Пройти замер',
      },
    };
  }

  /* --- общий процент ---
     Замер входит отдельным слагаемым с весом 2: он единственный
     с фиксированным составом, то есть единственный сопоставимый
     во времени. Но и вешать на него всё нельзя — 24 вопроса. */
  const parts = scored.map(s => ({ pct: s.pct, weight: s.weight }));
  if (diag) parts.push({ pct: Math.round((diag.correct / diag.total) * 100), weight: 2 });

  const wSum = parts.reduce((n, p) => n + p.weight, 0);
  const pct = Math.round(parts.reduce((n, p) => n + p.pct * p.weight, 0) / wSum);
  const rung = rungFor(pct);

  /* --- насколько этой цифре можно верить --- */
  const coverage = Math.round((stats.tests.filter(t => t.best).length / stats.tests.length) * 100);
  const thin = parts.length < 3 || coverage < 30;
  const confidence = thin
    ? 'Оценка пока грубая: закрыто слишком мало тестов, чтобы цифра стояла твёрдо.'
    : coverage < 65
      ? 'Оценка средней точности — половина тестов ещё не пройдена.'
      : 'Охват хороший, оценка устойчивая.';

  const weakest = [...scored].sort((a, b) => a.pct - b.pct)[0];
  const untouched = sections.filter(s => s.pct == null);

  const headline = pct >= 91 ? 'Упражнения ты перерос — пора на пробники и живое письмо.'
    : pct >= 83 ? 'Подступ к B2. Осталась точность, а не знание правил.'
    : pct >= 72 ? 'Уверенный B1. Здесь начинается разгон к экзамену.'
    : pct >= 60 ? 'База держится, конструкции B1 ещё не автоматизированы.'
    : 'Фундамент ещё собирается — и это ровно та работа, которая окупается быстрее всего.';

  /* --- что делать дальше: сначала пробоины, потом непокрытое --- */
  const next = [];
  if (!diag) next.push({
    href: '#/test/diag',
    title: 'Пройти замер (24 вопроса)',
    why: 'Единственный тест с фиксированным составом — только он даёт сравнимую во времени точку отсчёта.',
  });
  if (weakest && weakest.pct < 85) next.push({
    href: `#/test/${weakest.missing[0] || weakest.tests[0]}`,
    title: `Подтянуть «${weakest.label}» — сейчас ${weakest.pct}%`,
    why: weakest.hint,
  });
  untouched.slice(0, 2).forEach(s => next.push({
    href: `#/test/${s.tests[0]}`,
    title: `Открыть раздел «${s.label}»`,
    why: 'Он ещё ни разу не измерен — без него оценка неполная.',
  }));
  if (pct >= 83) next.push({
    href: '#/test/final',
    title: 'Финал · экзамен (35 вопросов)',
    why: 'Всё сложное сразу, без разминочных вопросов. Самая честная цифра из тех, что тут есть.',
  });

  return {
    eyebrow: 'где ты сейчас · оценка по упражнениям курса',
    title: 'Готовность.',
    lede: 'Ориентир собран из твоих лучших результатов по тестам. Это оценка грамматики ' +
          'и лексики — то есть примерно половина Reading и половина Writing. ' +
          'Listening, Speaking и живое эссе она не меряет вовсе.',

    band: rung.cefr,
    bandSub: `${pct}% по тестам`,
    tone: rung.tone,
    headline,
    sub: `${rung.what} Ориентир по IELTS: <b>${rung.ielts}</b>.`,
    note: `${confidence} Пройдено тестов: <b>${stats.tests.filter(t => t.best).length} из ${stats.tests.length}</b>, ` +
          `тем открыто: <b>${stats.lessons.done} из ${stats.lessons.total}</b>.` +
          (diag ? ` Замер: <b>${diag.correct}/${diag.total}</b>.` : ''),

    /* Метку ставим в середину диапазона ступени и подписываем самим
       диапазоном, а не одним числом: точки на этой шкале у нас нет,
       и рисовать её значило бы обещать точность, которой нет. */
    scale: {
      from: 3.5, to: 8.0,
      value: (rung.band[0] + rung.band[1]) / 2,
      valueLabel: rung.ielts,
      ticks: [{ v:4, label:'4.0' }, { v:5, label:'5.0' }, { v:5.5, label:'5.5' },
              { v:6.5, label:'6.5' }, { v:7.5, label:'7.5' }],
      target: { from: 6.5, to: 7.0, label: 'цель по плану: overall 6.5, не ниже 6.0 по секциям' },
    },

    bars: sections.map(s => ({
      label: s.label,
      value: s.pct == null ? 'не измерен' : `${s.pct}%`,
      pct: s.pct ?? 0,
      tone: s.pct == null ? '' : toneFor(s.pct),
      meta: s.pct == null
        ? `${s.tests.length} тестов, ни один не пройден`
        : `${s.taken} из ${s.tests.length} тестов · ${s.correct}/${s.total} верно${
            s.missing.length ? ` · осталось: ${s.missing.length}` : ''}`,
    })),

    table: {
      title: 'шкала, по которой считается цифра',
      cols: ['% по тестам', 'CEFR', 'IELTS (ориентир)', 'что это значит'],
      rows: RUNGS.map((r, i) => ({
        here: r === rung,
        cells: [
          i === 0 ? `< ${r.to}` : `${RUNGS[i - 1].to}–${r.to - 1}`,
          r.cefr, r.ielts, r.what,
        ],
      })),
      note: 'Соответствие CEFR ↔ IELTS взято по официальной таблице IELTS ' +
            '(B1 ≈ 4.0–5.0, B2 ≈ 5.5–6.5, C1 ≈ 7.0–8.0) и сдвинуто вниз на полступени: ' +
            'упражнение на одно предложение проще, чем то же правило на длинном тексте под таймером.',
    },

    next,

    caveat: '<b>Чего эта цифра не знает.</b> Она не слышала, как ты говоришь, ' +
            'и не читала твоё эссе. Не меряет скорость на длинном тексте, восприятие на слух ' +
            'и умение держать мысль на 250 слов — а это половина экзамена. ' +
            'Эссе может оценить только человек. Считай это показанием прибора, ' +
            'который меряет одно: держат ли форму кирпичи.',
  };
}
