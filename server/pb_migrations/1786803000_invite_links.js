/// <reference path="../pb_data/types.d.ts" />

/**
 * Вход по персональной ссылке вместо кода из письма.
 * Причина: хостер режет исходящие SMTP-порты (25/465/587 — timeout),
 * поэтому почту с этой машины отправить нечем, а ради трёх человек
 * тащить внешний релей смысла нет.
 *
 * У каждого пользователя — свой токен (генерируется хуком в pb_hooks/invite.pb.js).
 * Ссылка вида https://langs.crs-projects.com/#/invite/<token> логинит навсегда.
 * Отозвать = очистить поле invite_token в админке, хук выпишет новый.
 */
migrate((app) => {
  const users = app.findCollectionByNameOrId('users');

  users.fields.add(new TextField({ name: 'invite_token', max: 64 }));
  users.addIndex('idx_users_invite_token', true, 'invite_token', "invite_token != ''");

  // писем нет вовсе — иначе каждый вход ждёт таймаута SMTP
  users.authAlert.enabled = false;

  app.save(users);
}, (app) => {
  const users = app.findCollectionByNameOrId('users');
  users.fields.removeByName('invite_token');
  users.removeIndex('idx_users_invite_token');
  users.authAlert.enabled = true;
  app.save(users);
});
