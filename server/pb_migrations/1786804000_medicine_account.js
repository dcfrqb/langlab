/// <reference path="../pb_data/types.d.ts" />

/**
 * Аккаунт под медицинский профиль + его программа.
 *
 * Почему миграцией, а не руками в админке: админка живёт только на сервере,
 * и всё, что заведено там руками, теряется при переносе базы и нигде не
 * записано. Здесь же аккаунт приезжает вместе с кодом — как схема.
 *
 * Почта — заглушка: писем мы не шлём (у хостера закрыт SMTP, см. миграцию
 * 1786803000), вход идёт по персональной ссылке. Настоящий адрес можно
 * поставить в админке, на вход это не влияет.
 *
 * Ссылку для входа миграция печатает в лог контейнера один раз, при создании
 * аккаунта (`docker compose logs pocketbase | grep medicine`): sqlite3 ни на
 * хосте, ни в образе нет, а лезть в базу иначе нечем. Потом её всегда видно
 * в админке: Collections → users → invite_token.
 *
 * Токен в логе — долгоживущий секрет, но лог читает только root. Отозвать:
 * очистить invite_token в админке, хук выпишет новый.
 *
 * Сеем мягко: если что-то пойдёт не так, миграция не должна ронять старт
 * PocketBase — данные это не схема, сайт важнее одной записи.
 */
migrate((app) => {
  const EMAIL = 'medicine@langlab.local';

  try {
    let user;
    try {
      user = app.findFirstRecordByFilter('users', 'email = {:email}', { email: EMAIL });
    } catch (_) {
      const users = app.findCollectionByNameOrId('users');
      user = new Record(users);
      user.set('email', EMAIL);
      user.set('verified', true);
      user.set('invite_token', $security.randomString(40));
      // пароль случайный и никому не нужен: вход по ссылке, парольная авторизация выключена
      user.setPassword($security.randomString(40));
      app.save(user);
      console.log('[medicine] ссылка для входа: https://langs.crs-projects.com/#/invite/'
        + user.getString('invite_token'));
    }

    try {
      app.findFirstRecordByFilter('profiles', 'user = {:id}', { id: user.id });
    } catch (_) {
      const profile = new Record(app.findCollectionByNameOrId('profiles'));
      profile.set('user', user.id);
      profile.set('display_name', 'Медицина');
      profile.set('native_lang', 'ru');
      profile.set('goal', 'USMLE: Step 1 (база) → Step 2 CK (клиника)');
      app.save(profile);
    }

    try {
      app.findFirstRecordByFilter('programs', 'user = {:id} && course = "medicine"', { id: user.id });
    } catch (_) {
      const program = new Record(app.findCollectionByNameOrId('programs'));
      program.set('user', user.id);
      program.set('course', 'medicine');
      program.set('title', 'Начало: алгоритмы и выжимки');
      program.set('items', ['bradyarrhythmias', 'shock', 'adh']);
      program.set('active', true);
      program.set('source', 'hand');
      program.set('note', 'Два дерева, которые чаще всего нужны у постели (брадиаритмии, шок), ' +
        'и одна выжимка на два учебника (АДГ). Дальше добавляем по её запросу.');
      app.save(program);
    }
  } catch (err) {
    console.log('[medicine] аккаунт не создан:', err);
  }
}, (app) => {
  try {
    const user = app.findFirstRecordByFilter('users', 'email = {:email}', { email: 'medicine@langlab.local' });
    app.delete(user);   // профиль и программа уедут следом: relation с cascadeDelete
  } catch (_) { /* уже нет — и хорошо */ }
});
