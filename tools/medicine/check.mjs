/* ============================================================
   CHECK — проверка медицинского контента перед коммитом.

     node tools/medicine/check.mjs

   Проверяет две вещи, которые ломаются молча:
     1) дерево алгоритма — тупики, битые ссылки, недостижимые узлы;
     2) ссылку на источник — что такая книга, раздел и страница есть.

   Ссылка на учебник, ведущая не туда, хуже отсутствующей: человек
   идёт сверяться и теряет доверие ко всему остальному.
   ============================================================ */

import { readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];
const warns = [];

const fail = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warns.push(`${where}: ${msg}`);

async function loadAll(dir, pick) {
  const abs = path.join(ROOT, dir);
  if (!existsSync(abs)) return [];
  const files = (await readdir(abs)).filter(f => f.endsWith('.js'));
  const out = [];
  for (const f of files) {
    const mod = await import(pathToFileURL(path.join(abs, f)).href);
    const value = pick(mod);
    if (!value) { fail(`${dir}/${f}`, 'модуль ничего не экспортирует — нужен named export'); continue; }
    out.push({ file: `${dir}/${f}`, value });
  }
  return out;
}

/* --- источник: книга · раздел · страница --- */

function flatSections(nodes, acc = new Map()) {
  for (const n of nodes) {
    acc.set(n.id, n);
    if (n.children) flatSections(n.children, acc);
  }
  return acc;
}

function checkSource(where, source, books, { section = true } = {}) {
  if (!source) return warn(where, 'нет ссылки на источник');
  const book = books.get(source.book);
  if (!book) return fail(where, `нет такой книги: ${source.book} (есть: ${[...books.keys()].join(', ') || '—'})`);

  const page = Number(source.page);
  if (!Number.isFinite(page)) return fail(where, `страница не число: ${source.page}`);

  /* выжимка ссылается прямо на страницу, без раздела: в оглавлении Step 1
     закладок только на главы, поэтому раздел там ничего не уточняет */
  if (!section || !source.section) {
    const printed = new Set(pageLabels(book.value));
    if (printed.size && !printed.has(String(page))) {
      fail(where, `в «${book.value.short}» нет печатной страницы ${page}`);
    }
    return;
  }

  const found = flatSections(book.value.sections).get(source.section);
  if (!found) return fail(where, `в «${book.value.short}» нет раздела ${source.section}`);

  const from = Number(found.page);
  const to = Number(found.pageTo);
  if (Number.isFinite(from) && Number.isFinite(to) && (page < from || page > to)) {
    fail(where, `стр. ${page} вне раздела ${source.section} (${from}–${to})`);
  }
}

/* какие печатные номера в книге вообще есть: карта книги знает сдвиг
   нумерации, значит проверить «такая страница существует» можно без PDF */
function pageLabels(book) {
  const out = [];
  for (let i = 1; i <= book.pages; i += 1) {
    const printed = i - (book.offset || 0);
    if (printed >= 1) out.push(String(printed));
  }
  return out;
}

/* --- дерево алгоритма --- */

/* чем ветка имеет право закончиться: диагноз, лечение или ссылка на другой алгоритм */
const KINDS = ['root', 'finding', 'test', 'dx', 'tx', 'ref'];
const ENDINGS = ['dx', 'tx', 'ref'];

function checkAlgorithm(file, algo, books, algorithmIds) {
  const where = `${file} [${algo.id}]`;
  const byId = new Map();

  for (const n of algo.nodes || []) {
    if (byId.has(n.id)) fail(where, `узел ${n.id} объявлен дважды`);
    byId.set(n.id, n);
    if (!n.label) fail(where, `узел ${n.id} без подписи`);
    if (!KINDS.includes(n.kind)) fail(where, `узел ${n.id}: неизвестный kind «${n.kind}»`);
    if (n.note && !algo.notes?.[n.note]) fail(where, `узел ${n.id} ссылается на сноску «${n.note}», её нет`);
    /* ссылка на ещё не написанный алгоритм — это план, а не поломка */
    if (n.goto && !algorithmIds.has(n.goto)) warn(where, `узел ${n.id} ведёт на алгоритм «${n.goto}» — его ещё нет`);
  }

  if (!byId.has(algo.start)) fail(where, `start=${algo.start} — такого узла нет`);

  for (const n of byId.values()) {
    for (const edge of n.next || []) {
      if (!byId.has(edge.to)) fail(where, `${n.id} → ${edge.to}: узла нет`);
    }
    /* развилка без вопроса — человек не поймёт, что выбирает */
    if ((n.next || []).length > 1 && !n.ask) warn(where, `узел ${n.id}: развилка без вопроса (ask)`);
    /* ветка обязана чем-то кончиться: диагнозом, лечением или ссылкой */
    if (!(n.next || []).length && !ENDINGS.includes(n.kind)) {
      fail(where, `узел ${n.id} (${n.kind}) — тупик: ветка кончается не диагнозом, не лечением и не ссылкой`);
    }
  }

  /* достижимость: узел, до которого не дойти, — это забытая правка */
  const seen = new Set();
  const walk = id => {
    if (seen.has(id) || !byId.has(id)) return;
    seen.add(id);
    (byId.get(id).next || []).forEach(e => walk(e.to));
  };
  walk(algo.start);
  for (const id of byId.keys()) if (!seen.has(id)) fail(where, `узел ${id} недостижим от start`);

  for (const key of Object.keys(algo.notes || {})) {
    if (![...byId.values()].some(n => n.note === key)) warn(where, `сноска «${key}» ни к чему не привязана`);
  }

  checkSource(where, algo.source, books);
}

/* --- прогон --- */

const books = new Map(
  (await loadAll('content/medicine/books', m => m.book)).map(b => [b.value.id, b]),
);
const algorithms = await loadAll('content/medicine/algorithms', m => m.algorithm);
const algorithmIds = new Set(algorithms.map(a => a.value.id));

for (const { file, value } of algorithms) checkAlgorithm(file, value, books, algorithmIds);

/* --- уроки: выжимки, термины, вопросы --- */

const { course } = await import(pathToFileURL(path.join(ROOT, 'content/medicine/index.js')).href);
const lessons = course.lessons || [];
let terms = 0;
const seenTerms = new Map();

for (const lesson of lessons) {
  const where = `урок ${lesson.id}`;
  if (!course.categories.some(c => c.key === lesson.aspect)) {
    fail(where, `предмет «${lesson.aspect}» не объявлен в категориях курса`);
  }
  if (!course.groups.includes(lesson.group)) fail(where, `группа «${lesson.group}» не объявлена в курсе`);

  (lesson.steps || []).forEach((step, i) => {
    const stepWhere = `${where}, шаг ${i + 1} (${step.type})`;
    if (step.src) checkSource(stepWhere, step.src, books, { section: false });

    if (step.type === 'table') {
      (step.rows || []).forEach(row => {
        if (row.cells.length !== step.cols.length) {
          fail(stepWhere, `строка «${row.label}»: ${row.cells.length} ячеек на ${step.cols.length} столбцов`);
        }
      });
    }

    if (step.type === 'terms') {
      (step.items || []).forEach(t => {
        terms += 1;
        if (!t.en || !t.ru) return fail(stepWhere, `термин без перевода: ${t.en || t.ru}`);
        /* один термин в двух темах — это не ошибка, но словарь потом дублирует */
        if (seenTerms.has(t.en) && seenTerms.get(t.en) !== lesson.id) {
          warn(stepWhere, `термин «${t.en}» уже есть в теме ${seenTerms.get(t.en)}`);
        }
        seenTerms.set(t.en, lesson.id);
      });
    }
  });
}

/* тест без вопросов — пустой экран вместо проверки */
for (const test of course.tests || []) {
  const pool = (course.questions || []).filter(test.filter);
  if (!pool.length) fail(`тест ${test.id}`, 'в пуле нет ни одного вопроса');
  else if (pool.length < test.pick) {
    warn(`тест ${test.id}`, `вопросов ${pool.length}, а просит ${test.pick} — покажет меньше`);
  }
}

const nodeCount = algorithms.reduce((sum, a) => sum + (a.value.nodes?.length || 0), 0);
console.log(`книг: ${books.size} · алгоритмов: ${algorithms.length} · узлов: ${nodeCount}`);
console.log(`уроков: ${lessons.length} · терминов: ${terms} · вопросов: ${(course.questions || []).length}`
  + ` · тестов: ${(course.tests || []).length}`);

warns.forEach(w => console.log(`  ⚠ ${w}`));
if (errors.length) {
  errors.forEach(e => console.log(`  ✗ ${e}`));
  console.log(`\nошибок: ${errors.length}`);
  process.exit(1);
}
console.log('всё сходится');
