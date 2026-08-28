/* ============================================================
   TESTS — банк вопросов + сборка тестов.

   Банк собран из четырёх пачек, каждая в своём файле:
     здесь              пачки 1–2 · A1/A2 · база и первое закрепление
     questions-b1.js    пачка 3   · B1/B2 · конструкции и лексика
     questions-fix.js   пачка 4   · РЕМОНТ — под журнал ошибок Will'а
     questions-ielts.js пачка 4   · МОСТ К IELTS — письмо и академическая лексика
     questions-diag.js  ЗАМЕР     · 24 вопроса фиксированного состава

   Типы вопросов:
     choose — выбор варианта      order — собрать предложение
     gap    — вписать слово       mgap  — два пропуска в предложении
     form   — поставить форму     pick  — отметить все верные
     error  — найти ошибочное слово

   Поля: g — группа, type, q, options/answer/…, ru — перевод/подсказка,
         why — разбор, mine:true — построено на реальной ошибке,
         lex:true — лексический, diag:true — только для замера,
         r2/r3/r4 — номер пачки, tag:[...] — из какого теста брать.
   ============================================================ */
import { B1_QUESTIONS } from './questions-b1.js';
import { FIX_QUESTIONS } from './questions-fix.js';
import { IELTS_QUESTIONS } from './questions-ielts.js';
import { DIAG_QUESTIONS } from './questions-diag.js';

const BASE_QUESTIONS = [

/* ============ БАЗА ============ */
{ g:'База', type:'choose', q:'___ you tired?', options:['Am','Is','Are'], answer:2,
  ru:'ты устал?', why:'you → are.' },
{ g:'База', type:'gap', q:'Karina and I ___ ready for the move.', answer:['are'],
  ru:'мы с Кариной готовы к переезду', why:'два человека (we) → are. Пропуск «are» — твоя ошибка из Рубежа 1.', mine:true },
{ g:'База', type:'error', q:'She are a good student.', tokens:['She','are','a','good','student'], answer:1,
  fix:'is', ru:'она хорошая ученица', why:'She → is, не are.' },
{ g:'База', type:'choose', q:'We need three ___.', options:['document','documents','a document'], answer:1,
  ru:'нам нужно три документа', why:'после числа >1 → множественное, +s.' },
{ g:'База', type:'choose', q:'___ apples are fresh.', options:['This','These','That'], answer:1,
  ru:'эти яблоки свежие', why:'apples — много, рядом → these. Ты путал this/these — держи в фокусе.', mine:true },
{ g:'База', type:'error', q:'I have some picture on my phone.', tokens:['I','have','some','picture','on','my','phone'], answer:3,
  fix:'pictures', ru:'у меня несколько фото в телефоне', why:'some + исчисляемое → множественное: pictures.', mine:true },
{ g:'База', type:'choose', q:'Как носитель скорее скажет в разговоре?',
  options:['I have got a question','I’ve got a question','I am having a question'], answer:1,
  ru:'у меня есть вопрос', why:'в речи сокращают → I’ve got.' },
{ g:'База', type:'gap', q:'She ___ got a meeting tomorrow. (has/have)', answer:['has','has’s','’s'],
  ru:'у неё завтра встреча', why:'he/she/it → has got (’s got).' },
{ g:'База', type:'order', ru:'она любит музыку',
  tokens:['She','loves','music'], answer:'She loves music',
  why:'жёсткий порядок: Кто → действие → что (SVO).' },
{ g:'База', type:'error', q:'I student from Russia.', tokens:['I','student','from','Russia'], answer:0,
  fix:'I am', ru:'я студент из России', why:'без глагола to be предложения нет: I am a student.' },
{ g:'База', type:'choose', q:'She wants ___ time, not money.', options:['a','the','—'], answer:2,
  ru:'ей нужно время, а не деньги', why:'time тут неисчисляемое «вообще» → без артикля. «a time» — твоя ошибка из Рубежа 1.', mine:true },

/* ============ PRESENT ============ */
{ g:'Present', type:'choose', q:'Karina ___ two languages.', options:['speak','speaks','is speaking'], answer:1,
  ru:'Карина говорит на двух языках', why:'Karina = she, привычка/факт → speaks (+s).' },
{ g:'Present', type:'form', q:'He ___ (study) every morning.', answer:['studies'],
  ru:'он занимается каждое утро', why:'he + Present Simple, study → studies (-y→-ies).' },
{ g:'Present', type:'choose', q:'Don’t call me now — I ___ my motivation letter.',
  options:['write','am writing','writes'], answer:1,
  ru:'не звони сейчас — я пишу письмо', why:'прямо сейчас → am writing.' },
{ g:'Present', type:'error', q:'I am wanting a coffee.', tokens:['I','am','wanting','a','coffee'], answer:2,
  fix:'want', ru:'я хочу кофе', why:'want — глагол состояния, не ставим в -ing: I want. Твоя ошибка из Рубежа 2.', mine:true },
{ g:'Present', type:'error', q:'She take pictures every day.', tokens:['She','take','pictures','every','day'], answer:1,
  fix:'takes', ru:'она фотографирует каждый день', why:'she + привычка → takes (+s). Раньше ты, наоборот, лепил лишний -ing.', mine:true },
{ g:'Present', type:'choose', q:'He usually ___ the bus, but today he ___.',
  options:['takes / is walking','is taking / walks','take / walks'], answer:0,
  ru:'обычно ездит на автобусе, но сегодня идёт пешком', why:'usually → Simple, today (сейчас) → Continuous.' },
{ g:'Present', type:'choose', q:'___ you ever ___ to Italy?',
  options:['Did / go','Have / been','Are / being'], answer:1,
  ru:'ты когда-нибудь был в Италии?', why:'ever + опыт → Present Perfect: Have you ever been. «did … been» — твоя ошибка из Рубежа 2.', mine:true },
{ g:'Present', type:'form', q:'I have already ___ (submit) my application.', answer:['submitted'],
  ru:'я уже подал заявку', why:'Present Perfect → have + V3 (submitted).' },
{ g:'Present', type:'gap', q:'She has never ___ to Rome. (be → V3)', answer:['been'],
  ru:'она никогда не была в Риме', why:'have/has + been (V3 от be).' },
{ g:'Present', type:'order', ru:'смотри, идёт дождь!',
  tokens:['Look,','it','is','raining'], answer:'Look, it is raining',
  why:'прямо сейчас, в моменте → is + V-ing.' },
{ g:'Present', type:'error', q:'I have finished it yesterday.', tokens:['I','have','finished','it','yesterday'], answer:1,
  fix:'—', altfix:'finished', ru:'я закончил это вчера', why:'есть «yesterday» → Past Simple: I finished it yesterday. С точным временем Perfect нельзя.' },

/* ============ PAST ============ */
{ g:'Past', type:'choose', q:'I ___ my IELTS results last week.', options:['get','got','have got'], answer:1,
  ru:'я получил результаты на прошлой неделе', why:'last week → Past Simple, get → got.' },
{ g:'Past', type:'error', q:'I didn’t went to the lesson.', tokens:['I','didn’t','went','to','the','lesson'], answer:2,
  fix:'go', ru:'я не пошёл на урок', why:'после didn’t — начальная форма: go, не went.' },
{ g:'Past', type:'error', q:'Did you saw the email?', tokens:['Did','you','saw','the','email'], answer:2,
  fix:'see', ru:'ты видел письмо?', why:'после did — начальная форма: see.' },
{ g:'Past', type:'form', q:'We ___ (visit) Milan last spring.', answer:['visited'],
  ru:'мы съездили в Милан прошлой весной', why:'last spring → Past Simple, +ed.' },
{ g:'Past', type:'choose', q:'While I ___ the essay, my laptop died.',
  options:['wrote','was writing','write'], answer:1,
  ru:'пока я писал эссе, ноут вырубился', why:'длительный фон → Past Continuous (was writing).' },
{ g:'Past', type:'choose', q:'I couldn’t apply — the deadline ___.',
  options:['passed','had passed','has passed'], answer:1,
  ru:'я не смог подать — дедлайн уже прошёл', why:'прошёл ДО того как я проверил → Past Perfect (had passed).' },
{ g:'Past', type:'gap', q:'She ___ (study → V2) Italian before the move.', answer:['studied'],
  ru:'она учила итальянский до переезда', why:'Past Simple: study → studied.' },
{ g:'Past', type:'order', ru:'вчера я прошёл пробный IELTS',
  tokens:['Yesterday','I','took','a','mock','IELTS','test'], answer:'Yesterday I took a mock IELTS test',
  why:'есть «вчера» → Past Simple, take → took.' },

/* ============ FUTURE ============ */
{ g:'Future', type:'choose', q:'Look at those clouds! It ___ rain.',
  options:['will','is going to','goes'], answer:1,
  ru:'посмотри на тучи! будет дождь', why:'есть признак сейчас → be going to.' },
{ g:'Future', type:'choose', q:'This is heavy — I ___ help you.',
  options:['am going to','will','help'], answer:1,
  ru:'тяжело — я помогу тебе', why:'решение прямо сейчас → will.' },
{ g:'Future', type:'gap', q:'She ___ (will + not, кратко) call you.', answer:['won’t','wont'],
  ru:'она не позвонит', why:'will not → won’t.' },
{ g:'Future', type:'choose', q:'By 2027 we ___ our master’s.',
  options:['will finish','will have finished','are finishing'], answer:1,
  ru:'к 2027 мы закончим магистратуру', why:'сделаем К моменту в будущем → Future Perfect.' },
{ g:'Future', type:'order', ru:'я собираюсь учиться в Италии',
  tokens:['I','am','going','to','study','in','Italy'], answer:'I am going to study in Italy',
  why:'заранее готовый план → be going to.' },
{ g:'Future', type:'choose', q:'This time next year I ___ in Milan.',
  options:['will live','will be living','live'], answer:1,
  ru:'через год в это время я буду жить в Милане', why:'процесс в момент будущего → Future Continuous.' },

/* ============ СТРУКТУРА ============ */
{ g:'Структура', type:'choose', q:'___ he live near you?', options:['Do','Does','Did'], answer:1,
  ru:'он живёт рядом?', why:'he + настоящее → does.' },
{ g:'Структура', type:'error', q:'Does she likes it?', tokens:['Does','she','likes','it'], answer:2,
  fix:'like', ru:'ей это нравится?', why:'-s уже в does → смысловой глагол чистый: like.' },
{ g:'Структура', type:'choose', q:'It’s late, you ___ go home.', options:['should','can to','musts'], answer:0,
  ru:'уже поздно, тебе стоит идти домой', why:'совет → should + глагол без to.' },
{ g:'Структура', type:'error', q:'She can to drive.', tokens:['She','can','to','drive'], answer:2,
  fix:'—', ru:'она умеет водить', why:'после модального — без to: She can drive.' },
{ g:'Структура', type:'choose', q:'She wants ___ umbrella.', options:['a','an','the'], answer:1,
  ru:'ей нужен зонт', why:'umbrella начинается с гласного звука → an.' },
{ g:'Структура', type:'choose', q:'I’m ___ the exam.', options:['ready to','ready for','ready at'], answer:1,
  ru:'я готов к экзамену', why:'ready + for. «ready to exam» — твоя ошибка из Рубежа 1.', mine:true },
{ g:'Структура', type:'error', q:'I have been in Milan twice.', tokens:['I','have','been','in','Milan','twice'], answer:3,
  fix:'to', ru:'я был в Милане дважды', why:'опыт-место → been to. «been in» — твоя ошибка.', mine:true },
{ g:'Структура', type:'gap', q:'See you ___ the morning! (in/on/at)', answer:['in'],
  ru:'увидимся утром', why:'части суток → in the morning. «on the morning» — твоя ошибка из Рубежа 2.', mine:true },
{ g:'Структура', type:'gap', q:'It depends ___ the weather. (in/on/at)', answer:['on'],
  ru:'это зависит от погоды', why:'depend + on — устойчивая пара.' },
{ g:'Структура', type:'error', q:'I am good in English.', tokens:['I','am','good','in','English'], answer:3,
  fix:'at', ru:'я хорош в английском', why:'good + at.' },
{ g:'Структура', type:'choose', q:'The deadline is ___ 15 December ___ 23:59.',
  options:['in / at','on / at','on / in'], answer:1,
  ru:'дедлайн 15 декабря в 23:59', why:'дата → on, часы → at.' },
{ g:'Структура', type:'order', ru:'я готов к собеседованию в понедельник утром',
  tokens:['I’m','ready','for','the','interview','on','Monday','morning'],
  answer:'I’m ready for the interview on Monday morning',
  why:'ready for; день → on Monday morning.' },

/* ============ СЛОВА / МАРКЕРЫ ============ */
{ g:'Слова', type:'choose', q:'«___ I have finished.» — какое слово подходит?',
  options:['yesterday','already','now'], answer:1,
  ru:'я уже закончил', why:'Present Perfect любит already.' },
{ g:'Слова', type:'choose', q:'Маркер «ago» тянет за собой…',
  options:['Past Simple','Present Perfect','Future'], answer:0,
  ru:'…назад', why:'ago = точка в прошлом → Past Simple.' },
{ g:'Слова', type:'choose', q:'«Look! …» — сигнал к какому времени?',
  options:['Present Simple','Present Continuous','Past'], answer:1,
  ru:'смотри!', why:'Look! = прямо сейчас → Present Continuous.' },
{ g:'Слова', type:'gap', q:'Антоним к «tomorrow» на оси дней — ___.', answer:['yesterday'],
  ru:'вчера', why:'tomorrow ↔ yesterday.' },
{ g:'Слова', type:'choose', q:'Какой маркер зовёт Present Perfect?',
  options:['every day','just','now'], answer:1,
  ru:'только что', why:'just / already / yet → Present Perfect.' },
{ g:'Слова', type:'choose', q:'«usually» указывает на…',
  options:['Present Simple','Present Continuous','Past Perfect'], answer:0,
  ru:'обычно', why:'usually = привычка → Present Simple.' },

/* ============================================================
   ПАЧКА 2 — закрепление. Новые типы (mgap, pick), новые контексты,
   акцент на горячие зоны: предлоги, Present Perfect, лишний -ing.
   ============================================================ */

/* ---- Предлоги (tag:prep) — самая горячая зона ---- */
{ g:'Структура', type:'mgap', r2:true, tag:['prep'],
  q:'I study ___ the morning and ___ night.', answer:[['in'],['at']],
  ru:'я занимаюсь утром и ночью', why:'части суток → in the morning, НО at night.', mine:true },
{ g:'Структура', type:'mgap', r2:true, tag:['prep'],
  q:'The exam is ___ Monday ___ 9 am.', answer:[['on'],['at']],
  ru:'экзамен в понедельник в 9 утра', why:'день → on, часы → at.' },
{ g:'Структура', type:'pick', r2:true, tag:['prep'],
  q:'Отметь ВСЕ верные пары «слово + предлог».',
  options:['good at','depend of','interested in','afraid of','listen at'],
  answers:[0,2,3], ru:'', why:'depend ON, listen TO. Остальные верны.' },
{ g:'Структура', type:'error', r2:true, tag:['prep'],
  q:'I fell from my bike yesterday.', tokens:['I','fell','from','my','bike','yesterday'], answer:2,
  fix:'off', ru:'я упал с велосипеда вчера', why:'fall OFF a bike, не from. Твоя ошибка из устной сессии.', mine:true },
{ g:'Структура', type:'gap', r2:true, tag:['prep'],
  q:'Have you ever been ___ Italy? (to/in/at)', answer:['to'],
  ru:'ты когда-нибудь был в Италии?', why:'опыт-место → been TO. «been in» — твоя ошибка.', mine:true },
{ g:'Структура', type:'choose', r2:true, tag:['prep'],
  q:'She is really good ___ maths.', options:['in','at','on'], answer:1,
  ru:'она реально сильна в математике', why:'good AT.' },
{ g:'Структура', type:'error', r2:true, tag:['prep'],
  q:'We are waiting the bus.', tokens:['We','are','waiting','the','bus'], answer:2,
  fix:'waiting for', ru:'мы ждём автобус', why:'wait FOR — предлог обязателен.' },
{ g:'Структура', type:'gap', r2:true, tag:['prep'],
  q:'It all depends ___ the weather. (on/of/from)', answer:['on'],
  ru:'всё зависит от погоды', why:'depend ON — устойчивая пара.' },
{ g:'Структура', type:'mgap', r2:true, tag:['prep'],
  q:'I am ready ___ the interview ___ Friday.', answer:[['for'],['on']],
  ru:'я готов к собеседованию в пятницу', why:'ready FOR; день → on Friday.', mine:true },
{ g:'Структура', type:'choose', r2:true, tag:['prep'],
  q:'The documents are ___ the folder ___ the desk.', options:['in / on','on / in','at / on'], answer:0,
  ru:'документы в папке на столе', why:'внутри → in, на поверхности → on.' },
{ g:'Структура', type:'pick', r2:true, tag:['prep'],
  q:'Отметь ВСЕ предложения, где предлог верный.',
  options:['I arrive at 8.','See you on the morning.','I live in Milan.','He is afraid of dogs.'],
  answers:[0,2,3], ru:'', why:'«on the morning» неверно → in the morning. Твоя ошибка.', mine:true },
{ g:'Структура', type:'gap', r2:true, tag:['prep'],
  q:'I listen ___ music while I work. (to/at/on)', answer:['to'],
  ru:'я слушаю музыку, когда работаю', why:'listen TO.' },

/* ---- Present Perfect / времена (tag:perfect) ---- */
{ g:'Present', type:'error', r2:true, tag:['perfect'],
  q:'Did you ever been to Rome?', tokens:['Did','you','ever','been','to','Rome'], answer:0,
  fix:'Have', ru:'ты когда-нибудь был в Риме?', why:'опыт → Have you ever been. did + been вместе нельзя. Твоя ошибка из Рубежа 2.', mine:true },
{ g:'Present', type:'choose', r2:true, tag:['perfect'],
  q:'I ___ my keys — I can’t find them now.', options:['lost','have lost','was losing'], answer:1,
  ru:'я потерял ключи (и сейчас их нет)', why:'результат важен сейчас → Present Perfect.' },
{ g:'Present', type:'mgap', r2:true, tag:['perfect'],
  q:'She ___ (finish) already, but I ___ (not finish) yet.', answer:[['has finished'],['haven’t finished','have not finished']],
  ru:'она уже закончила, а я ещё нет', why:'already/yet → Present Perfect. she → has, I → haven’t.' },
{ g:'Present', type:'choose', r2:true, tag:['perfect'],
  q:'I ___ him yesterday. / I ___ him since Monday.',
  options:['saw / haven’t seen','have seen / didn’t see','see / don’t see'], answer:0,
  ru:'видел вчера / не видел с понедельника', why:'yesterday → Past Simple; since → Present Perfect.' },
{ g:'Present', type:'gap', r2:true, tag:['perfect'],
  q:'We ___ (know → V3, have + …) each other for ten years.', answer:['known'],
  ru:'мы знакомы десять лет', why:'have + known (V3). for → Present Perfect.' },
{ g:'Present', type:'error', r2:true, tag:['perfect'],
  q:'I have seen this film last week.', tokens:['I','have','seen','this','film','last','week'], answer:1,
  fix:'—', ru:'я видел этот фильм на прошлой неделе', why:'есть «last week» → Past Simple: I saw. С точным временем Perfect нельзя.' },
{ g:'Present', type:'choose', r2:true, tag:['perfect'],
  q:'How long ___ you ___ English?', options:['did / study','have / studied','are / studying'], answer:1,
  ru:'как долго ты учишь английский?', why:'how long + сейчас продолжается → Present Perfect.' },
{ g:'Present', type:'gap', r2:true, tag:['perfect'],
  q:'They ___ (just, arrive) — have + already/just + V3.', answer:['have just arrived','just arrived'],
  ru:'они только что приехали', why:'just → Present Perfect: have just arrived.' },
{ g:'Present', type:'choose', r2:true, tag:['perfect'],
  q:'Which is right?', options:['I am here since Monday','I have been here since Monday','I was here since Monday'], answer:1,
  ru:'я здесь с понедельника', why:'since + сейчас всё ещё → Present Perfect (have been).' },
{ g:'Present', type:'gap', r2:true, tag:['perfect'],
  q:'Have you finished ___? (ещё — маркер в конце) ', answer:['yet'],
  ru:'ты уже закончил?', why:'вопрос/отрицание Perfect → yet в конце.' },

/* ---- Лишний -ing / глаголы состояния (tag:ing) ---- */
{ g:'Present', type:'error', r2:true, tag:['ing'],
  q:'I am knowing the answer.', tokens:['I','am','knowing','the','answer'], answer:2,
  fix:'know', ru:'я знаю ответ', why:'know — глагол состояния, без -ing: I know.', mine:true },
{ g:'Present', type:'choose', r2:true, tag:['ing'],
  q:'Every night I ___ photos of the city.', options:['am taking','take','takes'], answer:1,
  ru:'каждую ночь я фотографирую город', why:'привычка (every night) → Simple, без -ing. Твоя ошибка.', mine:true },
{ g:'Present', type:'pick', r2:true, tag:['ing'],
  q:'Отметь ВСЕ глаголы, которые НЕ ставят в -ing (состояние).',
  options:['want','run','know','like','write'], answers:[0,2,3],
  ru:'', why:'want / know / like — состояние. run / write — действие, можно -ing.' },
{ g:'Present', type:'error', r2:true, tag:['ing'],
  q:'She is wanting to apply this year.', tokens:['She','is','wanting','to','apply','this','year'], answer:2,
  fix:'wants', ru:'она хочет подать в этом году', why:'want → wants (состояние, без -ing).', mine:true },
{ g:'Present', type:'choose', r2:true, tag:['ing'],
  q:'I ___ what you mean.', options:['am understanding','understand','understands'], answer:1,
  ru:'я понимаю, о чём ты', why:'understand — состояние, без -ing.' },
{ g:'Present', type:'error', r2:true, tag:['ing'],
  q:'I am liking this song.', tokens:['I','am','liking','this','song'], answer:2,
  fix:'like', ru:'мне нравится эта песня', why:'like — состояние: I like, без -ing.', mine:true },
{ g:'Present', type:'choose', r2:true, tag:['ing'],
  q:'Right now she ___ dinner, but usually she ___ at 7.',
  options:['cooks / is cooking','is cooking / cooks','cooking / cooks'], answer:1,
  ru:'сейчас готовит, но обычно в 7', why:'right now → Continuous; usually → Simple.' },

/* ---- Прочие r2 для «Микса 2» ---- */
{ g:'Past', type:'mgap', r2:true, tag:['tense'],
  q:'While I ___ (cook), the phone ___ (ring).', answer:[['was cooking'],['rang']],
  ru:'пока я готовил, зазвонил телефон', why:'длинный фон → was cooking; короткое прервало → rang (Past Simple).' },
{ g:'Past', type:'error', r2:true, tag:['tense'],
  q:'When I arrived, the train already left.', tokens:['When','I','arrived,','the','train','already','left'], answer:5,
  fix:'had already left', ru:'когда я приехал, поезд уже ушёл', why:'раньшее действие → Past Perfect: had left.' },
{ g:'Future', type:'choose', r2:true, tag:['tense'],
  q:'— The phone is ringing! — OK, I ___ it.', options:['am getting','will get','get'], answer:1,
  ru:'решение прямо сейчас → will', why:'спонтанное решение в момент речи → will.' },
{ g:'База', type:'pick', r2:true,
  q:'Отметь ВСЕ грамматически верные предложения.',
  options:['She have a car.','We are ready.','He doesn’t works.','They are students.'],
  answers:[1,3], ru:'', why:'She HAS a car; He doesn’t WORK (без -s после doesn’t).' },
{ g:'Структура', type:'choose', r2:true,
  q:'You ___ smoke here — it’s forbidden.', options:['mustn’t','don’t have to','should'], answer:0,
  ru:'здесь нельзя курить — запрещено', why:'запрет → mustn’t (не «не обязан»).' },
{ g:'Структура', type:'mgap', r2:true,
  q:'___ she ___ (live) near you? (вопрос, Present Simple)', answer:[['does'],['live']],
  ru:'она живёт рядом с тобой?', why:'he/she + вопрос → Does she live…? Глагол чистый.' },
{ g:'Слова', type:'pick', r2:true,
  q:'Отметь ВСЕ маркеры Present Perfect.',
  options:['already','yesterday','yet','just','ago'], answers:[0,2,3],
  ru:'', why:'already / yet / just → Perfect. yesterday / ago → Past Simple.' },
];

/* Один банк на все экраны. Порядок пачек — исторический: так в разборе
   ошибок видно, из какого слоя курса прилетел вопрос. */
export const QUESTIONS = [
  ...BASE_QUESTIONS,
  ...B1_QUESTIONS,
  ...FIX_QUESTIONS,
  ...IELTS_QUESTIONS,
  ...DIAG_QUESTIONS,
];

/* ------------------------------------------------------------
   ФИЛЬТРЫ. Вопросы замера (diag) не должны просачиваться в
   обычные тесты: замер тем и ценен, что его состав фиксирован
   и не встречался нигде ещё. Поэтому исключаем их везде, кроме
   самого теста «Замер».
   ------------------------------------------------------------ */
const live = q => !q.diag;
const tag = (...names) => q => live(q) && q.tag && names.some(n => q.tag.includes(n));
const pack = n => q => live(q) && q[`r${n}`];

/* ------------------------------------------------------------
   ТЕСТЫ. pick — сколько вопросов взять; filter — из какого пула.
   sect — раздел на витрине, lvl — уровень (подсказка, куда лезть).

   Порядок разделов — это и есть маршрут: сначала замерить, потом
   чинить пробоины, потом строить мост к экзамену, и только потом
   общая теория и миксы. Раньше витрина была плоским списком из
   13 карточек, и «что делать сейчас» из неё не читалось.
   ------------------------------------------------------------ */
export const TESTS = [

  /* ---- ЗАМЕР ---- */
  { id:'diag',   title:'Замер · где ты сейчас',   sub:'24 вопроса фиксированного состава — по 2–3 на каждую зону курса',
    sect:'Замер', lvl:'A2–B2', aspect:'perfcont', filter:q=>q.diag,          pick:24, mixed:true },

  /* ---- РЕМОНТ: то, что доказанно просело ---- */
  { id:'fix-past', title:'Past · нарратив',       sub:'Simple ↔ Continuous ↔ Perfect в одном рассказе · used to · would',
    sect:'Ремонт', lvl:'B1',    aspect:'perfect',    filter:tag('narr2','narr'),          pick:12, mixed:true },
  { id:'fix-prep', title:'Предлоги · пары',       sub:'горячая зона №1: depend on · rise in · been to · result of',
    sect:'Ремонт', lvl:'B1–B2', aspect:'perfcont',   filter:tag('prep3','prep2','prep'),  pick:14, mixed:true },
  { id:'fix-perf', title:'Perfect ↔ Past',        sub:'been/gone · have done ↔ have been doing · did + been вместе нельзя',
    sect:'Ремонт', lvl:'B1',    aspect:'perfect',    filter:tag('perf3','perf2','perfect'), pick:12, mixed:true },
  { id:'fix-ing',  title:'Лишний -ing · капкан',  sub:'состояния без -ing и глаголы, которые меняют смысл',
    sect:'Ремонт', lvl:'B1',    aspect:'continuous', filter:tag('ing2','ing'),            pick:10, mixed:true },
  { id:'fix-quant',title:'Артикли и кванторы',    sub:'неисчисляемые · little/a little · much/many · a/the/—',
    sect:'Ремонт', lvl:'B1',    aspect:'simple',     filter:tag('quant2','quant'),        pick:12, mixed:true },
  { id:'mine3',    title:'Твои ошибки 3.0',       sub:'всё, на чём ты реально спотыкался — старое и новое вперемешку',
    sect:'Ремонт', lvl:'A2–B2', aspect:'continuous', filter:q=>live(q)&&q.mine,           pick:14, mixed:true },

  /* ---- МОСТ К IELTS ---- */
  { id:'w-gram',  title:'Грамматика для письма',  sub:'условные · инверсия · пассив · косвенная · сокращённые придаточные',
    sect:'Мост к IELTS', lvl:'B2', aspect:'perfect',    filter:tag('wgram'),  pick:12, mixed:true },
  { id:'w-lex',   title:'Академическая лексика',  sub:'significant · sufficient · conduct research · affect ≠ effect',
    sect:'Мост к IELTS', lvl:'B2', aspect:'perfcont',   filter:tag('wlex'),   pick:12, mixed:true },
  { id:'w-task1', title:'Task 1 · язык графиков', sub:'rose by · peaked at · accounted for · number ≠ amount',
    sect:'Мост к IELTS', lvl:'B2', aspect:'simple',     filter:tag('task1','ielts'), pick:12, mixed:true },
  { id:'w-task2', title:'Task 2 · язык аргумента',sub:'позиция · hedging · примеры · вывод без «I think»',
    sect:'Мост к IELTS', lvl:'B2', aspect:'continuous', filter:tag('task2'),  pick:10, mixed:true },
  { id:'w-reg',   title:'Регистр и связность',    sub:'however ≠ but · whereas · отсылки вместо повторов',
    sect:'Мост к IELTS', lvl:'B2', aspect:'perfect',    filter:tag('reg2','formal','link'), pick:12, mixed:true },

  /* ---- ГРАММАТИКА B1+ (пачка 3) ---- */
  { id:'cond',    title:'Условные · if-машина',   sub:'0 / 1 / 2 / 3 тип · unless · I wish',
    sect:'Грамматика B1+', lvl:'B1', aspect:'perfect',    filter:tag('cond'),     pick:10, mixed:true },
  { id:'ger',     title:'-ing или to + глагол',   sub:'enjoy doing ↔ decide to do · stop doing ≠ stop to do',
    sect:'Грамматика B1+', lvl:'B1', aspect:'continuous', filter:tag('ger'),      pick:11, mixed:true },
  { id:'passive', title:'Пассивный залог',        sub:'be + V3 во всех временах · by · must be done',
    sect:'Грамматика B1+', lvl:'B1', aspect:'simple',     filter:tag('passive'),  pick:8, mixed:true },
  { id:'reported',title:'Косвенная речь',         sub:'said/told · сдвиг времён · косвенный вопрос',
    sect:'Грамматика B1+', lvl:'B1', aspect:'perfect',    filter:tag('reported'), pick:8, mixed:true },
  { id:'modal',   title:'Модальные: догадки',     sub:'must be · can’t have · should have · mustn’t ≠ don’t have to',
    sect:'Грамматика B1+', lvl:'B2', aspect:'perfcont',   filter:tag('modal'),    pick:8, mixed:true },
  { id:'struct2', title:'Вопросы и сравнения',    sub:'непрямой вопрос · so/such · as…as · enough/too',
    sect:'Грамматика B1+', lvl:'B1', aspect:'continuous', filter:tag('struct2'),  pick:8, mixed:true },
  { id:'rel',     title:'Придаточные who/which',  sub:'who · which · that · whose · запятая меняет правила',
    sect:'Грамматика B1+', lvl:'B1', aspect:'perfect',    filter:tag('rel'),      pick:9,  mixed:true },

  /* ---- ЛЕКСИКА B1+ (пачка 3) ---- */
  { id:'coll',    title:'Коллокации',             sub:'make / do / take / have / pay — что с чем живёт',
    sect:'Лексика B1+', lvl:'B1', aspect:'simple',     filter:tag('coll'),    pick:10, mixed:true },
  { id:'phrasal', title:'Фразовые глаголы',       sub:'put off · look into · come up with · carry out',
    sect:'Лексика B1+', lvl:'B1', aspect:'continuous', filter:tag('phrasal'), pick:10, mixed:true },
  { id:'wform',   title:'Словообразование',       sub:'analyse → analysis · -ing ≠ -ed · economic ≠ economical',
    sect:'Лексика B1+', lvl:'B2', aspect:'perfect',    filter:tag('wform'),   pick:10, mixed:true },
  { id:'confuse', title:'Похожие слова',          sub:'affect/effect · lend/borrow · say/tell · raise/rise',
    sect:'Лексика B1+', lvl:'B1', aspect:'continuous', filter:tag('confuse'), pick:10, mixed:true },
  { id:'awl',     title:'AWL · ядро для эссе',    sub:'significant · evidence · approach · sufficient',
    sect:'Лексика B1+', lvl:'B2', aspect:'perfcont',   filter:tag('awl'),     pick:12, mixed:true },

  /* ---- МИКСЫ И ФИНАЛ ---- */
  { id:'base',    title:'База · контроль',        sub:'12 вопросов уровня A1/A2 — проверка, что фундамент не поехал',
    sect:'Миксы и финал', lvl:'A1–A2', aspect:'simple',  filter:q=>live(q)&&!q.r3&&!q.r4, pick:12, mixed:true },
  { id:'mix4',    title:'Микс · пачка 4',         sub:'весь новый материал вперемешку: ремонт + мост к IELTS',
    sect:'Миксы и финал', lvl:'B1–B2', aspect:'continuous', filter:pack(4),   pick:20, mixed:true },
  { id:'lexmix',  title:'Лексика · большой микс', sub:'вся лексика сразу: слова, пары, регистр, графики',
    sect:'Миксы и финал', lvl:'B1–B2', aspect:'perfcont',   filter:q=>live(q)&&q.lex, pick:20, mixed:true },
  { id:'mixb1',   title:'Микс B1+ · без разминки',sub:'только материал уровня B1/B2, ни одного простого вопроса',
    sect:'Миксы и финал', lvl:'B1–B2', aspect:'perfect',    filter:q=>live(q)&&(q.r3||q.r4), pick:20, mixed:true },
  { id:'final',   title:'Финал · экзамен',        sub:'35 вопросов, грамматика и лексика, всё сложное сразу',
    sect:'Миксы и финал', lvl:'B2',    aspect:'perfcont',   filter:q=>live(q)&&(q.r2||q.r3||q.r4), pick:35, mixed:true },
];
