/* ============================================================
   STEPS — рендер одного шага урока и его поведение.
   Типы шагов — контракт между контентом и движком:
     concept · formula · tabs · examples · vs · markers
     mistake · scale · produce · note · quiz · algorithm
     table (сравнение в столбцах) · terms (термины темы)
     drill (микро-упражнение: задание → разбор)
   ============================================================ */
import { timeline } from './timeline.js';
import { algorithmHTML, bindAlgorithm } from './algorithm.js';

/* Ссылка на учебник у шага-выжимки. Пишем печатный номер страницы —
   тот, что человек увидит, открыв книгу: выжимке надо верить, а для
   этого её должно быть можно перепроверить за десять секунд. */
function sourceLine(s, ctx) {
  if (!s.src) return '';
  const book = ctx?.bookName?.(s.src.book) || s.src.book;
  return `<div class="step-src">${book}, стр. ${s.src.page}</div>`;
}

export function renderStep(step, ctx) {
  return stepBody(step, ctx) + sourceLine(step, ctx);
}

function stepBody(step, ctx) {
  const s = step;
  const tl = t => timeline(t, {
    color: ctx.color, ink: ctx.ink, colorOf: ctx.colorOf, inkOf: ctx.inkOf, labels: ctx.labels,
  });

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
        <div class="formulas">
          ${s.rows.map(r => `<div class="formula">
            <span class="lbl-l">${r.label}</span><span class="op">→</span><span>${r.html}</span>
          </div>`).join('')}
        </div>
      </div>`;

    case 'tabs': return `
      <div class="fade-seq" style="text-align:center">
        ${s.title ? `<div class="stitle">${s.title}</div>` : ''}
        <div class="tabbar" role="tablist">${s.tabs.map((t, i) =>
          `<button type="button" role="tab" aria-selected="${i === 0}" data-tab="${i}"
            class="${i === 0 ? 'is-active' : ''}">${t.label}</button>`).join('')}</div>
        <div class="tab-body">
          ${s.tabs.map((t, i) => `<div class="tab-panel" data-panel="${i}" ${i ? 'hidden' : ''}>
            <div class="en">${t.html}</div>${t.ru ? `<div class="ru">${t.ru}</div>` : ''}</div>`).join('')}
        </div>
      </div>`;

    /* подсказка «нажми — перевод» одна на список, а не на каждой карточке */
    case 'examples': return `
      <div class="fade-seq">
        ${s.title ? `<div class="stitle" style="text-align:center">${s.title}</div>` : ''}
        <div class="ex-hint">нажми на пример — покажу перевод</div>
        <div class="ex-list">
          ${s.items.map(it => `<div class="rev" tabindex="0" role="button">
            <div class="en">${it.en}</div><div class="ru">${it.ru}</div></div>`).join('')}
        </div>
      </div>`;

    case 'vs': return `
      <div class="fade-seq">
        <div class="vs">
          <div class="vs-card is-alt"><div class="tg">${s.left.tag}</div>
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
        <div class="ex-hint">нажми на карточку — покажу ответ</div>
        <div class="ex-list">
          ${s.items.map(it => `<div class="rev" tabindex="0" role="button">
            <div class="prompt">${it.ru}</div>
            <div class="answer">${it.en}</div>${it.tip ? `<div class="tip-line">${it.tip}</div>` : ''}</div>`).join('')}
        </div>
      </div>`;

    case 'note':
      return `<div class="fade-seq"><div class="callout ${s.warn ? 'callout-warn' : ''}">${s.html}</div></div>`;

    case 'algorithm': return algorithmHTML(s.algorithm, ctx);

    /* Сравнение в столбцах — основная форма First Aid: три похожих
       состояния и строки-признаки, по которым они расходятся.
       Первый столбец липкий: на телефоне таблица уезжает вбок,
       и без него непонятно, чей это признак. */
    case 'table': return `
      <div class="fade-seq">
        ${s.title ? `<div class="stitle">${s.title}</div>` : ''}
        ${s.lede ? `<p class="body">${s.lede}</p>` : ''}
        <div class="dtable-scroll">
          <table class="dtable">
            <thead><tr><th></th>${s.cols.map(c => `<th>${c}</th>`).join('')}</tr></thead>
            <tbody>${s.rows.map(r => `<tr>
              <th scope="row">${r.label}</th>
              ${r.cells.map(cell => `<td>${cell}</td>`).join('')}
            </tr>`).join('')}</tbody>
          </table>
        </div>
        ${s.note ? `<p class="dtable-note">${s.note}</p>` : ''}
      </div>`;

    /* Термины: английское слово — главное, оно же будет на экзамене */
    case 'terms': return `
      <div class="fade-seq">
        ${s.title ? `<div class="stitle">${s.title}</div>` : ''}
        <div class="terms">
          ${s.items.map(t => `<div class="term">
            <div class="term-en">${t.en}</div>
            <div class="term-ru">${t.ru}</div>
            ${t.hint ? `<div class="term-hint">${t.hint}</div>` : ''}
          </div>`).join('')}
        </div>
      </div>`;

    /* Микро-упражнение. Полного экзаменационного задания здесь нет намеренно:
       сорок вопросов за час тренируют выносливость, а приём ставится на одном
       предложении — там видно, что именно ты сделал и почему это сработало.
       Ответ спрятан до нажатия: подглядев его сразу, упражнение не делают. */
    case 'drill': return `
      <div class="fade-seq">
        ${s.title ? `<div class="stitle">${s.title}</div>` : ''}
        ${s.task ? `<p class="drill-task">${s.task}</p>` : ''}
        <div class="ex-hint">нажми на карточку — покажу разбор</div>
        <div class="ex-list">
          ${s.items.map(it => `<div class="rev is-drill" tabindex="0" role="button">
            ${it.label ? `<div class="drill-label">${it.label}</div>` : ''}
            <div class="drill-q">${it.q}</div>
            <div class="answer">${it.a}</div>
            ${it.why ? `<div class="tip-line">${it.why}</div>` : ''}
          </div>`).join('')}
        </div>
      </div>`;

    case 'quiz': return `
      <div class="fade-seq quiz">
        <div class="q-type">проверь себя</div>
        <div class="q">${s.q}</div>
        <div class="opts">${s.options.map((o, i) => `<button type="button" class="opt" data-i="${i}">${o}</button>`).join('')}</div>
        <div class="explain">${s.explain || ''}${s.ru ? `<span class="ru">${s.ru}</span>` : ''}</div>
      </div>`;

    default:
      return '';
  }
}

export function bindStep(root, s) {
  if (s.type === 'algorithm') bindAlgorithm(root, s.algorithm);

  if (s.type === 'tabs') {
    const btns = root.querySelectorAll('[data-tab]');
    btns.forEach(b => b.addEventListener('click', () => {
      btns.forEach(x => { x.classList.remove('is-active'); x.setAttribute('aria-selected', 'false'); });
      b.classList.add('is-active');
      b.setAttribute('aria-selected', 'true');
      root.querySelectorAll('[data-panel]').forEach(p => { p.hidden = p.dataset.panel !== b.dataset.tab; });
    }));
  }

  if (s.type === 'examples' || s.type === 'produce' || s.type === 'drill') {
    root.querySelectorAll('.rev').forEach(r => {
      const toggle = () => r.classList.toggle('is-open');
      r.addEventListener('click', toggle);
      r.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
      });
    });
  }

  if (s.type === 'quiz') {
    const opts = root.querySelectorAll('.opt');
    opts.forEach(o => o.addEventListener('click', () => {
      const i = +o.dataset.i;
      opts.forEach(x => { x.disabled = true; });
      if (i === s.answer) o.classList.add('is-correct');
      else { o.classList.add('is-wrong'); opts[s.answer].classList.add('is-correct'); }
      root.querySelector('.explain').classList.add('is-shown');
    }));
  }
}
