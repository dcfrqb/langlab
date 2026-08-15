/// <reference path="../pb_data/types.d.ts" />

/**
 * Хук выписывает токен при создании и обновлении, но аккаунты, заведённые
 * раньше него, остались без ссылки. Выдаём им токен разово.
 */
migrate((app) => {
  const users = app.findAllRecords('users');
  for (const user of users) {
    if (user.getString('invite_token')) continue;
    user.set('invite_token', $security.randomString(40));
    app.save(user);
  }
}, (app) => {
  // откатывать нечего: поле удаляется миграцией 1786803000
});
