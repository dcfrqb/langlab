/* ============================================================
   PLAYER — проигрыватель урока: колода шагов, прогресс, навигация.
   Клавиши ← → Esc на десктопе, свайпы на телефоне.
   ============================================================ */
import { renderStep, bindStep } from './steps.js';
import { centerTimelines } from './timeline.js';
import { railHTML, bindRail } from './rail.js';
import { store } from './storage.js';
import { setKeys } from './keys.js';
import { icon } from '../ui/icons.js';

export function renderPlayer(app, course, lesson) {
  const total = lesson.steps.length;
  const accent = course.accentFor(lesson);
  let idx = 0;
  let dir = 'fwd';

  app.innerHTML = `
    <div class="player wrap" id="player" style="--accent:${accent}">
      <div class="player-top">
        <button class="btn btn-secondary btn-icon" id="back" type="button"
          title="Все темы" aria-label="Все темы">${icon('chevron-left')}</button>
        <div style="flex:1;min-width:0">${railHTML(course, lesson.id)}</div>
      </div>
      <div class="deck-head">
        <span class="pill">${course.labelOf(lesson.aspect)} <span class="num">· ${lesson.n}/${course.lessonCount}</span></span>
        <h1>${lesson.title}</h1>
        <div class="lesson-sub">${lesson.subtitle}</div>
      </div>
      <div class="stage" id="stage"></div>
      <div class="controls">
        <button class="btn btn-secondary" id="prev" type="button">${icon('chevron-left')} Назад</button>
        <button class="btn btn-primary" id="next" type="button">Дальше ${icon('chevron-right')}</button>
      </div>
      <div class="step-meta">
        <span id="stepNum"></span>
        <span class="dots" id="dots"></span>
        <span class="khint">← → листать · Esc — выход</span>
      </div>
    </div>`;

  const player = app.querySelector('#player');
  const stage = app.querySelector('#stage');
  const prevBtn = app.querySelector('#prev');
  const nextBtn = app.querySelector('#next');
  const dots = app.querySelector('#dots');
  const stepNum = app.querySelector('#stepNum');

  const ctx = {
    color: accent,
    ink: course.inkFor(lesson),
    colorOf: key => course.colorOf(key),
    inkOf: key => course.inkOf(key),
    labels: course.timeline,
  };

  function paintMeta() {
    stepNum.textContent = `шаг ${idx + 1} из ${total}`;
    dots.innerHTML = lesson.steps.map((_, i) =>
      `<i class="${i === idx ? 'is-here' : (i < idx ? 'is-done' : '')}" data-d="${i}"
        title="шаг ${i + 1}"></i>`).join('');
    dots.querySelectorAll('[data-d]').forEach(d =>
      d.addEventListener('click', () => go(+d.dataset.d)));
  }

  function drawStep() {
    const s = lesson.steps[idx];
    const div = document.createElement('div');
    div.className = 'step in' + (dir === 'back' ? ' back' : '');
    div.innerHTML = renderStep(s, ctx);
    stage.replaceChildren(div);
    bindStep(div, s);
    centerTimelines(div);

    /* со второго шага титры урока ужимаются — место отдаём содержанию */
    player.classList.toggle('is-deep', idx > 0);

    prevBtn.disabled = idx === 0;
    nextBtn.innerHTML = idx === total - 1
      ? `Урок пройден ${icon('check')}`
      : `Дальше ${icon('chevron-right')}`;
    paintMeta();
    if (idx === total - 1) store.markLessonDone(course.id, lesson.id);
  }

  function go(i) {
    if (i >= total) return finish();
    if (i < 0) return;
    dir = i > idx ? 'fwd' : 'back';
    idx = i;
    drawStep();
  }

  /* финал урока: подтверждаем, что засчитано, и даём следующий шаг */
  function finish() {
    const next = course.lessons.find(l => l.n === lesson.n + 1);
    player.classList.remove('is-deep');
    app.querySelector('.deck-head').innerHTML = `
      <span class="pill">${icon('check')} засчитано</span>
      <h1>${lesson.title} — пройден</h1>
      <div class="lesson-sub">Отмечен в прогрессе${next ? '. Дальше по курсу — «' + next.title + '»' : ''}.</div>`;
    stage.innerHTML = `
      <div class="fade-seq" style="text-align:center">
        <p class="lede" style="margin:0 auto">Закрепить сразу — самый дешёвый способ не забыть:
          пара минут теста прямо сейчас стоит получаса повторения через неделю.</p>
      </div>`;
    app.querySelector('.controls').innerHTML = `
      <a class="btn btn-secondary" href="#/">К темам</a>
      ${next ? `<a class="btn btn-primary" href="#/lesson/${next.id}">Следующий урок ${icon('chevron-right')}</a>`
             : `<a class="btn btn-primary" href="#/tests">К тестам ${icon('chevron-right')}</a>`}`;
    app.querySelector('.step-meta').innerHTML = `<a class="btn btn-ghost" href="#/tests">проверить себя тестом</a>`;
    window.scrollTo(0, 0);
  }

  prevBtn.addEventListener('click', () => go(idx - 1));
  nextBtn.addEventListener('click', () => go(idx + 1));
  app.querySelector('#back').addEventListener('click', () => { location.hash = '#/'; });
  bindRail(app);

  /* свайп по сцене — основной жест на телефоне */
  let x0 = null, y0 = null;
  stage.addEventListener('touchstart', e => {
    x0 = e.changedTouches[0].clientX;
    y0 = e.changedTouches[0].clientY;
  }, { passive: true });
  stage.addEventListener('touchend', e => {
    if (x0 == null) return;
    const dx = e.changedTouches[0].clientX - x0;
    const dy = e.changedTouches[0].clientY - y0;
    x0 = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.6) go(idx + (dx < 0 ? 1 : -1));
  }, { passive: true });

  setKeys(e => {
    if (e.key === 'ArrowRight') go(idx + 1);
    else if (e.key === 'ArrowLeft') go(idx - 1);
    else if (e.key === 'Escape') location.hash = '#/';
  });

  drawStep();
}
