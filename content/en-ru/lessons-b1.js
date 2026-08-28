/* ============================================================
   B1 — темы уровня выше базы: конструкции и лексика.

   С этого блока меняется сам вопрос: не «какое время поставить»,
   а «какую конструкцию выбрать» и «хватает ли слов». Дальше на
   базовых временах расти некуда — они закрыты на 8/8.

   Перенесено 2026-08-28 из прототипа eng.crs-projects.com
   (scripts/data.js), где блок появился 2026-08-17.
   ============================================================ */

export const B1_LESSONS = [
{
  id: 'conditionals', group: 'B1 · Конструкции', aspect: 'perfect', n: 20,
  title: 'Условные предложения 0–3',
  subtitle: 'если … то — четыре разных механизма',
  steps: [
    { type:'concept', lead:'Условное — это машина из двух половин.',
      text:'Половина с <b>if</b> задаёт условие, вторая — результат. Тип зависит только от того, насколько это реально: закон природы, реальное будущее, фантазия про сейчас или сожаление о прошлом.' },
    { type:'formula', title:'Четыре типа', rows:[
      { label:'0 — всегда так', html:'<span class="slot">If + Present, Present</span>' },
      { label:'1 — реально будет', html:'<span class="slot">If + Present, will + V</span>' },
      { label:'2 — фантазия сейчас', html:'<span class="slot">If + Past, would + V</span>' },
      { label:'3 — сожаление о прошлом', html:'<span class="slot">If + had + V3, would have + V3</span>' },
    ]},
    { type:'examples', title:'Одна ситуация — четыре смысла', items:[
      { en:'If I <u>have</u> time, I <u>will call</u> you.', ru:'реальный план на сегодня' },
      { en:'If I <u>had</u> time, I <u>would call</u> you.', ru:'но времени нет — это фантазия' },
      { en:'If I <u>had had</u> time, I <u>would have called</u> you.', ru:'вчера не было — уже не изменить' },
      { en:'If you <u>heat</u> water, it <u>boils</u>.', ru:'закон природы' },
    ]},
    { type:'note', html:'Железное правило: <b>после if не ставим will и would</b>. «If I will have time» — сразу маркер низкого уровня.' },
    { type:'markers', title:'Соседи по теме', chips:[
      {w:'unless', ru:'= if not — если не'},{w:'I wish + Past', ru:'жаль, что сейчас не так'},
      {w:'I wish + had V3', ru:'жаль, что тогда так вышло'},{w:'If I were you', ru:'на твоём месте'},
    ]},
    { type:'mistake', pairs:[
      { bad:'If I will have money…', good:'If I have money…', why:'will живёт только во второй половине' },
      { bad:'If I would have known…', good:'If I had known…', why:'would не заходит за if' },
    ]},
    { type:'produce', items:[
      { ru:'если завтра будет дождь, останемся дома', en:'If it rains tomorrow, we will stay at home.' },
      { ru:'на твоём месте я бы подал в этом году', en:'If I were you, I would apply this year.' },
      { ru:'если бы я знал раньше, я бы всё поменял', en:'If I had known earlier, I would have changed everything.' },
    ]},
    { type:'quiz', q:'If I ___ you, I would apply now.', options:['am','was','were'], answer:2,
      ru:'на твоём месте…', explain:'2-й тип: устойчивая формула If I were you' },
  ]
},
{
  id: 'passive', group: 'B1 · Конструкции', aspect: 'simple', n: 21,
  title: 'Пассивный залог',
  subtitle: 'важно ЧТО сделали, а не кто',
  steps: [
    { type:'concept', lead:'Пассив = be + третья форма.',
      text:'Когда исполнитель неважен, неизвестен или очевиден, англичанин разворачивает предложение: не «они объявят результаты», а «результаты будут объявлены». В отчётах и академическом тексте это норма, а не украшение.' },
    { type:'formula', title:'Форма по временам', rows:[
      { label:'Present', html:'<span class="slot">is / are + V3</span>' },
      { label:'Past', html:'<span class="slot">was / were + V3</span>' },
      { label:'Future', html:'<span class="slot">will be + V3</span>' },
      { label:'сейчас в процессе', html:'<span class="slot">is being + V3</span>' },
      { label:'после модального', html:'<span class="slot">must / can be + V3</span>' },
    ]},
    { type:'vs',
      left:{ tag:'active', en:'Anna wrote the report.', ru:'Анна написала отчёт' },
      right:{ tag:'passive', en:'The report was written by Anna.', ru:'отчёт был написан Анной' } },
    { type:'examples', title:'Где встретишь каждый день', items:[
      { en:'My application <u>was submitted</u> yesterday.', ru:'заявку подали вчера' },
      { en:'The documents must <u>be submitted</u> before Friday.', ru:'документы нужно подать до пятницы' },
      { en:'A new metro line <u>is being built</u> here.', ru:'здесь строят новую ветку' },
    ]},
    { type:'note', html:'Исполнитель вводится только через <b>by</b>: written <b>by</b> Anna. «from Anna» — калька.' },
    { type:'mistake', pairs:[
      { bad:'The house was build in 1990.', good:'The house was built in 1990.', why:'в пассиве всегда V3' },
      { bad:'The bridge is repairing now.', good:'The bridge is being repaired now.', why:'мост сам себя не чинит' },
    ]},
    { type:'quiz', q:'The results ___ next week.', options:['will announce','will be announced','are announcing'], answer:1,
      ru:'результаты объявят', explain:'will be + V3' },
  ]
},
{
  id: 'reported-speech', group: 'B1 · Конструкции', aspect: 'perfect', n: 22,
  title: 'Косвенная речь',
  subtitle: 'он сказал, что… — со сдвигом времени',
  steps: [
    { type:'concept', lead:'Пересказываешь — двигай время на шаг назад.',
      text:'Прямая речь: «I am tired». Пересказ: He said he <b>was</b> tired. Всё, что было настоящим, становится прошедшим; прошедшее уходит в Past Perfect.' },
    { type:'formula', title:'Сдвиг времён', rows:[
      { label:'am / is / are', html:'<span class="slot">→ was / were</span>' },
      { label:'do / does', html:'<span class="slot">→ did</span>' },
      { label:'did / have done', html:'<span class="slot">→ had done</span>' },
      { label:'will', html:'<span class="slot">→ would</span>' },
      { label:'can / must', html:'<span class="slot">→ could / had to</span>' },
    ]},
    { type:'tabs', title:'say / tell / ask', tabs:[
      { label:'say', html:'He <b>said</b> (that) he was busy.', ru:'без адресата' },
      { label:'tell', html:'He <b>told me</b> (that) he was busy.', ru:'всегда с адресатом, без to' },
      { label:'ask', html:'She <b>asked</b> me <b>if</b> I had finished.', ru:'вопрос без вопросительного слова → if' },
    ]},
    { type:'note', warn:true, html:'Косвенный вопрос строится <b>как утверждение</b>: «She asked what time <b>it was</b>», а не «what time was it».' },
    { type:'markers', title:'Слова тоже сдвигаются', chips:[
      {w:'now → then', ru:'сейчас → тогда'},{w:'today → that day', ru:'сегодня → в тот день'},
      {w:'yesterday → the day before', ru:'вчера → накануне'},{w:'tomorrow → the next day', ru:'завтра → на следующий день'},
    ]},
    { type:'mistake', pairs:[
      { bad:'He said me that…', good:'He told me that… / He said to me that…', why:'said me не бывает' },
      { bad:'She asked where do I live.', good:'She asked where I lived.', why:'в косвенном вопросе нет do/does' },
    ]},
    { type:'produce', items:[
      { ru:'он сказал, что позвонит позже', en:'He said he would call later.' },
      { ru:'она спросила, закончил ли я', en:'She asked if I had finished.' },
      { ru:'он попросил меня не опаздывать', en:'He told me not to be late.' },
    ]},
    { type:'quiz', q:'He asked me where I ___.', options:['live','lived','did live'], answer:1,
      ru:'он спросил, где я живу', explain:'сдвиг времени + прямой порядок слов' },
  ]
},
{
  id: 'gerund-infinitive', group: 'B1 · Конструкции', aspect: 'continuous', n: 23,
  title: '-ing или to + глагол',
  subtitle: 'что ставить после первого глагола',
  steps: [
    { type:'concept', lead:'Второй глагол не свободен — форму задаёт первый.',
      text:'enjoy требует <b>-ing</b>, decide требует <b>to</b>. Это не логика, а списки — но списки короткие, и они закрывают почти всю речь.' },
    { type:'formula', title:'Два списка', rows:[
      { label:'+ -ing', html:'<span class="slot">enjoy · avoid · finish · mind · practise · suggest · keep</span>' },
      { label:'+ to', html:'<span class="slot">want · decide · plan · hope · promise · agree · refuse</span>' },
      { label:'после предлога', html:'<span class="slot">всегда -ing: good at coding, interested in working</span>' },
      { label:'make / let + кто', html:'<span class="slot">голый инфинитив: made me do it</span>' },
    ]},
    { type:'vs',
      left:{ tag:'stop doing', en:'He stopped smoking.', ru:'бросил курить' },
      right:{ tag:'stop to do', en:'He stopped to smoke.', ru:'остановился, чтобы покурить' } },
    { type:'examples', title:'Пары, где смысл меняется', items:[
      { en:'I <u>remember locking</u> the door.', ru:'помню, что запер' },
      { en:'Remember <u>to lock</u> the door.', ru:'не забудь запереть' },
      { en:'I’m looking forward <u>to seeing</u> you.', ru:'to здесь предлог → -ing' },
    ]},
    { type:'note', warn:true, html:'Твой личный капкан: <b>want / suggest</b>. Правильно — «I want <b>to go</b>» и «I suggest <b>taking</b> a break».' },
    { type:'mistake', pairs:[
      { bad:'I suggest to take a break.', good:'I suggest taking a break.', why:'suggest + -ing' },
      { bad:'I want going home.', good:'I want to go home.', why:'want + to' },
      { bad:'looking forward to hear from you', good:'looking forward to hearing from you', why:'to — предлог' },
    ]},
    { type:'quiz', q:'It’s worth ___ this book.', options:['to read','reading','read'], answer:1,
      ru:'книгу стоит прочитать', explain:'worth + -ing' },
  ]
},
{
  id: 'modals-deduction', group: 'B1 · Конструкции', aspect: 'perfcont', n: 24,
  title: 'Модальные: догадки и упрёки',
  subtitle: 'must be · can’t have · should have',
  steps: [
    { type:'concept', lead:'Модальные — это не только «могу/должен».',
      text:'На B1+ их главная работа — показывать <b>степень уверенности</b> и <b>оценку прошлого</b>: «наверняка», «не может быть», «надо было».' },
    { type:'formula', title:'Шкала уверенности', rows:[
      { label:'99% да', html:'<span class="slot">must be / must have done</span>' },
      { label:'50%', html:'<span class="slot">may / might (have done)</span>' },
      { label:'99% нет', html:'<span class="slot">can’t be / can’t have done</span>' },
      { label:'упрёк', html:'<span class="slot">should have done — надо было</span>' },
    ]},
    { type:'examples', title:'Живые примеры', items:[
      { en:'The lights are on — they <u>must be</u> at home.', ru:'наверняка дома' },
      { en:'It <u>can’t be</u> Karina — she’s at work.', ru:'это точно не она' },
      { en:'Someone <u>must have broken</u> the window.', ru:'кто-то, видимо, разбил' },
      { en:'I <u>should have studied</u> harder.', ru:'надо было заниматься больше' },
    ]},
    { type:'note', warn:true, html:'Ловушка уровня: <b>mustn’t</b> = запрещено, <b>don’t have to</b> = не обязан. Это разные вещи.' },
    { type:'markers', title:'Прошлое у модальных', chips:[
      {w:'must → had to', ru:'пришлось'},{w:'can → could', ru:'умел'},
      {w:'should have V3', ru:'надо было (не сделал)'},{w:'needn’t have V3', ru:'зря сделал'},
    ]},
    { type:'mistake', pairs:[
      { bad:'You must to submit the form.', good:'You must submit the form.', why:'после модального — без to' },
      { bad:'You mustn’t pay, it’s free.', good:'You don’t have to pay, it’s free.', why:'это не запрет, а «не обязан»' },
    ]},
    { type:'quiz', q:'He ___ have forgotten — he never forgets.', options:['can’t','mustn’t','shouldn’t'], answer:0,
      ru:'не может быть, чтобы забыл', explain:'уверенное отрицание прошлого → can’t have + V3' },
  ]
},
{
  id: 'relative-clauses', group: 'B1 · Конструкции', aspect: 'simple', n: 25,
  title: 'Придаточные: who / which / that',
  subtitle: 'как склеивать два предложения в одно',
  steps: [
    { type:'concept', lead:'Одно длинное вместо двух коротких.',
      text:'«Это человек. Он мне помог.» → «This is the man <b>who</b> helped me.» Такое склеивание — половина письменного B1: без него текст звучит как список.' },
    { type:'formula', title:'Кого чем цеплять', rows:[
      { label:'люди', html:'<span class="slot">who / that</span>' },
      { label:'вещи', html:'<span class="slot">which / that</span>' },
      { label:'принадлежность', html:'<span class="slot">whose</span>' },
      { label:'место / время', html:'<span class="slot">where / when</span>' },
    ]},
    { type:'vs',
      left:{ tag:'без запятой', en:'The film that I saw was great.', ru:'уточняет, о каком фильме речь' },
      right:{ tag:'с запятой', en:'Milan, which is in the north, has two airports.', ru:'просто добавочная информация' } },
    { type:'note', warn:true, html:'После запятой <b>that запрещён</b> — только which / who. И <b>what</b> в этой роли не бывает вообще.' },
    { type:'examples', title:'Полезный приём', items:[
      { en:'He passed the exam, <u>which</u> surprised everybody.', ru:'which может комментировать всё предложение' },
      { en:'That’s the student <u>whose</u> laptop was stolen.', ru:'чей ноутбук украли' },
      { en:'The hotel <u>where</u> we stayed was cheap.', ru:'отель, где мы жили' },
    ]},
    { type:'mistake', pairs:[
      { bad:'She is the girl what I told you about.', good:'…the girl who I told you about.', why:'what — не относительное местоимение' },
      { bad:'My brother, that lives in Rome…', good:'My brother, who lives in Rome…', why:'после запятой — who/which' },
    ]},
    { type:'quiz', q:'This is the book ___ changed my mind.', options:['who','that','what'], answer:1,
      ru:'книга, которая меня переубедила', explain:'вещь → that / which' },
  ]
},
{
  id: 'perfect-continuous', group: 'B1 · Конструкции', aspect: 'perfcont', n: 26,
  title: 'Perfect Continuous',
  subtitle: 'делаю уже сколько-то времени',
  steps: [
    { type:'concept', lead:'Четвёртый аспект, который ты ещё не закрывал.',
      text:'Perfect отвечает «сколько сделано», Perfect Continuous — «сколько времени делаю». Это разные вопросы, и в тесте они стоят рядом специально.',
      timeline:{ shape:'bump', now:true, center:48, bracket:'сколько-то времени' } },
    { type:'formula', title:'Форма', rows:[
      { label:'present', html:'<span class="slot">have / has been + V-ing</span>' },
      { label:'past', html:'<span class="slot">had been + V-ing</span>' },
      { label:'future', html:'<span class="slot">will have been + V-ing</span>' },
    ]},
    { type:'vs',
      left:{ tag:'perfect', en:'I have read three chapters.', ru:'результат: сколько сделано' },
      right:{ tag:'perfect continuous', en:'I have been reading all day.', ru:'процесс: сколько времени' } },
    { type:'markers', title:'Слова-подсказки', chips:[
      {w:'for two hours', ru:'два часа подряд'},{w:'since 2020', ru:'начиная с…'},
      {w:'all day', ru:'весь день'},{w:'How long…?', ru:'как долго?'},
    ]},
    { type:'note', warn:true, html:'Глаголы состояния (<b>know, believe, want, like</b>) в Continuous не идут никогда: «We <b>have known</b> each other since school».' },
    { type:'mistake', pairs:[
      { bad:'I am living here since 2020.', good:'I have been living here since 2020.', why:'since → перфект, не Present Continuous' },
      { bad:'We have been knowing each other for years.', good:'We have known each other for years.', why:'know — состояние' },
    ]},
    { type:'produce', items:[
      { ru:'я учу английский уже три года', en:'I have been studying English for three years.' },
      { ru:'как долго ты ждёшь?', en:'How long have you been waiting?' },
      { ru:'земля мокрая — шёл дождь', en:'The ground is wet — it has been raining.' },
    ]},
    { type:'quiz', q:'She’s exhausted — she ___ all day.', options:['worked','has been working','works'], answer:1,
      ru:'она работала весь день', explain:'процесс с видимым следом сейчас' },
  ]
},
{
  id: 'quantifiers', group: 'B1 · Конструкции', aspect: 'perfect', n: 27,
  title: 'Артикли и кванторы',
  subtitle: 'much/many · little/few · неисчисляемые',
  steps: [
    { type:'concept', lead:'Сначала спроси: это можно посчитать?',
      text:'От ответа зависит всё: артикль, форма множественного, какой квантор и какая форма глагола. Русская интуиция тут врёт: information, advice, work, furniture — <b>неисчисляемые</b>.' },
    { type:'formula', title:'Кто с кем', rows:[
      { label:'исчисляемые', html:'<span class="slot">many · a few · few · a number of</span>' },
      { label:'неисчисляемые', html:'<span class="slot">much · a little · little · a great deal of</span>' },
      { label:'оба', html:'<span class="slot">a lot of · plenty of · some · most of</span>' },
    ]},
    { type:'vs',
      left:{ tag:'a little', en:'We have a little time.', ru:'немного, но хватает' },
      right:{ tag:'little', en:'We have little time.', ru:'мало, почти нет' } },
    { type:'markers', title:'Топ неисчисляемых', chips:[
      {w:'information', ru:'информация'},{w:'advice', ru:'совет'},{w:'work', ru:'работа'},
      {w:'furniture', ru:'мебель'},{w:'research', ru:'исследования'},{w:'evidence', ru:'доказательства'},
    ]},
    { type:'note', html:'Артикль выбирается <b>по звуку</b>, а не по букве: <b>an</b> hour, <b>a</b> university.' },
    { type:'mistake', pairs:[
      { bad:'I have many works to do.', good:'I have a lot of work to do.', why:'work тут неисчисляемое' },
      { bad:'She gave me an advice.', good:'She gave me some advice.', why:'advice без a/an' },
      { bad:'This information are useful.', good:'This information is useful.', why:'неисчисляемое → is' },
    ]},
    { type:'quiz', q:'How ___ information do you need?', options:['many','much','few'], answer:1,
      ru:'сколько информации?', explain:'information неисчисляемо → much' },
  ]
},
{
  id: 'indirect-questions', group: 'B1 · Конструкции', aspect: 'continuous', n: 28,
  title: 'Непрямые вопросы и сравнения',
  subtitle: 'вежливо спросить · so/such · as…as',
  steps: [
    { type:'concept', lead:'Вежливый вопрос теряет вопросительный порядок.',
      text:'«Where is the station?» → «Could you tell me where the station <b>is</b>?» Внутри вежливой обёртки предложение выпрямляется, do/does исчезает.' },
    { type:'tabs', title:'Прямой / непрямой', tabs:[
      { label:'прямой', html:'<b>Where does he live?</b>', ru:'обычный вопрос' },
      { label:'непрямой', html:'Do you know <b>where he lives</b>?', ru:'вежливо, прямой порядок' },
      { label:'в пересказе', html:'I asked <b>where he lived</b>.', ru:'плюс сдвиг времени' },
    ]},
    { type:'formula', title:'Усилители и сравнения', rows:[
      { label:'so + прилагательное', html:'<span class="slot">so boring that I left</span>' },
      { label:'such + (a) + сущ.', html:'<span class="slot">such a difficult test that…</span>' },
      { label:'равенство', html:'<span class="slot">not as big as Moscow</span>' },
      { label:'чем… тем…', html:'<span class="slot">the more you practise, the better you get</span>' },
    ]},
    { type:'note', html:'<b>enough</b> идёт после прилагательного (old <b>enough</b>), но перед существительным (<b>enough</b> time).' },
    { type:'mistake', pairs:[
      { bad:'I asked him where does he live.', good:'I asked him where he lives.', why:'внутри — прямой порядок' },
      { bad:'He is not enough old.', good:'He is not old enough.', why:'enough после прилагательного' },
      { bad:'She speaks English more fluent than me.', good:'…more fluently than me.', why:'к глаголу — наречие' },
    ]},
    { type:'quiz', q:'It was ___ a difficult test that nobody finished.', options:['so','such','too'], answer:1,
      ru:'настолько трудный тест…', explain:'such + a + прилагательное + существительное' },
  ]
},

/* ============================================================
   B1 · ЛЕКСИКА — то, что даёт балл быстрее грамматики.
   ============================================================ */
{
  id: 'collocations', group: 'B1 · Лексика', aspect: 'simple', n: 29,
  title: 'Коллокации: make / do / take',
  subtitle: 'слова, которые ходят парами',
  steps: [
    { type:'concept', lead:'Носитель хранит не слова, а пары.',
      text:'«Принять решение» — это не take, а <b>make</b> a decision. Ошибки в парах не ломают смысл, но сразу выдают уровень. Учить их надо как одно слово.' },
    { type:'formula', title:'Три главных глагола', rows:[
      { label:'make', html:'<span class="slot">a decision · a mistake · progress · money · a promise</span>' },
      { label:'do', html:'<span class="slot">homework · research · the dishes · business · a favour</span>' },
      { label:'take', html:'<span class="slot">a photo · a break · an exam · a risk · a course</span>' },
    ]},
    { type:'markers', title:'Ещё пары на каждый день', chips:[
      {w:'pay attention', ru:'обращать внимание'},{w:'keep a promise', ru:'сдержать обещание'},
      {w:'heavy rain', ru:'сильный дождь'},{w:'strong coffee', ru:'крепкий кофе'},
      {w:'earn money', ru:'зарабатывать'},{w:'carry out research', ru:'проводить исследование'},
    ]},
    { type:'mistake', pairs:[
      { bad:'do a mistake', good:'make a mistake', why:'ошибка — всегда make' },
      { bad:'make a photo', good:'take a photo', why:'фото — всегда take' },
      { bad:'make research', good:'do / carry out research', why:'исследование не «делают» через make' },
    ]},
    { type:'produce', items:[
      { ru:'мне нужно принять решение', en:'I need to make a decision.' },
      { ru:'давай сделаем перерыв', en:'Let’s take a break.' },
      { ru:'я делаю успехи в английском', en:'I’m making progress in English.' },
    ]},
    { type:'quiz', q:'to ___ attention to the details', options:['pay','give','make'], answer:0,
      ru:'обращать внимание', explain:'pay attention — фиксированная пара' },
  ]
},
{
  id: 'phrasal-verbs', group: 'B1 · Лексика', aspect: 'continuous', n: 30,
  title: 'Фразовые глаголы — рабочий минимум',
  subtitle: 'глагол + предлог = новый смысл',
  steps: [
    { type:'concept', lead:'Предлог полностью меняет глагол.',
      text:'look — смотреть, look <b>after</b> — заботиться, look <b>into</b> — расследовать, look <b>for</b> — искать. Это отдельные слова, и учить их надо целиком, а не по частям.' },
    { type:'formula', title:'Ядро, которое встречается всюду', rows:[
      { label:'put off', html:'<span class="slot">отложить</span>' },
      { label:'give up', html:'<span class="slot">бросить (+ -ing)</span>' },
      { label:'come up with', html:'<span class="slot">придумать</span>' },
      { label:'carry out', html:'<span class="slot">проводить (исследование)</span>' },
      { label:'take up', html:'<span class="slot">начать заниматься</span>' },
      { label:'run out of', html:'<span class="slot">закончиться</span>' },
    ]},
    { type:'markers', title:'Ещё двадцать секунд пользы', chips:[
      {w:'take after', ru:'быть похожим на родню'},{w:'come across', ru:'наткнуться случайно'},
      {w:'turn down', ru:'убавить / отказать'},{w:'go up', ru:'расти (о цифрах)'},
      {w:'carry on', ru:'продолжать'},{w:'look forward to', ru:'ждать с нетерпением'},
    ]},
    { type:'note', warn:true, html:'В деловом письме: «I am looking forward to <b>hearing</b> from you» — здесь to предлог, значит -ing.' },
    { type:'mistake', pairs:[
      { bad:'They putted off the meeting.', good:'They put off the meeting.', why:'put — неправильный глагол, форма не меняется' },
      { bad:'I gave up to smoke.', good:'I gave up smoking.', why:'give up + -ing' },
    ]},
    { type:'quiz', q:'The police are ___ the case.', options:['looking after','looking into','looking for'], answer:1,
      ru:'полиция расследует дело', explain:'look into = разбираться, расследовать' },
  ]
},
{
  id: 'word-formation', group: 'B1 · Лексика', aspect: 'perfect', n: 31,
  title: 'Словообразование',
  subtitle: 'одно слово → семья слов',
  steps: [
    { type:'concept', lead:'Одно выученное слово даёт четыре.',
      text:'succeed → success → successful → successfully. Так словарный запас растёт не линейно, а гнёздами — и именно это проверяют на экзамене.' },
    { type:'formula', title:'Суффиксы по ролям', rows:[
      { label:'существительное', html:'<span class="slot">-tion · -sion · -ment · -ity · -ness</span>' },
      { label:'прилагательное', html:'<span class="slot">-ful · -ive · -able · -ic · -al</span>' },
      { label:'глагол', html:'<span class="slot">en- · -ise/-ize · -ify</span>' },
      { label:'наречие', html:'<span class="slot">-ly</span>' },
    ]},
    { type:'examples', title:'Гнёзда, которые нужны сразу', items:[
      { en:'analyse → <u>analysis</u> → analytical', ru:'анализировать → анализ → аналитический' },
      { en:'decide → <u>decision</u> → decisive', ru:'решать → решение → решительный' },
      { en:'able → <u>ability</u> → enable → unable', ru:'способный → способность → позволять → неспособный' },
      { en:'strong → <u>strength</u> → strengthen', ru:'сильный → сила → усиливать' },
    ]},
    { type:'vs',
      left:{ tag:'-ing', en:'The results were surprising.', ru:'какие они сами' },
      right:{ tag:'-ed', en:'I was surprised by the results.', ru:'что чувствую я' } },
    { type:'note', warn:true, html:'Пара-ловушка: <b>economic</b> (про экономику страны) ≠ <b>economical</b> (экономичный, выгодный).' },
    { type:'quiz', q:'The company’s ___ has grown.', options:['production','productive','produced'], answer:0,
      ru:'производство выросло', explain:'после притяжательного нужно существительное' },
  ]
},
{
  id: 'academic-awl', group: 'B1 · Лексика', aspect: 'perfcont', n: 32,
  title: 'Академическая лексика (AWL)',
  subtitle: 'ядро для эссе, статей и IELTS',
  steps: [
    { type:'concept', lead:'570 слов покрывают академические тексты.',
      text:'Academic Word List — слова, которые встречаются в любой научной статье независимо от темы. Ниже стартовое ядро: с ним текст сразу звучит взрослее.' },
    { type:'markers', title:'Ядро №1 — про исследование', chips:[
      {w:'significant', ru:'значительный'},{w:'evidence', ru:'доказательства (неисч.)'},
      {w:'factor', ru:'фактор'},{w:'approach', ru:'подход (to)'},
      {w:'data', ru:'данные'},{w:'analysis', ru:'анализ'},
    ]},
    { type:'markers', title:'Ядро №2 — про логику', chips:[
      {w:'consequence', ru:'следствие'},{w:'sufficient', ru:'достаточный'},
      {w:'subsequent', ru:'последующий'},{w:'previous', ru:'предыдущий'},
      {w:'indicate', ru:'указывать (that)'},{w:'thus', ru:'таким образом'},
    ]},
    { type:'markers', title:'Ядро №3 — про влияние', chips:[
      {w:'impact', ru:'воздействие'},{w:'affect', ru:'влиять (глагол)'},
      {w:'effect', ru:'эффект (сущ.)'},{w:'limitation', ru:'ограничение'},
      {w:'approximately', ru:'приблизительно'},{w:'preliminary', ru:'предварительный'},
    ]},
    { type:'note', html:'Учи не слово, а <b>слово + предлог + типовое соседство</b>: an approach <b>to</b> the problem, evidence <b>of</b> a change, a significant increase <b>in</b> prices.' },
    { type:'produce', items:[
      { ru:'данные показывают значительный рост', en:'The data show a significant increase.' },
      { ru:'у нас недостаточно доказательств', en:'We do not have sufficient evidence.' },
      { ru:'это указывает на то, что теорию надо пересмотреть', en:'This indicates that the theory needs revision.' },
    ]},
    { type:'quiz', q:'We do not have ___ data to prove it.', options:['sufficient','efficient','proficient'], answer:0,
      ru:'недостаточно данных', explain:'sufficient = достаточный' },
  ]
},
{
  id: 'linking-register', group: 'B1 · Лексика', aspect: 'simple', n: 33,
  title: 'Связки и регистр IELTS',
  subtitle: 'however · whereas · и что нельзя писать в эссе',
  steps: [
    { type:'concept', lead:'Экзаменатор читает связки в первую очередь.',
      text:'Связка показывает, что ты управляешь логикой текста, а регистр — что понимаешь разницу между разговором и письмом. Обе вещи стоят баллов и учатся за вечер.' },
    { type:'formula', title:'Что чем цеплять', rows:[
      { label:'контраст', html:'<span class="slot">however · nevertheless · whereas · although</span>' },
      { label:'добавление', html:'<span class="slot">moreover · in addition · furthermore</span>' },
      { label:'следствие', html:'<span class="slot">therefore · thus · consequently</span>' },
      { label:'пример', html:'<span class="slot">for instance · such as</span>' },
    ]},
    { type:'vs',
      left:{ tag:'+ существительное', en:'Despite the rain, we went out.', ru:'despite / in spite of' },
      right:{ tag:'+ предложение', en:'Although it was raining, we went out.', ru:'although / even though' } },
    { type:'examples', title:'Разговорное → письменное', items:[
      { en:'kids → <u>children</u>', ru:'дети' },
      { en:'a lot of → <u>a considerable amount of</u>', ru:'значительный объём' },
      { en:'find out → <u>determine</u>', ru:'установить' },
      { en:'get → <u>obtain</u>', ru:'получить' },
      { en:'It proves → <u>It suggests / indicates</u>', ru:'осторожная формулировка' },
    ]},
    { type:'note', warn:true, html:'В эссе не идут: сокращения (<b>don’t</b>), «stuff / things like that», начало предложения с <b>But</b> и «In my opinion I think».' },
    { type:'quiz', q:'___ it was raining, we went out.', options:['Despite','Although','However'], answer:1,
      ru:'хотя шёл дождь…', explain:'although + подлежащее и глагол' },
  ]
},
];
