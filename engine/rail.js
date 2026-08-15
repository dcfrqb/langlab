/* ============================================================
   RAIL — цветная лента всех уроков курса: где ты и что пройдено.
   ============================================================ */
import { store } from './storage.js';

export function railHTML(course, currentId = null) {
  const done = store.lessons(course.id);
  return `<div class="rail">${course.lessons.map(l => {
    const cls = ['seg', done[l.id] ? '' : 'dim', l.id === currentId ? 'here' : ''].filter(Boolean).join(' ');
    return `<span class="${cls}" style="color:${course.accentFor(l)}" data-go="${l.id}" title="${l.title}"></span>`;
  }).join('')}</div>`;
}

export function bindRail(root) {
  root.querySelectorAll('[data-go]').forEach(seg =>
    seg.addEventListener('click', () => { location.hash = '#/lesson/' + seg.dataset.go; }));
}
