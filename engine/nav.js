/* ============================================================
   NAV — общая шапка экранов (бренд, разделы, переключатель темы).
   ============================================================ */
import { themeButtonHTML, bindThemeButton } from './theme.js';

const LINKS = [
  { href: '#/',        label: 'Темы',        key: 'home' },
  { href: '#/tests',   label: 'Тесты',       key: 'tests' },
  { href: '#/results', label: 'Результаты',  key: 'results' },
];

export function navHTML(course, active) {
  return `
    <nav class="nav"><div class="nav-inner">
      <a class="brand" href="#/"><span class="dot"></span> ${course.brand.name}<span class="dim">${course.brand.suffix}</span></a>
      <div class="nav-links">
        ${LINKS.map(l => `<a href="${l.href}" class="${l.key === active ? 'active' : ''}">${l.label}</a>`).join('')}
      </div>
      ${themeButtonHTML()}
    </div></nav>`;
}

export function bindNav(root) {
  bindThemeButton(root);
}
