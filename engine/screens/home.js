/* ============================================================
   HOME — витрина курса: прогресс, карта, все темы.
   ============================================================ */
import { navHTML, bindNav } from '../nav.js';
import { railHTML, bindRail } from '../rail.js';
import { explorerHTML, bindExplorer } from '../explorer.js';
import { store } from '../storage.js';
import { setKeys } from '../keys.js';

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
