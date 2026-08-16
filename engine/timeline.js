/* ============================================================
   TIMELINE — анимированная ось «прошлое → сейчас → будущее».
   Чистая функция: данные + цвет → SVG. Ничего не знает о курсе,
   подписи и цвета приходят снаружи.
   ============================================================ */

const X = p => (p * 9).toFixed(1);        // позиция 0..100 → 0..900
const NOWP = 52;
const NOWX = X(NOWP);

const sine = (cx, halfW, amp, cycles) => {
  const n = 46, x0 = cx - halfW, x1 = cx + halfW;
  let d = '';
  for (let i = 0; i <= n; i++) {
    const x = x0 + (x1 - x0) * i / n;
    const y = 120 - amp * Math.sin((i / n) * Math.PI * 2 * cycles);
    d += (i ? ' L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
  }
  return d;
};

const arch = (cx, halfW, amp) => {
  const n = 30, x0 = cx - halfW, x1 = cx + halfW;
  let d = '';
  for (let i = 0; i <= n; i++) {
    const x = x0 + (x1 - x0) * i / n;
    const y = 120 - amp * Math.sin(Math.PI * i / n);
    d += (i ? ' L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
  }
  return d;
};

/* На странице живёт несколько таймлайнов сразу, а id в SVG глобальны на весь
   документ: одинаковые id — и браузер берёт первый попавшийся, иногда из чужой
   (даже скрытой) картинки. Поэтому у каждого таймлайна свой суффикс. */
let seq = 0;

/* filterUnits="userSpaceOnUse" — не косметика, а лечение конкретного бага.
   По умолчанию область фильтра считается в процентах от bounding box элемента,
   а у идеально горизонтальной линии (стрелка perfect) высота bbox = 0 → область
   вырождается в ноль, и Safari по спецификации рисует пустоту (Chromium прощает).
   Явная область в координатах холста снимает вопрос для всех фигур разом. */
const defs = id => `
  <defs>
    <radialGradient id="nowglow-${id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stop-color="currentColor" stop-opacity="0.38"/>
      <stop offset="45%"  stop-color="currentColor" stop-opacity="0.11"/>
      <stop offset="100%" stop-color="currentColor" stop-opacity="0"/>
    </radialGradient>
    <filter id="glw-${id}" filterUnits="userSpaceOnUse" x="-40" y="-40" width="980" height="280">
      <feGaussianBlur stdDeviation="3.2" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>`;

/* на узком экране ось шире экрана и живёт в горизонтальной прокрутке —
   показываем её середину («сейчас»), а не левый край */
export function centerTimelines(root) {
  root.querySelectorAll('.tl-scroll').forEach(el => {
    el.scrollLeft = Math.max(0, (el.scrollWidth - el.clientWidth) / 2);
  });
}

/**
 * @param {object} tl        описание таймлайна из контента
 * @param {object} opts
 * @param {string} opts.color     основной цвет (CSS-значение)
 * @param {function} opts.colorOf ключ категории → CSS-цвет (для точечных маркеров)
 * @param {object} opts.labels    { past, future, now }
 */
export function timeline(tl, { color, ink = color, colorOf = () => color, inkOf = () => ink, labels = {} } = {}) {
  if (!tl) return '';
  const c = color;
  const Xn = p => +X(p);
  const shape = tl.shape || (tl.markers && tl.markers.length > 1 ? 'diamonds' : 'point');
  const L = { past: 'PAST', future: 'FUTURE', now: 'NOW', ...labels };
  const id = ++seq;
  const glow = `filter="url(#glw-${id})"`;

  const nowBits = `
    <g style="color:var(--c-now)">
      <ellipse class="glow" cx="${NOWX}" cy="118" rx="64" ry="96" fill="url(#nowglow-${id})"/>
    </g>
    <line class="nowdot" x1="${NOWX}" y1="46" x2="${NOWX}" y2="182"/>
    <text class="lbl-now" x="${NOWX}" y="34" text-anchor="middle">${L.now}</text>`;

  const axis = `
    <line class="axis-line" x1="18" y1="120" x2="876" y2="120"/>
    <path class="axis-head" d="M876 120 l-12 -6 v12 z" stroke="none"/>
    <text class="lbl-end" x="24"  y="168">${L.past}</text>
    <text class="lbl-end" x="812" y="168">${L.future}</text>`;

  const centerX = tl.center != null ? Xn(tl.center)
    : (tl.from != null && tl.to != null) ? (Xn(tl.from) + Xn(tl.to)) / 2 : +NOWX;

  let inner = '';

  if (shape === 'diamonds') {
    const xs = tl.markers ? tl.markers.map(m => Xn(m.pos)) : [centerX - 30, centerX, centerX + 30];
    xs.forEach((x, i) => {
      inner += `<rect class="pop" ${glow} x="${x - 8}" y="112" width="16" height="16" rx="3" fill="${c}"
                transform="rotate(45 ${x} 120)" style="animation-delay:${.15 + i * .1}s"/>`;
    });
  }
  else if (shape === 'point') {
    (tl.markers || []).forEach((m, i) => {
      const mc = m.color ? colorOf(m.color) : c;
      inner += `<circle class="pop" ${glow} cx="${Xn(m.pos)}" cy="120" r="9" fill="${mc}"
                style="animation-delay:${.15 + i * .1}s"/>`;
    });
  }
  else if (shape === 'wave') {
    inner += `<path class="draw" ${glow} pathLength="1" fill="none" stroke="${c}" stroke-width="3.5"
                stroke-linecap="round" d="${sine(centerX, 84, 17, 2)}"/>
              <circle class="pop" ${glow} cx="${centerX}" cy="120" r="7" fill="var(--surface-sunken)"
                stroke="${c}" stroke-width="2" style="animation-delay:.8s"/>`;
  }
  else if (shape === 'bump') {
    const hw = 58, a = centerX - hw, b = centerX + hw;
    inner += `<path class="draw" ${glow} pathLength="1" fill="none" stroke="${c}" stroke-width="3.5"
                stroke-linecap="round" d="${arch(centerX, hw, 26)}"/>
              <circle class="pop" ${glow} cx="${b}" cy="120" r="7" fill="${c}" style="animation-delay:.8s"/>
              <path class="draw" pathLength="1" fill="none" stroke="${c}" stroke-width="2" opacity=".6"
                d="M${a} 136 v6 h${b - a} v-6"/>`;
    if (tl.bracket) inner += `<text class="cap" x="${centerX}" y="162" text-anchor="middle" fill="${ink}">${tl.bracket}</text>`;
  }
  else if (shape === 'arrow') {
    const a = X(tl.from ?? 22);
    const end = tl.to != null ? Xn(tl.to) : +NOWX;
    inner += `<path class="draw" ${glow} pathLength="1" fill="none" d="M${a} 120 L${end - 6} 120"
                stroke="${c}" stroke-width="4" stroke-linecap="round"/>
              <path class="pop" ${glow} d="M${end} 120 l-15 -7 v14 z" fill="${c}" style="animation-delay:.8s"/>
              <text class="checkmark" x="${end - 26}" y="102" text-anchor="middle" fill="${ink}" font-size="22">✓</text>`;
  }
  else if (shape === 'arc') {
    const a = X(tl.from ?? 24), b = X(tl.to ?? 68);
    inner += `<path class="draw" ${glow} pathLength="1" fill="none" stroke="${c}" stroke-width="3"
                stroke-dasharray="2 7" stroke-linecap="round" d="M${a} 120 Q ${(+a + +b) / 2} 62, ${b} 120"/>
              <circle class="pop" ${glow} cx="${a}" cy="120" r="9" fill="${c}" style="animation-delay:.2s"/>
              <circle class="pop" ${glow} cx="${b}" cy="120" r="8" fill="${c}" opacity=".7" style="animation-delay:.9s"/>`;
  }

  let cap = '';
  const caps = tl.captions || (tl.caption ? [tl.caption] : []);
  caps.forEach(cp => {
    const cc = cp.color ? inkOf(cp.color) : ink;
    cap += `<text class="cap" x="${X(cp.pos)}" y="150" text-anchor="middle" fill="${cc}">${cp.text}</text>`;
  });

  return `<div class="tl-scroll"><svg class="tl" viewBox="0 0 900 200" xmlns="http://www.w3.org/2000/svg"
    role="img" aria-label="таймлайн">${defs(id)}${nowBits}${axis}${inner}${cap}</svg></div>`;
}
