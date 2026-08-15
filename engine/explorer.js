/* ============================================================
   EXPLORER — интерактивная карта (для en-ru это карта времён).
   Данные целиком приходят из курса; курс без explorer просто
   не получает эту секцию.
   ============================================================ */
import { timeline, centerTimelines } from './timeline.js';

export function explorerHTML(course) {
  const ex = course.explorer;
  if (!ex) return '';
  return `
    <section class="section wrap">
      <p class="eyebrow">${ex.eyebrow}</p>
      <h2 style="margin-bottom:6px">${ex.title}</h2>
      <p class="lede" style="margin:0 0 22px">${ex.lede}</p>
      <div class="scroll-x"><div class="tense-switch" id="tenseSwitch">
        ${ex.nodes.map((n, i) =>
          `<button type="button" data-t="${n.key}" class="${i === 0 ? 'active' : ''}">${n.label}</button>`).join('')}
      </div></div>
      <div id="mapTimeline"></div>
      <div class="tree-group" style="margin-top:var(--s-5)">
        <div class="tense-node" id="tenseNode">${ex.nodes[0].label}</div>
        <svg class="tree-connectors" viewBox="0 0 148 360" fill="none" xmlns="http://www.w3.org/2000/svg">
          ${ex.nodes[0].rows.map((r, i) =>
            `<path d="M0 180 C 74 180, 74 ${45 + i * 90}, 148 ${45 + i * 90}" stroke="${course.colorOf(r.k)}" stroke-width="1.5"/>`).join('')}
        </svg>
        <div class="aspect-rows fade-seq" id="aspectRows"></div>
      </div>
    </section>`;
}

export function bindExplorer(root, course) {
  const ex = course.explorer;
  if (!ex) return;

  const node = root.querySelector('#tenseNode');
  const rows = root.querySelector('#aspectRows');
  const tl = root.querySelector('#mapTimeline');
  const btns = [...root.querySelectorAll('#tenseSwitch button')];

  let currentAspect = ex.nodes[0].rows[1]?.k || ex.nodes[0].rows[0].k;

  function showSignature(tenseKey, aspectKey) {
    currentAspect = aspectKey;
    tl.innerHTML = timeline(ex.signature(tenseKey, aspectKey), {
      color: course.colorOf(aspectKey),
      colorOf: k => course.colorOf(k),
      labels: course.timeline,
    });
    centerTimelines(tl);
    rows.querySelectorAll('.aspect-row').forEach(r =>
      r.classList.toggle('active', r.dataset.aspect === aspectKey));
  }

  function paint(tenseKey) {
    const n = ex.nodes.find(x => x.key === tenseKey);
    node.textContent = n.label;
    node.style.borderColor = n.tint || '';
    rows.innerHTML = n.rows.map(r => `
      <div class="aspect-row" data-aspect="${r.k}" style="--accent:${course.colorOf(r.k)}">
        <div class="aspect-tag"><span class="bead"></span> ${r.tag}</div>
        <div class="form">${r.form}</div>
        <div class="hint">${r.hint}</div>
        ${r.lesson ? `<button class="row-open" type="button" data-open="${r.lesson}">урок ›</button>`
                   : '<span class="row-soon">скоро</span>'}
      </div>`).join('');

    rows.querySelectorAll('[data-aspect]').forEach(row =>
      row.addEventListener('click', () => showSignature(tenseKey, row.dataset.aspect)));
    rows.querySelectorAll('[data-open]').forEach(b =>
      b.addEventListener('click', e => {
        e.stopPropagation();
        location.hash = '#/lesson/' + b.dataset.open;
      }));

    btns.forEach(b => b.classList.toggle('active', b.dataset.t === tenseKey));
    showSignature(tenseKey, currentAspect);
  }

  btns.forEach(b => b.addEventListener('click', () => paint(b.dataset.t)));
  paint(ex.nodes[0].key);
}
