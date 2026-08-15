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

export const store = {
  /* --- прогресс по урокам --- */
  lessons(courseId) {
    return courseSlot(read(), courseId).lessons;
  },
  isLessonDone(courseId, lessonId) {
    return !!courseSlot(read(), courseId).lessons[lessonId];
  },
  markLessonDone(courseId, lessonId) {
    const state = read();
    courseSlot(state, courseId).lessons[lessonId] = { done: true, at: Date.now() };
    write(state);
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
  /* пишем только если результат лучше прежнего; возвращаем true, если рекорд */
  saveScore(courseId, testId, correct, total) {
    const state = read();
    const tests = courseSlot(state, courseId).tests;
    const prev = tests[testId];
    if (prev && prev.correct >= correct) return false;
    tests[testId] = { correct, total, at: Date.now() };
    write(state);
    return true;
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
