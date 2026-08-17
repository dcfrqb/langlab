/* ============================================================
   NAV — общая шапка экранов (бренд, разделы, аккаунт, тема).
   ============================================================ */
import { themeButtonHTML, bindThemeButton } from './theme.js';
import { icon } from '../ui/icons.js';
import { api } from './api.js';

/* «Тесты» показываем только курсу, у которого они есть: у медицины
   вместо них повторение алгоритмов, и пустая вкладка только сбивала бы. */
const LINKS = course => [
  { href: '#/',        label: 'Темы',       key: 'home' },
  ...(course.terms?.length ? [{ href: '#/terms', label: 'Термины', key: 'terms' }] : []),
  ...(course.tests?.length ? [{ href: '#/tests', label: 'Тесты', key: 'tests' }] : []),
  { href: '#/results', label: 'Результаты', key: 'results' },
];

function accountHTML(active) {
  if (!api.isAuthed) {
    return `<a href="#/login" class="nav-acc ${active === 'login' ? 'active' : ''}">Войти</a>`;
  }
  const name = api.user.email.split('@')[0];
  return `<button class="nav-acc" id="logoutBtn" type="button"
    title="${api.user.email} — выйти" aria-label="Выйти из аккаунта ${api.user.email}">${name}${icon('logout')}</button>`;
}

export function navHTML(course, active) {
  return `
    <nav class="nav"><div class="nav-inner">
      <a class="brand" href="#/"><span class="dot"></span> ${course.brand.name}<span class="dim">${course.brand.suffix}</span></a>
      <div class="nav-links">
        ${LINKS(course).map(l => `<a href="${l.href}" class="${l.key === active ? 'active' : ''}">${l.label}</a>`).join('')}
        ${accountHTML(active)}
      </div>
      ${themeButtonHTML()}
    </div></nav>`;
}

export function bindNav(root) {
  bindThemeButton(root);
  root.querySelector('#logoutBtn')?.addEventListener('click', () => {
    api.logout();
    location.hash = '#/';
    location.reload();          // проще перерисовать всё, чем чинить состояние по кусочкам
  });
}
