/* ============================================================
   CHECK — проверка английского курса перед коммитом.

     node tools/en-ru/check.mjs

   Ловит то, что ломается молча и обнаруживается только человеком
   посреди теста:
     1) шаг или вопрос неизвестного типа — движок отрисует пустоту;
     2) ответ за границей списка вариантов;
     3) число пропусков в mgap не сходится с числом ответов;
     4) тест с пустым пулом — пустой экран вместо проверки;
     5) вопрос-замер, просочившийся в обычный тест: замер тем и
        ценен, что его состав фиксирован и нигде больше не встречался;
     6) разделы «Готовности», ссылающиеся на несуществующий тест;
     7) расхождение программы в миграции со списком тем.

   Отдельно считает покрытие: сколько вопросов в каждой зоне
   ремонта. Зона, у которой вопросов меньше, чем берёт её тест, —
   это тест, который каждый раз показывает одно и то же.
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

const { course: raw } = await import(pathToFileURL(path.join(ROOT, 'content/en-ru/index.js')).href);
const { makeCourse } = await import(pathToFileURL(path.join(ROOT, 'engine/course.js')).href);
const course = makeCourse(raw);

/* контракт с engine/steps.js и engine/quiz.js */
const STEP_TYPES = new Set(['concept', 'formula', 'tabs', 'examples', 'vs', 'markers',
  'mistake', 'scale', 'produce', 'note', 'quiz', 'algorithm', 'table', 'terms', 'drill']);
const Q_TYPES = new Set(['choose', 'gap', 'form', 'error', 'order', 'mgap', 'pick']);

/* --- уроки --- */
const ids = new Set();
const aspects = new Set(course.categories.map(c => c.key));

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
      if (!s.explain) warn(stepWhere, 'quiz без разбора');
    }
    if (s.type === 'table' && s.rows?.some(r => r.cells.length !== s.cols.length)) {
      fail(stepWhere, 'в таблице строка не совпадает по числу колонок с заголовком');
    }
  });
}

/* карта времён не должна вести в никуда */
(course.explorer?.nodes || []).forEach(node => {
  (node.rows || []).forEach(r => {
    if (r.lesson && !ids.has(r.lesson)) fail('карта времён', `строка «${r.tag}» ведёт на «${r.lesson}», а темы такой нет`);
  });
});

/* --- вопросы --- */
const questions = course.questions || [];
const seen = new Map();

for (const [i, q] of questions.entries()) {
  const where = `вопрос ${i + 1} (${q.g || '—'}${q.tag ? ` · ${q.tag.join('/')}` : ''})`;
  if (!Q_TYPES.has(q.type)) fail(where, `неизвестный тип «${q.type}»`);
  if (!q.g) fail(where, 'нет группы (g)');
  if (!q.why) warn(where, 'нет разбора');

  /* один и тот же вопрос в двух пачках — человек решает его дважды
     и думает, что прогрессирует */
  const key = [q.type, q.q, (q.options || q.tokens || []).join('|'), JSON.stringify(q.answer ?? q.answers)].join('~');
  if (seen.has(key)) warn(where, `дублирует вопрос ${seen.get(key) + 1}`);
  else seen.set(key, i);

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
  if (q.type === 'order') {
    if (!(q.tokens || []).length) fail(where, 'нечего собирать');
    else {
      /* сборка должна давать ровно заявленный ответ, иначе верный
         порядок засчитается как ошибка */
      const built = q.tokens.join(' ').replace(/\s+/g, ' ').trim();
      const want = String(q.answer || '').replace(/\s+/g, ' ').trim();
      const norm = s => s.toLowerCase().replace(/[’`]/g, "'").replace(/[.,!?;:]+$/g, '');
      if (norm([...built.split(' ')].sort().join(' ')) !== norm([...want.split(' ')].sort().join(' '))) {
        fail(where, 'кусочки не складываются в заявленный ответ');
      }
    }
  }
  if ((q.type === 'gap' || q.type === 'form') && !q.answer) fail(where, 'нет ответа');
  if (q.type === 'gap' || q.type === 'form' || q.type === 'choose' || q.type === 'pick') {
    const blanks = (String(q.q || '').match(/___/g) || []).length;
    if ((q.type === 'gap' || q.type === 'form') && blanks !== 1) {
      warn(where, `пропусков в предложении: ${blanks} (ожидался один)`);
    }
  }
  if (q.type === 'mgap') {
    const blanks = (String(q.q || '').match(/___/g) || []).length;
    if (blanks !== (q.answer || []).length) fail(where, `пропусков ${blanks}, а ответов ${(q.answer || []).length}`);
  }
}

/* --- тесты --- */
const testIds = new Set();
for (const test of course.tests || []) {
  const where = `тест ${test.id}`;
  if (testIds.has(test.id)) fail(where, 'такой id уже есть — прогресс двух тестов сольётся в один');
  testIds.add(test.id);

  const pool = questions.filter(test.filter);
  if (!pool.length) fail(where, 'в пуле нет ни одного вопроса');
  else if (pool.length < test.pick) warn(where, `вопросов ${pool.length}, а просит ${test.pick} — покажет меньше`);
  else if (pool.length < test.pick * 1.3 && test.id !== 'diag') {
    warn(where, `пул ${pool.length} при выборке ${test.pick} — состав почти не меняется между заходами`);
  }

  if (!aspects.has(test.aspect)) fail(where, `категория «${test.aspect}» не объявлена`);
  if (!test.sub) warn(where, 'нет подписи — по названию не понять, что внутри');

  /* вопросы замера — только в замере */
  if (test.id !== 'diag' && pool.some(q => q.diag)) {
    fail(where, 'в пул просочились вопросы замера — он перестанет быть сравнимым во времени');
  }
}

/* --- «Готовность» ссылается на реальные тесты --- */
if (course.estimate) {
  const src = await readFile(path.join(ROOT, 'content/en-ru/level.js'), 'utf8');
  const block = src.match(/const SECTIONS = \[([\s\S]*?)\n\];/);
  if (!block) warn('готовность', 'не нашёл SECTIONS — проверить руками');
  else {
    [...block[1].matchAll(/tests:\s*\[([^\]]+)\]/g)].forEach(m => {
      [...m[1].matchAll(/'([^']+)'/g)].forEach(t => {
        if (!testIds.has(t[1])) fail('готовность', `раздел ссылается на тест «${t[1]}», а его нет`);
      });
    });
  }
  /* экран не должен падать на пустом прогрессе — самый частый вход */
  try {
    course.estimate({
      tests: (course.tests || []).map(t => ({ id: t.id, title: t.title, size: course.testSize(t), best: null })),
      lessons: { done: 0, total: course.lessonCount, byId: {} },
      groups: course.groups.map(title => ({ title, total: 0, done: 0 })),
    });
  } catch (e) {
    fail('готовность', `падает на пустом прогрессе: ${e.message}`);
  }
}

/* --- программа в миграции --- */
const migration = path.join(ROOT, 'server/pb_migrations/1786901000_en_program.js');
if (existsSync(migration)) {
  const text = await readFile(migration, 'utf8');
  const block = text.match(/const ITEMS = \[([\s\S]*?)\];/);
  if (!block) fail('миграция программы', 'не нашёл список ITEMS');
  else {
    const planned = [...block[1].matchAll(/'([^']+)'/g)].map(m => m[1]);
    planned.forEach(id => {
      if (!ids.has(id)) fail('миграция программы', `в плане есть «${id}», а темы такой нет`);
    });
    const dupes = planned.filter((v, i) => planned.indexOf(v) !== i);
    if (dupes.length) fail('миграция программы', `тема встречается дважды: ${[...new Set(dupes)].join(', ')}`);
    course.lessons.forEach(l => {
      if (!planned.includes(l.id)) warn('миграция программы', `тема «${l.id}» не попала в план`);
    });
  }
}

/* --- покрытие зон ремонта --- */
const ZONES = ['narr2', 'prep3', 'perf3', 'ing2', 'quant2', 'wgram', 'wlex', 'task1', 'task2', 'reg2'];
const coverage = ZONES.map(z => `${z}: ${questions.filter(q => q.tag?.includes(z)).length}`);

console.log(`тем: ${course.lessons.length} · шагов: ${course.lessons.reduce((n, l) => n + l.steps.length, 0)}`
  + ` · групп: ${course.groups.length}`);
console.log(`вопросов: ${questions.length} (замер ${questions.filter(q => q.diag).length}`
  + ` · пачка 4 ${questions.filter(q => q.r4 && !q.diag).length}`
  + ` · «твои ошибки» ${questions.filter(q => q.mine).length}) · тестов: ${course.tests.length}`);
console.log(`зоны: ${coverage.join(' · ')}`);

warns.forEach(w => console.log(`  ⚠ ${w}`));
if (errors.length) {
  errors.forEach(e => console.log(`  ✗ ${e}`));
  console.log(`\nошибок: ${errors.length}`);
  process.exit(1);
}
console.log('всё сходится');
