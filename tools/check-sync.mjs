/* ============================================================
   CHECK-SYNC — проверка очереди отправки в базу.

     node tools/check-sync.mjs

   Зачем отдельная проверка именно здесь: это единственное место
   в проекте, где потеря данных не видна вообще ничем. Экран рисуется,
   ответ засчитан, ритм посчитан, ошибок в консоли нет — а в базе
   записи не появилось. Так дважды терялось расписание повторений:
   один раз из-за гонки в очереди, второй — из-за 400, который
   выбрасывался молча. Оба случая закреплены тестами ниже.

   Тест гоняет НАСТОЯЩИЕ engine/sync.js и engine/api.js: подменяются
   только localStorage и fetch, то есть браузер, а не наш код.
   ============================================================ */

import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const load = p => import(pathToFileURL(path.join(ROOT, p)).href);

/* --- браузер, которого здесь нет --- */
const mem = new Map();
globalThis.localStorage = {
  getItem: k => (mem.has(k) ? mem.get(k) : null),
  setItem: (k, v) => mem.set(k, String(v)),
  removeItem: k => mem.delete(k),
};
Object.defineProperty(globalThis, 'navigator', { value: { onLine: true }, configurable: true });
globalThis.window = { addEventListener() {} };

/* Аккаунт должен лежать в localStorage ДО импорта api.js: он читает
   его один раз при загрузке модуля. */
localStorage.setItem('langlab.auth', JSON.stringify({ token: 'test', user: { id: 'u1', email: 't@t' } }));

/* --- сервер, которого здесь тоже нет --- */
let rows = [];            // что «создано» в базе
let plan = [];            // очередь ответов: {status, delay}
let seenPaths = [];

const nextPlan = () => (plan.length ? plan.shift() : { status: 200 });

globalThis.fetch = async (url, opts = {}) => {
  const method = opts.method || 'GET';
  seenPaths.push(`${method} ${String(url).split('?')[0]}`);

  if (method === 'GET') {                       // «есть ли такая запись» — нет
    return { ok: true, status: 200, json: async () => ({ items: [] }) };
  }
  const step = nextPlan();
  if (step.delay) await new Promise(r => setTimeout(r, step.delay));
  if (step.status >= 400) {
    return {
      ok: false, status: step.status,
      json: async () => ({ message: 'нет', data: { box: { code: 'validation_required' } } }),
    };
  }
  rows.push(JSON.parse(opts.body));
  return { ok: true, status: 200, json: async () => ({ id: 'r' + rows.length }) };
};

const { sync } = await load('engine/sync.js');

const errors = [];
const check = (ok, what) => { if (!ok) errors.push(what); };
const reset = () => {
  rows = []; plan = []; seenPaths = [];
  localStorage.removeItem('langlab.queue.v1');
  localStorage.removeItem('langlab.sync.rejected');
};
const queueLen = () => JSON.parse(localStorage.getItem('langlab.queue.v1') || '[]').length;
const settle = () => new Promise(r => setTimeout(r, 120));

/* ------------------------------------------------------------
   1. Запись, добавленная во время отправки, не теряется.

   Ровно то, что делает каждый ответ: review.record сначала считает
   день, потом сохраняет расписание вопроса. Второй enqueue случается,
   пока первый запрос ещё летит.
   ------------------------------------------------------------ */
reset();
plan = [{ status: 200, delay: 40 }, { status: 200 }];
sync.enqueue({ kind: 'day', courseId: 'en-ru', day: '2026-08-31', answered: 1 });
sync.enqueue({ kind: 'review', courseId: 'en-ru', key: 'q1', rec: { b: 2, d: '2026-09-03', n: 1, m: 0, at: '2026-08-31' } });
await settle();
check(rows.length === 2, `гонка: до базы доехало ${rows.length} записей из 2`);
check(rows.some(r => r.question === 'q1'), 'гонка: расписание вопроса потерялось — это и был баг');
check(queueLen() === 0, `гонка: в очереди осталось ${queueLen()}`);

/* ------------------------------------------------------------
   2. Ступень 0 доезжает.

   PocketBase считает ноль пустым значением у required-поля, и на
   каждый промах отвечал 400. Здесь сервер честный — проверяем, что
   ноль вообще уходит в тело запроса, а не отсекается по дороге.
   ------------------------------------------------------------ */
reset();
sync.enqueue({ kind: 'review', courseId: 'en-ru', key: 'q0', rec: { b: 0, d: '2026-09-01', n: 1, m: 1, at: '2026-08-31' } });
await settle();
check(rows.length === 1 && rows[0].box === 0, 'промах: запись со ступенью 0 не ушла в базу');

/* ------------------------------------------------------------
   3. Отказ сервера (4xx) выбрасывается — но со следом.

   Держать такую запись в очереди нельзя: она будет вечно получать
   те же 400. А выбрасывать молча — как раз то, из-за чего дыру
   не видели: ни ошибки, ни следа, ни строки в базе.
   ------------------------------------------------------------ */
reset();
plan = [{ status: 400 }];
const warns = [];
const realWarn = console.warn;
console.warn = (...a) => warns.push(a.join(' '));
sync.enqueue({ kind: 'review', courseId: 'en-ru', key: 'q400', rec: { b: 1, d: '2026-09-01', n: 1, m: 0, at: '2026-08-31' } });
await settle();
console.warn = realWarn;
check(queueLen() === 0, '4xx: неисправимая запись осталась в очереди и будет биться вечно');
check(warns.length > 0, '4xx: потеря прошла молча — именно так баг и прятался');
check(JSON.parse(localStorage.getItem('langlab.sync.rejected') || '[]').length === 1,
  '4xx: отказ не записан в журнал отказов');

/* ------------------------------------------------------------
   4. Сбой сети (5xx) — запись остаётся и уедет потом.
   ------------------------------------------------------------ */
reset();
plan = [{ status: 503 }];
sync.enqueue({ kind: 'day', courseId: 'en-ru', day: '2026-08-31', answered: 3 });
await settle();
check(queueLen() === 1, '5xx: запись выброшена, хотя повтор бы помог');

reset();

if (errors.length) {
  errors.forEach(e => console.log(`  ✗ ${e}`));
  console.log(`\nошибок: ${errors.length}`);
  process.exit(1);
}
console.log('очередь отправки: гонка, ступень 0, отказ 4xx и сбой сети — всё сходится');
