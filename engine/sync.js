/* ============================================================
   SYNC — мост между локальным состоянием и базой.

   Правило: экран всегда пишет в localStorage и рисуется мгновенно,
   а отправка в БД идёт фоном через очередь. Нет сети или не вошёл —
   ничего не теряется: очередь доживёт до следующего запуска.
   ============================================================ */
import { store } from './storage.js';
import { api } from './api.js';

const QUEUE_KEY = 'langlab.queue.v1';

const readQueue = () => {
  try { return JSON.parse(localStorage.getItem(QUEUE_KEY)) || []; } catch { return []; }
};
const writeQueue = q => {
  try { localStorage.setItem(QUEUE_KEY, JSON.stringify(q)); } catch { /* приватный режим */ }
};

let flushing = false;

async function sendOne(item) {
  const user = api.user.id;

  if (item.kind === 'lesson') {
    const existing = await api.list('progress', {
      filter: api.mine(`course="${item.courseId}" && lesson="${item.lessonId}"`), perPage: 1,
    });
    if (existing.length) return;                   // уже отмечен на сервере
    await api.create('progress', {
      user, course: item.courseId, lesson: item.lessonId, status: 'done',
    });
    return;
  }

  if (item.kind === 'score') {
    await api.create('test_results', {
      user, course: item.courseId, test: item.testId,
      correct: item.correct, total: item.total, source: 'app',
    });
  }
}

export const sync = {
  /* положить изменение в очередь и попробовать отправить */
  enqueue(change) {
    const q = readQueue();
    q.push({ ...change, at: Date.now() });
    writeQueue(q);
    sync.flush();
  },

  async flush() {
    if (flushing || !api.isAuthed || !navigator.onLine) return;
    const queue = readQueue();
    if (!queue.length) return;

    flushing = true;
    const left = [];
    for (const item of queue) {
      try {
        await sendOne(item);
      } catch (e) {
        // 4xx — данные кривые, повтор не поможет; всё остальное пробуем позже
        if (!(e.status >= 400 && e.status < 500)) left.push(item);
      }
    }
    writeQueue(left);
    flushing = false;
  },

  /* забрать своё из БД и влить в локальное состояние */
  async pull(courseId) {
    if (!api.isAuthed) return false;
    const [progress, results] = await Promise.all([
      api.list('progress', { filter: api.mine(`course="${courseId}"`) }),
      api.list('test_results', { filter: api.mine(`course="${courseId}"`), sort: '-created' }),
    ]);

    const best = new Map();
    results.forEach(r => {
      const prev = best.get(r.test);
      if (!prev || r.correct > prev.correct) best.set(r.test, r);
    });

    return store.mergeRemote(courseId, {
      lessons: progress.map(p => ({ lesson: p.lesson, at: Date.parse(p.created) || Date.now() })),
      tests: [...best.values()].map(r => ({
        test: r.test, correct: r.correct, total: r.total, at: Date.parse(r.created) || Date.now(),
      })),
    });
  },

  /* отправить в БД всё, что человек успел нарешать до входа */
  async pushLocal(courseId) {
    const lessons = store.lessons(courseId);
    const scores = store.scores(courseId);
    const q = readQueue();
    Object.keys(lessons).forEach(lessonId => q.push({ kind: 'lesson', courseId, lessonId }));
    Object.entries(scores).forEach(([testId, s]) =>
      q.push({ kind: 'score', courseId, testId, correct: s.correct, total: s.total }));
    writeQueue(q);
    await sync.flush();
  },

  /* завести всё это один раз при старте приложения */
  init(courseId, onPulled) {
    store.onChange(change => sync.enqueue(change));
    window.addEventListener('online', () => sync.flush());

    if (!api.isAuthed) return;
    api.refresh()
      .then(user => (user ? sync.pull(courseId) : false))
      .then(changed => { if (changed) onPulled?.(); })
      .then(() => sync.flush())
      .catch(() => { /* оффлайн — не мешаем работать */ });
  },
};
