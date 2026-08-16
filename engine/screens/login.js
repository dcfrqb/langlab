/* ============================================================
   LOGIN — объяснение, как попасть в аккаунт.

   Вход у нас по персональной ссылке (#/invite/<token>), а не по почте:
   хостер режет исходящие SMTP-порты, письма с этой машины не уходят.
   Код входа по OTP жив в api.js — включим, когда появится релей.
   ============================================================ */
import { navHTML, bindNav } from '../nav.js';
import { api } from '../api.js';
import { setKeys } from '../keys.js';

export function renderLogin(app, course) {
  setKeys(null);

  const authed = api.isAuthed;

  app.innerHTML = `
    ${navHTML(course, 'login')}
    <section class="section wrap auth">
      <p class="eyebrow">вход</p>
      ${authed ? `
        <h1 class="h-sm">Ты уже вошёл.</h1>
        <p class="lede" style="margin-top:var(--s-4)">Аккаунт: <b>${api.user.email}</b>.
          Прогресс и результаты тестов сохраняются в базе и подтянутся на любом устройстве,
          где открыта твоя ссылка.</p>
        <div class="auth-box"><a class="btn btn-primary" href="#/">К темам</a></div>
      ` : `
        <h1 class="h-sm">Вход — по личной ссылке.</h1>
        <p class="lede" style="margin-top:var(--s-4)">Ни паролей, ни кодов из письма: у каждого своя
          ссылка, открыл — и ты внутри, на любом устройстве. Нет ссылки — напиши мне, выпишу.</p>
        <p class="lede" style="margin-top:var(--s-3)">Без входа сайт работает целиком, просто прогресс
          живёт в этом браузере. Войдёшь позже — всё нарешанное уедет в аккаунт, ничего не пропадёт.</p>
        <div class="auth-box"><a class="btn btn-primary" href="#/">Позаниматься так</a></div>
      `}
    </section>`;

  bindNav(app);
}
