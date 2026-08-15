/* ============================================================
   QUIZ — движок тестов: 7 типов вопросов, проверка, итог, разбор.
   Типы: choose · gap · form · error · order · mgap · pick
   ============================================================ */
import { store } from './storage.js';
import { setKeys } from './keys.js';

const norm = s => String(s ?? '')
  .toLowerCase().replace(/[’`]/g, "'").replace(/[.,!?;:]+$/g, '')
  .replace(/\s+/g, ' ').trim();

const shuffle = a => {
  const r = a.slice();
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
};

const TYPE_LABEL = {
  choose: 'выбери вариант', gap: 'впиши слово', form: 'форма слова',
  error: 'найди ошибку', order: 'собери предложение', mgap: 'впиши слова',
  pick: 'отметь все верные',
};

export function answerText(q) {
  if (q.type === 'error') return `${q.tokens[q.answer]} → ${q.fix || '—'}`;
  if (q.type === 'choose') return q.options[q.answer];
  if (q.type === 'pick') return q.answers.map(i => q.options[i]).join(', ');
  if (q.type === 'mgap') return q.answer.map(a => a[0]).join(' · ');
  return Array.isArray(q.answer) ? q.answer[0] : q.answer;
}

const promptText = q => q.q || q.ru || (q.tokens ? q.tokens.join(' ') : '');

export function renderTest(app, course, test) {
  const pool = course.poolFor(test);
  const qs = shuffle(pool).slice(0, Math.min(test.pick, pool.length));
  const total = qs.length;
  const accent = course.accentFor(test);
  const results = [];        // { q, correct, given }
  let idx = 0;
  let staged = null;         // ответ до нажатия «Проверить»
  let checked = false;

  app.innerHTML = `
    <div class="player wrap" style="--accent:${accent}">
      <div class="player-top">
        <button class="back-btn" id="back" type="button" title="Все тесты" aria-label="Все тесты">‹</button>
        <div class="t-progress" id="tbar"></div>
      </div>
      <div class="deck-head">
        <span class="pill">${test.mixed ? 'МИКС' : 'ТЕСТ'} <span class="num" id="qnum">· 1/${total}</span></span>
        <h1 style="font-size:clamp(22px,5.4vw,36px)">${test.title}</h1>
      </div>
      <div class="stage" id="stage"></div>
      <div class="controls">
        <button class="nav-btn primary" id="act" type="button" disabled>Проверить</button>
      </div>
      <div class="khint">Enter — проверить / дальше · Esc — выход</div>
    </div>`;

  const stage = app.querySelector('#stage');
  const act = app.querySelector('#act');
  const tbar = app.querySelector('#tbar');
  const qnum = app.querySelector('#qnum');

  function paintBar() {
    tbar.innerHTML = qs.map((_, i) => {
      const r = results[i];
      return `<i class="${r ? (r.correct ? 'ok' : 'no') : (i === idx ? 'cur' : '')}"></i>`;
    }).join('');
  }

  const setAct = (label, on) => { act.textContent = label; act.disabled = !on; };
  const typeTag = q => `<div class="q-type">${TYPE_LABEL[q.type] || ''}</div>`;

  /* ---------- разметка вопроса ---------- */
  function questionBody(q) {
    if (q.type === 'choose') return `
      <div class="fade-seq quiz">
        ${typeTag(q)}
        <div class="q">${q.q}</div>
        <div class="opts">${q.options.map((o, i) => `<button type="button" class="opt" data-i="${i}">${o}</button>`).join('')}</div>
        <div class="explain" id="exp"></div>
      </div>`;

    if (q.type === 'error') return `
      <div class="fade-seq quiz">
        ${typeTag(q)}
        <div class="q" style="font-size:13px;color:var(--text-dim)">${q.ru || ''}</div>
        <div class="err-sent">${q.tokens.map((w, i) => `<button type="button" class="tok" data-i="${i}">${w}</button>`).join(' ')}</div>
        <div class="explain" id="exp"></div>
      </div>`;

    if (q.type === 'gap' || q.type === 'form') return `
      <div class="fade-seq quiz">
        ${typeTag(q)}
        <div class="q">${q.q}</div>
        <div class="gap-wrap"><input class="gap-input" id="gap" type="text" autocomplete="off"
          autocapitalize="off" spellcheck="false" enterkeyhint="done" placeholder="ответ…" /></div>
        <div class="q-ru">${q.ru || ''}</div>
        <div class="explain" id="exp"></div>
      </div>`;

    if (q.type === 'order') return `
      <div class="fade-seq quiz">
        ${typeTag(q)}
        <div class="q">${q.ru || ''}</div>
        <div class="order-line" id="line"><span class="ph">нажимай слова по порядку</span></div>
        <div class="order-bank" id="bank">${shuffle(q.tokens).map((w, i) =>
          `<button type="button" class="tok bank-tok" data-w="${i}">${w}</button>`).join('')}</div>
        <div class="explain" id="exp"></div>
      </div>`;

    if (q.type === 'mgap') {
      const segs = q.q.split('___');
      let sent = '';
      segs.forEach((seg, i) => {
        sent += `<span>${seg}</span>`;
        if (i < segs.length - 1) {
          sent += `<input class="mgap-input" data-b="${i}" type="text" autocomplete="off"
            autocapitalize="off" spellcheck="false" placeholder="…" />`;
        }
      });
      return `
      <div class="fade-seq quiz">
        ${typeTag(q)}
        <div class="mgap-sent">${sent}</div>
        <div class="q-ru">${q.ru || ''}</div>
        <div class="explain" id="exp"></div>
      </div>`;
    }

    if (q.type === 'pick') return `
      <div class="fade-seq quiz">
        ${typeTag(q)}
        <div class="q">${q.q}</div>
        <div class="pick-hint">можно несколько</div>
        <div class="opts">${q.options.map((o, i) => `<button type="button" class="opt" data-i="${i}">${o}</button>`).join('')}</div>
        <div class="explain" id="exp"></div>
      </div>`;

    return '';
  }

  /* ---------- ввод ---------- */
  function bindQuestion(root, q) {
    if (q.type === 'choose' || q.type === 'error') {
      const sel = q.type === 'choose' ? '.opt' : '.tok';
      root.querySelectorAll(sel).forEach(o => o.addEventListener('click', () => {
        if (checked) return;
        root.querySelectorAll(sel).forEach(x => x.classList.remove('sel'));
        o.classList.add('sel');
        staged = +o.dataset.i;
        setAct('Проверить', true);
      }));
    }

    if (q.type === 'gap' || q.type === 'form') {
      const inp = root.querySelector('#gap');
      inp.focus({ preventScroll: true });
      inp.addEventListener('input', () => {
        staged = inp.value;
        setAct('Проверить', inp.value.trim().length > 0);
      });
      inp.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); doAction(); }
      });
    }

    if (q.type === 'order') {
      const line = root.querySelector('#line');
      const bank = root.querySelector('#bank');
      const words = [...bank.querySelectorAll('.bank-tok')].map(b => b.textContent);
      const placed = [];
      const refresh = () => {
        line.innerHTML = placed.length
          ? placed.map((p, i) => `<button type="button" class="tok placed" data-p="${i}">${words[p]}</button>`).join(' ')
          : '<span class="ph">нажимай слова по порядку</span>';
        staged = placed.map(p => words[p]).join(' ');
        setAct('Проверить', placed.length > 0);
        line.querySelectorAll('.placed').forEach(b => b.addEventListener('click', () => {
          if (checked) return;
          const w = placed.splice(+b.dataset.p, 1)[0];
          bank.querySelector(`[data-w="${w}"]`).classList.remove('used');
          refresh();
        }));
      };
      bank.querySelectorAll('.bank-tok').forEach(b => b.addEventListener('click', () => {
        if (checked || b.classList.contains('used')) return;
        b.classList.add('used');
        placed.push(+b.dataset.w);
        refresh();
      }));
      refresh();
    }

    if (q.type === 'mgap') {
      const inputs = [...root.querySelectorAll('.mgap-input')];
      inputs[0]?.focus({ preventScroll: true });
      const sync = () => {
        staged = inputs.map(i => i.value);
        setAct('Проверить', inputs.every(i => i.value.trim().length > 0));
      };
      inputs.forEach(i => {
        i.addEventListener('input', sync);
        i.addEventListener('keydown', e => {
          if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); doAction(); }
        });
      });
    }

    if (q.type === 'pick') {
      const sel = new Set();
      root.querySelectorAll('.opt').forEach(o => o.addEventListener('click', () => {
        if (checked) return;
        const i = +o.dataset.i;
        if (sel.has(i)) { sel.delete(i); o.classList.remove('sel'); }
        else { sel.add(i); o.classList.add('sel'); }
        staged = [...sel];
        setAct('Проверить', sel.size > 0);
      }));
    }
  }

  /* ---------- проверка ---------- */
  function isCorrect(q) {
    if (q.type === 'choose' || q.type === 'error') return staged === q.answer;
    if (q.type === 'gap' || q.type === 'form') {
      const acc = (Array.isArray(q.answer) ? q.answer : [q.answer]).map(norm);
      return acc.includes(norm(staged));
    }
    if (q.type === 'order') return norm(staged) === norm(q.answer);
    if (q.type === 'mgap') return Array.isArray(staged) &&
      q.answer.every((acc, i) => acc.map(norm).includes(norm(staged[i])));
    if (q.type === 'pick') {
      return [...(staged || [])].sort().join(',') === [...q.answers].sort().join(',');
    }
    return false;
  }

  function reveal(q, correct) {
    const root = stage;
    const exp = root.querySelector('#exp');

    if (q.type === 'choose' || q.type === 'error') {
      const items = root.querySelectorAll(q.type === 'choose' ? '.opt' : '.tok');
      items.forEach(x => { x.disabled = true; });
      items[q.answer].classList.add('correct');
      if (!correct && staged != null) items[staged].classList.add('wrong');
    }
    if (q.type === 'gap' || q.type === 'form') {
      const inp = root.querySelector('#gap');
      inp.disabled = true;
      inp.classList.add(correct ? 'ok' : 'no');
    }
    if (q.type === 'order') {
      root.querySelectorAll('.tok').forEach(x => { x.disabled = true; });
      root.querySelector('#line').classList.add(correct ? 'ok' : 'no');
    }
    if (q.type === 'mgap') {
      [...root.querySelectorAll('.mgap-input')].forEach((inp, i) => {
        inp.disabled = true;
        const ok = q.answer[i].map(norm).includes(norm(staged ? staged[i] : ''));
        inp.classList.add(ok ? 'ok' : 'no');
      });
    }
    if (q.type === 'pick') {
      const sel = new Set(staged || []);
      root.querySelectorAll('.opt').forEach((o, i) => {
        o.disabled = true;
        if (q.answers.includes(i)) o.classList.add('correct');
        else if (sel.has(i)) o.classList.add('wrong');
      });
    }

    exp.innerHTML =
      `<div class="verdict ${correct ? 'good' : 'bad'}">${correct ? '✓ верно' : '✕ мимо'}</div>` +
      (!correct ? `<div class="right">правильно: <b>${answerText(q)}</b></div>` : '') +
      (q.why ? `<div class="why-line">${q.why}${q.mine ? ' <span class="mine-tag">твоя ошибка</span>' : ''}</div>` : '');
    exp.classList.add('show');
  }

  function drawQuestion() {
    const q = qs[idx];
    staged = null;
    checked = false;
    qnum.textContent = `· ${idx + 1}/${total}`;
    const div = document.createElement('div');
    div.className = 'step in';
    div.innerHTML = questionBody(q);
    stage.replaceChildren(div);
    bindQuestion(div, q);
    setAct('Проверить', false);
    paintBar();
  }

  function doAction() {
    if (act.disabled) return;
    const q = qs[idx];
    if (!checked) {
      const correct = isCorrect(q);
      results[idx] = { q, correct, given: staged };
      checked = true;
      reveal(q, correct);
      setAct(idx === total - 1 ? 'Итог ›' : 'Дальше ›', true);
      paintBar();
    } else if (idx === total - 1) {
      finish();
    } else {
      idx++;
      drawQuestion();
    }
  }

  function finish() {
    const correct = results.filter(r => r.correct).length;
    const isBest = store.saveScore(course.id, test.id, correct, total);
    const pct = Math.round((correct / total) * 100);
    const wrong = results.filter(r => !r.correct);

    const verdict = pct >= 90 ? { t: 'Отлично — тема закреплена.', c: 'good' }
      : pct >= 70 ? { t: 'Хорошо. Пара мест на докрутку.', c: 'ok' }
      : pct >= 50 ? { t: 'Нормально для тренировки — но есть что подтянуть.', c: 'ok' }
      : { t: 'Тему стоит перепройти и вернуться.', c: 'bad' };

    const review = wrong.length ? `
      <div class="review">
        <div class="stitle" style="text-align:center;margin-bottom:14px">разбор промахов</div>
        ${wrong.map(({ q }) => `<div class="rev-item">
          <div class="rev-q">${promptText(q)}</div>
          <div class="rev-a">правильно: <b>${answerText(q)}</b></div>
          ${q.why ? `<div class="rev-w">${q.why}${q.mine ? ' <span class="mine-tag">твоя ошибка</span>' : ''}</div>` : ''}
        </div>`).join('')}
      </div>` : '<div class="allclear">✓ ни одной ошибки — чисто.</div>';

    app.querySelector('.deck-head').innerHTML = `
      <div class="score-ring ${verdict.c}">
        <div class="score-num">${correct}<span>/${total}</span></div>
        <div class="score-pct">${pct}%</div>
      </div>
      <div class="score-verdict ${verdict.c}">${verdict.t}${isBest ? ' <span class="pb">новый рекорд</span>' : ''}</div>`;
    app.querySelector('.controls').innerHTML = `
      <button class="nav-btn" id="retry" type="button">Пройти заново</button>
      <button class="nav-btn primary" id="tolist" type="button">К тестам ›</button>`;
    stage.innerHTML = review;
    paintBar();

    app.querySelector('#retry').addEventListener('click', () => renderTest(app, course, test));
    app.querySelector('#tolist').addEventListener('click', () => { location.hash = '#/tests'; });
    setKeys(e => { if (e.key === 'Escape') location.hash = '#/tests'; });
    window.scrollTo(0, 0);
  }

  act.addEventListener('click', doAction);
  app.querySelector('#back').addEventListener('click', () => { location.hash = '#/tests'; });
  setKeys(e => {
    if (e.key === 'Enter') doAction();
    else if (e.key === 'Escape') location.hash = '#/tests';
  });

  drawQuestion();
}
