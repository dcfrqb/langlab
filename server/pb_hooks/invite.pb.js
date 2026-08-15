/// <reference path="../pb_data/types.d.ts" />

/**
 * Ссылки-приглашения.
 *
 * 1. Каждому пользователю при создании выписывается случайный invite_token.
 *    Пустое поле = «выпиши новый», так токен отзывается прямо из админки.
 * 2. POST /api/langlab/invite {token} — меняет токен на обычную сессию PocketBase.
 *
 * Компромисс осознанный: ссылка работает многократно (человек открывает её
 * и на телефоне, и на ноуте), то есть это долгоживущий секрет в адресе.
 * Для круга «я, Карина и пара знакомых» — приемлемо, отзыв в один клик.
 */

const TOKEN_LEN = 40;

function ensureToken(e) {
  if (!e.record.getString('invite_token')) {
    e.record.set('invite_token', $security.randomString(TOKEN_LEN));
  }
  e.next();
}

onRecordCreate(ensureToken, 'users');
onRecordUpdate(ensureToken, 'users');

routerAdd('POST', '/api/langlab/invite', (e) => {
  const body = new DynamicModel({ token: '' });
  e.bindBody(body);

  const token = String(body.token || '').trim();
  if (token.length !== TOKEN_LEN) {
    throw new BadRequestError('Ссылка недействительна.');
  }

  let user;
  try {
    user = e.app.findFirstRecordByFilter('users', 'invite_token = {:t}', { t: token });
  } catch (err) {
    throw new BadRequestError('Ссылка недействительна.');
  }

  // пустая строка вместо метода — чтобы PocketBase не пытался слать письмо-алерт
  // о входе: почты у нас нет, а каждая попытка стоит двух минут таймаута
  return $apis.recordAuthResponse(e, user, '');
});
