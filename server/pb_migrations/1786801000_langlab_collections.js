/// <reference path="../pb_data/types.d.ts" />

/**
 * Схема langlab.
 *
 * Принцип: контент (уроки, тесты) живёт в git и сюда не копируется — в базе
 * только ссылки на его id. В БД лежит то, что принадлежит человеку:
 * профиль, персональная программа, прогресс, результаты тестов.
 *
 * Все коллекции закрыты правилом «вижу только своё»: суперюзер (админка)
 * правила обходит, поэтому программу под человека можно править руками.
 */
migrate((app) => {
  const users = app.findCollectionByNameOrId('users');
  const owner = (extra = {}) => ({
    name: 'user',
    type: 'relation',
    required: true,
    collectionId: users.id,
    cascadeDelete: true,
    maxSelect: 1,
    ...extra,
  });
  const ownRecord = '@request.auth.id != "" && user = @request.auth.id';
  const ownAndKeepOwner = `${ownRecord} && @request.body.user:isset = false`;

  /* ---------- профиль: ответы опроса, уровень, цель ---------- */
  const profiles = new Collection({
    type: 'base',
    name: 'profiles',
    listRule: ownRecord,
    viewRule: ownRecord,
    createRule: '@request.auth.id != "" && user = @request.auth.id',
    updateRule: ownAndKeepOwner,
    deleteRule: null,                       // профиль удаляется вместе с юзером
    fields: [
      owner(),
      { name: 'display_name', type: 'text', max: 80 },
      { name: 'native_lang',  type: 'text', max: 8 },   // ru
      { name: 'level',        type: 'text', max: 8 },   // A1…C2, ставится опросом
      { name: 'goal',         type: 'text', max: 200 }, // «IELTS 7», «с нуля», …
      { name: 'survey',       type: 'json', maxSize: 200000 }, // сырые ответы опроса
      { name: 'created', type: 'autodate', onCreate: true },
      { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
    ],
    indexes: ['CREATE UNIQUE INDEX `idx_profiles_user` ON `profiles` (`user`)'],
  });
  app.save(profiles);

  /* ---------- программа = плейлист поверх общего контента ---------- */
  const programs = new Collection({
    type: 'base',
    name: 'programs',
    listRule: ownRecord,
    viewRule: ownRecord,
    createRule: null,                       // программы назначаю я через админку
    updateRule: null,
    deleteRule: null,
    fields: [
      owner(),
      { name: 'course', type: 'text', required: true, max: 32 },  // en-ru
      { name: 'title',  type: 'text', required: true, max: 120 }, // «IELTS 7 — Карина»
      { name: 'items',  type: 'json', required: true, maxSize: 500000 }, // ["to-be","present-simple",…]
      { name: 'active', type: 'bool' },
      { name: 'note',   type: 'text', max: 500 },
      { name: 'created', type: 'autodate', onCreate: true },
      { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
    ],
    indexes: ['CREATE INDEX `idx_programs_user_course` ON `programs` (`user`,`course`)'],
  });
  app.save(programs);

  /* ---------- прогресс по урокам ---------- */
  const progress = new Collection({
    type: 'base',
    name: 'progress',
    listRule: ownRecord,
    viewRule: ownRecord,
    createRule: '@request.auth.id != "" && user = @request.auth.id',
    updateRule: ownAndKeepOwner,
    deleteRule: ownRecord,
    fields: [
      owner(),
      { name: 'course', type: 'text', required: true, max: 32 },
      { name: 'lesson', type: 'text', required: true, max: 64 },
      { name: 'status', type: 'text', required: true, max: 16 },  // done
      { name: 'created', type: 'autodate', onCreate: true },
      { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
    ],
    indexes: ['CREATE UNIQUE INDEX `idx_progress_user_lesson` ON `progress` (`user`,`course`,`lesson`)'],
  });
  app.save(progress);

  /* ---------- результаты тестов: храним каждую попытку ---------- */
  const results = new Collection({
    type: 'base',
    name: 'test_results',
    listRule: ownRecord,
    viewRule: ownRecord,
    createRule: '@request.auth.id != "" && user = @request.auth.id',
    updateRule: null,                       // попытку не переписывают, её добавляют
    deleteRule: null,
    fields: [
      owner(),
      { name: 'course',  type: 'text', required: true, max: 32 },
      { name: 'test',    type: 'text', required: true, max: 64 },
      { name: 'correct', type: 'number', required: true, min: 0, onlyInt: true },
      { name: 'total',   type: 'number', required: true, min: 1, onlyInt: true },
      { name: 'source',  type: 'text', max: 32 },   // 'app' | 'migration' — откуда приехало
      { name: 'created', type: 'autodate', onCreate: true },
    ],
    indexes: ['CREATE INDEX `idx_results_user_test` ON `test_results` (`user`,`course`,`test`)'],
  });
  app.save(results);
}, (app) => {
  for (const name of ['test_results', 'progress', 'programs', 'profiles']) {
    try {
      app.delete(app.findCollectionByNameOrId(name));
    } catch (_) { /* уже нет — и хорошо */ }
  }
});
