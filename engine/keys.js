/* ============================================================
   KEYS — один глобальный слушатель клавиатуры.
   Экран ставит свой обработчик, движок снимает старый.
   ============================================================ */

let handler = null;

export function setKeys(fn) { handler = fn || null; }

export function initKeys() {
  window.addEventListener('keydown', e => { if (handler) handler(e); });
}
