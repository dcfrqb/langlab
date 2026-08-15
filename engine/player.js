/* ============================================================
   PLAYER — проигрыватель урока: колода шагов, прогресс, навигация.
   Клавиши ← → Esc на десктопе, свайпы на телефоне.
   ============================================================ */
import { renderStep, bindStep } from './steps.js';
import { centerTimelines } from './timeline.js';
import { railHTML, bindRail } from './rail.js';
import { store } from './storage.js';
import { setKeys } from './keys.js';

export function renderPlayer(app, course, lesson) {
  const total = lesson.steps.length;
  const accent = course.accentFor(lesson);
  let idx = 0;
  let dir = 'fwd';

  app.innerHTML = `
    <div class="player wrap" style="--accent:${accent}">
      <div class="player-top">
        <button class="back-btn" id="back" type="button" title="Все темы" aria-label="Все темы">‹</button>
        <div style="flex:1;min-width:0">${railHTML(course, lesson.id)}</div>
      </div>
      <div class="deck-head">
        <span class="pill">${course.labelOf(lesson.aspect)} <span class="num">· ${lesson.n}/${course.lessonCount}</span></span>
        <h1>${lesson.title}</h1>
        <div class="lesson-sub">${lesson.subtitle}</div>
      </div>
      <div class="stage" id="stage"></div>
      <div class="controls">
        <button class="nav-btn" id="prev" type="button">‹ Назад</button>
        <button class="nav-btn primary" id="next" type="button">Дальше ›</button>
      </div>
      <div class="step-dots" id="dots"></div>
      <div class="khint">← → стрелки · Esc — выход</div>
    </div>`;

  const stage = app.querySelector('#stage');
  const prevBtn = app.querySelector('#prev');
  const nextBtn = app.querySelector('#next');
  const dots = app.querySelector('#dots');

  const ctx = {
    color: accent,
    colorOf: key => course.colorOf(key),
    labels: course.timeline,
  };

  function paintDots() {
    dots.innerHTML = lesson.steps.map((_, i) =>
      `<i class="${i === idx ? 'on' : (i < idx ? 'done' : '')}" data-d="${i}"></i>`).join('');
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

    prevBtn.disabled = idx === 0;
    nextBtn.textContent = idx === total - 1 ? 'Готово ✓' : 'Дальше ›';
    paintDots();
    if (idx === total - 1) store.markLessonDone(course.id, lesson.id);
  }

  function go(i) {
    if (i >= total) { location.hash = '#/'; return; }   // конец урока → на главную
    if (i < 0) return;
    dir = i > idx ? 'fwd' : 'back';
    idx = i;
    drawStep();
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
