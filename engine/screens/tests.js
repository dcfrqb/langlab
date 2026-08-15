/* ============================================================
   TESTS — список тестов курса с лучшими результатами.
   ============================================================ */
import { navHTML, bindNav } from '../nav.js';
import { store } from '../storage.js';
import { setKeys } from '../keys.js';

export function renderTestsHome(app, course) {
  const scores = store.scores(course.id);

  const cards = course.tests.map(t => {
    const best = scores[t.id];
    const badge = best ? `<span class="t-best">лучший: ${best.correct}/${best.total}</span>` : '';
    return `
      <a class="t-card" href="#/test/${t.id}" style="--accent:${course.accentFor(t)}">
        <div class="kicker">${t.mixed ? 'МИКС' : 'РУБЕЖ'} · ${course.testSize(t)} вопросов ${badge}</div>
        <h3>${t.title}</h3><p>${t.sub}</p>
        <span class="t-go">пройти ›</span>
      </a>`;
  }).join('');

  app.innerHTML = `
    ${navHTML(course, 'tests')}
    <header class="section wrap" style="padding-bottom:var(--s-4)">
      <p class="eyebrow">проверь себя · разные типы вопросов</p>
      <h1>Тесты по всем темам.</h1>
      <p class="lede" style="margin-top:16px">Каждый тест — набор вопросов вперемешку:
        выбор, вписать слово, найти ошибку, собрать предложение. Порядок и состав меняются
        при каждом заходе. В конце — счёт и разбор промахов.</p>
    </header>
    <section class="section wrap" style="padding-top:var(--s-5)">
      <div class="t-grid">${cards}</div>
      <footer class="site">${course.brand.name}${course.brand.suffix} · тесты сохраняют лучший результат</footer>
    </section>`;

  bindNav(app);
  setKeys(null);
}
