/// <reference path="../pb_data/types.d.ts" />

/**
 * Аккаунт под профиль IELTS + его программа.
 *
 * Заведено миграцией, а не руками в админке, по той же причине, что и
 * медицинский аккаунт (см. 1786804000): заведённое руками теряется при
 * переносе базы и нигде не записано. Здесь аккаунт приезжает вместе
 * с кодом — как схема.
 *
 * Почта — заглушка: писем мы не шлём (у хостера закрыт SMTP), вход идёт
 * по персональной ссылке. Настоящий адрес можно поставить в админке,
 * на вход это не влияет.
 *
 * Ссылку миграция печатает в лог контейнера один раз, при создании
 * аккаунта: `docker compose logs pocketbase | grep ielts`. Потом её
 * всегда видно в админке: Collections → users → invite_token.
 *
 * Список тем продублирован здесь руками: миграция не может импортировать
 * ES-модули фронта. Порядок тот же, что в content/ielts/lessons.js —
 * программа это плейлист поверх контента, и листать её нужно подряд.
 *
 * Сеем мягко: данные — это не схема, и упавшая запись не должна
 * ронять старт PocketBase.
 */
migrate((app) => {
  const EMAIL = 'ielts@langlab.local';

  const ITEMS = [
    // Часть 1 · Как устроен экзамен
    'exam-map', 'bands', 'reading-format', 'writing-format', 'vs-duolingo',
    // Часть 2 · Чтение по приёмам
    'skimming', 'paraphrase', 'tfng', 'headings', 'completion',
    // Часть 3 · Письмо по кирпичикам
    't2-question', 't2-intro', 't2-body', 't2-cohesion', 't1-language', 't1-overview',
    // Часть 4 · Лексика, шаблоны и правила
    'templates', 'topic-lexis', 'hedging', 'academic-tone', 'common-errors',
  ];

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
      console.log('[ielts] ссылка для входа: https://langs.crs-projects.com/#/invite/'
        + user.getString('invite_token'));
    }

    try {
      app.findFirstRecordByFilter('profiles', 'user = {:id}', { id: user.id });
    } catch (_) {
      const profile = new Record(app.findCollectionByNameOrId('profiles'));
      profile.set('user', user.id);
      profile.set('display_name', 'Карина');
      profile.set('native_lang', 'ru');
      profile.set('goal', 'IELTS Academic: overall 6.5–7.0');
      app.save(profile);
    }

    try {
      app.findFirstRecordByFilter('programs', 'user = {:id} && course = "ielts"', { id: user.id });
    } catch (_) {
      const program = new Record(app.findCollectionByNameOrId('programs'));
      program.set('user', user.id);
      program.set('course', 'ielts');
      program.set('title', 'IELTS Academic: четыре части');
      program.set('items', ITEMS);
      program.set('active', true);
      program.set('source', 'hand');
      program.set('note', 'Сначала правила игры, потом чтение (там прибавка приходит быстрее всего), ' +
        'потом письмо по кирпичикам, и справочная часть с лексикой и шаблонами — к ней возвращаются ' +
        'постоянно. В конце каждой части есть рубеж, а раздел «Готовность» собирает из тестов ' +
        'ориентир по баллу.');
      app.save(program);
      console.log(`[ielts] программа создана: ${ITEMS.length} тем`);
    }
  } catch (err) {
    console.log('[ielts] аккаунт не создан:', err);
  }
}, (app) => {
  try {
    const user = app.findFirstRecordByFilter('users', 'email = {:email}', { email: 'ielts@langlab.local' });
    app.delete(user);   // профиль и программа уедут следом: relation с cascadeDelete
  } catch (_) { /* уже нет — и хорошо */ }
});
