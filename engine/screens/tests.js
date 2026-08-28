/* ============================================================
   TESTS — список тестов курса с лучшими результатами.

   Тесты группируются по `sect`, если курс его задал. Пока тестов
   было тринадцать, плоская сетка читалась; на тридцати из неё
   перестаёт быть виден маршрут — что делать сейчас, а что потом.
   Курс без `sect` рисуется одной сеткой, как и раньше.
   ============================================================ */
import { navHTML, bindNav } from '../nav.js';
import { store } from '../storage.js';
import { setKeys } from '../keys.js';
import { icon } from '../../ui/icons.js';

function cardHTML(course, t, scores, showKind) {
  const best = scores[t.id];
  const badge = best ? `<span class="t-best">${icon('check')} лучший: ${best.correct}/${best.total}</span>` : '';
  const lvl = t.lvl ? ` · ${t.lvl}` : '';
  /* «МИКС / РУБЕЖ» пишем, только если в курсе есть и то и другое:
     подпись, стоящая на каждой карточке, ничего не различает */
  const kind = showKind ? `${t.mixed ? 'МИКС' : 'РУБЕЖ'} · ` : '';
  return `
    <a class="card t-card" href="#/test/${t.id}" style="--accent:${course.accentFor(t)}">
      <div class="kicker">${kind}${course.testSize(t)} вопросов${lvl} ${badge}</div>
      <h3 class="card-title">${t.title}</h3>
      <p class="card-note">${t.sub}</p>
      <span class="t-go">пройти ${icon('chevron-right')}</span>
    </a>`;
}

/* порядок разделов задаёт сам курс — тем, в каком порядке идут тесты */
function sectionsOf(tests) {
  const out = [];
  tests.forEach(t => {
    const key = t.sect || '';
    let group = out.find(g => g.key === key);
    if (!group) out.push(group = { key, items: [] });
    group.items.push(t);
  });
  return out;
}

export function renderTestsHome(app, course) {
  const scores = store.scores(course.id);
  const groups = sectionsOf(course.tests);
  const showKind = course.tests.some(t => t.mixed) && course.tests.some(t => !t.mixed);

  const body = groups.map(g => `
    ${g.key ? `<div class="eyebrow" style="margin:var(--s-6) 0 14px">${g.key}</div>` : ''}
    <div class="t-grid">${g.items.map(t => cardHTML(course, t, scores, showKind)).join('')}</div>`).join('');

  app.innerHTML = `
    ${navHTML(course, 'tests')}
    <header class="section wrap" style="padding-bottom:var(--s-4)">
      <p class="eyebrow">проверь себя · разные типы вопросов</p>
      <h1>Тесты по всем темам.</h1>
      <p class="lede" style="margin-top:var(--s-4)">${course.testsLede
        || 'Вопросы вперемешку: выбрать вариант, вписать слово, найти ошибку, собрать предложение. '
         + 'Состав меняется при каждом заходе, в конце — счёт и разбор промахов. '
         + '<b>Рубеж</b> — тест по одной теме, <b>микс</b> — по всем сразу.'}</p>
    </header>
    <section class="section wrap" style="padding-top:var(--s-5)">
      ${body}
      <footer class="site">${course.brand.name}${course.brand.suffix} · сохраняется лучший результат по каждому тесту</footer>
    </section>`;

  bindNav(app);
  setKeys(null);
}
