/// <reference path="../pb_data/types.d.ts" />

/**
 * Ступень 0 — законное значение, а не пустое поле.
 *
 * `box` был объявлен required, и PocketBase на этом ловит: для числового
 * поля required значит «не ноль». А ноль — это ровно промах: ответил
 * мимо → ступень падает до нуля → вопрос возвращается завтра.
 *
 * Итог: сервер отвечал 400 «Cannot be blank» на каждый неверный ответ,
 * очередь считала 4xx неисправимым и молча его выбрасывала. Верные
 * ответы доезжали, неверные — никогда. Причём именно неверные и есть
 * весь смысл: из промахов собирается журнал ошибок и горячие зоны,
 * по которым доза выбирает, что показать завтра.
 *
 * min: 0 остаётся — отрицательной ступени не бывает. Уходит только
 * required: пустым `box` не приедет, его всегда пишет engine/review.js.
 */
migrate((app) => {
  const reviews = app.findCollectionByNameOrId('reviews');
  const box = reviews.fields.getByName('box');
  box.required = false;
  app.save(reviews);

  console.log('[migration] reviews.box: ноль больше не считается пустым');
}, (app) => {
  const reviews = app.findCollectionByNameOrId('reviews');
  reviews.fields.getByName('box').required = true;
  app.save(reviews);
});
