/// <reference path="../pb_data/types.d.ts" />

/**
 * Программа стала полной: три части по главам учебников вместо трёх тем.
 *
 * Порядок тот же, что в `content/medicine/lessons.js` — программа это
 * плейлист поверх контента, и листать её нужно подряд, как книгу.
 * Список продублирован здесь руками: миграция не может импортировать
 * ES-модули фронта, а расхождение поймает tools/medicine/check.mjs
 * (он сверяет id программы с уроками курса).
 */
migrate((app) => {
  const ITEMS = [
    // Часть 1 · Кардиология
    'bradyarrhythmias', 'svt-atrial', 'svt-av', 'vt', 'chf', 'cardiomyopathy', 'angina', 'acs',
    // Часть 2 · Эндокринология
    'diabetes', 'thyroid-tests', 'hyperthyroid', 'hypothyroid', 'adh', 'cushing', 'adrenal-htn',
    // Часть 3 · Неотложное и травма
    'primary-survey', 'shock', 'burns', 'thermal', 'toxicology',
  ];

  try {
    const user = app.findFirstRecordByFilter('users', 'email = {:email}',
      { email: 'medicine@langlab.local' });
    const program = app.findFirstRecordByFilter('programs',
      'user = {:id} && course = "medicine"', { id: user.id });

    program.set('title', 'First Aid: три части');
    program.set('items', ITEMS);
    program.set('note', 'Три части по главам учебников: кардиология, эндокринология, ' +
      'неотложное и травма. Темы идут в порядке книги — можно листать подряд. ' +
      'В конце каждой части есть рубеж, отдельно — тест по терминам.');
    app.save(program);

    console.log(`[medicine] программа обновлена: ${ITEMS.length} тем`);
  } catch (err) {
    console.log('[medicine] программа не обновлена:', err);
  }
}, (app) => {
  // откат не нужен: старый список из трёх тем ничем не лучше
});
