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
    const fields = { level: p.level, goal: p.goal, survey: p.survey };
    /* В правку `user` не кладём: правило коллекции требует, чтобы владельца
       не переписывали (`@request.body.user:isset = false`), и на присланное
       поле PocketBase отвечает 404 — профиль молча не сохранялся. */
    if (existing.length) await api.update('profiles', existing[0].id, fields);
    else await api.create('profiles', { user, ...fields });
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

  /* Какой курс у человека назначен: у него программа по медицине —
     значит открывать надо медицину, а не общий курс по умолчанию.

     Назначенная руками программа (source:'hand') главнее собранной опросом:
     иначе случайная анонимная программа, приехавшая в аккаунт при входе,
     перетягивает человека на чужой курс. По дате этого не различить —
     самопальная почти всегда свежее. */
  async activeCourse() {
    if (!api.isAuthed) return null;
    try {
      const programs = await api.list('programs', {
        filter: api.mine('active = true'), sort: '-updated',
      });
      if (!programs.length) return null;
      const assigned = programs.find(p => p.source === 'hand');
      return (assigned || programs[0]).course;
    } catch {
      return null;                                   // оффлайн — остаёмся где были
    }
  },

  /* забрать своё из БД и влить в локальное состояние */
  async pull(courseId) {
    if (!api.isAuthed) return false;
    store.setAccount(api.user.id);      // всё, что тут окажется, — этого аккаунта
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

  /* Принять локальное состояние в аккаунт.

     Состояние в браузере принадлежит либо этому человеку, либо никому:
     если оно осталось от другого аккаунта (проверял чужую ссылку на своём
     ноуте), это чужой кэш — отправлять его нельзя. Именно так медицинская
     программа уехала в аккаунт Карины, а результаты по английскому — в
     медицинский. Приоритет `hand` в activeCourse() прячет симптом,
     причина — здесь.

     Возвращает true, если нарешанное уехало в аккаунт, false — если
     локальное состояние оказалось чужим и его стёрли. */
  async adopt(courseId, userId) {
    const previous = store.account();
    const foreign = previous && previous !== userId;

    if (foreign) {
      store.forgetCourses();
      writeQueue([]);                                // и очередь тоже чужая
    }
    store.setAccount(userId);

    if (foreign) return false;
    await sync.pushLocal(courseId);
    return true;
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
    /* Отправляем только заведомо своё: `from: 'local'` ставит опрос здесь.
       Серверная копия назад не едет, а запись без метки осталась с прошлых
       версий — чьё это, мы уже не знаем, и в аккаунт её не тащим. */
    if (profile?.from === 'local') q.push({ kind: 'profile', courseId, profile });
    if (program?.from === 'local') q.push({ kind: 'program', courseId, program });

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
