/* ============================================================
   ALGORITHM — клинический алгоритм как дерево решений.

   Два режима, и это принципиально:
     «по шагам» — один вопрос за раз, как у постели больного;
     «вся карта» — то же дерево целиком, как разворот в книге.
   Первый учит думать, второй — вспоминать. Картинку из PDF
   не показываем: на телефоне она нечитаема, а тут дерево живое.
   ============================================================ */
import { icon } from '../ui/icons.js';

const KIND = {
  root:    'старт',
  finding: 'признак',
  test:    'исследование',
  dx:      'диагноз',
  tx:      'лечение',
  ref:     'дальше',
};

const nodeById = (algo, id) => algo.nodes.find(n => n.id === id) || null;
const isEnd = node => !(node.next || []).length;

function sourceHTML(algo, ctx) {
  const src = algo.source;
  if (!src) return '';
  const book = ctx?.bookName?.(src.book) || src.book;
  return `<div class="algo-src">источник: ${book}, стр. ${src.page}</div>`;
}

export function algorithmHTML(algo, ctx) {
  return `
    <div class="fade-seq algo" data-algo="${algo.id}">
      <div class="algo-top">
        <div class="algo-en">${algo.titleEn || algo.title}</div>
        <div class="segmented algo-modes" role="tablist">
          <button type="button" role="tab" data-mode="walk" class="is-active" aria-selected="true">по шагам</button>
          <button type="button" role="tab" data-mode="map" aria-selected="false">вся карта</button>
        </div>
      </div>
      ${algo.lede ? `<p class="body algo-lede">${algo.lede}</p>` : ''}
      <div class="algo-body"></div>
      ${sourceHTML(algo, ctx)}
    </div>`;
}

/* --- режим «по шагам» --- */

function nodeCardHTML(algo, node, { current = true } = {}) {
  const note = node.note ? algo.notes?.[node.note] : '';
  return `
    <div class="algo-node is-${node.kind}${current ? ' is-current' : ''}">
      <span class="algo-kind">${KIND[node.kind] || node.kind}</span>
      <div class="algo-label">${node.label}</div>
      ${node.labelEn ? `<div class="algo-en">${node.labelEn}</div>` : ''}
      ${node.why ? `<p class="algo-why">${node.why}</p>` : ''}
      ${note ? `<p class="algo-note">${note}</p>` : ''}
    </div>`;
}

function walkHTML(algo, path) {
  const node = nodeById(algo, path[path.length - 1]);
  if (!node) return '';

  /* пройденный путь — он же способ вернуться и переиграть развилку */
  const trail = path.slice(0, -1).map((id, i) => {
    const passed = nodeById(algo, id);
    return `<button type="button" class="algo-crumb" data-back="${i}">${passed.label}</button>`;
  }).join(`<span class="algo-crumb-sep">${icon('chevron-right')}</span>`);

  const branches = node.next || [];
  let tail = '';

  if (isEnd(node)) {
    tail = `
      <div class="algo-end">
        <span>${node.kind === 'tx' ? 'Дошли до лечения' : node.kind === 'ref'
          ? 'Дальше — другой алгоритм' : 'Дошли до диагноза'}</span>
        <button type="button" class="btn btn-secondary" data-restart>Пройти заново</button>
      </div>`;
  } else if (branches.length === 1) {
    const only = branches[0];
    tail = `<div class="algo-branches">
      <button type="button" class="algo-branch is-only" data-to="${only.to}">
        <b>${only.label || 'дальше'}</b>${only.labelEn ? `<small>${only.labelEn}</small>` : ''}
      </button></div>`;
  } else {
    tail = `
      ${node.ask ? `<div class="algo-ask">${node.ask}</div>` : ''}
      <div class="algo-branches">
        ${branches.map(b => `<button type="button" class="algo-branch" data-to="${b.to}">
          <b>${b.label || nodeById(algo, b.to)?.label || '—'}</b>
          ${b.labelEn ? `<small>${b.labelEn}</small>` : ''}
        </button>`).join('')}
      </div>`;
  }

  return `
    ${trail ? `<div class="algo-path">${trail}</div>` : ''}
    ${nodeCardHTML(algo, node)}
    ${tail}`;
}

/* --- режим «вся карта» --- */

function mapHTML(algo) {
  const seen = new Set();

  const branch = (id, edgeLabel, depth) => {
    const node = nodeById(algo, id);
    if (!node) return '';
    /* узлы-исходы (постоянный ЭКС, «лечить причину») собирают на себя много веток;
       второй раз показываем ссылкой, иначе карта раздувается копиями */
    const repeat = seen.has(id);
    seen.add(id);

    /* подпись ветки, повторяющая узел, в который ведёт, — шум:
       в книге это одна стрелка, а не два одинаковых прямоугольника */
    const same = (edgeLabel || '').trim().toLowerCase() === node.label.trim().toLowerCase();

    return `
      <li class="algo-map-row" style="--depth:${depth}">
        ${edgeLabel && !same ? `<span class="algo-map-edge">${edgeLabel}</span>` : ''}
        <span class="algo-map-node is-${node.kind}${repeat ? ' is-repeat' : ''}">
          <b>${node.label}</b>
          ${node.labelEn ? `<i>${node.labelEn}</i>` : ''}
          ${repeat ? '<em>— уже был выше</em>' : ''}
        </span>
        ${!repeat && (node.next || []).length
          ? `<ul>${node.next.map(e => branch(e.to, e.label, depth + 1)).join('')}</ul>`
          : ''}
      </li>`;
  };

  return `<ul class="algo-map">${branch(algo.start, '', 0)}</ul>`;
}

export function bindAlgorithm(root, algo) {
  const shell = root.querySelector('[data-algo]');
  if (!shell) return;
  const body = shell.querySelector('.algo-body');
  let path = [algo.start];
  let mode = 'walk';

  function paint() {
    body.innerHTML = mode === 'walk' ? walkHTML(algo, path) : mapHTML(algo);

    body.querySelectorAll('[data-to]').forEach(btn =>
      btn.addEventListener('click', () => { path.push(btn.dataset.to); paint(); }));

    body.querySelectorAll('[data-back]').forEach(btn =>
      btn.addEventListener('click', () => { path = path.slice(0, +btn.dataset.back + 1); paint(); }));

    body.querySelector('[data-restart]')?.addEventListener('click', () => {
      path = [algo.start];
      paint();
    });
  }

  shell.querySelectorAll('[data-mode]').forEach(btn =>
    btn.addEventListener('click', () => {
      mode = btn.dataset.mode;
      shell.querySelectorAll('[data-mode]').forEach(b => {
        const on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', String(on));
      });
      paint();
    }));

  paint();
}
