/* ============================================================
   EXPLORER — интерактивная карта (для en-ru это карта времён).
   Данные целиком приходят из курса; курс без explorer просто
   не получает эту секцию.

   Устройство: слева строки аспектов, справа ось времени с «почерком»
   выбранного. Одна карточка, а не две отдельные картинки — иначе
   не читается, что строка и ось это одно и то же.
   ============================================================ */
import { timeline, centerTimelines } from './timeline.js';
import { icon } from '../ui/icons.js';

export function explorerHTML(course) {
  const ex = course.explorer;
  if (!ex) return '';
  return `
    <section class="section wrap">
      <p class="eyebrow">${ex.eyebrow}</p>
      <h2 style="margin-bottom:6px">${ex.title}</h2>
      <p class="lede" style="margin:0 0 var(--s-5)">${ex.lede}</p>

      <div class="explorer" id="explorer">
        <div class="explorer-head">
          <div class="segmented" id="tenseSwitch" role="tablist" aria-label="Время">
            ${ex.nodes.map((n, i) => `<button type="button" role="tab" data-t="${n.key}"
              aria-selected="${i === 0}" class="${i === 0 ? 'is-active' : ''}">${n.label}</button>`).join('')}
          </div>
          <div class="caption" id="tenseHint"></div>
        </div>

        <div class="aspect-rows" id="aspectRows"></div>

        <div class="explorer-map">
          <div id="mapTimeline"></div>
          <div class="explorer-caption" id="mapCaption"></div>
        </div>
      </div>
    </section>`;
}

export function bindExplorer(root, course) {
  const ex = course.explorer;
  if (!ex) return;

  const rows = root.querySelector('#aspectRows');
  const tl = root.querySelector('#mapTimeline');
  const caption = root.querySelector('#mapCaption');
  const hint = root.querySelector('#tenseHint');
  const explorer = root.querySelector('#explorer');
  const btns = [...root.querySelectorAll('#tenseSwitch button')];

  let currentAspect = ex.nodes[0].rows[1]?.k || ex.nodes[0].rows[0].k;

  function showSignature(tenseKey, aspectKey) {
    currentAspect = aspectKey;
    const node = ex.nodes.find(n => n.key === tenseKey);
    const row = node.rows.find(r => r.k === aspectKey);

    explorer.style.setProperty('--accent', course.colorOf(aspectKey));
    tl.innerHTML = timeline(ex.signature(tenseKey, aspectKey), {
      color: course.colorOf(aspectKey),
      colorOf: k => course.colorOf(k),
      labels: course.timeline,
    });
    centerTimelines(tl);

    /* подпись под осью объясняет, что именно нарисовано */
    caption.innerHTML = `<b>${node.label} ${row.tag}</b> — ${row.hint}`;
    rows.querySelectorAll('.aspect-row').forEach(r =>
      r.classList.toggle('is-active', r.dataset.aspect === aspectKey));
  }

  function paint(tenseKey) {
    const node = ex.nodes.find(x => x.key === tenseKey);
    hint.textContent = `${node.label} · выбери аспект — ось перерисуется`;

    rows.innerHTML = node.rows.map(r => `
      <div class="aspect-row" data-aspect="${r.k}" role="button" tabindex="0"
        style="--accent:${course.colorOf(r.k)}">
        <div class="aspect-tag"><span class="bead"></span> ${r.tag}</div>
        <div class="form">${r.form}</div>
        <div class="hint">${r.hint}</div>
        ${r.lesson
          ? `<a class="row-open btn btn-secondary" href="#/lesson/${r.lesson}">урок ${icon('chevron-right')}</a>`
          : '<span class="row-soon">скоро</span>'}
      </div>`).join('');

    rows.querySelectorAll('[data-aspect]').forEach(row => {
      const pick = () => showSignature(tenseKey, row.dataset.aspect);
      row.addEventListener('click', pick);
      row.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); }
      });
    });
    rows.querySelectorAll('.row-open').forEach(a => a.addEventListener('click', e => e.stopPropagation()));

    btns.forEach(b => {
      const on = b.dataset.t === tenseKey;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', String(on));
    });
    showSignature(tenseKey, currentAspect);
  }

  btns.forEach(b => b.addEventListener('click', () => paint(b.dataset.t)));
  paint(ex.nodes[0].key);
}
