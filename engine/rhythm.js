/* ============================================================
   RHYTHM — картинка занятий за последние две недели.

   Намеренно НЕ стрик. Счётчик подряд идущих дней обнуляется ровно
   тогда, когда человеку тяжелее всего, и цена возвращения после
   пропуска становится выше цены не возвращаться. Здесь считается
   плотность: «11 дней из 14». Пропуск убирает точку — и всё.

   Порог дня — один ответ. Он должен браться в худший день, а не
   в лучший, иначе это снова обещание, которое нельзя сдержать.
   ============================================================ */
import { review, dayKey } from './review.js';

const WEEKDAY = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];

/* Насыщенность точки — грубая: «был» и «был как следует». Пять градаций
   человек всё равно не различит, а пять оттенков одного зелёного
   превращают полосу в шум. */
const level = n => (n === 0 ? '' : n < 5 ? 'is-on' : 'is-full');

export function rhythmHTML(courseId, { span = 14, caption = true } = {}) {
  const r = review.rhythm(courseId, span);
  const today = dayKey();

  const dots = r.cells.map(c => {
    const d = new Date(`${c.key}T00:00:00`);
    const title = `${c.key} · ${WEEKDAY[d.getDay()]} · ${c.count ? `${c.count} ответов` : 'пропуск'}`;
    return `<i class="${level(c.count)} ${c.key === today ? 'is-today' : ''}" title="${title}"></i>`;
  }).join('');

  const cap = caption
    ? `<div class="rhythm-cap"><b>${r.active}</b> из ${span} дней${
        r.answeredToday ? ` · сегодня ${r.answeredToday}` : ' · сегодня пока пусто'}</div>`
    : '';

  return `<div class="rhythm">${cap}<div class="rhythm-dots">${dots}</div></div>`;
}
