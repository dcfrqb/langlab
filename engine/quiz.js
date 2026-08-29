/* ============================================================
   QUIZ — движок тестов: 7 типов вопросов, проверка, итог, разбор.
   Типы: choose · gap · form · error · order · mgap · pick
   ============================================================ */
import { store } from './storage.js';
import { review } from './review.js';
import { setKeys } from './keys.js';
import { icon } from '../ui/icons.js';

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

/* что за задание и что от тебя хотят — одной строкой, без догадок */
const TYPE = {
  choose: { tag: 'выбери вариант',    how: '' },
  gap:    { tag: 'впиши слово',       how: '' },
  form:   { tag: 'форма слова',       how: 'поставь слово из скобок в нужную форму' },
  error:  { tag: 'найди ошибку',      how: 'нажми на слово, которое написано неверно' },
  order:  { tag: 'собери предложение', how: 'нажимай слова по порядку · перетаскивай, чтобы переставить' },
  mgap:   { tag: 'впиши слова',       how: '' },
  pick:   { tag: 'отметь все верные', how: 'верных вариантов может быть несколько' },
};

export function answerText(q) {
  if (q.type === 'error') return `${q.tokens[q.answer]} → ${q.fix || '—'}`;
  if (q.type === 'choose') return q.options[q.answer];
  if (q.type === 'pick') return q.answers.map(i => q.options[i]).join(', ');
  if (q.type === 'mgap') return q.answer.map(a => a[0]).join(' · ');
  return Array.isArray(q.answer) ? q.answer[0] : q.answer;
}

/* что ответил человек — без этого разбор ошибки наполовину бесполезен */
export function givenText(q, given) {
  if (given == null || given === '' || (Array.isArray(given) && !given.length)) return '';
  if (q.type === 'choose') return q.options[given] ?? '';
  if (q.type === 'error') return q.tokens[given] ?? '';
  if (q.type === 'pick') return [...given].sort().map(i => q.options[i]).join(', ');
  if (q.type === 'mgap') return given.join(' · ');
  return String(given);
}

const promptText = q => q.q || q.ru || (q.tokens ? q.tokens.join(' ') : '');

/* `test.ephemeral` — прогон, которого нет на витрине: доза дня. Рекорд по нему
   не хранится (сравнивать нечего: состав каждый раз новый), а выход ведёт туда,
   откуда пришли, а не в общий список тестов. */
export function renderTest(app, course, test) {
  const pool = course.poolFor(test);
  const qs = shuffle(pool).slice(0, Math.min(test.pick, pool.length));
  const total = qs.length;
  const accent = course.accentFor(test);
  /* Пара к акценту: на заливке амбера белая надпись не читается, а кнопка
     «Проверить» — это заливка акцентом. Прогон, который красится не цветом
     курса, называет свою пару сам (см. DESIGN.md, «фигура и текст»). */
  const onAccent = test.onAccent ? `;--on-accent:${test.onAccent}` : '';
  const exit = test.exit || '#/tests';
  const hadAttempt = !test.ephemeral && !!store.bestScore(course.id, test.id);   // рекорд имеет смысл только со второго захода
  const results = [];
  let idx = 0;
  let staged = null;
  let checked = false;

  app.innerHTML = `
    <div class="player wrap" style="--accent:${accent}${onAccent}">
      <div class="player-top">
        <button class="btn btn-secondary btn-icon" id="back" type="button"
          title="${test.exitLabel || 'Все тесты'}" aria-label="${test.exitLabel || 'Все тесты'}">${icon('chevron-left')}</button>
        <div class="track" id="track"></div>
      </div>
      <div class="deck-head">
        <span class="pill">${test.kind || (test.mixed ? 'МИКС' : 'ТЕСТ')} <span class="num" id="qnum">· 1/${total}</span></span>
        <h1>${test.title}</h1>
        ${test.lede ? `<div class="lesson-sub">${test.lede}</div>` : ''}
      </div>
      <div class="stage" id="stage"></div>
      <div class="controls">
        <button class="btn btn-primary" id="act" type="button" disabled>Проверить</button>
      </div>
      <div class="step-meta">
        <span id="qmeta"></span>
        <span class="khint">Enter — проверить · Esc — выход</span>
      </div>
    </div>`;

  const stage = app.querySelector('#stage');
  const act = app.querySelector('#act');
  const track = app.querySelector('#track');
  const qnum = app.querySelector('#qnum');
  const qmeta = app.querySelector('#qmeta');

  function paintTrack() {
    track.innerHTML = qs.map((_, i) => {
      const r = results[i];
      const cls = r ? (r.correct ? 'is-correct' : 'is-wrong') : (i === idx ? 'is-here' : '');
      return `<i class="${cls}"></i>`;
    }).join('');
    const right = results.filter(r => r?.correct).length;
    qmeta.textContent = `вопрос ${idx + 1} из ${total} · верно ${right}`;
  }

  const setAct = (label, on) => { act.textContent = label; act.disabled = !on; };

  function head(q) {
    const t = TYPE[q.type] || { tag: '', how: '' };
    return `<div class="q-type">${t.tag}</div>${t.how ? `<div class="pick-hint">${t.how}</div>` : ''}`;
  }

  /* ---------- разметка вопроса ---------- */
  function questionBody(q) {
    if (q.type === 'choose') return `
      <div class="fade-seq quiz">
        ${head(q)}
        <div class="q">${q.q}</div>
        <div class="opts">${q.options.map((o, i) => `<button type="button" class="opt" data-i="${i}">${o}</button>`).join('')}</div>
        ${q.ru ? `<div class="q-ru">${q.ru}</div>` : ''}
        <div class="explain" id="exp"></div>
      </div>`;

    if (q.type === 'error') return `
      <div class="fade-seq quiz">
        ${head(q)}
        <div class="err-sent">${q.tokens.map((w, i) => `<button type="button" class="tok" data-i="${i}">${w}</button>`).join(' ')}</div>
        ${q.ru ? `<div class="q-ru">${q.ru}</div>` : ''}
        <div class="explain" id="exp"></div>
      </div>`;

    if (q.type === 'gap' || q.type === 'form') return `
      <div class="fade-seq quiz">
        ${head(q)}
        <div class="q">${q.q}</div>
        <div class="gap-wrap"><input class="input input-center" id="gap" type="text" autocomplete="off"
          autocapitalize="off" spellcheck="false" enterkeyhint="done" placeholder="ответ…" /></div>
        ${q.ru ? `<div class="q-ru">${q.ru}</div>` : ''}
        <div class="explain" id="exp"></div>
      </div>`;

    if (q.type === 'order') return `
      <div class="fade-seq quiz">
        ${head(q)}
        <div class="q">${q.ru || ''}</div>
        <div class="order-line" id="line"><span class="ph">собери предложение из слов ниже</span></div>
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
        ${head(q)}
        <div class="mgap-sent">${sent}</div>
        ${q.ru ? `<div class="q-ru">${q.ru}</div>` : ''}
        <div class="explain" id="exp"></div>
      </div>`;
    }

    if (q.type === 'pick') return `
      <div class="fade-seq quiz">
        ${head(q)}
        <div class="q">${q.q}</div>
        <div class="opts">${q.options.map((o, i) => `<button type="button" class="opt" data-i="${i}">${o}</button>`).join('')}</div>
        <div class="explain" id="exp"></div>
      </div>`;

    return '';
  }

  /* ---------- собери предложение ----------
     Слово ставится нажатием, но порядок правится перетаскиванием: без этого
     единственный способ поменять местами два слова в середине — разобрать
     полстроки и собрать заново, а в предложении на тринадцать слов это мучение.
     Жест — на pointer-событиях: HTML5 drag-and-drop на телефоне не работает,
     а телефон здесь основной экран. Слушатели живут на window, потому что
     строка перерисовывается прямо во время жеста и элемент, с которого начали,
     до конца перетаскивания не доживает. */
  function bindOrder(root) {
    const line = root.querySelector('#line');
    const bank = root.querySelector('#bank');
    const banks = [...bank.querySelectorAll('.bank-tok')];
    const words = banks.map(b => b.textContent);
    const placed = [];                       // индексы слов банка, в порядке строки
    let drag = null;

    const paint = (focus = null) => {
      line.innerHTML = placed.length
        ? placed.map((p, i) => `<button type="button" class="tok placed" data-p="${i}" data-w="${p}"
            title="перетащи на другое место · нажми, чтобы убрать">${words[p]}</button>`).join('')
        : '<span class="ph">собери предложение из слов ниже</span>';
      banks.forEach(b => b.classList.toggle('is-used', placed.includes(+b.dataset.w)));
      if (drag?.moved) line.children[drag.at]?.classList.add('is-dragging');
      staged = placed.map(p => words[p]).join(' ');
      setAct('Проверить', placed.length > 0);
      if (focus != null) line.querySelector(`[data-p="${focus}"]`)?.focus({ preventScroll: true });
    };

    /* куда слово встанет: первый токен, чей центр правее указателя.
       Строка переносится, поэтому сначала отсекаем по нижней грани — иначе
       слово с последней строки считалось бы «правее» всех предыдущих. */
    const dropAt = (x, y) => {
      const toks = [...line.querySelectorAll('.tok')].filter(t => !t.classList.contains('is-dragging'));
      for (let i = 0; i < toks.length; i++) {
        const r = toks[i].getBoundingClientRect();
        if (y <= r.bottom && x < r.left + r.width / 2) return i;
      }
      return toks.length;
    };

    const moveGhost = e => {
      drag.ghost.style.left = `${e.clientX - drag.dx}px`;
      drag.ghost.style.top = `${e.clientY - drag.dy}px`;
    };

    const onMove = e => {
      if (!drag) return;
      if (!drag.moved) {
        if (Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) < 6) return;   // дрожь пальца — ещё не жест
        const r = drag.el.getBoundingClientRect();
        const g = drag.el.cloneNode(true);
        g.className = 'tok drag-ghost';
        g.disabled = false;
        g.style.width = `${r.width}px`;
        g.style.height = `${r.height}px`;
        /* Двойник живёт в <body>, а --accent объявлен на экране теста —
           без этой строки слово под пальцем красится корневым синим. */
        g.style.setProperty('--accent', getComputedStyle(line).getPropertyValue('--accent'));
        document.body.appendChild(g);
        drag.ghost = g;
        drag.moved = true;
        if (drag.at < 0) { drag.at = dropAt(e.clientX, e.clientY); placed.splice(drag.at, 0, drag.w); }
        paint();
      }
      moveGhost(e);
      const to = dropAt(e.clientX, e.clientY);
      if (to !== drag.at) {
        placed.splice(drag.at, 1);
        placed.splice(to, 0, drag.w);
        drag.at = to;
        paint();
      }
      e.preventDefault();
    };

    const onUp = e => {
      if (!drag) return;
      const d = drag;
      drag = null;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      d.ghost?.remove();
      if (!d.moved) {                                   // нажатие, а не жест
        if (d.src === 'bank') placed.push(d.w);
        else placed.splice(d.at, 1);
      } else {
        const r = bank.getBoundingClientRect();          // бросили в запас — слово вернулось
        const inBank = e.clientX >= r.left && e.clientX <= r.right
          && e.clientY >= r.top && e.clientY <= r.bottom;
        if (inBank) placed.splice(d.at, 1);
      }
      paint();
    };

    const onDown = src => e => {
      if (checked || drag || e.button > 0) return;
      const el = e.target.closest(src === 'bank' ? '.bank-tok' : '.placed');
      if (!el || el.disabled || el.classList.contains('is-used')) return;
      const r = el.getBoundingClientRect();
      drag = {
        src, el, w: +el.dataset.w, at: src === 'bank' ? -1 : +el.dataset.p,
        x0: e.clientX, y0: e.clientY, dx: e.clientX - r.left, dy: e.clientY - r.top, moved: false,
      };
      if (e.pointerType === 'mouse') e.preventDefault();   // мышь иначе выделяет текст по дороге
      window.addEventListener('pointermove', onMove, { passive: false });
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
    };

    line.addEventListener('pointerdown', onDown('line'));
    bank.addEventListener('pointerdown', onDown('bank'));

    /* то же самое с клавиатуры: стрелки двигают слово, Backspace убирает */
    line.addEventListener('keydown', e => {
      const el = e.target.closest?.('.placed');
      if (!el || checked) return;
      const i = +el.dataset.p;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const j = i + (e.key === 'ArrowLeft' ? -1 : 1);
        if (j < 0 || j >= placed.length) return;
        e.preventDefault(); e.stopPropagation();
        [placed[i], placed[j]] = [placed[j], placed[i]];
        paint(j);
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault(); e.stopPropagation();
        placed.splice(i, 1);
        paint(placed.length ? Math.min(i, placed.length - 1) : null);
      }
    });

    paint();
  }

  /* ---------- ввод ---------- */
  function bindQuestion(root, q) {
    if (q.type === 'choose' || q.type === 'error') {
      const sel = q.type === 'choose' ? '.opt' : '.tok';
      root.querySelectorAll(sel).forEach(o => o.addEventListener('click', () => {
        if (checked) return;
        root.querySelectorAll(sel).forEach(x => x.classList.remove('is-selected'));
        o.classList.add('is-selected');
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

    if (q.type === 'order') bindOrder(root);

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
        if (sel.has(i)) { sel.delete(i); o.classList.remove('is-selected'); }
        else { sel.add(i); o.classList.add('is-selected'); }
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
      items[q.answer].classList.add('is-correct');
      if (!correct && staged != null) items[staged].classList.add('is-wrong');
    }
    if (q.type === 'gap' || q.type === 'form') {
      const inp = root.querySelector('#gap');
      inp.disabled = true;
      inp.classList.add(correct ? 'is-correct' : 'is-wrong');
    }
    if (q.type === 'order') {
      root.querySelectorAll('.tok').forEach(x => { x.disabled = true; });
      root.querySelector('#line').classList.add(correct ? 'is-correct' : 'is-wrong');
    }
    if (q.type === 'mgap') {
      [...root.querySelectorAll('.mgap-input')].forEach((inp, i) => {
        inp.disabled = true;
        const ok = q.answer[i].map(norm).includes(norm(staged ? staged[i] : ''));
        inp.classList.add(ok ? 'is-correct' : 'is-wrong');
      });
    }
    if (q.type === 'pick') {
      const sel = new Set(staged || []);
      root.querySelectorAll('.opt').forEach((o, i) => {
        o.disabled = true;
        if (q.answers.includes(i)) o.classList.add('is-correct');
        else if (sel.has(i)) o.classList.add('is-wrong');
      });
    }

    const given = givenText(q, staged);
    exp.innerHTML =
      `<div class="verdict ${correct ? 'is-good' : 'is-bad'}">${correct ? '✓ верно' : '✕ мимо'}</div>` +
      (!correct && given ? `<div class="given">ты ответил: <b>${given}</b></div>` : '') +
      (!correct ? `<div class="right">правильно: <b>${answerText(q)}</b></div>` : '') +
      (q.why ? `<div class="why-line">${q.why}${q.mine ? ' <span class="badge badge-mine">твоя ошибка</span>' : ''}</div>` : '');
    exp.classList.add('is-shown');
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
    paintTrack();
  }

  function doAction() {
    if (act.disabled) return;
    const q = qs[idx];
    if (!checked) {
      const correct = isCorrect(q);
      results[idx] = { q, correct, given: staged };
      /* Каждый ответ — сразу в расписание повторений, а не в конце теста:
         брошенный на середине прогон тоже был работой, и то, что человек
         в нём вспомнил (или не вспомнил), терять незачем. */
      review.record(course, q, correct);
      checked = true;
      reveal(q, correct);
      setAct(idx === total - 1 ? 'Итог' : 'Дальше', true);
      paintTrack();
    } else if (idx === total - 1) {
      finish();
    } else {
      idx++;
      drawQuestion();
    }
  }

  function finish() {
    const correct = results.filter(r => r.correct).length;
    const isBest = test.ephemeral ? false : store.saveScore(course.id, test.id, correct, total);
    const pct = Math.round((correct / total) * 100);
    const wrong = results.filter(r => !r.correct);

    const verdict = pct >= 90 ? { t: 'Отлично — тема закреплена.', c: 'is-good' }
      : pct >= 70 ? { t: 'Хорошо. Пара мест на докрутку.', c: 'is-ok' }
      : pct >= 50 ? { t: 'Нормально для тренировки — но есть что подтянуть.', c: 'is-ok' }
      : { t: 'Тему стоит перепройти и вернуться.', c: 'is-bad' };

    /* не `review`: так называется модуль повторений, и локальная
       переменная с тем же именем закрыла бы его в этой функции */
    const reviewHTML = wrong.length ? `
      <div class="review">
        <div class="stitle" style="text-align:center">разбор промахов</div>
        ${wrong.map(({ q, given }) => {
          const g = givenText(q, given);
          return `<div class="rev-item">
            <div class="rev-q">${promptText(q)}</div>
            ${q.ru && q.q ? `<div class="rev-ru">${q.ru}</div>` : ''}
            <div class="rev-a">${g ? `ты: <b class="was">${g}</b> · ` : ''}правильно: <b class="fix">${answerText(q)}</b></div>
            ${q.why ? `<div class="rev-w">${q.why}${q.mine ? ' <span class="badge badge-mine">твоя ошибка</span>' : ''}</div>` : ''}
          </div>`;
        }).join('')}
      </div>` : '<div class="allclear">✓ ни одной ошибки — чисто.</div>';

    app.querySelector('.deck-head').innerHTML = `
      <div class="ring ${verdict.c}">
        <div>
          <div class="ring-num">${correct}<span>/${total}</span></div>
          <div class="ring-sub">${pct}%</div>
        </div>
      </div>
      <div class="score-verdict ${verdict.c}" style="margin-top:var(--s-3)">${verdict.t}</div>
      ${test.finishNote?.({ correct, total })
        || (isBest && hadAttempt ? '<div style="margin-top:6px"><span class="badge badge-new">новый рекорд</span></div>' : '')}`;
    app.querySelector('.controls').innerHTML = test.finishActions || `
      <button class="btn btn-secondary" id="retry" type="button">Пройти заново</button>
      <a class="btn btn-primary" href="#/tests">К тестам ${icon('chevron-right')}</a>`;
    app.querySelector('.step-meta').innerHTML =
      `<span>${wrong.length ? `промахов: ${wrong.length} — разбор ниже` : 'без ошибок'}</span>`;
    stage.innerHTML = reviewHTML;
    paintTrack();

    app.querySelector('#retry')?.addEventListener('click', () => renderTest(app, course, test));
    setKeys(e => { if (e.key === 'Escape') location.hash = exit; });
    window.scrollTo(0, 0);
  }

  act.addEventListener('click', doAction);
  app.querySelector('#back').addEventListener('click', () => { location.hash = exit; });
  setKeys(e => {
    if (e.key === 'Enter') doAction();
    else if (e.key === 'Escape') location.hash = exit;
  });

  drawQuestion();
}
