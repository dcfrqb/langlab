/* ============================================================
   LOGIN — вход по коду из письма. Паролей нет вовсе.
   До входа сайт работает как раньше (прогресс в браузере),
   после — то, что нарешал гостем, уезжает в базу.
   ============================================================ */
import { navHTML, bindNav } from '../nav.js';
import { api } from '../api.js';
import { sync } from '../sync.js';
import { setKeys } from '../keys.js';

export function renderLogin(app, course) {
  let otpId = null;
  let email = '';

  function shell(inner) {
    app.innerHTML = `
      ${navHTML(course, 'login')}
      <section class="section wrap auth">
        <p class="eyebrow">вход</p>
        <h1 style="font-size:clamp(26px,6vw,44px)">Твой прогресс — в аккаунте.</h1>
        <p class="lede" style="margin-top:14px">Без паролей: вводишь почту, получаешь код из письма.
          Аккаунты заводятся вручную — это не публичный сервис.</p>
        <div class="auth-box" id="box">${inner}</div>
      </section>`;
    bindNav(app);
  }

  const errorLine = '<div class="auth-err" id="err" hidden></div>';

  function showError(text) {
    const err = app.querySelector('#err');
    if (!err) return;
    err.textContent = text;
    err.hidden = false;
  }

  function stepEmail() {
    shell(`
      <label class="auth-label" for="email">почта</label>
      <input class="gap-input auth-input" id="email" type="email" inputmode="email"
        autocomplete="email" autocapitalize="off" spellcheck="false"
        enterkeyhint="send" placeholder="you@example.com" value="${email}" />
      ${errorLine}
      <button class="nav-btn primary" id="go" type="button">Прислать код</button>`);

    const input = app.querySelector('#email');
    const btn = app.querySelector('#go');
    input.focus({ preventScroll: true });

    const submit = async () => {
      email = input.value.trim();
      if (!email.includes('@')) return showError('Похоже, это не адрес почты.');
      btn.disabled = true;
      btn.textContent = 'Отправляю…';
      try {
        otpId = await api.requestCode(email);
        stepCode();
      } catch (e) {
        btn.disabled = false;
        btn.textContent = 'Прислать код';
        showError(e.status === 429 ? 'Слишком часто. Подожди минуту.' : 'Не вышло отправить код: ' + e.message);
      }
    };

    btn.addEventListener('click', submit);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
  }

  function stepCode() {
    shell(`
      <div class="auth-sent">Код ушёл на <b>${email}</b>. Проверь почту (и спам).</div>
      <label class="auth-label" for="code">код из письма</label>
      <input class="gap-input auth-input" id="code" type="text" inputmode="numeric"
        autocomplete="one-time-code" autocapitalize="off" spellcheck="false"
        enterkeyhint="go" placeholder="000000" />
      ${errorLine}
      <button class="nav-btn primary" id="go" type="button">Войти</button>
      <button class="auth-back" id="back" type="button">← другая почта</button>`);

    const input = app.querySelector('#code');
    const btn = app.querySelector('#go');
    input.focus({ preventScroll: true });

    const submit = async () => {
      const code = input.value.trim();
      if (!code) return;
      btn.disabled = true;
      btn.textContent = 'Проверяю…';
      try {
        await api.submitCode(otpId, code);
        btn.textContent = 'Переношу прогресс…';
        await sync.pushLocal(course.id);   // всё, что нарешал гостем
        await sync.pull(course.id);        // и то, что уже лежало в базе
        location.hash = '#/';
      } catch (e) {
        btn.disabled = false;
        btn.textContent = 'Войти';
        showError(e.status === 400 ? 'Код не подошёл или истёк.' : 'Не вышло войти: ' + e.message);
      }
    };

    btn.addEventListener('click', submit);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
    app.querySelector('#back').addEventListener('click', stepEmail);
  }

  setKeys(null);
  stepEmail();
}
