/* ============================================================
   TODAY — доза дня: то, что надо ответить сегодня.

   Главное трение ежедневных занятий — не мотивация, а вопрос
   «с чего начать». Поэтому экран не спрашивает: он собирает
   несколько вопросов сам (сначала просроченные повторы, потом
   новое из горячих зон) и сразу их показывает. Выбора здесь нет
   намеренно — выбор это и есть та секунда, на которой человек
   закрывает вкладку.

   Когда отвечать нечего, экран говорит «всё» и не выдумывает
   занятость. Разрешение остановиться — часть системы: без него
   ежедневность держится ровно до первого тяжёлого дня.
   ============================================================ */
import { navHTML, bindNav } from '../nav.js';
import { rhythmHTML } from '../rhythm.js';
import { review } from '../review.js';
import { renderTest } from '../quiz.js';
import { setKeys } from '../keys.js';
import { icon } from '../../ui/icons.js';

const plural = (n, one, few, many) => {
  const a = Math.abs(n) % 100;
  const b = a % 10;
  if (a > 10 && a < 20) return many;
  if (b > 1 && b < 5) return few;
  if (b === 1) return one;
  return many;
};

const days = n => `${n} ${plural(n, 'день', 'дня', 'дней')}`;

/* --- сегодня отвечать нечего --- */
function renderDone(app, course, summary, canPullAhead) {
  app.innerHTML = `
    ${navHTML(course, 'today')}
    <header class="section wrap" style="padding-bottom:var(--s-2)">
      <p class="eyebrow">доза дня</p>
      <h1>На сегодня всё.</h1>
      <p class="lede" style="margin-top:var(--s-4)">${summary.answeredToday
        ? `Сегодня ты ответил на <b>${summary.answeredToday}</b> — день засчитан.`
        : 'Ни одного просроченного повтора и ни одного нового вопроса в очереди.'}
        ${summary.nextInDays != null
          ? `Следующая порция подойдёт ${summary.nextInDays <= 1 ? 'завтра' : `через ${days(summary.nextInDays)}`}.`
          : ''}</p>
    </header>
    <section class="section wrap" style="padding-top:var(--s-4);--accent:var(--now);--on-accent:var(--on-now)">
      ${rhythmHTML(course.id)}
      <div class="empty" style="margin-top:var(--s-6)">
        <div class="empty-title">Останавливаться здесь — нормально.</div>
        <div class="empty-note">Расписание уже знает, когда что показать снова.
          Приходить каждый день важнее, чем сидеть подолгу: закрытая доза и есть
          весь дневной минимум.</div>
        <div class="today-actions">
          ${canPullAhead
            ? `<a class="btn btn-primary" href="#/today/more">Ещё вопросы ${icon('chevron-right')}</a>`
            : ''}
          <a class="btn btn-secondary" href="#/">К темам</a>
        </div>
      </div>
      <footer class="site">${course.brand.name}${course.brand.suffix} ·
        <a href="#/results" style="color:var(--c-purple)">ритм и журнал ошибок →</a>
      </footer>
    </section>`;

  bindNav(app);
  setKeys(null);
}

export function renderToday(app, course, { ahead = false } = {}) {
  const size = course.dose || 8;
  const plan = review.plan(course, size, { ahead });
  const summary = review.summary(course, size);

  if (!plan.items.length) return renderDone(app, course, summary, !ahead && summary.scheduled > 0);

  const parts = [];
  if (plan.due) parts.push(`<b>${plan.due}</b> на повторение`);
  if (plan.fresh) parts.push(`<b>${plan.fresh}</b> ${plural(plan.fresh, 'новый', 'новых', 'новых')}`);
  if (plan.ahead) parts.push(`<b>${plan.ahead}</b> наперёд`);
  /* Очередь после перерыва называем честно: доза остаётся дневной,
     но делать вид, что просроченных ровно восемь, нельзя.
     В добавке очередь не поминаем: она набрана из нового намеренно,
     и «ещё 40 в очереди» читалось бы как упрёк за лишний заход. */
  const backlog = ahead ? 0 : summary.due - plan.due;
  if (backlog > 0) parts.push(`ещё ${backlog} в очереди`);

  renderTest(app, course, {
    id: 'today',
    title: ahead ? 'Ещё' : 'Сегодня',
    kind: ahead ? 'ДОБАВКА' : 'СЕГОДНЯ',
    lede: parts.join(' · '),
    questions: plan.items,
    pick: plan.items.length,
    /* доза — не тест: состав каждый день новый, рекорд по нему
       не значил бы ничего (см. renderTest) */
    ephemeral: true,
    accent: 'var(--now)',
    onAccent: 'var(--on-now)',
    exit: '#/',
    exitLabel: 'На главную',

    /* Итог дозы говорит не про счёт, а про ритм: счёт по семи вопросам
       шумный, а «девятый день из четырнадцати» — то, ради чего всё. */
    finishNote() {
      const r = review.rhythm(course.id);
      return `<div class="today-mark">день засчитан · <b>${r.active}</b> из ${r.span} дней</div>
        ${rhythmHTML(course.id, { caption: false })}`;
    },
    /* «Ещё» ведёт на добавку (`/more`), а не обратно на дозу. Через #/today
       второй заход набирался бы из тех же просроченных повторов — человек
       дорешал двенадцать и получает продолжение вчерашнего дня. */
    finishActions: `
      <a class="btn btn-secondary" href="#/">К темам</a>
      <a class="btn btn-primary" href="#/today/more">Ещё ${icon('chevron-right')}</a>`,
  });
}
