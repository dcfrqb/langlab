/// <reference path="../pb_data/types.d.ts" />

/**
 * Убрать из аккаунтов чужой кэш, приехавший при входе по ссылке.
 *
 * Механика (третий случай подряд, см. 1786804100): ссылку открывают в браузере,
 * где до этого работал другой аккаунт, и `pushLocal` отправляет оставшееся
 * локальное состояние в новый аккаунт. Так медицинское уехало к Карине
 * (19.08), а её IELTS — в аккаунт Уилла (20.08): профиль с целью «IELTS
 * Academic» и программа по IELTS с пометкой `source: 'survey'`, хотя опроса
 * никто не проходил. Побочный эффект: `activeCourse()` открывает человеку
 * чужой курс.
 *
 * Причину закрывают две вещи в коде: `sync.adopt()` (состояние чужого
 * аккаунта не отправляем, а стираем) и метка `from` у профиля с программой
 * (серверную копию не возвращаем в базу). Эта миграция — про следы.
 *
 * Чистим по курсу: у каждого аккаунта оставляем только его курс. Профиль
 * сносим лишь там, где он целиком приезжий (`profile: true`) — у Уилла:
 * опрос он не проходил, а цель в профиле стоит чужая. Профили Карины и
 * медицинского аккаунта засеяны миграциями и выглядят так же пусто —
 * их не трогаем.
 */
migrate((app) => {
  const ACCOUNTS = [
    { email: 'ielts@langlab.local', course: 'ielts' },
    { email: 'dcfrqb@gmail.com',    course: 'en-ru', profile: true },
  ];

  for (const { email, course, profile: purgeProfile } of ACCOUNTS) {
    try {
      const user = app.findFirstRecordByFilter('users', 'email = {:email}', { email });
      let removed = 0;

      for (const name of ['programs', 'progress', 'test_results']) {
        const records = app.findRecordsByFilter(
          name,
          'user = {:id} && course != {:course}',
          '-created', 200, 0,
          { id: user.id, course },
        );
        for (const record of records) {
          app.delete(record);
          removed += 1;
        }
      }

      if (purgeProfile) {
        const profiles = app.findRecordsByFilter(
          'profiles', 'user = {:id}', '-created', 10, 0, { id: user.id },
        );
        for (const profile of profiles) {
          app.delete(profile);
          removed += 1;
        }
      }

      console.log(`[purge] ${email}: убрано чужих записей ${removed}`);
    } catch (err) {
      console.log(`[purge] ${email}: чистка не выполнена:`, err);
    }
  }
}, (app) => {
  // откатывать нечего: возвращать удалённый чужой кэш незачем
});
