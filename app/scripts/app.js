/* ============================================================
   ENGINE — router, lesson player, animated timelines.
   Depends on data.js (GROUPS, LESSONS).
   ============================================================ */
(function () {
  const app = document.getElementById('app');
  const TOTAL = LESSONS.length;
  const ASPECT_LABEL = { simple:'SIMPLE', continuous:'CONTINUOUS', perfect:'PERFECT', perfcont:'PERF. CONTINUOUS' };

  /* interactive tense map: tense -> 4 aspect rows */
  const TENSE_MATRIX = {
    present: { border:'', rows:[
      {k:'simple',    tag:'simple',              form:'I <span class="k-simple">do</span>',              hint:'привычка, регулярно',   lesson:'present-simple'},
      {k:'continuous',tag:'continuous',          form:"I'm <span class=\"k-continuous\">doing</span>",   hint:'прямо сейчас',          lesson:'present-continuous'},
      {k:'perfect',   tag:'perfect',             form:'I have <span class="k-perfect">done</span>',      hint:'результат сейчас',      lesson:'present-perfect'},
      {k:'perfcont',  tag:'perfect continuous',  form:'I have <span class="k-perfcont">been doing</span>',hint:'делаю уже сколько-то',  lesson:null},
    ]},
    past: { border:'#f5a63b44', rows:[
      {k:'simple',    tag:'simple',              form:'I <span class="k-simple">did</span>',             hint:'факт в прошлом',        lesson:'past-simple'},
      {k:'continuous',tag:'continuous',          form:'I was <span class="k-continuous">doing</span>',   hint:'делал в тот момент',    lesson:'past-continuous'},
      {k:'perfect',   tag:'perfect',             form:'I had <span class="k-perfect">done</span>',       hint:'до другого момента',    lesson:'past-perfect'},
      {k:'perfcont',  tag:'perfect continuous',  form:'I had <span class="k-perfcont">been doing</span>',hint:'тянулось до момента',   lesson:null},
    ]},
    future: { border:'#ac8cf644', rows:[
      {k:'simple',    tag:'simple',              form:'I will <span class="k-simple">do</span>',              hint:'решение, факт',        lesson:'future-will-going'},
      {k:'continuous',tag:'continuous',          form:'I will be <span class="k-continuous">doing</span>',    hint:'буду делать тогда',    lesson:'future-perfect-cont'},
      {k:'perfect',   tag:'perfect',             form:'I will have <span class="k-perfect">done</span>',      hint:'сделаю к моменту',     lesson:'future-perfect-cont'},
      {k:'perfcont',  tag:'perfect continuous',  form:'I will have <span class="k-perfcont">been doing</span>',hint:'буду делать уже сколько-то', lesson:null},
    ]},
  };

  /* ---------- progress (localStorage) ---------- */
  const PKEY = 'eng.progress.v1';
  const loadProg = () => { try { return JSON.parse(localStorage.getItem(PKEY)) || {}; } catch { return {}; } };
  const saveProg = p => localStorage.setItem(PKEY, JSON.stringify(p));
  const isDone = id => !!loadProg()[id];
  const markDone = id => { const p = loadProg(); p[id] = true; saveProg(p); };

  /* ---------- tiny helpers ---------- */
  const X = p => (p * 9).toFixed(1);            // pos 0..100 -> 0..900
  const NOWP = 52, NOWX = X(NOWP);
  const esc = s => s;                            // content is trusted (authored)

  /* ============================================================
     ANIMATED TIMELINE
     ============================================================ */
  function timeline(tl, aspect) {
    if (!tl) return '';
    const c = `var(--${aspect})`;
    const shape = tl.shape || (tl.markers && tl.markers.length > 1 ? 'diamonds' : 'point');
    let inner = '';

    const Xn = p => +X(p);
    // smooth generated paths
    const sine = (cx, halfW, amp, cycles) => {
      const n = 46, x0 = cx - halfW, x1 = cx + halfW; let d = '';
      for (let i = 0; i <= n; i++) {
        const x = x0 + (x1 - x0) * i / n;
        const y = 120 - amp * Math.sin((i / n) * Math.PI * 2 * cycles);
        d += (i ? ' L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
      }
      return d;
    };
    const arch = (cx, halfW, amp) => {
      const n = 30, x0 = cx - halfW, x1 = cx + halfW; let d = '';
      for (let i = 0; i <= n; i++) {
        const x = x0 + (x1 - x0) * i / n;
        const y = 120 - amp * Math.sin(Math.PI * i / n);
        d += (i ? ' L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
      }
      return d;
    };

    // NOW glow + real SVG blur filter for signature glow
    const defs = `
      <defs>
        <radialGradient id="nowglow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stop-color="#ffd233" stop-opacity="0.38"/>
          <stop offset="45%"  stop-color="#ffd233" stop-opacity="0.11"/>
          <stop offset="100%" stop-color="#ffd233" stop-opacity="0"/>
        </radialGradient>
        <filter id="glw" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3.2" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>`;
    const nowBits = `
      <ellipse class="glow" cx="${NOWX}" cy="118" rx="64" ry="96" fill="url(#nowglow)"/>
      <line class="nowdot" x1="${NOWX}" y1="46" x2="${NOWX}" y2="182"/>
      <text class="lbl-now" x="${NOWX}" y="34" text-anchor="middle">NOW · СЕЙЧАС</text>`;

    const axis = `
      <line class="axis-line" x1="18" y1="120" x2="876" y2="120"/>
      <path class="axis-line" d="M876 120 l-12 -6 v12 z" fill="var(--hairline-2)" stroke="none"/>
      <text class="lbl-end" x="24"  y="168">PAST</text>
      <text class="lbl-end" x="812" y="168">FUTURE</text>`;

    // center of the signature (pos). fall back to midpoint of from/to.
    const centerX = tl.center != null ? Xn(tl.center)
                  : (tl.from != null && tl.to != null) ? (Xn(tl.from) + Xn(tl.to)) / 2 : NOWX;

    if (shape === 'diamonds') {
      const xs = tl.markers ? tl.markers.map(m => Xn(m.pos)) : [centerX - 30, centerX, centerX + 30];
      xs.forEach((x, i) => {
        inner += `<rect class="pop" filter="url(#glw)" x="${x - 8}" y="112" width="16" height="16" rx="3" fill="${c}"
                  transform="rotate(45 ${x} 120)" style="animation-delay:${.15 + i * .1}s"/>`;
      });
    }
    else if (shape === 'point') {
      (tl.markers || []).forEach((m, i) => {
        const mc = m.color ? `var(--${m.color})` : c;
        inner += `<circle class="pop" filter="url(#glw)" cx="${Xn(m.pos)}" cy="120" r="9" fill="${mc}"
                  style="animation-delay:${.15 + i * .1}s"/>`;
      });
    }
    else if (shape === 'wave') {
      const d = sine(centerX, 84, 17, 2);
      inner += `<path class="draw" filter="url(#glw)" pathLength="1" fill="none" stroke="${c}" stroke-width="3.5" stroke-linecap="round" d="${d}"/>
        <circle class="pop" filter="url(#glw)" cx="${centerX}" cy="120" r="7" fill="#fff" style="animation-delay:.8s"/>`;
    }
    else if (shape === 'bump') {
      const hw = 58, a = centerX - hw, b = centerX + hw;
      inner += `<path class="draw" filter="url(#glw)" pathLength="1" fill="none" stroke="${c}" stroke-width="3.5" stroke-linecap="round" d="${arch(centerX, hw, 26)}"/>
        <circle class="pop" filter="url(#glw)" cx="${b}" cy="120" r="7" fill="${c}" style="animation-delay:.8s"/>
        <path class="draw" pathLength="1" fill="none" stroke="${c}" stroke-width="2" opacity=".6"
          d="M${a} 136 v6 h${b - a} v-6"/>`;
      if (tl.bracket) inner += `<text class="cap" x="${centerX}" y="162" text-anchor="middle" fill="${c}">${tl.bracket}</text>`;
    }
    else if (shape === 'arrow') {
      const a = X(tl.from ?? 22);
      const end = tl.to != null ? Xn(tl.to) : +NOWX;
      inner += `<line class="draw" filter="url(#glw)" pathLength="1" x1="${a}" y1="120" x2="${end - 6}" y2="120" stroke="${c}" stroke-width="4" stroke-linecap="round"/>
        <path class="pop" filter="url(#glw)" d="M${end} 120 l-15 -7 v14 z" fill="${c}" style="animation-delay:.8s"/>
        <text class="checkmark" x="${end}" y="98" text-anchor="middle" fill="${c}" font-size="22">✓</text>`;
    }
    else if (shape === 'arc') {
      const a = X(tl.from ?? 24), b = X(tl.to ?? 68);
      inner += `<path class="draw" filter="url(#glw)" pathLength="1" fill="none" stroke="${c}" stroke-width="3" stroke-dasharray="2 7"
        stroke-linecap="round" d="M${a} 120 Q ${(+a + +b) / 2} 62, ${b} 120"/>
        <circle class="pop" filter="url(#glw)" cx="${a}" cy="120" r="9" fill="${c}" style="animation-delay:.2s"/>
        <circle class="pop" filter="url(#glw)" cx="${b}" cy="120" r="8" fill="${c}" opacity=".7" style="animation-delay:.9s"/>`;
    }

    // caption label(s)
    let cap = '';
    const caps = tl.captions || (tl.caption ? [tl.caption] : []);
    caps.forEach(cp => {
      const cc = cp.color ? `var(--${cp.color})` : c;
      cap += `<text class="cap" x="${X(cp.pos)}" y="150" text-anchor="middle" fill="${cc}">${cp.text}</text>`;
    });

    return `<svg class="tl" viewBox="0 0 900 200" xmlns="http://www.w3.org/2000/svg">
      ${defs}${nowBits}${axis}${inner}${cap}</svg>`;
  }

  /* ============================================================
     STEP RENDERERS
     ============================================================ */
  function renderStep(s, aspect) {
    switch (s.type) {
      case 'concept': return `
        <div class="fade-seq">
          ${s.lead ? `<p class="lead ${aspect}">${s.lead}</p>` : ''}
          ${s.text ? `<p class="body">${s.text}</p>` : ''}
          ${s.timeline ? timeline(s.timeline, aspect) : ''}
        </div>`;

      case 'formula': return `
        <div class="fade-seq">
          ${s.title ? `<div class="stitle">${s.title}</div>` : ''}
          ${s.rows.map(r => `<div class="formula"><span class="lbl-l">${r.label}</span><span class="op">→</span>${r.html}</div>`).join('')}
        </div>`;

      case 'tabs': {
        const tabs = s.tabs;
        return `
        <div class="fade-seq" style="text-align:center">
          ${s.title ? `<div class="stitle">${s.title}</div>` : ''}
          <div class="tabbar">${tabs.map((t,i)=>`<button data-tab="${i}" class="${i===0?'active':''}">${t.label}</button>`).join('')}</div>
          <div class="tab-body">
            ${tabs.map((t,i)=>`<div class="tab-panel" data-panel="${i}" ${i?'hidden':''}>
              <div class="en">${t.html}</div>${t.ru?`<div class="ru">${t.ru}</div>`:''}</div>`).join('')}
          </div>
        </div>`;
      }

      case 'examples': return `
        <div class="fade-seq">
          ${s.title ? `<div class="stitle" style="text-align:center">${s.title}</div>` : ''}
          <div class="ex-list" style="display:grid;gap:12px">
            ${s.items.map(it=>`<div class="rev"><div class="en">${it.en}</div>
              <div class="ru">${it.ru}</div><div class="tap">нажми — перевод</div></div>`).join('')}
          </div>
        </div>`;

      case 'vs': return `
        <div class="fade-seq">
          <div class="vs">
            <div class="vs-card"><div class="tg k-${s.left.tag==='going to'?'perfcont':'simple'}" style="color:var(--${aspect==='continuous'?'simple':aspect})">${s.left.tag}</div>
              <div class="en">${s.left.en}</div><div class="ru">${s.left.ru}</div></div>
            <div class="vs-card"><div class="tg" style="color:var(--${aspect})">${s.right.tag}</div>
              <div class="en">${s.right.en}</div><div class="ru">${s.right.ru}</div></div>
          </div>
        </div>`;

      case 'markers': return `
        <div class="fade-seq" style="text-align:center">
          ${s.title ? `<div class="stitle">${s.title}</div>` : ''}
          <div class="chips" style="justify-content:center">
            ${s.chips.map(ch=>`<span class="chip">${ch.w}<small>${ch.ru}</small></span>`).join('')}
          </div>
        </div>`;

      case 'mistake': return `
        <div class="fade-seq">
          <div class="stitle" style="text-align:center">частые ошибки</div>
          <div class="mistake">
            ${s.pairs.map(p=>`<div><div class="mrow"><span class="bad">${p.bad}</span><span class="good">${p.good}</span></div>
              ${p.why?`<div class="why">${p.why}</div>`:''}</div>`).join('')}
          </div>
        </div>`;

      case 'scale': return `
        <div class="fade-seq">
          ${s.title?`<div class="stitle" style="text-align:center">${s.title}</div>`:''}
          <div class="scale" style="margin:0 auto">
            ${s.rows.map(r=>`<div class="scale-row ${r.kind||''}"><span class="delta">${r.d}</span>
              <span class="en">${r.en}</span><span class="ru">${r.ru}</span></div>`).join('')}
          </div>
        </div>`;

      case 'produce': return `
        <div class="fade-seq">
          <div class="stitle" style="text-align:center">${s.title || 'скажи по-английски вслух — потом проверь'}</div>
          <div class="ex-list" style="display:grid;gap:12px">
            ${s.items.map(it => `<div class="rev produce"><div class="prompt">${it.ru}</div>
              <div class="answer">${it.en}</div>${it.tip ? `<div class="tip-line">${it.tip}</div>` : ''}
              <div class="tap">нажми — проверь себя</div></div>`).join('')}
          </div>
        </div>`;

      case 'note': return `<div class="fade-seq"><div class="note ${s.warn ? 'warn' : ''}">${s.html}</div></div>`;

      case 'quiz': return `
        <div class="fade-seq quiz">
          <div class="q">${s.q}</div>
          <div class="opts">${s.options.map((o,i)=>`<button class="opt" data-i="${i}">${o}</button>`).join('')}</div>
          <div class="explain">${s.explain||''}${s.ru?`<span class="ru">${s.ru}</span>`:''}</div>
        </div>`;

      default: return '';
    }
  }

  /* bind interactive behaviour inside the current step */
  function bindStep(root, s) {
    if (s.type === 'tabs') {
      const btns = root.querySelectorAll('[data-tab]');
      btns.forEach(b => b.addEventListener('click', () => {
        btns.forEach(x => x.classList.remove('active')); b.classList.add('active');
        root.querySelectorAll('[data-panel]').forEach(p => p.hidden = p.dataset.panel !== b.dataset.tab);
      }));
    }
    if (s.type === 'examples' || s.type === 'produce') {
      root.querySelectorAll('.rev').forEach(r => r.addEventListener('click', () => r.classList.toggle('open')));
    }
    if (s.type === 'quiz') {
      const opts = root.querySelectorAll('.opt');
      opts.forEach(o => o.addEventListener('click', () => {
        const i = +o.dataset.i;
        opts.forEach(x => x.disabled = true);
        if (i === s.answer) o.classList.add('correct');
        else { o.classList.add('wrong'); opts[s.answer].classList.add('correct'); }
        root.querySelector('.explain').classList.add('show');
      }));
    }
  }

  /* ============================================================
     COURSE RAIL
     ============================================================ */
  function rail(currentId) {
    return `<div class="rail">${LESSONS.map(l =>
      `<span class="seg ${l.aspect} ${isDone(l.id)?'':'dim'} ${l.id===currentId?'here':''}"
        style="color:var(--${l.aspect})" data-go="${l.id}" title="${l.title}"></span>`).join('')}</div>`;
  }

  /* ============================================================
     PLAYER
     ============================================================ */
  function renderPlayer(lesson) {
    let idx = 0, dir = 'fwd';
    const total = lesson.steps.length;

    app.innerHTML = `
      <div class="player" style="--accent:var(--${lesson.aspect})">
        <div class="wrap" style="padding:0 var(--s-6)">
          <div class="player-top">
            <button class="back-btn" id="back" title="Все темы">‹</button>
            <div style="flex:1">${rail(lesson.id)}</div>
          </div>
          <div class="deck-head">
            <span class="pill ${lesson.aspect}">${ASPECT_LABEL[lesson.aspect]} <span class="num">· ${lesson.n}/${TOTAL}</span></span>
            <h1>${lesson.title}</h1>
            <div class="lesson-sub sub-${lesson.aspect}">${lesson.subtitle}</div>
          </div>
          <div class="stage" id="stage"></div>
          <div class="controls">
            <button class="nav-btn" id="prev">‹ Назад</button>
            <button class="nav-btn primary" id="next">Дальше ›</button>
          </div>
          <div class="step-dots" id="dots"></div>
          <div class="khint">← → стрелки · Esc — выход</div>
        </div>
      </div>`;

    const stage = app.querySelector('#stage');
    const prevBtn = app.querySelector('#prev');
    const nextBtn = app.querySelector('#next');
    const dots = app.querySelector('#dots');

    function paintDots() {
      dots.innerHTML = lesson.steps.map((_, i) =>
        `<i class="${i===idx?'on':(i<idx?'done':'')}" data-d="${i}"></i>`).join('');
      dots.querySelectorAll('[data-d]').forEach(d => d.addEventListener('click', () => go(+d.dataset.d)));
    }

    function drawStep() {
      const s = lesson.steps[idx];
      const div = document.createElement('div');
      div.className = 'step in' + (dir === 'back' ? ' back' : '');
      div.innerHTML = renderStep(s, lesson.aspect);
      stage.innerHTML = '';
      stage.appendChild(div);
      bindStep(div, s);

      prevBtn.disabled = idx === 0;
      nextBtn.textContent = idx === total - 1 ? 'Готово ✓' : 'Дальше ›';
      paintDots();
      if (idx === total - 1) markDone(lesson.id);
    }

    function go(i) {
      if (i < 0 || i >= total) {
        if (i >= total) { location.hash = '#/'; }   // finished -> home
        return;
      }
      dir = i > idx ? 'fwd' : 'back';
      idx = i; drawStep();
    }

    prevBtn.addEventListener('click', () => go(idx - 1));
    nextBtn.addEventListener('click', () => go(idx + 1));
    app.querySelector('#back').addEventListener('click', () => location.hash = '#/');
    app.querySelectorAll('[data-go]').forEach(g => g.addEventListener('click', () => location.hash = '#/lesson/' + g.dataset.go));

    // keyboard
    window.__key = e => {
      if (e.key === 'ArrowRight') go(idx + 1);
      else if (e.key === 'ArrowLeft') go(idx - 1);
      else if (e.key === 'Escape') location.hash = '#/';
    };

    drawStep();
  }

  /* ============================================================
     HOME
     ============================================================ */
  function tenseGroup(node, tint, rows) {
    return `
    <div class="tree-group">
      <div class="tense-node ${node==='present'?'present':''}" ${tint?`style="border-color:${tint}"`:''}>${node}</div>
      <svg class="tree-connectors" viewBox="0 0 148 360" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 180 C 74 180, 74 45,  148 45"  stroke="var(--simple)"     stroke-width="1.5"/>
        <path d="M0 180 C 74 180, 74 135, 148 135" stroke="var(--continuous)" stroke-width="1.5"/>
        <path d="M0 180 C 74 180, 74 225, 148 225" stroke="var(--perfect)"    stroke-width="1.5"/>
        <path d="M0 180 C 74 180, 74 315, 148 315" stroke="var(--perfcont)"   stroke-width="1.5"/>
      </svg>
      <div class="aspect-rows">
        ${rows.map(r=>`<div class="aspect-row row-${r.k}">
          <div class="aspect-tag"><span class="bead"></span> ${r.tag}</div>
          <div class="form">${r.form}</div><div class="hint">${r.hint}</div></div>`).join('')}
      </div>
    </div>`;
  }

  function renderHome() {
    const done = Object.keys(loadProg()).length;
    const grid = GROUPS.map(g => {
      const items = LESSONS.filter(l => l.group === g);
      return `
      <div style="margin-top:var(--s-6)">
        <div class="eyebrow" style="margin-bottom:14px">${g}</div>
        <div class="grid">
          ${items.map(l => `
            <a class="card a-${l.aspect}" href="#/lesson/${l.id}">
              <div class="kicker">${String(l.n).padStart(2,'0')} · ${ASPECT_LABEL[l.aspect]} ${isDone(l.id)?'· <span class="check">✓</span>':''}</div>
              <h3>${l.title}</h3><p>${l.subtitle}</p>
            </a>`).join('')}
        </div>
      </div>`;
    }).join('');

    app.innerHTML = `
      <nav class="nav"><div class="nav-inner">
        <div class="brand"><span class="dot"></span> English<span class="dim">.grammar</span></div>
        <div class="nav-links"><a class="active" href="#/">Темы</a><a href="#/tests">Тесты</a><a href="#/results">Результаты</a></div>
      </div></nav>

      <header class="section wrap" style="padding-top:64px;padding-bottom:32px">
        <p class="eyebrow">грамматика · база · каждый день</p>
        <h1>Английский —<br>как система, а не список правил.</h1>
        <p class="lede" style="margin-top:18px">Выбирай тему → листай карточки с анимированными таймлайнами →
          проверяй себя. Прогресс сохраняется. Пройдено: <b>${done}/${TOTAL}</b>.</p>
        <a class="test-cta" href="#/tests">
          <div><div class="cta-k">проверь себя</div><div class="cta-t">Тесты по всем темам</div></div>
          <span class="cta-go">пройти ›</span>
        </a>
        <div style="margin:26px 0 6px">${rail(null)}</div>
        <div class="tag-legend" style="margin-top:24px">
          <span><i style="background:var(--simple)"></i> Simple</span>
          <span><i style="background:var(--continuous)"></i> Continuous</span>
          <span><i style="background:var(--perfect)"></i> Perfect</span>
          <span><i style="background:var(--perfcont)"></i> Perfect Continuous</span>
        </div>
      </header>

      <section class="section wrap" style="padding-top:var(--s-6)">
        <p class="eyebrow">карта времён — переключай и смотри</p>
        <h2 style="margin-bottom:6px">Прошлое · сейчас · будущее</h2>
        <p class="lede" style="margin:0 0 22px">Жми <b>present / past / future</b> — меняется время. Жми на <b>строку аспекта</b> — таймлайн рисует его «почерк»: волну, стрелку, горку.</p>
        <div class="tense-switch" id="tenseSwitch">
          <button data-t="present" class="active">present</button>
          <button data-t="past">past</button>
          <button data-t="future">future</button>
        </div>
        <div id="mapTimeline"></div>
        <div class="tree-group" style="margin-top:var(--s-5)">
          <div class="tense-node present" id="tenseNode">present</div>
          <svg class="tree-connectors" viewBox="0 0 148 360" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 180 C 74 180, 74 45,  148 45"  stroke="var(--simple)"     stroke-width="1.5"/>
            <path d="M0 180 C 74 180, 74 135, 148 135" stroke="var(--continuous)" stroke-width="1.5"/>
            <path d="M0 180 C 74 180, 74 225, 148 225" stroke="var(--perfect)"    stroke-width="1.5"/>
            <path d="M0 180 C 74 180, 74 315, 148 315" stroke="var(--perfcont)"   stroke-width="1.5"/>
          </svg>
          <div class="aspect-rows fade-seq" id="aspectRows"></div>
        </div>
      </section>

      <section class="section wrap" style="padding-top:var(--s-6)">
        <p class="eyebrow">все темы — жми любую</p>
        ${grid}
      </section>

      <footer class="site wrap">English.grammar · тренировка — со мной в чате</footer>`;

    app.querySelectorAll('[data-go]').forEach(g => g.addEventListener('click', () => location.hash = '#/lesson/' + g.dataset.go));

    // interactive tense map
    const tNode = app.querySelector('#tenseNode');
    const tRows = app.querySelector('#aspectRows');
    const tTL = app.querySelector('#mapTimeline');
    const tBtns = [...app.querySelectorAll('#tenseSwitch button')];
    // each aspect has its own animated signature, placed in the tense's time zone
    const REGION = { present: 52, past: 27, future: 77 };
    function signatureFor(t, a) {
      const r = REGION[t];
      const when = t === 'present' ? 'сейчас' : t === 'past' ? 'тогда' : 'потом';
      if (a === 'simple')     return { shape:'diamonds', now:true, center:r, caption:{pos:r, text:when} };
      if (a === 'continuous') return { shape:'wave',  now:true, center:r, caption:{pos:r, text:when} };
      if (a === 'perfect')    return { shape:'arrow', now:true, from:r-20, to:(t === 'present' ? 52 : r) };
      return { shape:'bump', now:true, center:r-4, bracket:'сколько-то времени' };
    }
    let curAspect = 'continuous';
    function showSig(t, a) {
      curAspect = a;
      tTL.innerHTML = timeline(signatureFor(t, a), a);
      tRows.querySelectorAll('.aspect-row').forEach(r => r.classList.toggle('active', r.dataset.aspect === a));
    }
    function paintExplorer(t) {
      const d = TENSE_MATRIX[t];
      tNode.textContent = t;
      tNode.className = 'tense-node' + (t === 'present' ? ' present' : '');
      tNode.style.borderColor = d.border || '';
      tRows.innerHTML = d.rows.map(r => `
        <div class="aspect-row row-${r.k}" data-aspect="${r.k}">
          <div class="aspect-tag"><span class="bead"></span> ${r.tag}</div>
          <div class="form">${r.form}</div>
          <div class="hint">${r.hint}</div>
          ${r.lesson ? `<button class="row-open" data-open="${r.lesson}">урок ›</button>` : `<span class="row-soon">скоро</span>`}
        </div>`).join('');
      tRows.querySelectorAll('[data-aspect]').forEach(row => row.addEventListener('click', () => showSig(t, row.dataset.aspect)));
      tRows.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); location.hash = '#/lesson/' + b.dataset.open; }));
      tBtns.forEach(b => b.classList.toggle('active', b.dataset.t === t));
      showSig(t, curAspect);
    }
    tBtns.forEach(b => b.addEventListener('click', () => paintExplorer(b.dataset.t)));
    paintExplorer('present');

    window.__key = null;
  }

  /* ============================================================
     TESTS — банк вопросов, рендер, проверка, итог
     ============================================================ */
  const norm = s => String(s ?? '')
    .toLowerCase().replace(/[’`]/g, "'").replace(/[.,!?;:]+$/g, '')
    .replace(/\s+/g, ' ').trim();
  const shuffle = a => { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };

  const TKEY = 'eng.tests.v1';
  const loadTScores = () => { try { return JSON.parse(localStorage.getItem(TKEY)) || {}; } catch { return {}; } };
  const saveTScore = (id, val) => { const s = loadTScores(); s[id] = val; localStorage.setItem(TKEY, JSON.stringify(s)); };

  function renderTestsHome() {
    const scores = loadTScores();
    const cards = TESTS.map(t => {
      const total = Math.min(t.pick, poolFor(t).length);
      const best = scores[t.id];
      const badge = best != null
        ? `<span class="t-best">лучший: ${best.correct}/${best.total}</span>` : '';
      return `<a class="t-card a-${t.aspect}" href="#/test/${t.id}">
        <div class="kicker">${t.mixed ? 'МИКС' : 'РУБЕЖ'} · ${total} вопросов ${badge}</div>
        <h3>${t.title}</h3><p>${t.sub}</p>
        <span class="t-go">пройти ›</span></a>`;
    }).join('');

    app.innerHTML = `
      <nav class="nav"><div class="nav-inner">
        <div class="brand"><span class="dot"></span> English<span class="dim">.grammar</span></div>
        <div class="nav-links"><a href="#/">Темы</a><a class="active" href="#/tests">Тесты</a><a href="#/results">Результаты</a></div>
      </div></nav>
      <header class="section wrap" style="padding-top:64px;padding-bottom:20px">
        <p class="eyebrow">проверь себя · разные типы вопросов</p>
        <h1>Тесты по всем темам.</h1>
        <p class="lede" style="margin-top:16px;max-width:60ch">Каждый тест — набор вопросов вперемешку:
          выбор, вписать слово, найти ошибку, собрать предложение. Порядок и состав меняются
          при каждом заходе. В конце — счёт и разбор промахов. Начни с «Твои ошибки» или иди по рубежам.</p>
      </header>
      <section class="section wrap" style="padding-top:var(--s-5)">
        <div class="t-grid">${cards}</div>
        <footer class="site wrap" style="padding-left:0;padding-right:0">English.grammar · тесты сохраняют лучший результат</footer>
      </section>`;
    window.__key = null;
  }

  function renderTest(test) {
    const pool = poolFor(test);
    const qs = shuffle(pool).slice(0, Math.min(test.pick, pool.length));
    const total = qs.length;
    let idx = 0;
    const results = [];        // {q, correct, given}
    let staged = null;         // текущий выбранный/введённый ответ до проверки
    let checked = false;

    app.innerHTML = `
      <div class="player" style="--accent:var(--${test.aspect})">
        <div class="wrap" style="padding:0 var(--s-6)">
          <div class="player-top">
            <button class="back-btn" id="back" title="Все тесты">‹</button>
            <div class="t-progress" id="tbar"></div>
          </div>
          <div class="deck-head">
            <span class="pill ${test.aspect}">${test.mixed ? 'МИКС' : 'ТЕСТ'} <span class="num" id="qnum">· 1/${total}</span></span>
            <h1 style="font-size:clamp(24px,3.4vw,36px)">${test.title}</h1>
          </div>
          <div class="stage" id="stage"></div>
          <div class="controls">
            <button class="nav-btn primary" id="act" disabled>Проверить</button>
          </div>
          <div class="khint">Enter — проверить / дальше · Esc — выход</div>
        </div>
      </div>`;

    const stage = app.querySelector('#stage');
    const act = app.querySelector('#act');
    const tbar = app.querySelector('#tbar');
    const qnum = app.querySelector('#qnum');

    function paintBar() {
      tbar.innerHTML = qs.map((_, i) => {
        const r = results[i];
        const cls = r ? (r.correct ? 'ok' : 'no') : (i === idx ? 'cur' : '');
        return `<i class="${cls}"></i>`;
      }).join('');
    }

    function setAct(label, on) { act.textContent = label; act.disabled = !on; }

    /* ---- рендер тела вопроса по типу ---- */
    function drawQuestion() {
      const q = qs[idx];
      staged = null; checked = false;
      qnum.textContent = `· ${idx + 1}/${total}`;
      const div = document.createElement('div');
      div.className = 'step in';
      div.innerHTML = questionBody(q);
      stage.innerHTML = ''; stage.appendChild(div);
      bindQuestion(div, q);
      setAct('Проверить', false);
      paintBar();
    }

    function typeTag(q) {
      const map = { choose:'выбери вариант', gap:'впиши слово', form:'форма слова',
        error:'найди ошибку', order:'собери предложение', mgap:'впиши слова',
        pick:'отметь все верные' };
      return `<div class="q-type">${map[q.type] || ''}</div>`;
    }

    function questionBody(q) {
      if (q.type === 'choose') return `
        <div class="fade-seq quiz">
          ${typeTag(q)}
          <div class="q">${q.q}</div>
          <div class="opts">${q.options.map((o, i) => `<button class="opt" data-i="${i}">${o}</button>`).join('')}</div>
          <div class="explain" id="exp"></div>
        </div>`;

      if (q.type === 'error') return `
        <div class="fade-seq quiz">
          ${typeTag(q)}
          <div class="q" style="font-size:13px;color:var(--text-dim)">${q.ru || ''}</div>
          <div class="err-sent">${q.tokens.map((w, i) => `<button class="tok" data-i="${i}">${w}</button>`).join(' ')}</div>
          <div class="explain" id="exp"></div>
        </div>`;

      if (q.type === 'gap' || q.type === 'form') return `
        <div class="fade-seq quiz">
          ${typeTag(q)}
          <div class="q">${q.q}</div>
          <div class="gap-wrap"><input class="gap-input" id="gap" type="text" autocomplete="off"
            autocapitalize="off" spellcheck="false" placeholder="ответ…" /></div>
          <div class="q-ru">${q.ru || ''}</div>
          <div class="explain" id="exp"></div>
        </div>`;

      if (q.type === 'order') return `
        <div class="fade-seq quiz">
          ${typeTag(q)}
          <div class="q">${q.ru || ''}</div>
          <div class="order-line" id="line"><span class="ph">нажимай слова по порядку</span></div>
          <div class="order-bank" id="bank">${shuffle(q.tokens).map((w, i) =>
            `<button class="tok bank-tok" data-w="${i}">${w}</button>`).join('')}</div>
          <div class="explain" id="exp"></div>
        </div>`;

      if (q.type === 'mgap') {
        const segs = q.q.split('___');
        let sent = '';
        segs.forEach((seg, i) => {
          sent += `<span>${seg}</span>`;
          if (i < segs.length - 1)
            sent += `<input class="mgap-input" data-b="${i}" type="text" autocomplete="off"
              autocapitalize="off" spellcheck="false" placeholder="…" />`;
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
          <div class="opts">${q.options.map((o, i) => `<button class="opt" data-i="${i}">${o}</button>`).join('')}</div>
          <div class="explain" id="exp"></div>
        </div>`;
      return '';
    }

    /* ---- поведение ввода ---- */
    function bindQuestion(root, q) {
      if (q.type === 'choose') {
        root.querySelectorAll('.opt').forEach(o => o.addEventListener('click', () => {
          if (checked) return;
          root.querySelectorAll('.opt').forEach(x => x.classList.remove('sel'));
          o.classList.add('sel'); staged = +o.dataset.i; setAct('Проверить', true);
        }));
      }
      if (q.type === 'error') {
        root.querySelectorAll('.tok').forEach(o => o.addEventListener('click', () => {
          if (checked) return;
          root.querySelectorAll('.tok').forEach(x => x.classList.remove('sel'));
          o.classList.add('sel'); staged = +o.dataset.i; setAct('Проверить', true);
        }));
      }
      if (q.type === 'gap' || q.type === 'form') {
        const inp = root.querySelector('#gap');
        inp.focus();
        inp.addEventListener('input', () => { staged = inp.value; setAct('Проверить', inp.value.trim().length > 0); });
        inp.addEventListener('keydown', e => {
          if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); doAction(); }
        });
      }
      if (q.type === 'order') {
        const line = root.querySelector('#line');
        const bank = root.querySelector('#bank');
        const placed = [];
        const refresh = () => {
          line.innerHTML = placed.length
            ? placed.map((p, i) => `<button class="tok placed" data-p="${i}">${q.tokens_shuf[p]}</button>`).join(' ')
            : '<span class="ph">нажимай слова по порядку</span>';
          staged = placed.map(p => q.tokens_shuf[p]).join(' ');
          setAct('Проверить', placed.length > 0);
          line.querySelectorAll('.placed').forEach(b => b.addEventListener('click', () => {
            if (checked) return;
            const pi = +b.dataset.p; const w = placed.splice(pi, 1)[0];
            bank.querySelector(`[data-w="${w}"]`).classList.remove('used'); refresh();
          }));
        };
        // stash shuffled token order so indices stay stable
        q.tokens_shuf = [...bank.querySelectorAll('.bank-tok')].map(b => b.textContent);
        bank.querySelectorAll('.bank-tok').forEach(b => b.addEventListener('click', () => {
          if (checked || b.classList.contains('used')) return;
          b.classList.add('used'); placed.push(+b.dataset.w); refresh();
        }));
        refresh();
      }
      if (q.type === 'mgap') {
        const inputs = [...root.querySelectorAll('.mgap-input')];
        inputs[0] && inputs[0].focus();
        const sync = () => {
          staged = inputs.map(i => i.value);
          setAct('Проверить', inputs.every(i => i.value.trim().length > 0));
        };
        inputs.forEach(i => i.addEventListener('input', sync));
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

    /* ---- проверка ответа ---- */
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
        const a = [...(staged || [])].sort().join(',');
        const b = [...q.answers].sort().join(',');
        return a === b;
      }
      return false;
    }

    function answerText(q) {
      if (q.type === 'error') return `${q.tokens[q.answer]} → ${q.fix || '—'}`;
      if (q.type === 'choose') return q.options[q.answer];
      if (q.type === 'pick') return q.answers.map(i => q.options[i]).join(', ');
      if (q.type === 'mgap') return q.answer.map(a => a[0]).join(' · ');
      return Array.isArray(q.answer) ? q.answer[0] : q.answer;
    }
    function promptText(q) {
      return q.q || q.ru || (q.tokens ? q.tokens.join(' ') : '');
    }

    function reveal(q, correct) {
      const root = stage;
      const exp = root.querySelector('#exp');
      if (q.type === 'choose') {
        const opts = root.querySelectorAll('.opt');
        opts.forEach(x => x.disabled = true);
        opts[q.answer].classList.add('correct');
        if (!correct && staged != null) opts[staged].classList.add('wrong');
      }
      if (q.type === 'error') {
        const toks = root.querySelectorAll('.tok');
        toks.forEach(x => x.disabled = true);
        toks[q.answer].classList.add('correct');
        if (!correct && staged != null) toks[staged].classList.add('wrong');
      }
      if (q.type === 'gap' || q.type === 'form') {
        const inp = root.querySelector('#gap'); inp.disabled = true;
        inp.classList.add(correct ? 'ok' : 'no');
      }
      if (q.type === 'order') {
        root.querySelectorAll('.tok').forEach(x => x.disabled = true);
        root.querySelector('#line').classList.add(correct ? 'ok' : 'no');
      }
      if (q.type === 'mgap') {
        const inputs = [...root.querySelectorAll('.mgap-input')];
        inputs.forEach((inp, i) => {
          inp.disabled = true;
          const ok = q.answer[i].map(norm).includes(norm(staged ? staged[i] : ''));
          inp.classList.add(ok ? 'ok' : 'no');
        });
      }
      if (q.type === 'pick') {
        const opts = root.querySelectorAll('.opt');
        const sel = new Set(staged || []);
        opts.forEach((o, i) => {
          o.disabled = true;
          if (q.answers.includes(i)) o.classList.add('correct');
          else if (sel.has(i)) o.classList.add('wrong');
        });
      }
      const answerStr = answerText(q);
      exp.innerHTML =
        `<div class="verdict ${correct ? 'good' : 'bad'}">${correct ? '✓ верно' : '✕ мимо'}</div>` +
        (!correct ? `<div class="right">правильно: <b>${answerStr}</b></div>` : '') +
        (q.why ? `<div class="why-line">${q.why}${q.mine ? ' <span class="mine-tag">твоя ошибка</span>' : ''}</div>` : '');
      exp.classList.add('show');
    }

    function doAction() {
      if (act.disabled) return;
      const q = qs[idx];
      if (!checked) {
        const correct = isCorrect(q);
        results[idx] = { q, correct, given: staged };
        checked = true; reveal(q, correct);
        setAct(idx === total - 1 ? 'Итог ›' : 'Дальше ›', true);
        paintBar();
      } else {
        if (idx === total - 1) return finish();
        idx++; drawQuestion();
      }
    }

    function finish() {
      const correct = results.filter(r => r.correct).length;
      const prev = loadTScores()[test.id];
      const isBest = !prev || correct > prev.correct;
      if (isBest) saveTScore(test.id, { correct, total });

      const pct = Math.round((correct / total) * 100);
      const wrong = results.filter(r => !r.correct);
      const verdict = pct >= 90 ? { t:'Отлично — тема закреплена.', c:'good' }
        : pct >= 70 ? { t:'Хорошо. Пара мест на докрутку.', c:'ok' }
        : pct >= 50 ? { t:'Нормально для тренировки — но есть что подтянуть.', c:'ok' }
        : { t:'Тему стоит перепройти и вернуться.', c:'bad' };

      const review = wrong.length ? `
        <div class="review">
          <div class="stitle" style="text-align:center;margin-bottom:14px">разбор промахов</div>
          ${wrong.map(r => {
            const q = r.q;
            return `<div class="rev-item">
              <div class="rev-q">${promptText(q)}</div>
              <div class="rev-a">правильно: <b>${answerText(q)}</b></div>
              ${q.why ? `<div class="rev-w">${q.why}${q.mine ? ' <span class="mine-tag">твоя ошибка</span>' : ''}</div>` : ''}
            </div>`;
          }).join('')}
        </div>` : `<div class="allclear">✓ ни одной ошибки — чисто.</div>`;

      stage.innerHTML = '';
      app.querySelector('.controls').innerHTML = `
        <button class="nav-btn" id="retry">Пройти заново</button>
        <button class="nav-btn primary" id="tolist">К тестам ›</button>`;
      app.querySelector('.deck-head').innerHTML = `
        <div class="score-ring ${verdict.c}">
          <div class="score-num">${correct}<span>/${total}</span></div>
          <div class="score-pct">${pct}%</div>
        </div>
        <div class="score-verdict ${verdict.c}">${verdict.t}${isBest ? ' <span class="pb">новый рекорд</span>' : ''}</div>`;
      stage.innerHTML = review;
      paintBar();
      app.querySelector('#retry').addEventListener('click', () => renderTest(test));
      app.querySelector('#tolist').addEventListener('click', () => location.hash = '#/tests');
      window.__key = e => { if (e.key === 'Escape') location.hash = '#/tests'; };
    }

    act.addEventListener('click', doAction);
    app.querySelector('#back').addEventListener('click', () => location.hash = '#/tests');
    window.__key = e => {
      if (e.key === 'Enter') doAction();
      else if (e.key === 'Escape') location.hash = '#/tests';
    };
    drawQuestion();
  }

  /* ============================================================
     RESULTS — сводка лучших баллов из localStorage
     ============================================================ */
  function renderResults() {
    const scores = loadTScores();
    const taken = TESTS.filter(t => scores[t.id]);
    const totC = taken.reduce((s, t) => s + scores[t.id].correct, 0);
    const totQ = taken.reduce((s, t) => s + scores[t.id].total, 0);
    const pct = totQ ? Math.round(totC / totQ * 100) : 0;
    const cover = Math.round(taken.length / TESTS.length * 100);

    const level = totQ === 0 ? { t:'пока нет данных', c:'' }
      : pct >= 90 ? { t:'уверенно — ядро закреплено', c:'good' }
      : pct >= 75 ? { t:'крепко, добить точечно', c:'good' }
      : pct >= 55 ? { t:'средне — есть над чем работать', c:'ok' }
      : { t:'фундамент ещё сыпется — перепройти темы', c:'bad' };

    const row = t => {
      const s = scores[t.id];
      const p = s ? Math.round(s.correct / s.total * 100) : 0;
      const cls = !s ? '' : p >= 90 ? 'good' : p >= 60 ? 'ok' : 'bad';
      return `<a class="res-row a-${t.aspect}" href="#/test/${t.id}">
        <span class="res-name">${t.title}${t.batch === 2 ? ' <span class="res-b2">пачка 2</span>' : ''}</span>
        <span class="res-bar"><i class="${cls}" style="width:${s ? p : 0}%"></i></span>
        <span class="res-score ${cls}">${s ? `${s.correct}/${s.total}` : '—'}</span>
      </a>`;
    };

    app.innerHTML = `
      <nav class="nav"><div class="nav-inner">
        <div class="brand"><span class="dot"></span> English<span class="dim">.grammar</span></div>
        <div class="nav-links"><a href="#/">Темы</a><a href="#/tests">Тесты</a><a class="active" href="#/results">Результаты</a></div>
      </div></nav>
      <header class="section wrap" style="padding-top:64px;padding-bottom:8px">
        <p class="eyebrow">твой прогресс · лучшие результаты</p>
        <h1>Мои результаты.</h1>
      </header>
      <section class="section wrap" style="padding-top:var(--s-4)">
        <div class="res-summary">
          <div class="res-ring ${level.c}"><div class="res-big">${pct}<span>%</span></div>
            <div class="res-sub">${totC}/${totQ} верно</div></div>
          <div class="res-meta">
            <div class="res-verdict ${level.c}">${level.t}</div>
            <div class="res-cover">пройдено тестов: <b>${taken.length}/${TESTS.length}</b> · охват ${cover}%</div>
            <div class="res-note">Показаны лучшие результаты по каждому тесту (хранятся в этом браузере).
              Покажи этот экран мне — разберу слабые места точечно.</div>
          </div>
        </div>
        <div class="res-list">${TESTS.map(row).join('')}</div>
        <footer class="site wrap" style="padding-left:0;padding-right:0">
          English.grammar · <a href="#/tests" style="color:var(--perfcont)">← ко всем тестам</a>
        </footer>
      </section>`;
    window.__key = null;
  }

  /* ============================================================
     ROUTER
     ============================================================ */
  function route() {
    const h = location.hash;
    const m = h.match(/^#\/lesson\/(.+)$/);
    if (m) {
      const lesson = lessonById(m[1]);
      if (lesson) { renderPlayer(lesson); window.scrollTo(0, 0); return; }
    }
    const t = h.match(/^#\/test\/(.+)$/);
    if (t && typeof testById === 'function') {
      const test = testById(t[1]);
      if (test) { renderTest(test); window.scrollTo(0, 0); return; }
    }
    if (h === '#/tests' && typeof TESTS !== 'undefined') { renderTestsHome(); window.scrollTo(0, 0); return; }
    if (h === '#/results' && typeof TESTS !== 'undefined') { renderResults(); window.scrollTo(0, 0); return; }
    renderHome();
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', route);
  window.addEventListener('keydown', e => { if (window.__key) window.__key(e); });
  route();
})();
