/* ============================================================
   TERMS — глоссарий курса: все термины из уроков в одном месте,
   с поиском. Сам список нигде не хранится: он собирается из шагов
   type:'terms', см. course.terms — так словарь не может разойтись
   с уроками.

   Ищем и по английскому, и по русскому: человек одинаково часто
   вспоминает «как это по-английски» и «что это вообще значит».
   ============================================================ */
import { navHTML, bindNav } from '../nav.js';
import { setKeys } from '../keys.js';
import { icon } from '../../ui/icons.js';

function groupsOf(terms) {
  const byLesson = new Map();
  terms.forEach(t => {
    const key = t.lesson.id;
    if (!byLesson.has(key)) byLesson.set(key, { lesson: t.lesson, items: [] });
    byLesson.get(key).items.push(t);
  });
  return [...byLesson.values()];
}

function termHTML(t) {
  return `
    <div class="term">
      <div class="term-en">${t.en}</div>
      <div class="term-ru">${t.ru}</div>
      ${t.hint ? `<div class="term-hint">${t.hint}</div>` : ''}
    </div>`;
}

export function renderTerms(app, course) {
  const all = course.terms;

  app.innerHTML = `
    ${navHTML(course, 'terms')}
    <header class="section wrap" style="padding-bottom:var(--s-4)">
      <p class="eyebrow">термины · английский как на экзамене</p>
      <h1>Словарь курса.</h1>
      <p class="lede" style="margin-top:var(--s-4)">Все термины из пройденных тем — ${all.length} шт.
        Ищи по-английски или по-русски: вспоминается и то, и другое.</p>
      <input class="input gloss-search" id="q" type="search" autocomplete="off"
        placeholder="hyponatremia · гипонатриемия · ADH" aria-label="Поиск по словарю">
    </header>
    <section class="section wrap" id="list" style="padding-top:0"></section>`;

  const list = app.querySelector('#list');
  const input = app.querySelector('#q');

  function paint(query = '') {
    const q = query.trim().toLowerCase();
    const found = q
      ? all.filter(t => `${t.en} ${t.ru} ${t.hint || ''}`.toLowerCase().includes(q))
      : all;

    if (!found.length) {
      list.innerHTML = `<p class="gloss-empty">Ничего не нашлось на «${query}».
        Термины появляются вместе с темами — пройденных тем пока ${course.lessonCount}.</p>`;
      return;
    }

    /* при поиске группировка по темам только мешает — показываем плоско */
    list.innerHTML = q
      ? `<div class="terms">${found.map(t => `
          <div class="term">
            <div class="term-en">${t.en}</div>
            <div class="term-ru">${t.ru}</div>
            ${t.hint ? `<div class="term-hint">${t.hint}</div>` : ''}
            <div class="term-of">${t.lesson.title}</div>
          </div>`).join('')}</div>`
      : groupsOf(found).map(g => `
          <div class="gloss-group" style="--accent:${course.accentFor(g.lesson)}">
            <p class="eyebrow">${course.labelOf(g.lesson.aspect)} · ${g.items.length}</p>
            <a class="row" href="#/lesson/${g.lesson.id}" style="margin-bottom:var(--s-2)">
              <div class="row-body"><b>${g.lesson.title}</b><small>${g.lesson.subtitle || ''}</small></div>
              <span class="row-go">к теме ${icon('chevron-right')}</span>
            </a>
            <div class="terms">${g.items.map(termHTML).join('')}</div>
          </div>`).join('');
  }

  paint();
  input.addEventListener('input', () => paint(input.value));

  bindNav(app);
  setKeys(null);
}
