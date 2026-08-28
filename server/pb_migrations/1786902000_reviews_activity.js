/// <reference path="../pb_data/types.d.ts" />

/**
 * Повторения и ритм.
 *
 * До сих пор в базе от целого прохода теста оставалась одна строка
 * «14 из 18». По ней нельзя ни назначить повторение, ни собрать журнал
 * ошибок: она помнит рекорд, но не помнит, ЧТО именно было мимо и когда
 * это в последний раз вспоминали. Отсюда и провал после перерыва — тема,
 * закрытая на 8/8, больше никогда не всплывала.
 *
 * Две коллекции:
 *
 *   reviews  — расписание по каждому вопросу: ступень, дата следующего
 *              показа, сколько раз видел и сколько раз мимо. Одна строка
 *              на вопрос, её правят, а не копят: журнал каждого нажатия
 *              рос бы тысячами строк в год и отвечал бы ровно на те же
 *              вопросы. Ключ вопроса считается из его текста и ответа
 *              (engine/review.js) — своего id у вопросов в контенте нет.
 *
 *   activity — сколько ответов было в каждом дне. Ритм считается
 *              плотностью («11 дней из 14»), а не серией подряд,
 *              поэтому нужны сами дни, а не счётчик и дата последнего.
 *
 * Даты — текстом `YYYY-MM-DD`, а не полем date: день здесь календарный
 * и локальный для человека, а datetime тянет за собой часовой пояс,
 * из-за которого «сегодня» на сервере и «сегодня» в браузере разъезжаются.
 */
migrate((app) => {
  const users = app.findCollectionByNameOrId('users');
  const owner = () => ({
    name: 'user',
    type: 'relation',
    required: true,
    collectionId: users.id,
    cascadeDelete: true,
    maxSelect: 1,
  });
  const ownRecord = '@request.auth.id != "" && user = @request.auth.id';
  const ownAndKeepOwner = `${ownRecord} && @request.body.user:isset = false`;

  /* ---------- расписание повторений ---------- */
  const reviews = new Collection({
    type: 'base',
    name: 'reviews',
    listRule: ownRecord,
    viewRule: ownRecord,
    createRule: '@request.auth.id != "" && user = @request.auth.id',
    updateRule: ownAndKeepOwner,
    deleteRule: ownRecord,
    fields: [
      owner(),
      { name: 'course',   type: 'text', required: true, max: 32 },
      { name: 'question', type: 'text', required: true, max: 32 },  // ключ из текста вопроса
      { name: 'box',      type: 'number', required: true, min: 0, max: 5, onlyInt: true },
      { name: 'due',      type: 'text', required: true, max: 10 },  // YYYY-MM-DD
      { name: 'seen',     type: 'number', min: 0, onlyInt: true },
      { name: 'missed',   type: 'number', min: 0, onlyInt: true },
      { name: 'last',     type: 'text', max: 10 },                  // когда отвечали в последний раз
      { name: 'created', type: 'autodate', onCreate: true },
      { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
    ],
    indexes: [
      'CREATE UNIQUE INDEX `idx_reviews_user_question` ON `reviews` (`user`,`course`,`question`)',
      'CREATE INDEX `idx_reviews_due` ON `reviews` (`user`,`course`,`due`)',
    ],
  });
  app.save(reviews);

  /* ---------- ритм: сколько ответов в каждом дне ---------- */
  const activity = new Collection({
    type: 'base',
    name: 'activity',
    listRule: ownRecord,
    viewRule: ownRecord,
    createRule: '@request.auth.id != "" && user = @request.auth.id',
    updateRule: ownAndKeepOwner,
    deleteRule: ownRecord,
    fields: [
      owner(),
      { name: 'course',   type: 'text', required: true, max: 32 },
      { name: 'day',      type: 'text', required: true, max: 10 },   // YYYY-MM-DD
      { name: 'answered', type: 'number', required: true, min: 0, onlyInt: true },
      { name: 'created', type: 'autodate', onCreate: true },
      { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
    ],
    indexes: ['CREATE UNIQUE INDEX `idx_activity_user_day` ON `activity` (`user`,`course`,`day`)'],
  });
  app.save(activity);

  console.log('[migration] reviews + activity: расписание повторений и ритм заведены');
}, (app) => {
  for (const name of ['reviews', 'activity']) {
    try {
      app.delete(app.findCollectionByNameOrId(name));
    } catch (_) { /* уже нет — и хорошо */ }
  }
});
