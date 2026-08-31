/* ============================================================
   HOME — витрина курса: программа, карта времён, все темы.
   ============================================================ */
import { navHTML, bindNav } from '../nav.js';
import { railHTML, bindRail } from '../rail.js';
import { explorerHTML, bindExplorer } from '../explorer.js';
import { store } from '../storage.js';
import { review } from '../review.js';
import { rhythmHTML } from '../rhythm.js';
import { setKeys } from '../keys.js';
import { icon } from '../../ui/icons.js';

/* Блок «сегодня» стоит первым и до программы: программа отвечает на
   вопрос «куда я иду», а он — на вопрос «что делать прямо сейчас».
   Второй вопрос задаётся каждый день, первый — раз в месяц. */
function todayHTML(course) {
  if (!course.questions?.length) return '';

  const size = course.dose || 8;
  const s = review.summary(course, size);
  const waiting = s.take.due + s.take.fresh;

  const body = waiting
    ? `<div>
         <div class="cta-k">доза дня</div>
         <div class="cta-t">${waiting} ${waiting === 1 ? 'вопрос' : waiting < 5 ? 'вопроса' : 'вопросов'} на сегодня</div>
         <div class="today-mix">${[
           s.take.due ? `${s.take.due} ждёт повторения` : '',
           s.take.fresh ? `${s.take.fresh} ещё не видел` : '',
           /* Хвост называем вслух. После перерыва просроченных бывает две
              сотни, а доза остаётся дневной: молча показывать «12 вопросов»
              и не сказать про очередь — врать про масштаб. */
           s.due > s.take.due ? `<b>+${s.due - s.take.due}</b> в очереди` : '',
         ].filter(Boolean).join(' · ')}</div>
       </div>
       <span class="cta-go">${s.answeredToday ? 'ещё' : 'начать'} ${icon('chevron-right')}</span>`
    : `<div>
         <div class="cta-k">доза дня</div>
         <div class="cta-t">На сегодня всё ✓</div>
         <div class="today-mix">${s.answeredToday
           ? `сегодня ответов: ${s.answeredToday}`
           : 'повторять пока нечего'}${
           s.nextInDays != null ? ` · следующая порция ${s.nextInDays <= 1 ? 'завтра' : `через ${s.nextInDays} дн.`}` : ''}</div>
       </div>
       <span class="cta-go">открыть ${icon('chevron-right')}</span>`;

  return `
    <div class="today-block">
      <a class="cta today-cta" href="#/today" style="--accent:var(--now)">${body}</a>
      ${rhythmHTML(course.id)}
    </div>`;
}

/* блок «твоя программа»: то, ради чего всё затевалось —
   человек видит свой порядок, а не общий каталог */
function programHTML(course, done) {
  const program = store.program(course.id);

  /* опрос на уровень — вещь языковая (A1…B2, «заговорить»). Курсу без него
     не предлагаем: программу такому человеку собирают руками. */
  if (!program) {
    if (course.survey === false) return '';
    return `
      <section class="section wrap">
        <a class="cta" href="#/survey" style="--accent:${course.categories[0].color}">
          <div>
            <div class="cta-k">программа под тебя</div>
            <div class="cta-t">Пройди короткий опрос</div>
          </div>
          <span class="cta-go">три минуты ${icon('chevron-right')}</span>
        </a>
      </section>`;
  }

  const lessons = program.items.map(id => course.lessonById(id)).filter(Boolean);
  const left = lessons.filter(l => !done[l.id]);
  const passed = lessons.length - left.length;

  if (!left.length) {
    return `
      <section class="section wrap">
        <div class="program-done">✓ Программа пройдена целиком —
          <a href="#/tests">проверь себя тестами</a> или скажи мне, и я соберу следующую.</div>
      </section>`;
  }

  return `
    <section class="section wrap">
      <p class="eyebrow">твоя программа · пройдено ${passed} из ${lessons.length}</p>
      <h2 style="margin-bottom:6px">${program.title}</h2>
      ${program.note ? `<p class="lede" style="margin:0 0 var(--s-5)">${program.note}</p>` : ''}
      <div class="rows">
        ${left.slice(0, 5).map((l, i) => {
          /* по каким книгам собрана тема — иначе план не отличить от списка,
             придуманного из головы, а он весь стоит на учебниках */
          const books = course.booksOf(l);
          return `
          <a class="row ${i === 0 ? 'program-first' : ''}" href="#/lesson/${l.id}" style="--accent:${course.accentFor(l)}">
            <span class="row-num">${String(passed + i + 1).padStart(2, '0')}</span>
            <span class="row-body"><b>${l.title}</b><small>${l.subtitle}</small>
              ${books.length ? `<i class="row-src">${books.join(' + ')}</i>` : ''}</span>
            <span class="row-go">${i === 0 ? `продолжить ${icon('chevron-right')}` : icon('chevron-right')}</span>
          </a>`;
        }).join('')}
        ${course.terms.length ? `
          <a class="row" href="#/terms" style="--accent:${course.categories.at(-1).color}">
            <span class="row-num">${icon('spark')}</span>
            <span class="row-body"><b>Термины курса</b>
              <small>${course.terms.length} английских терминов из тем программы</small></span>
            <span class="row-go">повторить ${icon('chevron-right')}</span>
          </a>` : ''}
      </div>
    </section>`;
}

export function renderHome(app, course) {
  const doneCount = store.lessonsDoneCount(course.id);
  const done = store.lessons(course.id);

  const groups = course.groups.map(g => {
    const items = course.lessonsByGroup(g);
    if (!items.length) return '';
    return `
      <div style="margin-top:var(--s-6)">
        <div class="eyebrow" style="margin-bottom:14px">${g}</div>
        <div class="grid">
          ${items.map(l => `
            <a class="card" href="#/lesson/${l.id}" style="--accent:${course.accentFor(l)}">
              <div class="kicker">${String(l.n).padStart(2, '0')} · ${course.labelOf(l.aspect)}${
                done[l.id] ? ` · <span style="color:var(--success-ink)">${icon('check')} пройден</span>` : ''}</div>
              <h3 class="card-title">${l.title}</h3>
              <p class="card-note">${l.subtitle}</p>
            </a>`).join('')}
        </div>
      </div>`;
  }).join('');

  app.innerHTML = `
    ${navHTML(course, 'home')}

    <header class="section wrap">
      <p class="eyebrow">${course.eyebrow}</p>
      <h1>${course.tagline}</h1>
      <p class="lede" style="margin-top:var(--s-4)">${course.homeLede
        || 'Выбирай тему, листай карточки с анимированными таймлайнами, проверяй себя. Прогресс сохраняется. Пройдено: '
        }<b>${doneCount} из ${course.lessonCount}</b>.</p>

      <div style="margin:var(--s-5) 0 var(--s-2)">${railHTML(course)}</div>

      <div class="tag-legend">
        ${course.categories.map(c => `<span><i style="background:${c.color}"></i> ${c.short}</span>`).join('')}
      </div>

      ${todayHTML(course)}

      ${course.tests.length ? `
        <a class="cta" href="#/tests" style="--accent:${course.categories.at(-1).color};margin-top:var(--s-5)">
          <div><div class="cta-k">проверь себя</div><div class="cta-t">Тесты по всем темам</div></div>
          <span class="cta-go">пройти ${icon('chevron-right')}</span>
        </a>` : ''}
    </header>

    ${programHTML(course, done)}

    ${explorerHTML(course)}

    <section class="section wrap">
      <p class="eyebrow">все темы — жми любую</p>
      ${groups}
    </section>

    <footer class="site wrap">${course.brand.name}${course.brand.suffix} · тренировка — со мной в чате</footer>`;

  bindNav(app);
  bindRail(app);
  bindExplorer(app, course);
  setKeys(null);
}
