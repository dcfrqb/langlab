/// <reference path="../pb_data/types.d.ts" />

/**
 * Вход — по почте, без паролей: PocketBase присылает одноразовый код (OTP).
 * Регистрация закрыта: аккаунты завожу я в админке, это не публичный сервис.
 */
migrate((app) => {
  const users = app.findCollectionByNameOrId('users');

  users.otp.enabled = true;
  users.otp.duration = 600;          // 10 минут на ввод кода
  users.passwordAuth.enabled = false; // паролей у нас нет вовсе
  users.createRule = null;            // сам себя не зарегистрирует
  users.listRule = null;              // юзеры не видят друг друга
  users.viewRule = '@request.auth.id != "" && id = @request.auth.id';
  users.updateRule = '@request.auth.id != "" && id = @request.auth.id';
  users.deleteRule = null;

  app.save(users);
}, (app) => {
  const users = app.findCollectionByNameOrId('users');
  users.otp.enabled = false;
  users.passwordAuth.enabled = true;
  app.save(users);
});
