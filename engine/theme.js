/* ============================================================
   THEME — светло / темно / как в системе.
   Выбор хранится в prefs и ставится атрибутом на <html>.
   ============================================================ */
import { store } from './storage.js';
import { icon } from '../ui/icons.js';

const ORDER = ['system', 'light', 'dark'];
const ICON = { system: 'contrast', light: 'sun', dark: 'moon' };
const TITLE = { system: 'Тема: как в системе', light: 'Тема: светлая', dark: 'Тема: тёмная' };

export function currentTheme() {
  const t = store.pref('theme', 'system');
  return ORDER.includes(t) ? t : 'system';
}

export function applyTheme(theme = currentTheme()) {
  const root = document.documentElement;
  if (theme === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', theme);
}

export function initTheme() {
  applyTheme();
}

/* кнопка в шапке — рисуется движком, чтобы не дублировать в каждом экране */
export function themeButtonHTML() {
  const t = currentTheme();
  return `<button class="btn btn-secondary btn-icon" id="themeBtn" type="button"
    title="${TITLE[t]} — нажми, чтобы сменить" aria-label="${TITLE[t]}">${icon(ICON[t])}</button>`;
}

export function bindThemeButton(root) {
  const btn = root.querySelector('#themeBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const next = ORDER[(ORDER.indexOf(currentTheme()) + 1) % ORDER.length];
    store.setPref('theme', next);
    applyTheme(next);
    btn.innerHTML = icon(ICON[next]);
    btn.title = `${TITLE[next]} — нажми, чтобы сменить`;
    btn.setAttribute('aria-label', TITLE[next]);
  });
}
