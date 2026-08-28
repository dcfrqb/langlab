/// <reference path="../pb_data/types.d.ts" />

/**
 * Программа по английскому для аккаунта Уилла — собранная под журнал
 * ошибок, а не по порядку учебника.
 *
 * Почему миграцией: аккаунт уже есть (dcfrqb@gmail.com), но программы
 * у него нет — прежняя приехала чужим кэшем и была снесена миграцией
 * 1786900000. Заводить руками в админке нельзя по той же причине, что
 * и раньше: заведённое руками теряется при переносе базы и нигде
 * не записано.
 *
 * Порядок тем — это и есть решение. Он идёт не от простого к сложному,
 * а от протекающего к нужному:
 *
 *   Часть 1 · Ремонт — четыре зоны, доказанные замерами и журналом:
 *     Past 4/7 при 8/8 везде рядом (три темы про прошедшие),
 *     предлоги (4 повтора в журнале),
 *     Present Perfect ↔ did (2 повтора),
 *     лишний -ing (2 повтора), артикли («a time»).
 *     Темы не новые — это второй проход по тому, что течёт.
 *
 *   Часть 2 · Конструкции B1 — то, с чего начинается Grammatical Range
 *     в письме: условные, пассив, косвенная, герундий, придаточные.
 *
 *   Часть 3 · Лексика — объём слов упирает потолок в чтении и письме,
 *     и по плану (Мир/Английский/План.md) идёт параллельно грамматике,
 *     а не «потом».
 *
 * Двенадцать базовых тем (to be, множественное число, have got,
 * простые времена, маркеры) в программу не входят намеренно: они
 * закрыты на 8/8 и в каталоге никуда не делись — на них есть тест
 * «База · контроль», если захочется проверить, что фундамент цел.
 *
 * Список продублирован здесь руками: миграция не может импортировать
 * ES-модули фронта. Сверяется автоматически — tools/en-ru/check.mjs
 * ругнётся, если в плане окажется тема, которой нет в курсе.
 */
migrate((app) => {
  const EMAIL = 'dcfrqb@gmail.com';

  const ITEMS = [
    // Часть 1 · Ремонт — зоны из журнала ошибок
    'past-simple', 'past-continuous', 'past-perfect',
    'prepositions', 'present-perfect', 'present-simple-vs-continuous', 'articles',
    // Часть 2 · Конструкции B1
    'conditionals', 'passive', 'reported-speech', 'gerund-infinitive',
    'relative-clauses', 'perfect-continuous', 'modals-deduction',
    'quantifiers', 'indirect-questions',
    // Часть 3 · Лексика
    'collocations', 'phrasal-verbs', 'word-formation', 'academic-awl', 'linking-register',
  ];

  /* Сеем мягко: данные — не схема, и упавшая запись не должна
     ронять старт PocketBase. */
  try {
    const user = app.findFirstRecordByFilter('users', 'email = {:email}', { email: EMAIL });

    try {
      app.findFirstRecordByFilter('profiles', 'user = {:id}', { id: user.id });
    } catch (_) {
      const profile = new Record(app.findCollectionByNameOrId('profiles'));
      profile.set('user', user.id);
      profile.set('display_name', 'Will');
      profile.set('native_lang', 'ru');
      profile.set('level', 'B1');
      profile.set('goal', 'B2 / IELTS 6.5 — сначала ремонт базы, потом подготовка к экзамену');
      app.save(profile);
    }

    try {
      app.findFirstRecordByFilter('programs', 'user = {:id} && course = "en-ru"', { id: user.id });
      console.log('[en-ru] программа уже есть — не трогаю');
    } catch (_) {
      const program = new Record(app.findCollectionByNameOrId('programs'));
      program.set('user', user.id);
      program.set('course', 'en-ru');
      program.set('title', 'Ремонт базы → конструкции B1 → лексика');
      program.set('items', ITEMS);
      program.set('active', true);
      program.set('source', 'hand');
      program.set('note', 'Порядок собран по журналу ошибок, а не по учебнику. Сначала четыре зоны, ' +
        'которые доказанно текут: прошедшие времена в рассказе, предлоги, Present Perfect и лишний -ing. ' +
        'Потом конструкции, которые дают уровень в письме, и лексика — она идёт параллельно, ' +
        'а не после. Проверять себя — разделом «Ремонт» в тестах, следить за уровнем — на «Готовности».');
      app.save(program);
      console.log(`[en-ru] программа создана: ${ITEMS.length} тем`);
    }
  } catch (err) {
    console.log('[en-ru] программа не создана:', err);
  }
}, (app) => {
  try {
    const user = app.findFirstRecordByFilter('users', 'email = {:email}', { email: 'dcfrqb@gmail.com' });
    const program = app.findFirstRecordByFilter('programs', 'user = {:id} && course = "en-ru"', { id: user.id });
    app.delete(program);
  } catch (_) { /* уже нет — и хорошо */ }
});
