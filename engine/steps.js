/* ============================================================
   STEPS — рендер одного шага урока и его поведение.
   Типы шагов — контракт между контентом и движком:
     concept · formula · tabs · examples · vs · markers
     mistake · scale · produce · note · quiz
   ============================================================ */
import { timeline } from './timeline.js';

export function renderStep(step, ctx) {
  const s = step;
  const tl = t => timeline(t, { color: ctx.color, colorOf: ctx.colorOf, labels: ctx.labels });

  switch (s.type) {
    case 'concept': return `
      <div class="fade-seq">
        ${s.lead ? `<p class="lead">${s.lead}</p>` : ''}
        ${s.text ? `<p class="body">${s.text}</p>` : ''}
        ${s.timeline ? tl(s.timeline) : ''}
      </div>`;

    case 'formula': return `
      <div class="fade-seq">
        ${s.title ? `<div class="stitle">${s.title}</div>` : ''}
        ${s.rows.map(r => `<div class="formula"><span class="lbl-l">${r.label}</span><span class="op">→</span>${r.html}</div>`).join('')}
      </div>`;

    case 'tabs': return `
      <div class="fade-seq" style="text-align:center">
        ${s.title ? `<div class="stitle">${s.title}</div>` : ''}
        <div class="tabbar">${s.tabs.map((t, i) =>
          `<button type="button" data-tab="${i}" class="${i === 0 ? 'active' : ''}">${t.label}</button>`).join('')}</div>
        <div class="tab-body">
          ${s.tabs.map((t, i) => `<div class="tab-panel" data-panel="${i}" ${i ? 'hidden' : ''}>
            <div class="en">${t.html}</div>${t.ru ? `<div class="ru">${t.ru}</div>` : ''}</div>`).join('')}
        </div>
      </div>`;

    case 'examples': return `
      <div class="fade-seq">
        ${s.title ? `<div class="stitle" style="text-align:center">${s.title}</div>` : ''}
        <div class="ex-list">
          ${s.items.map(it => `<div class="rev"><div class="en">${it.en}</div>
            <div class="ru">${it.ru}</div><div class="tap">нажми — перевод</div></div>`).join('')}
        </div>
      </div>`;

    case 'vs': return `
      <div class="fade-seq">
        <div class="vs">
          <div class="vs-card"><div class="tg" style="color:var(--text-dim)">${s.left.tag}</div>
            <div class="en">${s.left.en}</div><div class="ru">${s.left.ru}</div></div>
          <div class="vs-card"><div class="tg">${s.right.tag}</div>
            <div class="en">${s.right.en}</div><div class="ru">${s.right.ru}</div></div>
        </div>
      </div>`;

    case 'markers': return `
      <div class="fade-seq" style="text-align:center">
        ${s.title ? `<div class="stitle">${s.title}</div>` : ''}
        <div class="chips" style="justify-content:center">
          ${s.chips.map(ch => `<span class="chip">${ch.w}<small>${ch.ru}</small></span>`).join('')}
        </div>
      </div>`;

    case 'mistake': return `
      <div class="fade-seq">
        <div class="stitle" style="text-align:center">частые ошибки</div>
        <div class="mistake">
          ${s.pairs.map(p => `<div><div class="mrow"><span class="bad">${p.bad}</span><span class="good">${p.good}</span></div>
            ${p.why ? `<div class="why">${p.why}</div>` : ''}</div>`).join('')}
        </div>
      </div>`;

    case 'scale': return `
      <div class="fade-seq">
        ${s.title ? `<div class="stitle" style="text-align:center">${s.title}</div>` : ''}
        <div class="scale" style="margin:0 auto">
          ${s.rows.map(r => `<div class="scale-row ${r.kind || ''}"><span class="delta">${r.d}</span>
            <span class="en">${r.en}</span><span class="ru">${r.ru}</span></div>`).join('')}
        </div>
      </div>`;

    case 'produce': return `
      <div class="fade-seq">
        <div class="stitle" style="text-align:center">${s.title || 'скажи вслух — потом проверь'}</div>
        <div class="ex-list">
          ${s.items.map(it => `<div class="rev produce"><div class="prompt">${it.ru}</div>
            <div class="answer">${it.en}</div>${it.tip ? `<div class="tip-line">${it.tip}</div>` : ''}
            <div class="tap">нажми — проверь себя</div></div>`).join('')}
        </div>
      </div>`;

    case 'note':
      return `<div class="fade-seq"><div class="note ${s.warn ? 'warn' : ''}">${s.html}</div></div>`;

    case 'quiz': return `
      <div class="fade-seq quiz">
        <div class="q">${s.q}</div>
        <div class="opts">${s.options.map((o, i) => `<button type="button" class="opt" data-i="${i}">${o}</button>`).join('')}</div>
        <div class="explain">${s.explain || ''}${s.ru ? `<span class="ru">${s.ru}</span>` : ''}</div>
      </div>`;

    default:
      return '';
  }
}

export function bindStep(root, s) {
  if (s.type === 'tabs') {
    const btns = root.querySelectorAll('[data-tab]');
    btns.forEach(b => b.addEventListener('click', () => {
      btns.forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      root.querySelectorAll('[data-panel]').forEach(p => { p.hidden = p.dataset.panel !== b.dataset.tab; });
    }));
  }

  if (s.type === 'examples' || s.type === 'produce') {
    root.querySelectorAll('.rev').forEach(r => r.addEventListener('click', () => r.classList.toggle('open')));
  }

  if (s.type === 'quiz') {
    const opts = root.querySelectorAll('.opt');
    opts.forEach(o => o.addEventListener('click', () => {
      const i = +o.dataset.i;
      opts.forEach(x => { x.disabled = true; });
      if (i === s.answer) o.classList.add('correct');
      else { o.classList.add('wrong'); opts[s.answer].classList.add('correct'); }
      root.querySelector('.explain').classList.add('show');
    }));
  }
}
