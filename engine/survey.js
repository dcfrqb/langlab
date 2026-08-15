/* ============================================================
   SURVEY — логика опроса: какие вопросы задать, какой уровень
   получился и какая из этого выходит программа.
   Чистые функции, никакого DOM — их удобно проверять и менять.
   ============================================================ */

export const GOALS = [
  { key: 'zero',     label: 'Начать с нуля',        note: 'база: глагол, порядок слов, времена' },
  { key: 'base',     label: 'Подтянуть базу',       note: 'дыры в грамматике, которые мешают' },
  { key: 'exam',     label: 'Экзамен (IELTS и др.)', note: 'точность и структура ответа' },
  { key: 'speak',    label: 'Заговорить',           note: 'меньше правил, больше практики' },
  { key: 'textbook', label: 'Иду по учебнику',      note: 'нужен порядок под свой курс' },
];

export const EXPERIENCE = [
  { key: 'none',    label: 'Не учил вообще',              idx: 0 },
  { key: 'school',  label: 'Учил давно, всё забыл',       idx: 1 },
  { key: 'reading', label: 'Читаю и понимаю, но не говорю', idx: 2 },
  { key: 'speak',   label: 'Говорю, но с ошибками',       idx: 3 },
];

const LEVELS = ['A1', 'A2', 'B1', 'B2'];

/** По одному вопросу с выбором варианта на каждую группу курса — быстрый срез. */
export function surveyQuestions(course, limit = 6) {
  const pool = course.questions.filter(q => q.type === 'choose');
  const picked = [];
  const used = new Set();

  course.groups.forEach(group => {
    if (picked.length >= limit) return;
    const q = pool.find(x => x.g === group && !used.has(x));
    if (q) { picked.push(q); used.add(q); }
  });

  for (const q of pool) {
    if (picked.length >= limit) break;
    if (!used.has(q)) { picked.push(q); used.add(q); }
  }
  return picked;
}

/**
 * Уровень = грамматический срез, подпёртый самооценкой: сам себя человек
 * оценивает с ошибкой в обе стороны, поэтому берём среднее и не пускаем
 * результат больше чем на ступень выше того, что он реально ответил.
 */
export function assessLevel({ correct, total, experienceKey }) {
  const ratio = total ? correct / total : 0;
  const byGrammar = ratio >= 0.9 ? 3 : ratio >= 0.7 ? 2 : ratio >= 0.45 ? 1 : 0;
  const bySelf = EXPERIENCE.find(e => e.key === experienceKey)?.idx ?? 0;
  const idx = Math.min(byGrammar + 1, Math.round((byGrammar + bySelf) / 2));
  return LEVELS[Math.max(0, Math.min(LEVELS.length - 1, idx))];
}

/**
 * Программа = порядок уроков под человека.
 * С нуля — строго по курсу. Всем остальным сначала то, где споткнулся на опросе:
 * это и есть «гибкая программа», а не отдельный курс под каждого.
 */
export function buildProgram(course, { level, goalKey, weakGroups = [] }) {
  const all = [...course.lessons].sort((a, b) => a.n - b.n);

  /* если слабо всё или человек начинает с нуля — переставлять нечего,
     идём по курсу; иначе слабые группы поднимаем наверх */
  const straight = goalKey === 'zero'
    || level === 'A1'
    || !weakGroups.length
    || weakGroups.length >= course.groups.length;

  const items = straight
    ? all
    : [...all.filter(l => weakGroups.includes(l.group)), ...all.filter(l => !weakGroups.includes(l.group))];

  const goal = GOALS.find(g => g.key === goalKey);
  return {
    title: `Программа · ${goal?.label || 'своя'}`,
    items: items.map(l => l.id),
    note: straight
      ? `Уровень ${level}. Идём по курсу с начала — так надёжнее.`
      : `Уровень ${level}. Сначала слабые места: ${weakGroups.join(', ')}.`,
  };
}
