/* ============================================================
   STORAGE — данные пользователя.
   Пока это localStorage, но форма уже «серверная»: один объект
   с версией, разложенный по курсам. Когда появится аккаунт,
   read()/write() меняются на вызовы API, остальной код — нет.
   ============================================================ */

const KEY = 'langlab.v1';

const EMPTY = () => ({ v: 1, prefs: {}, courses: {} });

function read() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    if (!raw || typeof raw !== 'object') return EMPTY();
    return { ...EMPTY(), ...raw };
  } catch {
    return EMPTY();
  }
}

function write(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* приватный режим — молча живём без сохранения */ }
}

function courseSlot(state, courseId) {
  if (!state.courses[courseId]) state.courses[courseId] = { lessons: {}, tests: {} };
  const slot = state.courses[courseId];
  slot.lessons ||= {};
  slot.tests ||= {};
  return slot;
}

/* подписчики на изменения — на них живёт отправка в БД (sync.js) */
const listeners = new Set();
const emit = change => listeners.forEach(fn => { try { fn(change); } catch { /* не роняем запись из-за слушателя */ } });

export const store = {
  onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); },

  /* --- прогресс по урокам --- */
  lessons(courseId) {
    return courseSlot(read(), courseId).lessons;
  },
  isLessonDone(courseId, lessonId) {
    return !!courseSlot(read(), courseId).lessons[lessonId];
  },
  markLessonDone(courseId, lessonId) {
    const state = read();
    const slot = courseSlot(state, courseId);
    if (slot.lessons[lessonId]) return;              // уже отмечен — не шлём повторно
    slot.lessons[lessonId] = { done: true, at: Date.now() };
    write(state);
    emit({ kind: 'lesson', courseId, lessonId });
  },
  lessonsDoneCount(courseId) {
    return Object.keys(courseSlot(read(), courseId).lessons).length;
  },

  /* --- лучшие результаты тестов --- */
  scores(courseId) {
    return courseSlot(read(), courseId).tests;
  },
  bestScore(courseId, testId) {
    return courseSlot(read(), courseId).tests[testId] || null;
  },
  /* локально держим лучший результат, в БД уезжает каждая попытка;
     возвращаем true, если это рекорд */
  saveScore(courseId, testId, correct, total) {
    const state = read();
    const tests = courseSlot(state, courseId).tests;
    const prev = tests[testId];
    const isBest = !prev || correct > prev.correct;
    if (isBest) {
      tests[testId] = { correct, total, at: Date.now() };
      write(state);
    }
    emit({ kind: 'score', courseId, testId, correct, total });
    return isBest;
  },

  /* влить состояние с сервера: уроки объединяем, по тестам берём лучшее */
  mergeRemote(courseId, { lessons = [], tests = [] }) {
    const state = read();
    const slot = courseSlot(state, courseId);
    let changed = false;

    lessons.forEach(({ lesson, at }) => {
      if (slot.lessons[lesson]) return;
      slot.lessons[lesson] = { done: true, at: at || Date.now() };
      changed = true;
    });

    tests.forEach(({ test, correct, total, at }) => {
      const prev = slot.tests[test];
      if (prev && prev.correct >= correct) return;
      slot.tests[test] = { correct, total, at: at || Date.now() };
      changed = true;
    });

    if (changed) write(state);
    return changed;
  },

  /* --- настройки (тема и т.п.) --- */
  pref(key, fallback = null) {
    const v = read().prefs[key];
    return v === undefined ? fallback : v;
  },
  setPref(key, value) {
    const state = read();
    state.prefs[key] = value;
    write(state);
  },

  /* --- всё разом: пригодится при переезде в БД --- */
  exportAll() { return read(); },
};
