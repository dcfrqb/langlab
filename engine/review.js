/* ============================================================
   REVIEW — интервальные повторения и ритм занятий.

   Зачем: тест «после перерыва» проседает не потому, что человек
   поглупел, а потому что закрытое на 8/8 больше ни разу не всплывало.
   Лучший результат по тесту этого не видит — он помнит рекорд, а не
   дату. Поэтому здесь хранится другое: по каждому ВОПРОСУ — когда его
   надо показать снова, и по каждому ДНЮ — сколько ответов в нём было.

   Ритм считается плотностью, а не непрерывностью: «11 дней из 14».
   Обнуляющийся счётчик наказывает ровно в тот момент, когда человек
   слабее всего, и возвращаться после пропуска становится дороже, чем
   не возвращаться. Пропуск здесь убирает точку и больше ничего.
   ============================================================ */
import { store } from './storage.js';

/* ------------------------------------------------------------
   КЛЮЧ ВОПРОСА

   Своего id у вопросов нет, и заводить его руками на восемьсот штук —
   работа, которая гарантированно разъедется с контентом. Ключ считается
   из самого вопроса: пока текст и ответ те же — это тот же вопрос;
   переписали формулировку — вопрос новый, и расписание ему положено
   новое. Это не обход задачи, а нужное поведение: у переписанного
   вопроса старая история ничего не измеряет.

   Два независимых хэша по 32 бита: на банке в тысячу вопросов
   одиночный уже даёт заметный шанс коллизии, а пара — нет.
   ------------------------------------------------------------ */
const fingerprints = new WeakMap();

function fingerprint(q) {
  let fp = fingerprints.get(q);
  if (fp) return fp;
  fp = [
    q.type,
    q.q || '',
    q.ru || '',
    (q.tokens || []).join(' '),
    (q.options || []).join('|'),
    JSON.stringify(q.answer ?? q.answers ?? ''),
  ].join('§');
  fingerprints.set(q, fp);
  return fp;
}

function hash32(s, seed) {
  let h = seed >>> 0;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0;
  return h >>> 0;
}

export function qid(q) {
  const fp = fingerprint(q);
  return hash32(fp, 0x811c9dc5).toString(36) + '-' + hash32(fp, 0x9e3779b1).toString(36);
}

/* ------------------------------------------------------------
   РАСПИСАНИЕ

   Пять ступеней. Ответил верно — вопрос уезжает на ступень выше и
   возвращается через столько дней; промахнулся — падает на две ступени
   вниз, а не в самое начало. Полный сброс за одну осечку — то же
   обнуление стрика, только для вопроса: выученное полгода назад слово
   после одной опечатки начинало бы жизнь заново и лезло бы в глаза
   каждый день. Две ступени вниз возвращают его через пару дней и
   ставят на место, если это была случайность.
   ------------------------------------------------------------ */
const STEPS = [1, 3, 7, 16, 35];

export const dayKey = (d = new Date()) => {
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

const addDays = (key, n) => {
  const d = new Date(`${key}T00:00:00`);       // без 'Z' — разбирается как локальное
  d.setDate(d.getDate() + n);
  return dayKey(d);
};

const daysBetween = (from, to) =>
  Math.round((new Date(`${to}T00:00:00`) - new Date(`${from}T00:00:00`)) / 86400000);

/* Вопросы, которым место в ежедневной дозе. Замер сюда не попадает:
   он тем и ценен, что его состав не встречался больше нигде, — начни
   мы гонять его вопросы в повторениях, и сравнивать два прохода
   станет нельзя. Курс объявляет это сам (`dailyFilter` в манифесте);
   курс без оговорок отдаёт весь банк. */
const poolOf = course =>
  (course.dailyFilter ? course.questions.filter(course.dailyFilter) : course.questions) || [];

/* ------------------------------------------------------------
   ГОРЯЧИЕ ЗОНЫ

   Куда смотреть, когда просроченных повторов мало и надо добрать
   новыми. Берём долю промахов по каждой зоне (метка `tag`, а при её
   отсутствии — группа `g`) и предлагаем новые вопросы оттуда, где
   уже спотыкались. Это тот же принцип, по которому собран порядок
   программы: учить то, что и так сдано, — самый дорогой способ
   никуда не двигаться.
   ------------------------------------------------------------ */
/* Зоны вопроса — уже под человеческими именами. Метки писались как ключи
   фильтров, и одну зону в банке называют по-разному: `prep`, `prep2` и
   `prep3` — это три пачки одних и тех же предлогов. Сводить их надо здесь,
   а не на экране: иначе в журнале «Предлоги» стоят тремя строками, и ни
   одна не показывает настоящий размер провала. */
const zonesOf = (course, q) => {
  const raw = (q.tag?.length ? q.tag : [q.g]).filter(Boolean);
  return [...new Set(raw.map(z => course.zoneLabel?.(z) || z))];
};

function heatMap(course, state) {
  const acc = new Map();
  poolOf(course).forEach(q => {
    const rec = state[qid(q)];
    if (!rec) return;
    zonesOf(course, q).forEach(z => {
      const cur = acc.get(z) || { seen: 0, missed: 0 };
      cur.seen += rec.n || 0;
      cur.missed += rec.m || 0;
      acc.set(z, cur);
    });
  });
  const heat = new Map();
  acc.forEach((v, z) => heat.set(z, v.seen ? v.missed / v.seen : 0));
  return heat;
}

const shuffle = a => {
  const r = a.slice();
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
};

/* ------------------------------------------------------------
   РАЗНООБРАЗИЕ ЗОН

   Сортировка «сначала самое горячее» кажется очевидной и даёт ровно
   один результат: вся доза — из одной зоны. У человека с горячими
   предлогами двенадцать вопросов подряд про предлоги, назавтра снова
   двенадцать про предлоги. Формально это самое полезное, что можно
   показать; на деле это то самое «опять одно и то же», после которого
   заниматься перестают.

   Поэтому порядок остаётся прежним (горячее выше), но из каждой зоны
   в дозу идёт не больше `limit`. Возвращаем две части отдельно:
   `fit` — то, что уложилось в потолок, `over` — остаток. Повторам
   остаток не отдаём (подождут до завтра, лишний день их не испортит),
   новому отдаём: банк большой, но зон в нём конечное число.
   ------------------------------------------------------------ */
function spread(list, zonesOfItem, limit, used = new Map()) {
  const fit = [];
  const over = [];
  list.forEach(item => {
    const zs = zonesOfItem(item);
    if (zs.some(z => (used.get(z) || 0) >= limit)) { over.push(item); return; }
    zs.forEach(z => used.set(z, (used.get(z) || 0) + 1));
    fit.push(item);
  });
  return { fit, over, used };
}

/* Как дозу делят повторы и новое. Правило живёт в одном месте, потому
   что делят её двое — сборка на #/today и карточка на главной, — и
   разойдись они на единицу, карточка обещает одно, а экран даёт другое. */
function splitDose(course, size, dueCount, freshCount) {
  const share = course.freshShare ?? 0.35;
  /* Новых нет — повторы занимают всё: выдумывать пустые места,
     когда банк кончился, незачем. */
  const room = freshCount ? Math.max(1, size - Math.max(1, Math.round(size * share))) : size;
  const due = Math.min(dueCount, size, room);
  return { due, fresh: Math.min(freshCount, size - due) };
}

export const review = {
  /* --- запись одного ответа --- */
  record(course, q, correct) {
    const today = dayKey();
    store.countDay(course.id, today);

    /* День засчитан в любом случае — даже за вопрос, который в
       расписание не идёт: двадцать четыре вопроса замера это
       безусловно занятие. А вот в само расписание он не попадает. */
    if (course.dailyFilter && !course.dailyFilter(q)) return;

    const key = qid(q);
    const prev = store.reviews(course.id)[key] || { b: 0, n: 0, m: 0 };
    /* Первое попадание с ходу — не на завтра. Иначе один тест на
       двадцать вопросов кладёт двадцать штук в завтрашнюю дозу, и
       неделю подряд человек видит ровно то, что уже сдал без запинки.
       Ступень «3 дня» здесь честнее: угадать двадцать раз подряд
       нельзя, а помнить сутки — можно и не зная. */
    const box = correct
      ? Math.min((prev.n ? (prev.b || 0) + 1 : 2), STEPS.length)
      : Math.max(0, (prev.b || 0) - 2);

    store.saveReview(course.id, key, {
      b: box,
      d: addDays(today, box ? STEPS[box - 1] : 1),
      n: (prev.n || 0) + 1,
      m: (prev.m || 0) + (correct ? 0 : 1),
      at: today,
    });
  },

  /* --- из чего состоит сегодняшняя доза ---
     Сначала просроченные повторы (в порядке «кто дольше ждёт»),
     потом новые из горячих зон. Повтор главнее нового: дырявое
     ведро не чинят, доливая воду.

     Но не главнее целиком. Пройденный подряд десяток тестов кладёт
     в очередь сотню повторов, и дальше доза месяцами состоит из
     одних и тех же предложений — человек приходит и видит вчерашний
     день. Поэтому у повторов есть потолок: доля дозы (freshShare)
     всегда отдана новому, пока новое в банке есть. Просроченное
     от этого не теряется — оно стареет и лезет наверх сортировкой
     «кто дольше ждёт», просто разбирается за несколько заходов. */
  plan(course, size = course.dose || 8, { ahead = false } = {}) {
    /* Возвращаем не голый список, а состав: экрану надо сказать вслух,
       из чего сегодняшняя доза собрана — «4 повтора и 3 новых» читается
       как план, а просто «7 вопросов» как случайная выборка. */
    const state = store.reviews(course.id);
    const today = dayKey();
    const pool = poolOf(course);

    const due = [];
    const fresh = [];
    const later = [];

    pool.forEach(q => {
      const rec = state[qid(q)];
      if (!rec) { fresh.push(q); return; }
      if (rec.d <= today) due.push({ q, rec, late: daysBetween(rec.d, today) });
      else later.push({ q, rec });
    });

    due.sort((a, b) => (b.late - a.late) || ((b.rec.m || 0) - (a.rec.m || 0)));

    /* Сколько вопросов одной зоны пускаем в дозу. По умолчанию четверть:
       на дозе в двенадцать это три, то есть минимум четыре разные темы
       за заход. */
    const cap = course.zoneCap || Math.max(2, Math.ceil(size / 4));
    const zonesOfQ = q => zonesOf(course, q);

    /* Добавка («Ещё») — только новое. Повторы своё уже отработали
       в основной дозе; второй заход, набранный из тех же просроченных,
       и есть «опять одно и то же». */
    const split = ahead
      ? { due: 0, fresh: Math.min(fresh.length, size) }
      : splitDose(course, size, due.length, fresh.length);

    /* Счётчик зон один на всю дозу, а не свой у повторов и у нового:
       иначе три повтора про предлоги плюс три новых про предлоги —
       это те же шесть предлогов подряд. */
    const used = new Map();
    const dueSpread = spread(due.map(d => d.q), zonesOfQ, cap, used);
    const items = dueSpread.fit.slice(0, split.due);
    const counts = { due: items.length, fresh: 0, ahead: 0 };

    if (items.length < size) {
      const heat = heatMap(course, state);
      const score = q => zonesOf(course, q).reduce((s, z) => s + (heat.get(z) || 0), 0) + (q.mine ? 0.5 : 0);
      const ranked = spread(shuffle(fresh).sort((a, b) => score(b) - score(a)), zonesOfQ, cap, used);
      const take = [...ranked.fit, ...ranked.over].slice(0, size - items.length);
      counts.fresh = take.length;
      items.push(...take);
    }

    /* Если и нового не хватило — тянем ближайшие будущие повторы.
       Раньше срока, зато по своей воле: это лучше, чем закрыть вкладку. */
    if (ahead && items.length < size) {
      later.sort((a, b) => (a.rec.d < b.rec.d ? -1 : 1));
      const ahead2 = spread(later.map(l => l.q), zonesOfQ, cap, used);
      const take = [...ahead2.fit, ...ahead2.over].slice(0, size - items.length);
      counts.ahead = take.length;
      items.push(...take);
    }

    return { items, ...counts };
  },

  /* сколько чего ждёт — для витрины, без сборки самой дозы */
  summary(course, size = course.dose || 8) {
    const state = store.reviews(course.id);
    const today = dayKey();
    const pool = poolOf(course);

    let due = 0;
    let fresh = 0;
    let scheduled = 0;
    let nextDue = null;
    pool.forEach(q => {
      const rec = state[qid(q)];
      if (!rec) { fresh++; return; }
      scheduled++;
      if (rec.d <= today) due++;
      else if (!nextDue || rec.d < nextDue) nextDue = rec.d;
    });

    const days = store.days(course.id);
    const split = splitDose(course, size, due, fresh);
    return {
      due,
      fresh,
      /* сколько чего реально войдёт в сегодняшнюю дозу — карточка на
         главной обещает ровно то, что потом покажет #/today */
      take: split,
      scheduled,
      nextDue,
      nextInDays: nextDue ? daysBetween(today, nextDue) : null,
      total: pool.length,
      size: Math.min(size, due + fresh),
      answeredToday: days[today] || 0,
    };
  },

  /* --- ритм: плотность за последние span дней --- */
  rhythm(courseId, span = 14) {
    const days = store.days(courseId);
    const today = dayKey();
    const cells = [];
    for (let i = span - 1; i >= 0; i--) {
      const key = addDays(today, -i);
      cells.push({ key, count: days[key] || 0 });
    }
    const active = cells.filter(c => c.count > 0).length;
    const answered = Object.values(days).reduce((s, n) => s + n, 0);
    return { cells, active, span, answeredToday: days[today] || 0, answered, totalDays: Object.keys(days).length };
  },

  /* --- журнал ошибок: он больше не пишется руками ---
     Раньше «предлоги — 4 повтора» считалось глазами по тетради
     устной практики. Теперь это просто сумма промахов по зоне. */
  journal(course, { zones = 6, items = 8 } = {}) {
    const state = store.reviews(course.id);
    const pool = poolOf(course);

    const acc = new Map();
    const worst = [];

    pool.forEach(q => {
      const rec = state[qid(q)];
      if (!rec || !rec.n) return;
      if (rec.m) worst.push({ q, missed: rec.m, seen: rec.n, box: rec.b, at: rec.at });
      zonesOf(course, q).forEach(z => {
        const cur = acc.get(z) || { zone: z, seen: 0, missed: 0, questions: 0 };
        cur.seen += rec.n;
        cur.missed += rec.m || 0;
        cur.questions++;
        acc.set(z, cur);
      });
    });

    const list = [...acc.values()]
      .filter(z => z.missed)
      .sort((a, b) => (b.missed - a.missed) || (b.missed / b.seen - a.missed / a.seen))
      .slice(0, zones);

    worst.sort((a, b) => (b.missed - a.missed) || (a.box - b.box));

    return { zones: list, worst: worst.slice(0, items), answered: [...acc.values()].reduce((s, z) => s + z.seen, 0) };
  },

  /* --- что отправить в базу при входе (см. sync.pushLocal) --- */
  pending(courseId) {
    return {
      reviews: Object.entries(store.reviews(courseId)).map(([key, r]) => ({ key, ...r })),
      days: Object.entries(store.days(courseId)).map(([day, answered]) => ({ day, answered })),
    };
  },
};
