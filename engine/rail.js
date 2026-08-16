/* ============================================================
   RAIL — цветная лента всех уроков курса: где ты и что пройдено.
   ============================================================ */
import { store } from './storage.js';

export function railHTML(course, currentId = null) {
  const done = store.lessons(course.id);
  return `<div class="rail" role="list">${course.lessons.map(l => {
    const cls = ['seg', done[l.id] ? '' : 'is-todo', l.id === currentId ? 'is-here' : ''].filter(Boolean).join(' ');
    const state = done[l.id] ? 'пройдено' : 'не пройдено';
    return `<span class="${cls}" role="listitem" style="color:${course.accentFor(l)}"
      data-go="${l.id}" title="${l.n}. ${l.title} — ${state}" aria-label="${l.title}, ${state}"></span>`;
  }).join('')}</div>`;
}

export function bindRail(root) {
  root.querySelectorAll('[data-go]').forEach(seg =>
    seg.addEventListener('click', () => { location.hash = '#/lesson/' + seg.dataset.go; }));
}
