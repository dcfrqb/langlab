/* ============================================================
   SURVEY — экран опроса: цель → опыт → 6 быстрых вопросов → программа.
   Шаги, как в уроке: один экран = один вопрос.
   ============================================================ */
import { navHTML, bindNav } from '../nav.js';
import { store } from '../storage.js';
import { setKeys } from '../keys.js';
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
        <button class="back-btn" id="back" type="button" title="На главную" aria-label="На главную">‹</button>
        <div class="t-progress" id="bar"></div>
      </div>
      <div class="deck-head">
        <span class="pill">ОПРОС <span class="num" id="num">· 1/${steps.length}</span></span>
        <h1 style="font-size:clamp(22px,5.4vw,36px)">Соберём программу под тебя</h1>
        <div class="lesson-sub" id="sub">Три минуты — и дальше идёшь по своему порядку, а не по общему списку.</div>
      </div>
      <div class="stage" id="stage"></div>
      <div class="controls">
        <button class="nav-btn" id="prev" type="button">‹ Назад</button>
        <button class="nav-btn primary" id="next" type="button" disabled>Дальше ›</button>
      </div>
    </div>`;

  const stage = app.querySelector('#stage');
  const bar = app.querySelector('#bar');
  const num = app.querySelector('#num');
  const sub = app.querySelector('#sub');
  const prevBtn = app.querySelector('#prev');
  const nextBtn = app.querySelector('#next');

  bindNav(app);
  app.querySelector('#back').addEventListener('click', () => { location.hash = '#/'; });
  setKeys(e => { if (e.key === 'Escape') location.hash = '#/'; });

  function paintBar() {
    bar.innerHTML = steps.map((_, i) =>
      `<i class="${i < idx ? 'ok' : i === idx ? 'cur' : ''}"></i>`).join('');
    num.textContent = `· ${idx + 1}/${steps.length}`;
  }

  function choiceList(items, selectedKey) {
    return `<div class="opts">${items.map(it => `
      <button type="button" class="opt ${it.key === selectedKey ? 'sel' : ''}" data-key="${it.key}">
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
          `<button type="button" class="opt ${answers.quiz[i] === oi ? 'sel' : ''}" data-key="${oi}">${o}</button>`).join('')}</div>
        ${q.ru ? `<div class="q-ru">${q.ru}</div>` : ''}</div>`;
    }

    stage.replaceChildren(div);

    div.querySelectorAll('.opt').forEach(btn => btn.addEventListener('click', () => {
      div.querySelectorAll('.opt').forEach(x => x.classList.remove('sel'));
      btn.classList.add('sel');
      if (step === 'goal') answers.goal = btn.dataset.key;
      else if (step === 'experience') answers.experience = btn.dataset.key;
      else answers.quiz[+step.slice(1)] = +btn.dataset.key;
      nextBtn.disabled = false;
    }));

    prevBtn.disabled = idx === 0;
    nextBtn.disabled = !answered(step);
    nextBtn.textContent = idx === steps.length - 1 ? 'Собрать программу ✓' : 'Дальше ›';
    paintBar();
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
      <span class="pill">ГОТОВО</span>
      <h1 style="font-size:clamp(24px,5.6vw,40px)">Уровень ${level}</h1>
      <div class="lesson-sub">${program.note}</div>`;
    stage.innerHTML = `
      <div class="fade-seq" style="text-align:center">
        <div class="stitle">твоя программа</div>
        <div class="ex-list" style="max-width:520px;margin:0 auto">
          ${program.items.slice(0, 5).map((id, i) => {
            const l = course.lessonById(id);
            return l ? `<a class="rev" href="#/lesson/${l.id}" style="--accent:${course.accentFor(l)};text-align:left">
              <div class="en" style="font-size:17px">${i + 1}. ${l.title}</div>
              <div class="ru" style="max-height:none;opacity:1;margin-top:6px">${l.subtitle}</div></a>` : '';
          }).join('')}
        </div>
        <p class="lede" style="margin:18px auto 0">Дальше по списку — на главной. Порядок можно поменять: скажи мне, и я пересоберу.</p>
      </div>`;
    app.querySelector('.controls').innerHTML = `
      <a class="nav-btn" href="#/">На главную</a>
      <a class="nav-btn primary" href="#/lesson/${nextLesson?.id || ''}">Начать первый урок ›</a>`;
    paintBar();
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
