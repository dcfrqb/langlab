/* ============================================================
   RESULTS — сводка лучших баллов.
   ============================================================ */
import { navHTML, bindNav } from '../nav.js';
import { api } from '../api.js';
import { store } from '../storage.js';
import { setKeys } from '../keys.js';
import { icon } from '../../ui/icons.js';

export function renderResults(app, course) {
  const scores = store.scores(course.id);
  const taken = course.tests.filter(t => scores[t.id]);
  const totC = taken.reduce((s, t) => s + scores[t.id].correct, 0);
  const totQ = taken.reduce((s, t) => s + scores[t.id].total, 0);
  const pct = totQ ? Math.round(totC / totQ * 100) : 0;
  const cover = Math.round(taken.length / course.tests.length * 100);

  const level = pct >= 90 ? { t: 'уверенно — ядро закреплено', c: 'is-good' }
    : pct >= 75 ? { t: 'крепко, добить точечно', c: 'is-good' }
    : pct >= 55 ? { t: 'средне — есть над чем работать', c: 'is-ok' }
    : { t: 'фундамент ещё сыпется — перепройти темы', c: 'is-bad' };

  /* пустой экран без выхода — тупик, поэтому здесь сразу зовём в тест */
  const summary = totQ === 0 ? `
    <div class="empty">
      <div class="empty-title">Пока нечего показывать.</div>
      <div class="empty-note">Пройди любой тест — здесь появится счёт по каждой теме,
        охват курса и слабые места, по которым видно, что подтягивать.</div>
      <a class="btn btn-primary" href="#/tests">Выбрать тест ${icon('chevron-right')}</a>
    </div>` : `
    <div class="res-summary">
      <div class="ring ${level.c}">
        <div>
          <div class="ring-num">${pct}<span>%</span></div>
          <div class="ring-sub">${totC}/${totQ} верно</div>
        </div>
      </div>
      <div class="res-meta">
        <div class="res-verdict ${level.c}">${level.t}</div>
        <div class="res-cover">пройдено тестов: <b>${taken.length} из ${course.tests.length}</b> · охват ${cover}%</div>
        <div class="res-note">Показаны лучшие результаты по каждому тесту. ${api.isAuthed
          ? 'Хранятся в аккаунте и подтянутся на любом устройстве.'
          : 'Пока хранятся в этом браузере — войдёшь по своей ссылке, и они уедут в аккаунт.'}
          Покажи этот экран мне — разберу слабые места точечно.</div>
      </div>
    </div>`;

  const row = t => {
    const s = scores[t.id];
    const p = s ? Math.round(s.correct / s.total * 100) : 0;
    const cls = !s ? '' : p >= 90 ? 'is-good' : p >= 60 ? 'is-ok' : 'is-bad';
    return `
      <a class="row" href="#/test/${t.id}" style="--accent:${course.accentFor(t)}">
        <span class="res-name">${t.title}${t.batch === 2 ? ' <span class="badge badge-soft">пачка 2</span>' : ''}</span>
        <span class="bar"><i class="${cls}" style="width:${s ? p : 0}%"></i></span>
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
      ${summary}
      <div class="rows" style="margin-top:var(--s-5)">${course.tests.map(row).join('')}</div>
      <footer class="site">${course.brand.name}${course.brand.suffix} ·
        <a href="#/tests" style="color:var(--c-purple)">← ко всем тестам</a>
      </footer>
    </section>`;

  bindNav(app);
  setKeys(null);
}
