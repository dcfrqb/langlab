/* ============================================================
   LEVEL — готовность к экзамену: ориентировочный уровень,
   сильные и слабые разделы, что делать дальше.

   Движок здесь ничего не считает сам: как превращать проценты
   в балл — знание курса, а не платформы. Курс отдаёт функцию
   estimate(stats) и получает готовый экран; курс без неё этот
   раздел просто не показывает (см. nav.js).

   Честность важнее красивой цифры: это оценка по упражнениям
   курса, а не результат экзамена, и экран обязан это сказать —
   иначе человек придёт на тест с чужим ожиданием.
   ============================================================ */
import { navHTML, bindNav } from '../nav.js';
import { store } from '../storage.js';
import { setKeys } from '../keys.js';
import { icon } from '../../ui/icons.js';

/* всё, что курс может знать о человеке, — в одном объекте */
function collect(course) {
  const scores = store.scores(course.id);
  const done = store.lessons(course.id);

  return {
    tests: course.tests.map(t => ({
      id: t.id, title: t.title, sub: t.sub, aspect: t.aspect, tag: t.tag || null,
      size: course.testSize(t),
      best: scores[t.id] || null,
    })),
    lessons: {
      done: Object.keys(done).length,
      total: course.lessonCount,
      byId: done,
    },
    groups: course.groups.map(title => {
      const items = course.lessonsByGroup(title);
      return { title, total: items.length, done: items.filter(l => done[l.id]).length };
    }),
  };
}

/* Линейка баллов: где ты и куда целишься. Полоса, а не число, потому что
   «6.5» без соседей не читается — непонятно, это близко к цели или нет. */
function scaleHTML(sc) {
  if (!sc) return '';
  const pos = v => ((v - sc.from) / (sc.to - sc.from)) * 100;
  const zone = sc.target
    ? `<span class="lv-zone" style="left:${pos(sc.target.from)}%;width:${pos(sc.target.to) - pos(sc.target.from)}%"></span>`
    : '';
  const mark = sc.value != null
    ? `<span class="lv-mark" style="left:${pos(sc.value)}%"><i></i><b>${sc.valueLabel ?? sc.value}</b></span>`
    : '';
  return `
    <div class="lv-scale">
      <div class="lv-track">${zone}${mark}</div>
      <div class="lv-ticks">${(sc.ticks || []).map(t =>
        `<span style="left:${pos(t.v)}%">${t.label}</span>`).join('')}</div>
      ${sc.target?.label ? `<div class="lv-zone-label">${sc.target.label}</div>` : ''}
    </div>`;
}

function barsHTML(bars) {
  if (!bars?.length) return '';
  return `
    <div class="lv-bars">
      ${bars.map(b => `
        <div class="lv-bar">
          <div class="lv-bar-head">
            <span class="lv-bar-name">${b.label}</span>
            <span class="lv-bar-val ${b.tone || ''}">${b.value}</span>
          </div>
          <span class="bar"><i class="${b.tone || ''}" style="width:${Math.max(0, Math.min(100, b.pct))}%"></i></span>
          ${b.meta ? `<div class="lv-bar-meta">${b.meta}</div>` : ''}
        </div>`).join('')}
    </div>`;
}

function tableHTML(t) {
  if (!t) return '';
  return `
    <div class="lv-block">
      ${t.title ? `<p class="eyebrow">${t.title}</p>` : ''}
      <div class="dtable-scroll">
        <table class="dtable">
          <thead><tr>${t.cols.map(c => `<th>${c}</th>`).join('')}</tr></thead>
          <tbody>${t.rows.map(r => `<tr class="${r.here ? 'is-here' : ''}">
            <th scope="row">${r.cells[0]}</th>
            ${r.cells.slice(1).map(c => `<td>${c}</td>`).join('')}
          </tr>`).join('')}</tbody>
        </table>
      </div>
      ${t.note ? `<p class="dtable-note">${t.note}</p>` : ''}
    </div>`;
}

function nextHTML(next) {
  if (!next?.length) return '';
  return `
    <div class="lv-block">
      <p class="eyebrow">что делать дальше</p>
      <div class="rows">
        ${next.map(n => `
          <a class="row" href="${n.href}">
            <span class="row-body"><b>${n.title}</b><small>${n.why}</small></span>
            <span class="row-go">${icon('chevron-right')}</span>
          </a>`).join('')}
      </div>
    </div>`;
}

export function renderLevel(app, course) {
  const model = course.estimate(collect(course)) || {};

  const body = model.empty ? `
    <div class="empty">
      <div class="empty-title">${model.empty.title}</div>
      <div class="empty-note">${model.empty.note}</div>
      <a class="btn btn-primary" href="${model.empty.href || '#/tests'}">${
        model.empty.cta || 'Выбрать тест'} ${icon('chevron-right')}</a>
    </div>` : `
    <div class="res-summary">
      <div class="ring ${model.tone || ''}">
        <div>
          <div class="ring-num">${model.band}</div>
          <div class="ring-sub">${model.bandSub || ''}</div>
        </div>
      </div>
      <div class="res-meta">
        <div class="res-verdict ${model.tone || ''}">${model.headline}</div>
        ${model.sub ? `<div class="res-cover">${model.sub}</div>` : ''}
        ${model.note ? `<div class="res-note">${model.note}</div>` : ''}
      </div>
    </div>
    ${scaleHTML(model.scale)}
    ${barsHTML(model.bars)}
    ${tableHTML(model.table)}
    ${nextHTML(model.next)}
    ${model.caveat ? `<div class="callout lv-caveat">${model.caveat}</div>` : ''}`;

  app.innerHTML = `
    ${navHTML(course, 'level')}
    <header class="section wrap" style="padding-bottom:var(--s-2)">
      <p class="eyebrow">${model.eyebrow || 'готовность к экзамену'}</p>
      <h1>${model.title || 'Где я сейчас.'}</h1>
      ${model.lede ? `<p class="lede" style="margin-top:var(--s-4)">${model.lede}</p>` : ''}
    </header>
    <section class="section wrap" style="padding-top:var(--s-4)">
      ${body}
      <footer class="site">${course.brand.name}${course.brand.suffix} ·
        <a href="#/results" style="color:var(--c-purple)">результаты по тестам →</a>
      </footer>
    </section>`;

  bindNav(app);
  setKeys(null);
}
