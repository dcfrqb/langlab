/* ============================================================
   RESULTS — сводка лучших баллов.
   ============================================================ */
import { navHTML, bindNav } from '../nav.js';
import { api } from '../api.js';
import { store } from '../storage.js';
import { review } from '../review.js';
import { rhythmHTML } from '../rhythm.js';
import { answerText } from '../quiz.js';
import { setKeys } from '../keys.js';
import { icon } from '../../ui/icons.js';

/* ------------------------------------------------------------
   ЖУРНАЛ ОШИБОК

   Раньше он вёлся руками: «предлоги — 4 повтора» было посчитано
   глазами по тетради устной практики и вписано в комментарий к
   пачке вопросов. Теперь это просто сумма промахов по зоне —
   считается из тех же записей, на которых стоят повторения.

   Зона — метка вопроса (`tag`), а где меток нет — его группа (`g`).
   Человеческое имя метке даёт курс (`zones` в манифесте).
   ------------------------------------------------------------ */
function journalHTML(course) {
  if (!course.questions?.length) return '';
  const j = review.journal(course);

  if (!j.answered) {
    return `
      <div class="lv-block">
        <p class="eyebrow">журнал ошибок</p>
        <div class="empty" style="padding:var(--s-5) 0">
          <div class="empty-note">Здесь появятся зоны, в которых ты промахиваешься,
            и сами вопросы — по мере того как будешь отвечать. Ничего вписывать
            руками не нужно: журнал считается сам.</div>
          <a class="btn btn-primary" href="#/today">Доза дня ${icon('chevron-right')}</a>
        </div>
      </div>`;
  }

  const zones = j.zones.length ? `
    <div class="lv-bars">
      ${j.zones.map(z => {
        const pct = Math.round(z.missed / z.seen * 100);
        const tone = pct >= 40 ? 'is-bad' : pct >= 20 ? 'is-ok' : 'is-good';
        return `
          <div class="lv-bar">
            <div class="lv-bar-head">
              <span class="lv-bar-name">${z.zone}</span>
              <span class="lv-bar-val ${tone}">${z.missed}/${z.seen} мимо</span>
            </div>
            <span class="bar"><i class="${tone}" style="width:${pct}%"></i></span>
          </div>`;
      }).join('')}
    </div>` : '<p class="res-note">Промахов пока нет ни в одной зоне.</p>';

  const worst = j.worst.length ? `
    <p class="eyebrow" style="margin:var(--s-6) 0 10px">чаще всего мимо</p>
    <div class="review">
      ${j.worst.map(({ q, missed, seen }) => `
        <div class="rev-item">
          <div class="rev-q">${q.q || q.ru || (q.tokens || []).join(' ')}</div>
          ${q.ru && q.q ? `<div class="rev-ru">${q.ru}</div>` : ''}
          <div class="rev-a">мимо <b class="was">${missed}</b> из ${seen} ·
            правильно: <b class="fix">${answerText(q)}</b></div>
          ${q.why ? `<div class="rev-w">${q.why}</div>` : ''}
        </div>`).join('')}
    </div>` : '';

  return `
    <div class="lv-block">
      <p class="eyebrow">журнал ошибок · ${j.answered} ответов</p>
      ${zones}
      ${worst}
    </div>`;
}

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
        <span class="res-name">${t.title}${t.lvl ? ` <span class="badge badge-soft">${t.lvl}</span>` : ''}</span>
        <span class="bar"><i class="${cls}" style="width:${s ? p : 0}%"></i></span>
        <span class="res-score ${cls}">${s ? `${s.correct}/${s.total}` : '—'}</span>
      </a>`;
  };

  /* те же разделы, что на витрине тестов: список из тридцати строк
     без заголовков перестаёт читаться как карта прогресса */
  let lastSect = null;
  const rowsHTML = course.tests.map(t => {
    const head = t.sect && t.sect !== lastSect
      ? `<div class="eyebrow" style="margin:var(--s-5) 0 10px">${t.sect}</div>` : '';
    lastSect = t.sect || lastSect;
    return head + row(t);
  }).join('');

  app.innerHTML = `
    ${navHTML(course, 'results')}
    <header class="section wrap" style="padding-bottom:var(--s-2)">
      <p class="eyebrow">твой прогресс · лучшие результаты</p>
      <h1>Мои результаты.</h1>
    </header>
    <section class="section wrap" style="padding-top:var(--s-4)">
      ${summary}
      ${course.questions?.length ? `
        <div class="lv-block">
          <p class="eyebrow">ритм · последние две недели</p>
          ${rhythmHTML(course.id)}
          <p class="res-note">Считаются дни, а не серия подряд: пропуск убирает точку
            и ничего не обнуляет. День засчитан с первого ответа —
            порог низкий намеренно, чтобы его можно было взять в плохой день.</p>
        </div>` : ''}
      ${journalHTML(course)}
      <p class="eyebrow" style="margin:var(--s-6) 0 10px">результаты по тестам</p>
      <div class="rows">${rowsHTML}</div>
      <footer class="site">${course.brand.name}${course.brand.suffix} ·
        <a href="#/tests" style="color:var(--c-purple)">← ко всем тестам</a>
      </footer>
    </section>`;

  bindNav(app);
  setKeys(null);
}
