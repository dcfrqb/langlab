/* ============================================================
   TESTS — список тестов курса с лучшими результатами.
   ============================================================ */
import { navHTML, bindNav } from '../nav.js';
import { store } from '../storage.js';
import { setKeys } from '../keys.js';
import { icon } from '../../ui/icons.js';

export function renderTestsHome(app, course) {
  const scores = store.scores(course.id);

  const cards = course.tests.map(t => {
    const best = scores[t.id];
    const badge = best ? `<span class="t-best">${icon('check')} лучший: ${best.correct}/${best.total}</span>` : '';
    return `
      <a class="card t-card" href="#/test/${t.id}" style="--accent:${course.accentFor(t)}">
        <div class="kicker">${t.mixed ? 'МИКС' : 'РУБЕЖ'} · ${course.testSize(t)} вопросов ${badge}</div>
        <h3 class="card-title">${t.title}</h3>
        <p class="card-note">${t.sub}</p>
        <span class="t-go">пройти ${icon('chevron-right')}</span>
      </a>`;
  }).join('');

  app.innerHTML = `
    ${navHTML(course, 'tests')}
    <header class="section wrap" style="padding-bottom:var(--s-4)">
      <p class="eyebrow">проверь себя · разные типы вопросов</p>
      <h1>Тесты по всем темам.</h1>
      <p class="lede" style="margin-top:var(--s-4)">${course.testsLede
        || 'Вопросы вперемешку: выбрать вариант, вписать слово, найти ошибку, собрать предложение.'
        } Состав меняется при каждом заходе, в конце — счёт и разбор
        промахов. <b>Рубеж</b> — тест по одной теме, <b>микс</b> — по всем сразу.</p>
    </header>
    <section class="section wrap" style="padding-top:var(--s-5)">
      <div class="t-grid">${cards}</div>
      <footer class="site">${course.brand.name}${course.brand.suffix} · сохраняется лучший результат по каждому тесту</footer>
    </section>`;

  bindNav(app);
  setKeys(null);
}
