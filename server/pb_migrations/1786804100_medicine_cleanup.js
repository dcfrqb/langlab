/// <reference path="../pb_data/types.d.ts" />

/**
 * Убрать из медицинского аккаунта чужое английское.
 *
 * Откуда взялось: вход по персональной ссылке отправляет в аккаунт всё, что
 * человек нарешал до входа (это правильно — иначе анонимный прогресс теряется).
 * Но ссылку проверяли из браузера, где уже лежало чужое анонимное состояние по
 * английскому, и оно уехало в этот аккаунт: результаты теста и программа,
 * собранная опросом.
 *
 * Прогресс и программу удалось погасить через API от имени владельца, а вот
 * результаты тестов правилами коллекции не удаляются никем, кроме суперюзера
 * (`deleteRule: null` — попытку не переписывают, её добавляют). Отсюда миграция.
 *
 * Чистим строго по курсу: медицинские записи этого аккаунта не трогаем.
 */
migrate((app) => {
  const EMAIL = 'medicine@langlab.local';

  try {
    const user = app.findFirstRecordByFilter('users', 'email = {:email}', { email: EMAIL });

    let removed = 0;
    for (const name of ['test_results', 'progress', 'programs']) {
      const records = app.findRecordsByFilter(
        name,
        'user = {:id} && course = "en-ru"',
        '-created', 200, 0,
        { id: user.id },
      );
      for (const record of records) {
        app.delete(record);
        removed += 1;
      }
    }

    console.log(`[medicine] убрано чужих записей по en-ru: ${removed}`);
  } catch (err) {
    console.log('[medicine] чистка не выполнена:', err);
  }
}, (app) => {
  // откатывать нечего: возвращать удалённый чужой прогресс незачем
});
