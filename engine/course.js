/* ============================================================
   COURSE — обёртка над манифестом курса.
   Всё, что движку нужно знать о конкретном языке, спрашивается
   только здесь: цвет категории, урок по id, пул вопросов теста.
   ============================================================ */

export function makeCourse(raw) {
  const byKey = new Map((raw.categories || []).map(c => [c.key, c]));
  const fallback = raw.categories?.[0]?.color || 'var(--c-blue)';

  return {
    ...raw,

    colorOf(key) { return byKey.get(key)?.color || fallback; },
    labelOf(key) { return byKey.get(key)?.label || ''; },

    lessonById(id) { return raw.lessons.find(l => l.id === id) || null; },
    lessonsByGroup(group) { return raw.lessons.filter(l => l.group === group); },
    get lessonCount() { return raw.lessons.length; },

    testById(id) { return raw.tests.find(t => t.id === id) || null; },
    poolFor(test) { return raw.questions.filter(test.filter); },
    testSize(test) { return Math.min(test.pick, this.poolFor(test).length); },

    /* цвет урока/теста — движок красит им весь экран через --accent */
    accentFor(item) { return this.colorOf(item.aspect); },
  };
}
