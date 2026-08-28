/* ============================================================
   ROUTER — hash-маршруты. Один курс на приложение (пока),
   поэтому в адресе только экран:
   #/ · #/today · #/lesson/:id · #/tests · #/test/:id · #/terms
   #/results · #/level · #/survey · #/login · #/invite/:token
   ============================================================ */
import { renderHome } from './screens/home.js';
import { renderToday } from './screens/today.js';
import { renderTestsHome } from './screens/tests.js';
import { renderTerms } from './screens/terms.js';
import { renderResults } from './screens/results.js';
import { renderLevel } from './screens/level.js';
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

    /* Доза дня. `#/today/more` — то же самое, но с добором будущих
       повторов: человек закрыл сегодняшнее и хочет ещё. */
    if (h === '#/today' || h === '#/today/more') {
      if (course.questions?.length) {
        return show('Сегодня', () => renderToday(app, course, { ahead: h.endsWith('/more') }));
      }
    }

    if (h === '#/tests')   return show('Тесты', () => renderTestsHome(app, course));
    if (h === '#/terms')   return show(course.termsCopy?.nav || 'Термины', () => renderTerms(app, course));
    if (h === '#/results') return show('Результаты', () => renderResults(app, course));
    /* курс без своей оценки уровня (медицина, английский) сюда не ходит */
    if (h === '#/level' && course.estimate) return show('Готовность', () => renderLevel(app, course));
    /* курс без опроса на уровень (медицина) на этот адрес просто не ходит */
    if (h === '#/survey' && course.survey !== false) return show('Опрос', () => renderSurvey(app, course));
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
