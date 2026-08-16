/* ============================================================
   SURVEY — экран опроса: цель → опыт → 6 быстрых вопросов → программа.
   Шаги, как в уроке: один экран = один вопрос.
   ============================================================ */
import { navHTML, bindNav } from '../nav.js';
import { store } from '../storage.js';
import { setKeys } from '../keys.js';
import { icon } from '../../ui/icons.js';
import { GOALS, EXPERIENCE, surveyQuestions, assessLevel, buildProgram } from '../survey.js';

export function renderSurvey(app, course) {
  const questions = surveyQuestions(course);
  const steps = ['goal', 'experience', ...questions.map((_, i) => `q${i}`)];
  const answers = { goal: null, experience: null, quiz: [] };
  const accent = course.categories[0].color;
  let idx = 0;

  app.innerHTML = `
    ${navHTML(course, 'survey')}
    <div class="player wrap" style="--accent:${accent}">
      <div class="player-top">
        <button class="btn btn-secondary btn-icon" id="back" type="button"
          title="На главную" aria-label="На главную">${icon('chevron-left')}</button>
        <div class="track" id="track"></div>
      </div>
      <div class="deck-head">
        <span class="pill">ОПРОС <span class="num" id="num">· 1/${steps.length}</span></span>
        <h1>Соберём программу под тебя</h1>
        <div class="lesson-sub" id="sub">Три минуты — и дальше идёшь по своему порядку, а не по общему списку.</div>
      </div>
      <div class="stage" id="stage"></div>
      <div class="controls">
        <button class="btn btn-secondary" id="prev" type="button">${icon('chevron-left')} Назад</button>
        <button class="btn btn-primary" id="next" type="button" disabled>Дальше ${icon('chevron-right')}</button>
      </div>
      <div class="step-meta"><span id="meta"></span></div>
    </div>`;

  const stage = app.querySelector('#stage');
  const track = app.querySelector('#track');
  const num = app.querySelector('#num');
  const sub = app.querySelector('#sub');
  const meta = app.querySelector('#meta');
  const prevBtn = app.querySelector('#prev');
  const nextBtn = app.querySelector('#next');

  bindNav(app);
  app.querySelector('#back').addEventListener('click', () => { location.hash = '#/'; });
  setKeys(e => { if (e.key === 'Escape') location.hash = '#/'; });

  function paintTrack() {
    track.innerHTML = steps.map((_, i) =>
      `<i class="${i < idx ? 'is-correct' : i === idx ? 'is-here' : ''}"></i>`).join('');
    num.textContent = `· ${idx + 1}/${steps.length}`;
    meta.textContent = `шаг ${idx + 1} из ${steps.length}`;
  }

  function choiceList(items, selectedKey) {
    return `<div class="opts">${items.map(it => `
      <button type="button" class="opt ${it.key === selectedKey ? 'is-selected' : ''}" data-key="${it.key}">
        ${it.label}${it.note ? `<small class="opt-note">${it.note}</small>` : ''}
      </button>`).join('')}</div>`;
  }

  function draw() {
    const step = steps[idx];
    const div = document.createElement('div');
    div.className = 'step in';

    if (step === 'goal') {
      sub.textContent = 'Зачем тебе язык — от этого зависит порядок тем.';
      div.innerHTML = `<div class="fade-seq quiz">
        <div class="q-type">цель</div>
        <div class="q">Что важнее всего сейчас?</div>
        ${choiceList(GOALS, answers.goal)}</div>`;
    } else if (step === 'experience') {
      sub.textContent = 'Честно — так программа выйдет точнее.';
      div.innerHTML = `<div class="fade-seq quiz">
        <div class="q-type">опыт</div>
        <div class="q">Как сейчас с языком?</div>
        ${choiceList(EXPERIENCE, answers.experience)}</div>`;
    } else {
      const i = +step.slice(1);
      const q = questions[i];
      sub.textContent = 'Не знаешь — отвечай наугад, это не экзамен.';
      div.innerHTML = `<div class="fade-seq quiz">
        <div class="q-type">проверка · ${q.g}</div>
        <div class="q">${q.q}</div>
        <div class="opts">${q.options.map((o, oi) =>
          `<button type="button" class="opt ${answers.quiz[i] === oi ? 'is-selected' : ''}" data-key="${oi}">${o}</button>`).join('')}</div>
        ${q.ru ? `<div class="q-ru">${q.ru}</div>` : ''}</div>`;
    }

    stage.replaceChildren(div);

    div.querySelectorAll('.opt').forEach(btn => btn.addEventListener('click', () => {
      div.querySelectorAll('.opt').forEach(x => x.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      if (step === 'goal') answers.goal = btn.dataset.key;
      else if (step === 'experience') answers.experience = btn.dataset.key;
      else answers.quiz[+step.slice(1)] = +btn.dataset.key;
      nextBtn.disabled = false;
    }));

    prevBtn.disabled = idx === 0;
    nextBtn.disabled = !answered(step);
    nextBtn.innerHTML = idx === steps.length - 1
      ? `Собрать программу ${icon('check')}`
      : `Дальше ${icon('chevron-right')}`;
    paintTrack();
  }

  const answered = step =>
    step === 'goal' ? !!answers.goal
      : step === 'experience' ? !!answers.experience
      : answers.quiz[+step.slice(1)] != null;

  function finish() {
    const correct = questions.reduce((s, q, i) => s + (answers.quiz[i] === q.answer ? 1 : 0), 0);
    const weakGroups = [...new Set(questions.filter((q, i) => answers.quiz[i] !== q.answer).map(q => q.g))];
    const level = assessLevel({ correct, total: questions.length, experienceKey: answers.experience });
    const goal = GOALS.find(g => g.key === answers.goal);
    const program = buildProgram(course, { level, goalKey: answers.goal, weakGroups });

    store.setProfile(course.id, {
      level,
      goal: goal?.label || '',
      survey: { goal: answers.goal, experience: answers.experience, correct, total: questions.length, weakGroups },
    });
    store.setProgram(course.id, program);

    const nextLesson = course.lessonById(program.items[0]);
    app.querySelector('.deck-head').innerHTML = `
      <span class="pill">${icon('check')} готово</span>
      <h1>Уровень ${level}</h1>
      <div class="lesson-sub">${program.note}</div>`;
    stage.innerHTML = `
      <div class="fade-seq">
        <div class="stitle" style="text-align:center">твоя программа — первые шаги</div>
        <div class="rows">
          ${program.items.slice(0, 5).map((id, i) => {
            const l = course.lessonById(id);
            return l ? `<a class="row" href="#/lesson/${l.id}" style="--accent:${course.accentFor(l)}">
              <span class="row-num">${String(i + 1).padStart(2, '0')}</span>
              <span class="row-body"><b>${l.title}</b><small>${l.subtitle}</small></span>
              <span class="row-go">${icon('chevron-right')}</span></a>` : '';
          }).join('')}
        </div>
        <p class="lede" style="margin:var(--s-4) auto 0;text-align:center">Весь список — на главной.
          Порядок можно поменять: скажи мне, и я пересоберу.</p>
      </div>`;
    app.querySelector('.controls').innerHTML = `
      <a class="btn btn-secondary" href="#/">На главную</a>
      <a class="btn btn-primary" href="#/lesson/${nextLesson?.id || ''}">Начать первый урок ${icon('chevron-right')}</a>`;
    meta.textContent = `уровень ${level} · ${correct} из ${questions.length} верно в проверке`;
    paintTrack();
    window.scrollTo(0, 0);
  }

  function go(i) {
    if (i < 0) return;
    if (i >= steps.length) return finish();
    idx = i;
    draw();
  }

  prevBtn.addEventListener('click', () => go(idx - 1));
  nextBtn.addEventListener('click', () => go(idx + 1));
  draw();
}
