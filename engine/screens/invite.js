/* ============================================================
   INVITE — вход по персональной ссылке #/invite/<token>.
   Открыл ссылку — уже внутри: ни писем, ни паролей.
   ============================================================ */
import { navHTML, bindNav } from '../nav.js';
import { api } from '../api.js';
import { sync } from '../sync.js';
import { setKeys } from '../keys.js';

export function renderInvite(app, course, token) {
  setKeys(null);

  const shell = inner => {
    app.innerHTML = `
      ${navHTML(course, 'login')}
      <section class="section wrap auth">${inner}</section>`;
    bindNav(app);
  };

  shell(`
    <p class="eyebrow">вход</p>
    <h1 style="font-size:clamp(26px,6vw,44px)">Секунду, узнаю тебя…</h1>`);

  (async () => {
    try {
      const user = await api.authWithInvite(token);
      await sync.pushLocal(course.id);   // что нарешал до входа — в базу
      await sync.pull(course.id);        // что уже лежало в базе — сюда
      shell(`
        <p class="eyebrow">вход</p>
        <h1 style="font-size:clamp(26px,6vw,44px)">Готово, ${user.email.split('@')[0]}.</h1>
        <p class="lede" style="margin-top:14px">Прогресс теперь сохраняется в аккаунте.
          Ссылку можно открыть и на телефоне — попадёшь в тот же аккаунт.</p>
        <div class="auth-box"><a class="nav-btn primary" href="#/">К темам ›</a></div>`);
      /* адрес с токеном в истории не оставляем */
      history.replaceState(null, '', location.pathname + '#/');
    } catch (e) {
      shell(`
        <p class="eyebrow">вход</p>
        <h1 style="font-size:clamp(26px,6vw,44px)">Ссылка не подошла.</h1>
        <p class="lede" style="margin-top:14px">${e.status === 400
          ? 'Похоже, ссылка устарела или её отозвали. Напиши мне — выпишу новую.'
          : 'Сеть не отвечает. Попробуй ещё раз через минуту.'}</p>
        <div class="auth-box"><a class="nav-btn" href="#/">Пока позанимаюсь так ›</a></div>`);
    }
  })();
}
