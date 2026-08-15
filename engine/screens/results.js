/* ============================================================
   RESULTS — сводка лучших баллов. Пока читает localStorage,
   после появления аккаунтов — те же данные придут из БД.
   ============================================================ */
import { navHTML, bindNav } from '../nav.js';
import { api } from '../api.js';
import { store } from '../storage.js';
import { setKeys } from '../keys.js';

export function renderResults(app, course) {
  const scores = store.scores(course.id);
  const taken = course.tests.filter(t => scores[t.id]);
  const totC = taken.reduce((s, t) => s + scores[t.id].correct, 0);
  const totQ = taken.reduce((s, t) => s + scores[t.id].total, 0);
  const pct = totQ ? Math.round(totC / totQ * 100) : 0;
  const cover = Math.round(taken.length / course.tests.length * 100);

  const level = totQ === 0 ? { t: 'пока нет данных', c: '' }
    : pct >= 90 ? { t: 'уверенно — ядро закреплено', c: 'good' }
    : pct >= 75 ? { t: 'крепко, добить точечно', c: 'good' }
    : pct >= 55 ? { t: 'средне — есть над чем работать', c: 'ok' }
    : { t: 'фундамент ещё сыпется — перепройти темы', c: 'bad' };

  const row = t => {
    const s = scores[t.id];
    const p = s ? Math.round(s.correct / s.total * 100) : 0;
    const cls = !s ? '' : p >= 90 ? 'good' : p >= 60 ? 'ok' : 'bad';
    return `
      <a class="res-row" href="#/test/${t.id}" style="--accent:${course.accentFor(t)}">
        <span class="res-name">${t.title}${t.batch === 2 ? ' <span class="res-b2">пачка 2</span>' : ''}</span>
        <span class="res-bar"><i class="${cls}" style="width:${s ? p : 0}%"></i></span>
        <span class="res-score ${cls}">${s ? `${s.correct}/${s.total}` : '—'}</span>
      </a>`;
  };

  app.innerHTML = `
    ${navHTML(course, 'results')}
    <header class="section wrap" style="padding-bottom:var(--s-2)">
      <p class="eyebrow">твой прогресс · лучшие результаты</p>
      <h1>Мои результаты.</h1>
    </header>
    <section class="section wrap" style="padding-top:var(--s-4)">
      <div class="res-summary">
        <div class="res-ring ${level.c}">
          <div class="res-big">${pct}<span>%</span></div>
          <div class="res-sub">${totC}/${totQ} верно</div>
        </div>
        <div class="res-meta">
          <div class="res-verdict ${level.c}">${level.t}</div>
          <div class="res-cover">пройдено тестов: <b>${taken.length}/${course.tests.length}</b> · охват ${cover}%</div>
          <div class="res-note">Показаны лучшие результаты по каждому тесту. ${api.isAuthed
            ? 'Хранятся в аккаунте и подтянутся на любом устройстве.'
            : 'Пока хранятся в этом браузере — войдёшь по своей ссылке, и они уедут в аккаунт.'}
            Покажи этот экран мне — разберу слабые места точечно.</div>
        </div>
      </div>
      <div class="res-list">${course.tests.map(row).join('')}</div>
      <footer class="site">${course.brand.name}${course.brand.suffix} ·
        <a href="#/tests" style="color:var(--c-purple)">← ко всем тестам</a>
      </footer>
    </section>`;

  bindNav(app);
  setKeys(null);
}
