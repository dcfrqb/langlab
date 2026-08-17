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
    return;
  }

  if (item.kind === 'profile') {
    const p = item.profile;
    const existing = await api.list('profiles', { filter: api.mine(), perPage: 1 });
    const data = { user, level: p.level, goal: p.goal, survey: p.survey };
    if (existing.length) await api.update('profiles', existing[0].id, data);
    else await api.create('profiles', data);
    return;
  }

  if (item.kind === 'program') {
    // программу заводим только если её ещё нет: ручную правку из админки не трогаем
    const existing = await api.list('programs', {
      filter: api.mine(`course="${item.courseId}"`), perPage: 1,
    });
    if (existing.length) return;
    const p = item.program;
    await api.create('programs', {
      user, course: item.courseId, title: p.title, items: p.items,
      note: p.note, active: true, source: 'survey',
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

  /* какой курс у человека назначен: у него программа по медицине —
     значит открывать надо медицину, а не общий курс по умолчанию */
  async activeCourse() {
    if (!api.isAuthed) return null;
    try {
      const programs = await api.list('programs', {
        filter: api.mine('active = true'), sort: '-updated', perPage: 1,
      });
      return programs[0]?.course || null;
    } catch {
      return null;                                   // оффлайн — остаёмся где были
    }
  },

  /* забрать своё из БД и влить в локальное состояние */
  async pull(courseId) {
    if (!api.isAuthed) return false;
    const [progress, results, profiles, programs] = await Promise.all([
      api.list('progress', { filter: api.mine(`course="${courseId}"`) }),
      api.list('test_results', { filter: api.mine(`course="${courseId}"`), sort: '-created' }),
      api.list('profiles', { filter: api.mine(), perPage: 1 }),
      api.list('programs', { filter: api.mine(`course="${courseId}"`), sort: '-updated', perPage: 1 }),
    ]);

    /* профиль и программа на сервере главнее: их мог поправить админ */
    if (profiles[0]) {
      const p = profiles[0];
      store.setProfile(courseId, { level: p.level, goal: p.goal, survey: p.survey }, { silent: true });
    }
    if (programs[0]) {
      const p = programs[0];
      store.setProgram(courseId, { title: p.title, items: p.items || [], note: p.note }, { silent: true });
    }

    const best = new Map();
    results.forEach(r => {
      const prev = best.get(r.test);
      if (!prev || r.correct > prev.correct) best.set(r.test, r);
    });

    const merged = store.mergeRemote(courseId, {
      lessons: progress.map(p => ({ lesson: p.lesson, at: Date.parse(p.created) || Date.now() })),
      tests: [...best.values()].map(r => ({
        test: r.test, correct: r.correct, total: r.total, at: Date.parse(r.created) || Date.now(),
      })),
    });
    return merged || !!profiles[0] || !!programs[0];
  },

  /* отправить в БД всё, что человек успел нарешать до входа */
  async pushLocal(courseId) {
    const lessons = store.lessons(courseId);
    const scores = store.scores(courseId);
    const profile = store.profile(courseId);
    const program = store.program(courseId);
    const q = readQueue();

    Object.keys(lessons).forEach(lessonId => q.push({ kind: 'lesson', courseId, lessonId }));
    Object.entries(scores).forEach(([testId, s]) =>
      q.push({ kind: 'score', courseId, testId, correct: s.correct, total: s.total }));
    if (profile) q.push({ kind: 'profile', courseId, profile });
    if (program) q.push({ kind: 'program', courseId, program });

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
