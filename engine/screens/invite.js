/* ============================================================
   INVITE — вход по персональной ссылке #/invite/<token>.
   Открыл ссылку — уже внутри: ни писем, ни паролей.
   ============================================================ */
import { navHTML, bindNav } from '../nav.js';
import { api } from '../api.js';
import { sync } from '../sync.js';
import { store } from '../storage.js';
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
    <h1 class="h-sm">Секунду, узнаю тебя…</h1>`);

  (async () => {
    try {
      const user = await api.authWithInvite(token);
      await sync.pushLocal(course.id);   // что нарешал до входа — в базу
      await sync.pull(course.id);        // что уже лежало в базе — сюда

      /* Курс берём из назначенной программы: приложение стартовало до входа,
         поэтому оно ещё показывает курс по умолчанию, а человеку нужен его. */
      const assigned = await sync.activeCourse();
      if (assigned) store.setPref('course', assigned);

      shell(`
        <p class="eyebrow">вход</p>
        <h1 class="h-sm">Готово, ${user.email.split('@')[0]}.</h1>
        <p class="lede" style="margin-top:var(--s-4)">Прогресс теперь сохраняется в аккаунте.
          Ссылку можно открыть и на телефоне — попадёшь в тот же аккаунт.</p>
        <div class="auth-box"><button class="btn btn-primary" type="button" id="go">К темам</button></div>`);
      /* адрес с токеном в истории не оставляем */
      history.replaceState(null, '', location.pathname + '#/');

      /* Именно перезагрузка, а не ссылка на «#/»: адрес уже подменён на «#/»,
         так что переход по ссылке никуда не ведёт и hashchange не случается —
         кнопка выглядела бы сломанной. Заодно приложение поднимется с нужным
         курсом: его модуль грузится на старте. */
      app.querySelector('#go').addEventListener('click', () => location.reload());
    } catch (e) {
      shell(`
        <p class="eyebrow">вход</p>
        <h1 class="h-sm">Ссылка не подошла.</h1>
        <p class="lede" style="margin-top:var(--s-4)">${e.status === 400
          ? 'Похоже, ссылка устарела или её отозвали. Напиши мне — выпишу новую.'
          : 'Сеть не отвечает. Попробуй ещё раз через минуту.'}</p>
        <div class="auth-box"><a class="btn btn-secondary" href="#/">Пока позанимаюсь так</a></div>`);
    }
  })();
}
