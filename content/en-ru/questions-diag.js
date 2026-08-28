/* ============================================================
   ЗАМЕР — 24 вопроса, по два-три на каждую зону курса.

   Зачем отдельный пул, а не «случайные 24 из банка»: случайная
   выборка из 550 вопросов каждый раз меряет разное, и два прохода
   подряд дают несравнимые цифры. Здесь состав фиксирован по
   покрытию — меняется только порядок, — поэтому «было 14/24,
   стало 19/24» означает ровно то, что означает.

   Уровень нарастает: первые вопросы A2, последние B2. Смысл не
   в том, чтобы всё решить, а в том, чтобы стало видно, где
   начинает сыпаться.

   Ни один вопрос не повторяет пачки 1–4: замер должен ловить
   умение, а не память о том, что этот вопрос уже попадался.
   ============================================================ */

export const DIAG_QUESTIONS = [

/* --- база: должно быть автоматом (A2) --- */
{ g:'Замер', r4:true, diag:true, tag:['diag'], type:'choose',
  q:'My colleagues ___ from three different countries.',
  options:['is','are','am'], answer:1,
  ru:'мои коллеги из трёх разных стран', why:'colleagues — множественное → are.' },
{ g:'Замер', r4:true, diag:true, tag:['diag'], type:'error',
  q:'She don’t work on Fridays.',
  tokens:['She','don’t','work','on','Fridays'], answer:1, fix:'doesn’t',
  ru:'она не работает по пятницам', why:'she → doesn’t. -s уходит в помощника.' },

/* --- Past-нарратив (B1) --- */
{ g:'Замер', r4:true, diag:true, tag:['diag'], type:'choose',
  q:'When I opened the door, the cat ___ on my bed.',
  options:['slept','was sleeping','had slept'], answer:1,
  ru:'когда я открыл дверь, кот спал на моей кровати',
  why:'процесс в тот момент → Past Continuous.' },
{ g:'Замер', r4:true, diag:true, tag:['diag'], type:'mgap',
  q:'By the time the guests ___ (arrive), she ___ (finish) cooking.',
  answer:[['arrived'],['had finished']],
  ru:'к приходу гостей она закончила готовить',
  why:'by the time + Past Simple → раньшее действие в Past Perfect.' },
{ g:'Замер', r4:true, diag:true, tag:['diag'], type:'choose',
  q:'We ___ have a car, but we sold it last year.',
  options:['used to','use to','are used to'], answer:0,
  ru:'раньше у нас была машина, но мы продали её в прошлом году',
  why:'прошлая привычка/состояние, которого больше нет → used to.' },

/* --- Present Perfect ↔ Past (B1) --- */
{ g:'Замер', r4:true, diag:true, tag:['diag'], type:'choose',
  q:'I ___ my passport — I can’t travel until I find it.',
  options:['lost','have lost','was losing'], answer:1,
  ru:'я потерял паспорт — не смогу поехать, пока не найду',
  why:'результат важен сейчас → Present Perfect.' },
{ g:'Замер', r4:true, diag:true, tag:['diag'], type:'error',
  q:'I have visited Berlin in 2019.',
  tokens:['I','have','visited','Berlin','in','2019'], answer:1, fix:'—', altfix:'visited',
  ru:'я был в Берлине в 2019 году',
  why:'точный год → Past Simple: I visited.' },
{ g:'Замер', r4:true, diag:true, tag:['diag'], type:'choose',
  q:'They ___ in this office since March.',
  options:['work','are working','have been working'], answer:2,
  ru:'они работают в этом офисе с марта',
  why:'since + всё ещё продолжается → Present Perfect Continuous.' },

/* --- предлоги (B1–B2) --- */
{ g:'Замер', r4:true, diag:true, tag:['diag'], type:'gap',
  q:'The success of the project depends ___ funding. (предлог)', answer:['on'],
  ru:'успех проекта зависит от финансирования', why:'depend ON.' },
{ g:'Замер', r4:true, diag:true, tag:['diag'], type:'choose',
  q:'There has been a sharp rise ___ unemployment.',
  options:['of','in','to'], answer:1,
  ru:'произошёл резкий рост безработицы', why:'a rise / fall / increase IN something.' },
{ g:'Замер', r4:true, diag:true, tag:['diag'], type:'error',
  q:'He is married with a teacher.',
  tokens:['He','is','married','with','a','teacher'], answer:3, fix:'to',
  ru:'он женат на учительнице', why:'married TO somebody.' },

/* --- -ing и состояния (B1) --- */
{ g:'Замер', r4:true, diag:true, tag:['diag'], type:'error',
  q:'I am not believing this story.',
  tokens:['I','am','not','believing','this','story'], answer:3, fix:'believe',
  ru:'я не верю в эту историю',
  why:'believe — состояние: I don’t believe.' },
{ g:'Замер', r4:true, diag:true, tag:['diag'], type:'choose',
  q:'She usually ___ tea, but today she ___ coffee.',
  options:['drinks / is drinking','is drinking / drinks','drink / drinks'], answer:0,
  ru:'обычно она пьёт чай, но сегодня — кофе',
  why:'usually → Simple, today (сейчас) → Continuous.' },

/* --- артикли и кванторы (B1) --- */
{ g:'Замер', r4:true, diag:true, tag:['diag'], type:'choose',
  q:'We don’t have ___ information about the delay.',
  options:['many','much','a few'], answer:1,
  ru:'у нас мало информации о задержке', why:'information неисчисляемо → much.' },
{ g:'Замер', r4:true, diag:true, tag:['diag'], type:'error',
  q:'The education is important for every country.',
  tokens:['The','education','is','important','for','every','country'], answer:0, fix:'—',
  ru:'образование важно для каждой страны',
  why:'понятие вообще → без артикля: Education is important.' },

/* --- условные и wish (B1–B2) --- */
{ g:'Замер', r4:true, diag:true, tag:['diag'], type:'choose',
  q:'If she ___ harder, she would have passed.',
  options:['studied','had studied','would study'], answer:1,
  ru:'если бы она занималась усерднее, она бы сдала',
  why:'сожаление о прошлом → третий тип: had studied + would have passed.' },
{ g:'Замер', r4:true, diag:true, tag:['diag'], type:'choose',
  q:'I wish I ___ speak Italian fluently.',
  options:['can','could','will'], answer:1,
  ru:'жаль, что я не говорю по-итальянски свободно',
  why:'I wish + could (о настоящем).' },

/* --- пассив и косвенная речь (B1–B2) --- */
{ g:'Замер', r4:true, diag:true, tag:['diag'], type:'form',
  q:'The bridge ___ (build) in 1890.', answer:['was built'],
  ru:'мост построили в 1890 году', why:'пассив в прошлом: was + V3.' },
{ g:'Замер', r4:true, diag:true, tag:['diag'], type:'choose',
  q:'He told me he ___ the email that morning.',
  options:['sends','had sent','has sent'], answer:1,
  ru:'он сказал, что отправил письмо тем утром',
  why:'косвенная речь сдвигает время на шаг назад.' },

/* --- герундий, придаточные, сравнения (B1–B2) --- */
{ g:'Замер', r4:true, diag:true, tag:['diag'], type:'choose',
  q:'I don’t mind ___ early if it saves time.',
  options:['to get up','getting up','get up'], answer:1,
  ru:'я не против вставать рано, если это экономит время',
  why:'mind / enjoy / avoid + -ing.' },
{ g:'Замер', r4:true, diag:true, tag:['diag'], type:'choose',
  q:'The woman ___ car was stolen called the police.',
  options:['who','whose','which'], answer:1,
  ru:'женщина, чью машину угнали, вызвала полицию',
  why:'принадлежность → whose.' },
{ g:'Замер', r4:true, diag:true, tag:['diag'], type:'error',
  q:'This solution is more better than the previous one.',
  tokens:['This','solution','is','more','better','than','the','previous','one'], answer:3, fix:'—',
  ru:'это решение лучше предыдущего',
  why:'better — уже сравнительная степень, more не нужно.' },

/* --- академическая лексика (B2) --- */
{ g:'Замер', r4:true, diag:true, lex:true, tag:['diag'], type:'choose',
  q:'The findings ___ that the method works.',
  options:['suggest','tell','say to'], answer:0,
  ru:'результаты позволяют предположить, что метод работает',
  why:'findings suggest / indicate / show — академические глаголы вывода.' },
{ g:'Замер', r4:true, diag:true, lex:true, tag:['diag'], type:'choose',
  q:'___ the high cost, the programme was expanded.',
  options:['Although','Despite','However'], answer:1,
  ru:'несмотря на высокую стоимость, программу расширили',
  why:'перед существительным → Despite. Although требует подлежащее с глаголом.' },
];
