/* ============================================================
   ЗАГРУЗЧИК — единственное место, где приложение знает,
   какой курс оно показывает. Дальше всё через движок.
   ============================================================ */
import { makeCourse } from '../engine/course.js';
import { startRouter } from '../engine/router.js';
import { initTheme } from '../engine/theme.js';
import { initKeys } from '../engine/keys.js';
import { course as rawCourse } from '../content/en-ru/index.js';

const course = makeCourse(rawCourse);

/* стили курса подключаются вместе с курсом, а не хардкодом в index.html */
if (course.stylesheet) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = course.stylesheet;
  document.head.appendChild(link);
}

document.title = `${course.title} — ${course.brand.name}${course.brand.suffix}`;

initTheme();
initKeys();
startRouter(document.getElementById('app'), course);
