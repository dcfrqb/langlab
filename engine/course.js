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
    /* тот же цвет для ТЕКСТА: в светлой теме он темнее, иначе подпись
       цветом фигуры на белом читается плохо */
    inkOf(key) { return byKey.get(key)?.ink || byKey.get(key)?.color || fallback; },
    labelOf(key) { return byKey.get(key)?.label || ''; },

    lessonById(id) { return raw.lessons.find(l => l.id === id) || null; },
    lessonsByGroup(group) { return raw.lessons.filter(l => l.group === group); },
    get lessonCount() { return raw.lessons.length; },

    /* Глоссарий не хранится отдельно: термины живут в уроках, где их
       и учат, а экран словаря собирается из шагов type:'terms'.
       Иначе список и уроки разъезжаются — и словарь начинает врать. */
    get terms() {
      const out = [];
      raw.lessons.forEach(lesson => {
        (lesson.steps || []).forEach(step => {
          if (step.type !== 'terms') return;
          (step.items || []).forEach(item => out.push({ ...item, lesson }));
        });
      });
      return out;
    },

    testById(id) { return raw.tests.find(t => t.id === id) || null; },
    poolFor(test) { return raw.questions.filter(test.filter); },
    testSize(test) { return Math.min(test.pick, this.poolFor(test).length); },

    /* как назвать книгу-источник; курс без книг отдаёт id как есть */
    bookName(id) { return raw.books?.[id] || id; },

    /* цвет урока/теста — движок красит им весь экран через --accent */
    accentFor(item) { return this.colorOf(item.aspect); },
    inkFor(item) { return this.inkOf(item.aspect); },
  };
}
