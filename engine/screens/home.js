/* ============================================================
   HOME — витрина курса: прогресс, карта, все темы.
   ============================================================ */
import { navHTML, bindNav } from '../nav.js';
import { railHTML, bindRail } from '../rail.js';
import { explorerHTML, bindExplorer } from '../explorer.js';
import { store } from '../storage.js';
import { setKeys } from '../keys.js';

/* блок «твоя программа»: то, ради чего всё затевалось —
   человек видит свой порядок, а не общий каталог */
function programHTML(course, done) {
  const program = store.program(course.id);
  if (!program) {
    return `
      <section class="section wrap">
        <a class="test-cta" href="#/survey" style="--accent:${course.categories[0].color};margin-top:0">
          <div>
            <div class="cta-k">программа под тебя</div>
            <div class="cta-t">Пройди короткий опрос</div>
          </div>
          <span class="cta-go">три минуты ›</span>
        </a>
      </section>`;
  }

  const lessons = program.items.map(id => course.lessonById(id)).filter(Boolean);
  const next = lessons.filter(l => !done[l.id]).slice(0, 5);
  const passed = lessons.length - lessons.filter(l => !done[l.id]).length;

  if (!next.length) {
    return `<section class="section wrap"><div class="program-done">✓ Программа пройдена целиком —
      <a href="#/tests">проверь себя тестами</a> или скажи мне, и я соберу следующую.</div></section>`;
  }

  return `
    <section class="section wrap">
      <p class="eyebrow">твоя программа · пройдено ${passed}/${lessons.length}</p>
      <h2 style="margin-bottom:6px">${program.title}</h2>
      <p class="lede" style="margin:0 0 20px">${program.note || ''}</p>
      <div class="program-list">
        ${next.map((l, i) => `
          <a class="program-row ${i === 0 ? 'first' : ''}" href="#/lesson/${l.id}" style="--accent:${course.accentFor(l)}">
            <span class="program-no">${String(passed + i + 1).padStart(2, '0')}</span>
            <span class="program-body"><b>${l.title}</b><small>${l.subtitle}</small></span>
            <span class="program-go">${i === 0 ? 'продолжить ›' : '›'}</span>
          </a>`).join('')}
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
              <div class="kicker">${String(l.n).padStart(2, '0')} · ${course.labelOf(l.aspect)}${done[l.id] ? ' · <span class="check">✓</span>' : ''}</div>
              <h3>${l.title}</h3><p>${l.subtitle}</p>
            </a>`).join('')}
        </div>
      </div>`;
  }).join('');

  app.innerHTML = `
    ${navHTML(course, 'home')}

    <header class="section wrap">
      <p class="eyebrow">${course.eyebrow}</p>
      <h1>${course.tagline}</h1>
      <p class="lede" style="margin-top:18px">Выбирай тему → листай карточки с анимированными таймлайнами →
        проверяй себя. Прогресс сохраняется. Пройдено: <b>${doneCount}/${course.lessonCount}</b>.</p>

      <a class="test-cta" href="#/tests" style="--accent:${course.categories.at(-1).color}">
        <div><div class="cta-k">проверь себя</div><div class="cta-t">Тесты по всем темам</div></div>
        <span class="cta-go">пройти ›</span>
      </a>

      <div style="margin:26px 0 6px">${railHTML(course)}</div>

      <div class="tag-legend" style="margin-top:24px">
        ${course.categories.map(c => `<span><i style="background:${c.color}"></i> ${c.short}</span>`).join('')}
      </div>
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
