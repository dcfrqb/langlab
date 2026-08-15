/* ============================================================
   ROUTER — hash-маршруты. Один курс на приложение (пока),
   поэтому в адресе только экран: #/ , #/lesson/:id , #/tests , #/test/:id , #/results
   ============================================================ */
import { renderHome } from './screens/home.js';
import { renderTestsHome } from './screens/tests.js';
import { renderResults } from './screens/results.js';
import { renderPlayer } from './player.js';
import { renderTest } from './quiz.js';

export function startRouter(app, course) {
  function route() {
    const h = location.hash || '#/';

    const lessonMatch = h.match(/^#\/lesson\/(.+)$/);
    if (lessonMatch) {
      const lesson = course.lessonById(lessonMatch[1]);
      if (lesson) return show(() => renderPlayer(app, course, lesson));
    }

    const testMatch = h.match(/^#\/test\/(.+)$/);
    if (testMatch) {
      const test = course.testById(testMatch[1]);
      if (test) return show(() => renderTest(app, course, test));
    }

    if (h === '#/tests') return show(() => renderTestsHome(app, course));
    if (h === '#/results') return show(() => renderResults(app, course));

    return show(() => renderHome(app, course));
  }

  function show(render) {
    render();
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', route);
  route();
}
