/* ============================================================
   ROUTER — hash-маршруты. Один курс на приложение (пока),
   поэтому в адресе только экран:
   #/ · #/lesson/:id · #/tests · #/test/:id · #/results · #/survey · #/login · #/invite/:token
   ============================================================ */
import { renderHome } from './screens/home.js';
import { renderTestsHome } from './screens/tests.js';
import { renderResults } from './screens/results.js';
import { renderSurvey } from './screens/survey.js';
import { renderLogin } from './screens/login.js';
import { renderInvite } from './screens/invite.js';
import { renderPlayer } from './player.js';
import { renderTest } from './quiz.js';

export function startRouter(app, course) {
  const brand = `${course.brand.name}${course.brand.suffix}`;

  function route() {
    const h = location.hash || '#/';

    const inviteMatch = h.match(/^#\/invite\/(.+)$/);
    if (inviteMatch) return show('Вход', () => renderInvite(app, course, inviteMatch[1]));

    const lessonMatch = h.match(/^#\/lesson\/(.+)$/);
    if (lessonMatch) {
      const lesson = course.lessonById(lessonMatch[1]);
      if (lesson) return show(lesson.title, () => renderPlayer(app, course, lesson));
    }

    const testMatch = h.match(/^#\/test\/(.+)$/);
    if (testMatch) {
      const test = course.testById(testMatch[1]);
      if (test) return show(test.title, () => renderTest(app, course, test));
    }

    if (h === '#/tests')   return show('Тесты', () => renderTestsHome(app, course));
    if (h === '#/results') return show('Результаты', () => renderResults(app, course));
    if (h === '#/survey')  return show('Опрос', () => renderSurvey(app, course));
    if (h === '#/login')   return show('Вход', () => renderLogin(app, course));

    return show(null, () => renderHome(app, course));
  }

  /* заголовок вкладки называет экран: иначе вся история браузера
     состоит из одинаковых строк */
  function show(title, render) {
    document.title = title ? `${title} — ${brand}` : `${course.title} — ${brand}`;
    render();
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', route);
  /* данные приехали из БД после старта — перерисовать текущий экран */
  window.addEventListener('langlab:synced', route);
  route();
}
