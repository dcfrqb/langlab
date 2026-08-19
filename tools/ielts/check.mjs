/* ============================================================
   CHECK — проверка курса IELTS перед коммитом.

     node tools/ielts/check.mjs

   Ловит то, что ломается молча и замечается только пользователем:
     1) шаг неизвестного типа — движок отрисует пустоту;
     2) вопрос с ответом за границей списка вариантов;
     3) вопрос про тему, которой в курсе нет, — это угадайка,
        и она врёт в первую очередь оценке готовности;
     4) тест с пустым пулом — пустой экран вместо проверки;
     5) расхождение программы в миграции со списком тем;
     6) разделы оценки, ссылающиеся на несуществующий тест.
   ============================================================ */

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];
const warns = [];
const fail = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warns.push(`${where}: ${msg}`);

const { course } = await import(pathToFileURL(path.join(ROOT, 'content/ielts/index.js')).href);

/* типы шагов — контракт с engine/steps.js */
const STEP_TYPES = new Set(['concept', 'formula', 'tabs', 'examples', 'vs', 'markers',
  'mistake', 'scale', 'produce', 'note', 'quiz', 'algorithm', 'table', 'terms', 'drill']);
const Q_TYPES = new Set(['choose', 'gap', 'form', 'error', 'order', 'mgap', 'pick']);

/* --- уроки --- */
const ids = new Set();
const aspects = new Set(course.categories.map(c => c.key));
let terms = 0;
let drills = 0;

for (const lesson of course.lessons) {
  const where = `урок ${lesson.id}`;
  if (ids.has(lesson.id)) fail(where, 'такой id уже есть');
  ids.add(lesson.id);

  if (!course.groups.includes(lesson.group)) fail(where, `группа «${lesson.group}» не объявлена в GROUPS`);
  if (!aspects.has(lesson.aspect)) fail(where, `категория «${lesson.aspect}» не объявлена в CATEGORIES`);
  if (!lesson.title || !lesson.subtitle) fail(where, 'нет заголовка или подзаголовка');
  if (!lesson.steps?.length) fail(where, 'нет ни одного шага');

  (lesson.steps || []).forEach((s, i) => {
    const stepWhere = `${where}, шаг ${i + 1}`;
    if (!STEP_TYPES.has(s.type)) return fail(stepWhere, `неизвестный тип «${s.type}»`);

    if (s.type === 'quiz') {
      if (!Array.isArray(s.options) || s.options.length < 2) fail(stepWhere, 'у quiz меньше двух вариантов');
      else if (!(s.answer >= 0 && s.answer < s.options.length)) fail(stepWhere, `answer=${s.answer} вне списка вариантов`);
      if (!s.explain) warn(stepWhere, 'quiz без разбора — ответ без объяснения почти бесполезен');
    }
    if (s.type === 'terms') {
      (s.items || []).forEach(t => {
        if (!t.en || !t.ru) fail(stepWhere, 'у фразы нет en или ru');
        terms++;
      });
    }
    if (s.type === 'drill') {
      drills++;
      if (!s.items?.length) fail(stepWhere, 'упражнение без заданий');
      (s.items || []).forEach(it => {
        if (!it.q || !it.a) fail(stepWhere, 'у задания нет вопроса или ответа');
        if (!it.why) warn(stepWhere, 'задание без разбора — непонятно, почему ответ такой');
      });
    }
    if (s.type === 'table' && s.rows?.some(r => r.cells.length !== s.cols.length)) {
      fail(stepWhere, 'в таблице строка не совпадает по числу колонок с заголовком');
    }
  });
}

/* --- вопросы --- */
for (const [i, q] of (course.questions || []).entries()) {
  const where = `вопрос ${i + 1} (${q.t || '—'})`;
  if (!Q_TYPES.has(q.type)) fail(where, `неизвестный тип «${q.type}»`);
  if (!q.t || !ids.has(q.t)) fail(where, `тема «${q.t}» — такого урока нет`);
  if (!q.g) fail(where, 'нет группы (g) — не попадёт ни в один рубеж');
  if (!q.why) warn(where, 'нет разбора');

  if (q.type === 'choose' && !(q.answer >= 0 && q.answer < (q.options || []).length)) {
    fail(where, `answer=${q.answer} вне списка вариантов`);
  }
  if (q.type === 'pick') {
    if (!q.answers?.length) fail(where, 'у pick нет верных вариантов');
    else if (q.answers.some(a => a < 0 || a >= q.options.length)) fail(where, 'индекс верного варианта вне списка');
    else if (q.answers.length === q.options.length) warn(where, 'верны все варианты — задание не различает');
  }
  if (q.type === 'error') {
    if (!(q.answer >= 0 && q.answer < (q.tokens || []).length)) fail(where, 'индекс неверного слова вне предложения');
    if (!q.fix) fail(where, 'не сказано, чем чинить');
  }
  if (q.type === 'order' && !(q.tokens || []).length) fail(where, 'нечего собирать');
  if ((q.type === 'gap' || q.type === 'form') && !q.answer) fail(where, 'нет ответа');
  if (q.type === 'mgap') {
    const blanks = (q.q.match(/___/g) || []).length;
    if (blanks !== (q.answer || []).length) fail(where, `пропусков ${blanks}, а ответов ${(q.answer || []).length}`);
  }
}

/* --- тесты --- */
for (const test of course.tests || []) {
  const pool = (course.questions || []).filter(test.filter);
  if (!pool.length) fail(`тест ${test.id}`, 'в пуле нет ни одного вопроса');
  else if (pool.length < test.pick) {
    warn(`тест ${test.id}`, `вопросов ${pool.length}, а просит ${test.pick} — покажет меньше`);
  }
  if (!aspects.has(test.aspect)) fail(`тест ${test.id}`, `категория «${test.aspect}» не объявлена`);
}

/* --- оценка готовности ссылается на реальные тесты --- */
if (course.estimate) {
  const testIds = new Set((course.tests || []).map(t => t.id));
  const src = await readFile(path.join(ROOT, 'content/ielts/index.js'), 'utf8');
  const block = src.match(/const SECTIONS = \[([\s\S]*?)\n\];/);
  if (!block) warn('оценка', 'не нашёл SECTIONS — проверить руками');
  else {
    [...block[1].matchAll(/tests: \[([^\]]+)\]/g)].forEach(m => {
      [...m[1].matchAll(/'([^']+)'/g)].forEach(t => {
        if (!testIds.has(t[1])) fail('оценка', `раздел ссылается на тест «${t[1]}», а его нет`);
      });
    });
  }
}

/* --- программа в миграции --- */
const migration = path.join(ROOT, 'server/pb_migrations/1786805000_ielts_account.js');
if (existsSync(migration)) {
  const text = await readFile(migration, 'utf8');
  const block = text.match(/const ITEMS = \[([\s\S]*?)\];/);
  if (!block) fail('миграция программы', 'не нашёл список ITEMS');
  else {
    const planned = [...block[1].matchAll(/'([^']+)'/g)].map(m => m[1]);
    planned.forEach(id => {
      if (!ids.has(id)) fail('миграция программы', `в плане есть «${id}», а темы такой нет`);
    });
    course.lessons.forEach(l => {
      if (!planned.includes(l.id)) warn('миграция программы', `тема «${l.id}» не попала в план`);
    });
    const order = course.lessons.map(l => l.id).filter(id => planned.includes(id));
    if (order.join() !== planned.filter(id => ids.has(id)).join()) {
      warn('миграция программы', 'порядок в плане не совпадает с порядком тем курса');
    }
  }
}

console.log(`тем: ${course.lessons.length} · шагов: ${course.lessons.reduce((n, l) => n + l.steps.length, 0)}`
  + ` · упражнений: ${drills} · фраз: ${terms}`);
console.log(`вопросов: ${(course.questions || []).length} · тестов: ${(course.tests || []).length}`);

warns.forEach(w => console.log(`  ⚠ ${w}`));
if (errors.length) {
  errors.forEach(e => console.log(`  ✗ ${e}`));
  console.log(`\nошибок: ${errors.length}`);
  process.exit(1);
}
console.log('всё сходится');
