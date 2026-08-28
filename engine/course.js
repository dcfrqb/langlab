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
    /* Обычный тест описывает свой пул фильтром по банку. Доза дня
       (см. engine/review.js) приходит готовым списком: её состав считается
       по расписанию повторений, а не по признаку вопроса, и фильтром
       такое не выражается. */
    poolFor(test) { return test.questions || raw.questions.filter(test.filter); },
    testSize(test) { return Math.min(test.pick, this.poolFor(test).length); },

    /* как назвать книгу-источник; курс без книг отдаёт id как есть */
    bookName(id) { return raw.books?.[id] || id; },

    /* Как назвать зону в журнале ошибок. Зона — это метка вопроса
       (`tag`), а метки писались для фильтров тестов, не для глаз:
       «prep3» в отчёте о собственных ошибках читать невозможно.
       Курс, у которого вопросы размечены группами (`g`), словарь
       не заводит — там имена и так человеческие. */
    zoneLabel(key) { return raw.zones?.[key] || key; },

    /* Из каких учебников собрана тема — по ссылкам на источник в её шагах.
       Нужно на витрине: план должен показывать, что за ним стоят книги,
       а не выглядеть списком слов, взятых из головы. */
    booksOf(lesson) {
      const ids = new Set();
      (lesson.steps || []).forEach(step => {
        if (step.src?.book) ids.add(step.src.book);
        if (step.algorithm?.source?.book) ids.add(step.algorithm.source.book);
      });
      return [...ids].map(id => this.bookName(id));
    },

    /* цвет урока/теста — движок красит им весь экран через --accent.
       Сборный прогон (доза дня) в аспекты курса не укладывается и называет
       свой цвет ролью прямо — на то роли и заведены. */
    accentFor(item) { return item.accent || this.colorOf(item.aspect); },
    inkFor(item) { return this.inkOf(item.aspect); },
  };
}
