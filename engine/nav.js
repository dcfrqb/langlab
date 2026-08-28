/* ============================================================
   NAV — общая шапка экранов (бренд, разделы, аккаунт, тема).
   ============================================================ */
import { themeButtonHTML, bindThemeButton } from './theme.js';
import { icon } from '../ui/icons.js';
import { api } from './api.js';

/* Раздел показываем только курсу, у которого он есть: у медицины нет опроса
   на уровень, у английского нет словаря терминов, и пустая вкладка сбивала бы.
   Подпись словаря курс может переназвать: у медицины это «Термины»,
   у IELTS — «Фразы»; список один, а называется он по-разному. */
const LINKS = course => [
  { href: '#/',        label: 'Темы',       key: 'home' },
  ...(course.questions?.length ? [{ href: '#/today', label: 'Сегодня', key: 'today' }] : []),
  ...(course.terms?.length ? [{ href: '#/terms', label: course.termsCopy?.nav || 'Термины', key: 'terms' }] : []),
  ...(course.tests?.length ? [{ href: '#/tests', label: 'Тесты', key: 'tests' }] : []),
  { href: '#/results', label: 'Результаты', key: 'results' },
  ...(course.estimate ? [{ href: '#/level', label: course.levelNav || 'Готовность', key: 'level' }] : []),
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
