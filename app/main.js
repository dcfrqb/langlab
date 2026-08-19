/* ============================================================
   ЗАГРУЗЧИК — единственное место, где приложение знает,
   какие курсы вообще есть. Дальше всё через движок.
   ============================================================ */
import { makeCourse } from '../engine/course.js';
import { startRouter } from '../engine/router.js';
import { initTheme } from '../engine/theme.js';
import { initKeys } from '../engine/keys.js';
import { sync } from '../engine/sync.js';
import { store } from '../engine/storage.js';
import { course as enRu } from '../content/en-ru/index.js';
import { course as medicine } from '../content/medicine/index.js';
import { course as ielts } from '../content/ielts/index.js';

const COURSES = { 'en-ru': enRu, medicine, ielts };
const DEFAULT = 'en-ru';

/* Какой курс показывать. Пока это выбор в адресе (?c=medicine) и он
   запоминается: у человека курс один, и переключать его каждый заход
   он не должен. Когда программы приедут из базы, курс будет приходить
   оттуда — вместе с программой, а не из URL. */
const asked = new URLSearchParams(location.search).get('c');

function pickCourse() {
  if (asked && COURSES[asked]) {
    store.setPref('course', asked);
    return asked;
  }
  const saved = store.pref('course');
  return COURSES[saved] ? saved : DEFAULT;
}

const courseId = pickCourse();
const course = makeCourse(COURSES[courseId]);

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

/* прогресс: пишем локально сразу, в базу — фоном (если вошёл) */
sync.init(course.id, () => window.dispatchEvent(new CustomEvent('langlab:synced')));

/* Вошедшему открываем тот курс, по которому ему назначена программа:
   человек с медицинской программой не должен попадать на английский
   только потому, что тот идёт по умолчанию. Курс, выбранный явно
   в адресе (?c=), сильнее — иначе не посмотреть чужой. */
if (!asked) {
  sync.activeCourse().then(id => {
    if (id && COURSES[id] && id !== courseId) {
      store.setPref('course', id);
      location.reload();
    }
  });
}
