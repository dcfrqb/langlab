/* ============================================================
   CONTENT — все темы и правила.
   Каждый урок = колода шагов (steps). Типы шагов рендерит app.js.
   Разметка в примерах: <u>слово</u> — акцент цвета аспекта, <b> — жирный.
   ============================================================ */

export const GROUPS = ['База', 'Present', 'Past', 'Future', 'Структура', 'Слова'];

export const LESSONS = [

/* ============ БАЗА ============ */
{
  id: 'to-be', group: 'База', aspect: 'simple', n: 1,
  title: 'To be — am / is / are',
  subtitle: 'быть / являться — самый главный глагол',
  steps: [
    { type:'concept', lead:'To be — это «быть».',
      text:'В русском мы говорим «я студент» без глагола. В английском глагол «быть» нужен всегда: I <b>am</b> a student.' },
    { type:'formula', title:'Три формы — по лицу', rows:[
      { label:'I', html:'<span class="slot">am</span>' },
      { label:'he / she / it', html:'<span class="slot">is</span>' },
      { label:'you / we / they', html:'<span class="slot">are</span>' },
    ]},
    { type:'tabs', title:'Утверждение / отрицание / вопрос', tabs:[
      { label:'+', html:'She <b>is</b> happy.', ru:'она счастлива' },
      { label:'−', html:'She <b>is not</b> (isn’t) happy.', ru:'она не счастлива' },
      { label:'?', html:'<b>Is</b> she happy?', ru:'она счастлива?' },
    ]},
    { type:'examples', title:'Примеры', items:[
      { en:'I <u>am</u> from Russia.', ru:'я из России' },
      { en:'We <u>are</u> ready for the move.', ru:'мы готовы к переезду' },
      { en:'It <u>is</u> cold in Milan in winter.', ru:'зимой в Милане холодно' },
    ]},
    { type:'mistake', pairs:[
      { bad:'I student.', good:'I am a student.', why:'без «am» предложения нет' },
      { bad:'He are nice.', good:'He is nice.', why:'he → is, не are' },
    ]},
    { type:'quiz', q:'___ you tired?', options:['Am','Is','Are'], answer:2,
      ru:'ты устал?', explain:'you → are' },
  ]
},
{
  id: 'pronouns-order', group: 'База', aspect: 'simple', n: 2,
  title: 'Местоимения и порядок слов',
  subtitle: 'кто → что делает → что',
  steps: [
    { type:'concept', lead:'Английский — язык твёрдого порядка слов.',
      text:'Почти всегда: <b>Кто</b> → <b>действие</b> → <b>что/кого</b> (SVO). Переставить, как в русском, нельзя — смысл сломается.' },
    { type:'formula', title:'Личные местоимения', rows:[
      { label:'единств.', html:'<span class="slot">I · you · he · she · it</span>' },
      { label:'множеств.', html:'<span class="slot">we · you · they</span>' },
    ]},
    { type:'examples', title:'Схема SVO', items:[
      { en:'<u>I</u> study software engineering.', ru:'я изучаю программную инженерию' },
      { en:'<u>She</u> studies bioengineering.', ru:'она изучает биоинженерию' },
      { en:'<u>We</u> plan the move together.', ru:'мы планируем переезд вместе' },
    ]},
    { type:'note', html:'Подлежащее нельзя выкидывать: не «Am tired», а <b>I am tired</b>. В английском всегда есть «кто».' },
    { type:'mistake', pairs:[
      { bad:'Books I read.', good:'I read books.', why:'сначала кто, потом что' },
      { bad:'Like I coffee.', good:'I like coffee.', why:'подлежащее — первым' },
    ]},
    { type:'quiz', q:'Собери правильно:', options:['Music she loves','She loves music','Loves she music'], answer:1,
      ru:'она любит музыку', explain:'Кто (She) → действие (loves) → что (music)' },
  ]
},
{
  id: 'plural-this', group: 'База', aspect: 'simple', n: 3,
  title: 'Множественное число · this/that',
  subtitle: 'один / много · этот / тот',
  steps: [
    { type:'concept', lead:'Много — обычно добавляем -s.',
      text:'car → car<b>s</b>, book → book<b>s</b>. После шипящих +es (box → boxes), а -y → -ies (city → cit<b>ies</b>).' },
    { type:'formula', title:'this / that — указываем', rows:[
      { label:'рядом', html:'<span class="slot">this</span> (этот) · <span class="slot">these</span> (эти)' },
      { label:'далеко', html:'<span class="slot">that</span> (тот) · <span class="slot">those</span> (те)' },
    ]},
    { type:'examples', items:[
      { en:'<u>This</u> university is in Milan.', ru:'этот университет в Милане' },
      { en:'<u>These</u> universities are in Italy.', ru:'эти университеты в Италии' },
      { en:'I need three <u>documents</u>.', ru:'мне нужны три документа' },
    ]},
    { type:'mistake', pairs:[
      { bad:'two car', good:'two cars', why:'много → -s' },
      { bad:'this books', good:'these books', why:'много → these' },
    ]},
    { type:'note', warn:true, html:'⚠️ <b>Твоя ошибка:</b> «some picture» → <b>some pictures</b>. «несколько / some» + исчисляемое = всегда множественное (+s).' },
    { type:'quiz', q:'___ apples are fresh.', options:['This','These','That'], answer:1,
      ru:'эти яблоки свежие', explain:'apples — много, рядом → these' },
  ]
},
{
  id: 'have-got', group: 'База', aspect: 'simple', n: 4,
  title: 'have / have got',
  subtitle: 'иметь — «у меня есть»',
  steps: [
    { type:'concept', lead:'«У меня есть» — два способа сказать.',
      text:'<b>I have</b> a car = <b>I’ve got</b> a car. Смысл один и тот же. Разница — в стиле и в том, где и как так говорят.' },
    { type:'tabs', title:'Формы', tabs:[
      { label:'+', html:'I <b>have</b> a car. · I’<b>ve got</b> a car.', ru:'у меня есть машина' },
      { label:'−', html:'I <b>don’t have</b> a car. · I <b>haven’t got</b> a car.', ru:'у меня нет машины' },
      { label:'?', html:'<b>Do</b> you <b>have</b> a car? · <b>Have</b> you <b>got</b> a car?', ru:'у тебя есть машина?' },
    ]},
    { type:'vs', left:{ tag:'have', en:'I <b>have</b> a car.', ru:'нейтрально · письмо · любое время · чаще в US' },
             right:{ tag:'have got', en:'I’<b>ve got</b> a car.', ru:'разговорно · речь · только настоящее · чаще в UK' } },
    { type:'note', html:'В живой речи почти всегда сокращают: <b>I’ve got</b>, <b>she’s got</b>, <b>we’ve got</b>. Полное «I have got» звучит формально и почти не встречается.' },
    { type:'note', warn:true, html:'⚠️ Прошлое и будущее — только <b>have</b>: «I <b>had</b> a car», «I’ll <b>have</b> a car». Форму <b>«had got»</b> для обладания носители не используют.' },
    { type:'note', html:'<b>Как реально звучит (US):</b> в быстрой речи «’ve» проглатывают — «I’ve got a question» на слух = <b>«I got a question»</b>. На письме так не пишут, но в речи и сериалах ты услышишь это постоянно.' },
    { type:'examples', title:'Где это живёт в речи', items:[
      { en:'I’<u>ve got</u> two sisters.', ru:'у меня две сестры (родство)' },
      { en:'I’<u>ve got</u> a headache.', ru:'у меня болит голова (самочувствие)' },
      { en:'I’<u>ve got</u> a meeting at 5.', ru:'у меня встреча в 5 (планы, расписание)' },
      { en:'We’<u>ve got</u> a deadline in December.', ru:'у нас дедлайн в декабре' },
    ]},
    { type:'note', warn:true, html:'⚠️ <b>have got</b> — только для значения «иметь». Для действий — только <b>have</b>: <b>have</b> breakfast, <b>have</b> a shower, <b>have</b> a look, <b>have</b> a good time. «I’ve got breakfast» — нельзя.' },
    { type:'note', html:'Бонус: <b>have got to</b> = <b>have to</b> = «должен». «I’ve got to go» = «I have to go» = мне надо идти. Тоже очень разговорно.' },
    { type:'produce', items:[
      { ru:'У меня есть степень бакалавра.', en:'I’ve got a bachelor’s degree.', tip:'обладание → have got, сокращаем ’ve' },
      { ru:'У неё завтра встреча.', en:'She’s got a meeting tomorrow.', tip:'he/she/it → ’s got' },
      { ru:'У нас нет времени.', en:'We haven’t got time. / We don’t have time.', tip:'два варианта отрицания' },
    ]},
    { type:'mistake', pairs:[
      { bad:'She have got a car.', good:'She’s got a car.', why:'he/she/it → has got (’s got)' },
      { bad:'I had got a bike.', good:'I had a bike.', why:'прошлое → только had' },
      { bad:'I’ve got breakfast at 8.', good:'I have breakfast at 8.', why:'действие → have, не have got' },
    ]},
    { type:'quiz', q:'Как носитель скорее скажет в разговоре?', options:['I have got a question','I’ve got a question','I am having a question'], answer:1,
      ru:'у меня есть вопрос', explain:'в речи сокращают → I’ve got (а на слух часто «I got»)' },
  ]
},

/* ============ PRESENT ============ */
{
  id: 'present-simple', group: 'Present', aspect: 'simple', n: 5,
  title: 'Present Simple',
  subtitle: 'привычка — делаю всегда',
  steps: [
    { type:'concept', lead:'Регулярное, обычное, всегда.',
      text:'Привычки, факты, расписание. НЕ «прямо сейчас», а «вообще».',
      timeline:{ markers:[{pos:14},{pos:32},{pos:50},{pos:68},{pos:86}], now:true,
        caption:{pos:50, text:'every morning'} } },
    { type:'formula', title:'Форма', rows:[
      { label:'I / you / we / they', html:'<span class="slot">work</span>' },
      { label:'he / she / it', html:'<span class="slot">works</span> <span class="lbl">+s !</span>' },
    ]},
    { type:'tabs', title:'+ / − / ?', tabs:[
      { label:'+', html:'She <b>works</b> here.', ru:'она работает здесь' },
      { label:'−', html:'She <b>doesn’t work</b> here.', ru:'она здесь не работает' },
      { label:'?', html:'<b>Does</b> she <b>work</b> here?', ru:'она здесь работает?' },
    ]},
    { type:'examples', items:[
      { en:'I <u>study</u> English every morning.', ru:'я занимаюсь английским каждое утро' },
      { en:'The application <u>opens</u> in autumn.', ru:'приём заявок открывается осенью' },
      { en:'Karina and I <u>live</u> in the same city.', ru:'мы с Кариной живём в одном городе' },
    ]},
    { type:'markers', title:'Слова-подсказки', chips:[
      {w:'every day', ru:'каждый день'},{w:'usually', ru:'обычно'},{w:'always', ru:'всегда'},
      {w:'often', ru:'часто'},{w:'never', ru:'никогда'},{w:'on Mondays', ru:'по понедельникам'},
    ]},
    { type:'mistake', pairs:[
      { bad:'She work here.', good:'She works here.', why:'he/she/it → +s' },
      { bad:'He doesn’t works.', good:'He doesn’t work.', why:'после doesn’t — без -s' },
    ]},
    { type:'produce', items:[
      { ru:'Я просыпаюсь в 8 каждый день.', en:'I wake up at 8 every day.', tip:'привычка → Present Simple, без -ing' },
      { ru:'Мы с Кариной живём в одном городе.', en:'Karina and I live in the same city.' },
    ]},
    { type:'quiz', q:'Karina ___ two languages.', options:['speak','speaks','is speaking'], answer:1,
      ru:'Карина говорит на двух языках', explain:'Karina = she → speaks' },
  ]
},
{
  id: 'present-continuous', group: 'Present', aspect: 'continuous', n: 6,
  title: 'Present Continuous',
  subtitle: 'процесс — делаю прямо сейчас',
  steps: [
    { type:'concept', lead:'Происходит в момент речи.',
      text:'Сейчас, на моих глазах, в процессе. Или временно, в этот период жизни.',
      timeline:{ shape:'wave', from:34, to:70, dot:52, now:true, caption:{pos:52, text:'now'} } },
    { type:'formula', title:'Форма: am/is/are + V-ing', rows:[
      { label:'I', html:'<span class="slot">am</span> working' },
      { label:'he / she / it', html:'<span class="slot">is</span> working' },
      { label:'you / we / they', html:'<span class="slot">are</span> working' },
    ]},
    { type:'tabs', title:'+ / − / ?', tabs:[
      { label:'+', html:'I <b>am reading</b> now.', ru:'я сейчас читаю' },
      { label:'−', html:'I <b>am not reading</b> now.', ru:'я сейчас не читаю' },
      { label:'?', html:'<b>Are</b> you <b>reading</b>?', ru:'ты читаешь?' },
    ]},
    { type:'examples', items:[
      { en:'I <u>am preparing</u> for IELTS.', ru:'я готовлюсь к IELTS' },
      { en:'We <u>are applying</u> to Politecnico di Milano.', ru:'мы подаём в Политехнический Милана' },
      { en:'Look! The portal <u>is loading</u>.', ru:'смотри! портал грузится' },
    ]},
    { type:'markers', title:'Слова-подсказки', chips:[
      {w:'now', ru:'сейчас'},{w:'right now', ru:'прямо сейчас'},{w:'at the moment', ru:'в данный момент'},
      {w:'Look!', ru:'смотри!'},{w:'today', ru:'сегодня'},
    ]},
    { type:'note', html:'Глаголы состояния (love, know, want, like) обычно <b>не</b> ставят в -ing: не «I am knowing», а <b>I know</b>.' },
    { type:'note', warn:true, html:'⚠️ <b>Твоя частая ошибка:</b> лишний -ing. Continuous — только когда «прямо сейчас, в моменте». Для привычки бери простой глагол: «I <b>take</b> pictures every day», а не «I am taking».' },
    { type:'produce', items:[
      { ru:'Смотри, идёт дождь!', en:'Look, it is raining!', tip:'прямо сейчас → am/is/are + V-ing' },
      { ru:'Я сейчас готовлюсь к IELTS.', en:'I am preparing for IELTS right now.' },
    ]},
    { type:'quiz', q:'Don’t call me now — I ___ my motivation letter.', options:['write','am writing','writes'], answer:1,
      ru:'не звони сейчас — я пишу мотивационное письмо', explain:'прямо сейчас → am writing' },
  ]
},
{
  id: 'present-simple-vs-continuous', group: 'Present', aspect: 'continuous', n: 7,
  title: 'Simple vs Continuous',
  subtitle: 'вообще ↔ прямо сейчас',
  steps: [
    { type:'concept', lead:'Одно действие — два взгляда.',
      text:'Simple = вообще, регулярно. Continuous = прямо сейчас, в процессе.' },
    { type:'vs', left:{ tag:'simple', en:'I <b>work</b> in a bank.', ru:'я работаю в банке (профессия, вообще)' },
             right:{ tag:'continuous', en:'I <b>am working</b> now.', ru:'я сейчас работаю (в этот момент)' } },
    { type:'vs', left:{ tag:'simple', en:'She <b>speaks</b> French.', ru:'она говорит по-французски (умеет)' },
             right:{ tag:'continuous', en:'She <b>is speaking</b> French.', ru:'она сейчас говорит по-французски' } },
    { type:'markers', title:'Ключ — по слову-подсказке', chips:[
      {w:'usually / every day', ru:'→ Simple'},{w:'now / Look!', ru:'→ Continuous'},
    ]},
    { type:'note', warn:true, html:'⚠️ <b>Твоя ошибка из устных сессий:</b> «taking some picture» → <b>take some pictures</b>. Привычка/факт — простой глагол без -ing.' },
    { type:'produce', items:[
      { ru:'Обычно я катаюсь на велосипеде ночью.', en:'I usually ride a bike at night.', tip:'usually → Simple, без -ing' },
      { ru:'Сейчас я фотографирую улицу.', en:'I am taking pictures of the street.', tip:'сейчас, в моменте → Continuous' },
    ]},
    { type:'quiz', q:'He usually ___ the bus, but today he ___.', options:['takes / is walking','is taking / walks'], answer:0,
      ru:'обычно он ездит на автобусе, но сегодня идёт пешком', explain:'usually → Simple, today (сейчас) → Continuous' },
  ]
},
{
  id: 'present-perfect', group: 'Present', aspect: 'perfect', n: 8,
  title: 'Present Perfect',
  subtitle: 'результат — уже сделал',
  steps: [
    { type:'concept', lead:'Прошлое, которое важно сейчас.',
      text:'Действие уже случилось, но нам важен <b>результат сейчас</b>, а не когда именно.',
      timeline:{ shape:'arrow', from:22, now:true } },
    { type:'formula', title:'Форма: have/has + V3', rows:[
      { label:'I / you / we / they', html:'<span class="slot">have</span> done' },
      { label:'he / she / it', html:'<span class="slot">has</span> done' },
    ]},
    { type:'tabs', title:'+ / − / ?', tabs:[
      { label:'+', html:'I <b>have finished</b>.', ru:'я закончил (готово)' },
      { label:'−', html:'I <b>haven’t finished</b>.', ru:'я ещё не закончил' },
      { label:'?', html:'<b>Have</b> you <b>finished</b>?', ru:'ты закончил?' },
    ]},
    { type:'examples', items:[
      { en:'I <u>have submitted</u> my application.', ru:'я подал заявку (готово, сейчас она отправлена)' },
      { en:'She <u>has passed</u> the language test.', ru:'она сдала языковой тест' },
      { en:'We <u>have just booked</u> the tickets.', ru:'мы только что купили билеты' },
    ]},
    { type:'markers', title:'Слова-подсказки', chips:[
      {w:'already', ru:'уже'},{w:'just', ru:'только что'},{w:'yet', ru:'ещё (не)'},
      {w:'ever', ru:'когда-либо'},{w:'never', ru:'никогда'},{w:'for / since', ru:'в течение / с'},
    ]},
    { type:'mistake', pairs:[
      { bad:'I have finished yesterday.', good:'I finished yesterday.', why:'есть точное время (yesterday) → Past Simple' },
    ]},
    { type:'produce', items:[
      { ru:'Я уже подал заявку.', en:'I have already submitted my application.', tip:'результат сейчас → have + V3' },
      { ru:'Она никогда не была в Италии.', en:'She has never been to Italy.' },
    ]},
    { type:'quiz', q:'___ you ever ___ to Italy?', options:['Did / go','Have / been','Are / being'], answer:1,
      ru:'ты когда-нибудь был в Италии?', explain:'ever + опыт → Present Perfect (have been)' },
  ]
},

/* ============ PAST ============ */
{
  id: 'past-simple', group: 'Past', aspect: 'simple', n: 9,
  title: 'Past Simple',
  subtitle: 'факт в прошлом — сделал вчера',
  steps: [
    { type:'concept', lead:'Законченное действие в прошлом.',
      text:'Есть конкретное «когда»: yesterday, in 2020, an hour ago. Просто факт, что было.',
      timeline:{ markers:[{pos:25,color:'simple'}], now:true, caption:{pos:25, text:'yesterday', color:'simple'} } },
    { type:'formula', title:'Форма: V2 (глагол в прошедшем)', rows:[
      { label:'правильные', html:'work → <span class="slot">worked</span> <span class="lbl">+ed</span>' },
      { label:'неправильные', html:'go → <span class="slot">went</span> · see → <span class="slot">saw</span>' },
    ]},
    { type:'tabs', title:'+ / − / ?', tabs:[
      { label:'+', html:'I <b>watched</b> a film.', ru:'я посмотрел фильм' },
      { label:'−', html:'I <b>didn’t watch</b> a film.', ru:'я не смотрел фильм' },
      { label:'?', html:'<b>Did</b> you <b>watch</b> a film?', ru:'ты смотрел фильм?' },
    ]},
    { type:'examples', items:[
      { en:'We <u>visited</u> Milan last spring.', ru:'мы съездили в Милан прошлой весной' },
      { en:'I <u>took</u> a mock IELTS test yesterday.', ru:'я прошёл пробный IELTS вчера' },
      { en:'I <u>didn’t sleep</u> before the exam.', ru:'я не спал перед экзаменом' },
    ]},
    { type:'markers', title:'Слова-подсказки', chips:[
      {w:'yesterday', ru:'вчера'},{w:'ago', ru:'назад'},{w:'last week', ru:'на прошлой неделе'},
      {w:'in 2020', ru:'в 2020'},{w:'when I was…', ru:'когда я был…'},
    ]},
    { type:'mistake', pairs:[
      { bad:'I didn’t went.', good:'I didn’t go.', why:'после didn’t — начальная форма' },
      { bad:'Did you saw it?', good:'Did you see it?', why:'после did — без V2' },
    ]},
    { type:'produce', items:[
      { ru:'Вчера я прошёл пробный IELTS.', en:'Yesterday I took a mock IELTS test.', tip:'есть «вчера» → Past Simple (V2)' },
      { ru:'Мы съездили в Милан прошлой весной.', en:'We visited Milan last spring.' },
    ]},
    { type:'quiz', q:'I ___ my IELTS results last week.', options:['get','got','have got'], answer:1,
      ru:'я получил результаты IELTS на прошлой неделе', explain:'last week → Past Simple, get → got' },
  ]
},
{
  id: 'past-continuous', group: 'Past', aspect: 'continuous', n: 10,
  title: 'Past Continuous',
  subtitle: 'делал в тот момент в прошлом',
  steps: [
    { type:'concept', lead:'Процесс в определённый момент прошлого.',
      text:'Что было «в разгаре» в какой-то момент. Часто фон, который прервало другое действие.',
      timeline:{ shape:'wave', from:12, to:46, dot:30, now:true, caption:{pos:30, text:'at 7 pm'} } },
    { type:'formula', title:'Форма: was/were + V-ing', rows:[
      { label:'I / he / she / it', html:'<span class="slot">was</span> working' },
      { label:'you / we / they', html:'<span class="slot">were</span> working' },
    ]},
    { type:'examples', items:[
      { en:'At 8 pm I <u>was studying</u> grammar.', ru:'в 8 вечера я учил грамматику' },
      { en:'We <u>were discussing</u> universities when she called.', ru:'мы обсуждали университеты, когда она позвонила' },
    ]},
    { type:'note', html:'Частая связка: <b>was doing</b> (фон, длилось) + <b>when</b> + <b>did</b> (короткое, прервало). «I was writing the essay when my laptop died.»' },
    { type:'quiz', q:'While I ___ the essay, my laptop died.', options:['wrote','was writing','write'], answer:1,
      ru:'пока я писал эссе, ноут вырубился', explain:'длительный фон → was writing' },
  ]
},
{
  id: 'past-perfect', group: 'Past', aspect: 'perfect', n: 11,
  title: 'Past Perfect',
  subtitle: 'до другого момента в прошлом',
  steps: [
    { type:'concept', lead:'Прошлое до прошлого.',
      text:'Когда одно действие случилось <b>раньше</b> другого в прошлом. «Раньшее» ставим в Past Perfect.',
      timeline:{ shape:'point', markers:[{pos:20,color:'perfect'},{pos:55,color:'simple'}], now:true,
        caption:{pos:20, text:'had done', color:'perfect'} } },
    { type:'formula', title:'Форма: had + V3', rows:[
      { label:'все лица', html:'<span class="slot">had</span> finished' },
    ]},
    { type:'examples', items:[
      { en:'The deadline <u>had passed</u> when I checked.', ru:'дедлайн уже прошёл, когда я проверил' },
      { en:'She <u>had studied</u> Italian before the move.', ru:'она учила итальянский ещё до переезда' },
    ]},
    { type:'mistake', pairs:[
      { bad:'When I checked, the deadline already passed.', good:'When I checked, the deadline had already passed.', why:'раньшее действие → had passed' },
    ]},
    { type:'quiz', q:'I couldn’t apply — the deadline ___.', options:['passed','had passed','has passed'], answer:1,
      ru:'я не смог подать — дедлайн уже прошёл (раньше)', explain:'прошёл ДО того как я не смог → had passed' },
  ]
},

/* ============ FUTURE ============ */
{
  id: 'future-will-going', group: 'Future', aspect: 'perfcont', n: 12,
  title: 'will vs be going to',
  subtitle: 'будущее — сделаю',
  steps: [
    { type:'concept', lead:'Два способа сказать о будущем.',
      text:'<b>will</b> — решение в момент речи, обещание, прогноз. <b>be going to</b> — план и намерение, которое уже было.',
      timeline:{ shape:'point', markers:[{pos:66,color:'perfcont'},{pos:80,color:'perfcont'}], now:true, caption:{pos:73, text:'later'} } },
    { type:'vs', left:{ tag:'will', en:'I <b>will</b> help you with the form.', ru:'я помогу тебе с анкетой (решил сейчас)' },
             right:{ tag:'going to', en:'I <b>am going to</b> study in Italy.', ru:'я собираюсь учиться в Италии (план)' } },
    { type:'tabs', title:'will: + / − / ?', tabs:[
      { label:'+', html:'She <b>will call</b> you.', ru:'она тебе позвонит' },
      { label:'−', html:'She <b>won’t call</b> you.', ru:'она не позвонит' },
      { label:'?', html:'<b>Will</b> she <b>call</b>?', ru:'она позвонит?' },
    ]},
    { type:'markers', title:'Слова-подсказки', chips:[
      {w:'tomorrow', ru:'завтра'},{w:'next week', ru:'на следующей неделе'},{w:'soon', ru:'скоро'},
      {w:'I think…', ru:'думаю… → will'},{w:'plan / going to', ru:'план → going to'},
    ]},
    { type:'quiz', q:'Look at those clouds! It ___ rain.', options:['will','is going to','goes'], answer:1,
      ru:'посмотри на тучи! будет дождь', explain:'есть признак сейчас → be going to' },
  ]
},
{
  id: 'future-perfect-cont', group: 'Future', aspect: 'perfcont', n: 13,
  title: 'Future Continuous / Perfect',
  subtitle: 'буду делать · сделаю к моменту',
  steps: [
    { type:'concept', lead:'Тонкие оттенки будущего (обзор).',
      text:'Нужны реже, но полезно узнавать. Строятся по знакомой логике.' },
    { type:'formula', title:'Формы', rows:[
      { label:'Future Continuous', html:'will <span class="slot">be doing</span> <span class="lbl">буду делать в момент</span>' },
      { label:'Future Perfect', html:'will <span class="slot">have done</span> <span class="lbl">сделаю к моменту</span>' },
    ]},
    { type:'examples', items:[
      { en:'This time next year I <u>will be living</u> in Milan.', ru:'через год в это время я буду жить в Милане' },
      { en:'By September I <u>will have submitted</u> everything.', ru:'к сентябрю я подам все документы' },
    ]},
    { type:'quiz', q:'By 2027 we ___ our master’s.', options:['will finish','will have finished','are finishing'], answer:1,
      ru:'к 2027 мы закончим магистратуру', explain:'к моменту в будущем → will have finished' },
  ]
},

/* ============ СТРУКТУРА ============ */
{
  id: 'questions-negatives', group: 'Структура', aspect: 'simple', n: 14,
  title: 'Вопросы и отрицания',
  subtitle: 'do / does / did — помощники',
  steps: [
    { type:'concept', lead:'Для вопроса/отрицания нужен помощник.',
      text:'В Present/Past Simple это <b>do / does / did</b>. Смысловой глагол при этом — в начальной форме.' },
    { type:'formula', title:'Кто какой помощник', rows:[
      { label:'I/you/we/they (present)', html:'<span class="slot">do</span>' },
      { label:'he/she/it (present)', html:'<span class="slot">does</span>' },
      { label:'прошлое (все)', html:'<span class="slot">did</span>' },
    ]},
    { type:'tabs', title:'Схема', tabs:[
      { label:'−', html:'You <b>don’t</b> know. · He <b>doesn’t</b> know. · We <b>didn’t</b> know.', ru:'ты не знаешь / он не знает / мы не знали' },
      { label:'?', html:'<b>Do</b> you know? · <b>Does</b> he know? · <b>Did</b> you know?', ru:'ты знаешь? / он знает? / ты знал?' },
      { label:'Wh-', html:'<b>Where do</b> you live? · <b>What did</b> she say?', ru:'где ты живёшь? / что она сказала?' },
    ]},
    { type:'mistake', pairs:[
      { bad:'Does she likes it?', good:'Does she like it?', why:'-s уже в does → глагол чистый' },
      { bad:'You no like it.', good:'You don’t like it.', why:'отрицание через don’t' },
    ]},
    { type:'quiz', q:'___ he live near you?', options:['Do','Does','Did'], answer:1,
      ru:'он живёт рядом с тобой?', explain:'he + настоящее → does' },
  ]
},
{
  id: 'modals', group: 'Структура', aspect: 'continuous', n: 15,
  title: 'Модальные глаголы',
  subtitle: 'can · must · should · may',
  steps: [
    { type:'concept', lead:'Модальные = отношение к действию.',
      text:'Могу, должен, следует, можно. После них — глагол <b>без to</b> и без -s.' },
    { type:'formula', title:'Основные', rows:[
      { label:'can', html:'<span class="slot">могу / умею</span>' },
      { label:'must / have to', html:'<span class="slot">должен</span>' },
      { label:'should', html:'<span class="slot">следует, стоит</span>' },
      { label:'may / might', html:'<span class="slot">можно / возможно</span>' },
    ]},
    { type:'examples', items:[
      { en:'I <u>can</u> read English papers.', ru:'я могу читать статьи на английском' },
      { en:'You <u>should</u> book IELTS early.', ru:'тебе стоит записаться на IELTS заранее' },
      { en:'We <u>must</u> apply before December.', ru:'мы должны подать до декабря' },
    ]},
    { type:'mistake', pairs:[
      { bad:'She can to drive.', good:'She can drive.', why:'после модального — без to' },
      { bad:'He must goes.', good:'He must go.', why:'без -s' },
    ]},
    { type:'quiz', q:'It’s late, you ___ go home.', options:['should','can to','musts'], answer:0,
      ru:'уже поздно, тебе стоит идти домой', explain:'совет → should + глагол' },
  ]
},
{
  id: 'articles', group: 'Структура', aspect: 'perfect', n: 16,
  title: 'Артикли a / an / the',
  subtitle: 'какой-то ↔ тот самый',
  steps: [
    { type:'concept', lead:'a/an = любой, один из. the = конкретный, тот самый.',
      text:'Первое упоминание — часто <b>a</b>. Повторно, когда уже понятно о чём — <b>the</b>.' },
    { type:'formula', title:'Когда что', rows:[
      { label:'a', html:'перед согласным звуком: <span class="slot">a car</span>' },
      { label:'an', html:'перед гласным звуком: <span class="slot">an apple</span>' },
      { label:'the', html:'конкретный / единственный: <span class="slot">the sun</span>' },
    ]},
    { type:'examples', items:[
      { en:'I wrote <u>a</u> letter. <u>The</u> letter was long.', ru:'я написал письмо. (То) письмо было длинным' },
      { en:'She is <u>an</u> engineer.', ru:'она инженер' },
      { en:'Send me <u>the</u> document, please.', ru:'пришли мне (тот) документ, пожалуйста' },
    ]},
    { type:'note', html:'С именами, городами, странами (в основном) и «вообще» во множественном — артикль не нужен: «I like <b>dogs</b>».' },
    { type:'quiz', q:'She wants ___ umbrella.', options:['a','an','the'], answer:1,
      ru:'ей нужен зонт', explain:'umbrella начинается с гласного звука → an' },
  ]
},
{
  id: 'prepositions', group: 'Структура', aspect: 'perfcont', n: 17,
  title: 'Предлоги',
  subtitle: 'in · on · at + устойчивые пары',
  steps: [
    { type:'concept', lead:'Три кита: in → большое / внутри, on → поверхность / день, at → точка.',
      text:'Сначала логика in/on/at (время и место), потом — устойчивые пары, где предлог просто надо запомнить.' },
    { type:'formula', title:'Время: in / on / at', rows:[
      { label:'in', html:'<span class="slot">месяцы · годы · части суток</span> · in May, in 2025, in the morning' },
      { label:'on', html:'<span class="slot">дни · даты</span> · on Monday, on 15 May' },
      { label:'at', html:'<span class="slot">часы · night</span> · at 7, at night' },
    ]},
    { type:'note', warn:true, html:'⚠️ <b>Твоя ошибка:</b> «on the morning» → <b>in the morning</b>. Части суток → <b>in</b> (in the morning / afternoon / evening), НО <b>at night</b>.' },
    { type:'formula', title:'Место: in / on / at', rows:[
      { label:'in', html:'<span class="slot">внутри</span> · in the room, in Italy' },
      { label:'on', html:'<span class="slot">на поверхности</span> · on the table' },
      { label:'at', html:'<span class="slot">в точке</span> · at the door, at work' },
    ]},
    { type:'examples', items:[
      { en:'The deadline is <u>on</u> 15 December <u>at</u> 23:59.', ru:'дедлайн 15 декабря в 23:59' },
      { en:'I study <u>in</u> the morning and <u>at</u> night.', ru:'я занимаюсь утром и ночью' },
      { en:'My documents are <u>in</u> the folder.', ru:'мои документы в папке' },
    ]},
    { type:'concept', lead:'Устойчивые пары — предлог не переводишь, учишь вместе со словом.',
      text:'Тут логика не помогает: просто запоминаешь «слово + предлог» как одно целое.' },
    { type:'formula', title:'Прилагательное + предлог', rows:[
      { label:'ready', html:'<span class="slot">for</span> · ready for the exam' },
      { label:'good', html:'<span class="slot">at</span> · good at maths' },
      { label:'interested', html:'<span class="slot">in</span> · interested in art' },
      { label:'afraid', html:'<span class="slot">of</span> · afraid of dogs' },
    ]},
    { type:'note', warn:true, html:'⚠️ <b>Твоя ошибка:</b> «ready to exam» → <b>ready for the exam</b>.' },
    { type:'formula', title:'Глагол + предлог', rows:[
      { label:'be been', html:'<span class="slot">to</span> · I’ve been to Rome' },
      { label:'wait', html:'<span class="slot">for</span> · wait for the bus' },
      { label:'listen', html:'<span class="slot">to</span> · listen to music' },
      { label:'depend', html:'<span class="slot">on</span> · it depends on you' },
      { label:'fall', html:'<span class="slot">off</span> · fall off a bike' },
    ]},
    { type:'note', warn:true, html:'⚠️ <b>Твои ошибки:</b> «been in Italy» → <b>been to Italy</b>; «fall from» → <b>fall off</b>. С местом-опытом всегда <b>been to</b>.' },
    { type:'produce', items:[
      { ru:'Я готов к экзамену.', en:'I’m ready for the exam.', tip:'ready + for' },
      { ru:'Я никогда не был в Риме.', en:'I’ve never been to Rome.', tip:'been + to (место)' },
      { ru:'Встреча в понедельник утром.', en:'The meeting is on Monday morning.', tip:'день → on; но «утром» само по себе → in the morning' },
      { ru:'Это зависит от погоды.', en:'It depends on the weather.', tip:'depend + on' },
    ]},
    { type:'mistake', pairs:[
      { bad:'I am good in English.', good:'I am good at English.', why:'good + at' },
      { bad:'I’ve been in Milan.', good:'I’ve been to Milan.', why:'been + to (место)' },
      { bad:'See you on the morning.', good:'See you in the morning.', why:'части суток → in' },
    ]},
    { type:'quiz', q:'I’m ___ (готов) ___ the interview ___ Monday morning.', options:['ready for / on','ready to / in','ready at / on'], answer:0,
      ru:'я готов к собеседованию в понедельник утром', explain:'ready for; день → on (Monday morning)' },
  ]
},

/* ============ СЛОВА ============ */
{
  id: 'time-markers', group: 'Слова', aspect: 'simple', n: 18,
  title: 'Слова-маркеры времени',
  subtitle: 'подсказка сама называет время',
  steps: [
    { type:'concept', lead:'Половина дела — узнать слово-маркер.',
      text:'Услышал «yesterday» → Past. «now» → Continuous. «already» → Perfect. Держи их на автомате.' },
    { type:'scale', title:'Ось дней', rows:[
      { d:'+3', en:'in 3 days', ru:'через три дня' },
      { d:'+2', en:'day after tomorrow', ru:'послезавтра' },
      { d:'+1', en:'tomorrow', ru:'завтра' },
      { d:'0', en:'today', ru:'сегодня', kind:'today' },
      { d:'−1', en:'yesterday', ru:'вчера', kind:'mark' },
      { d:'−2', en:'day before yesterday', ru:'позавчера' },
      { d:'−3', en:'3 days ago', ru:'три дня назад' },
    ]},
    { type:'markers', title:'Маркер → время', chips:[
      {w:'yesterday, ago', ru:'→ Past Simple'},{w:'now, Look!', ru:'→ Present Continuous'},
      {w:'already, just, yet', ru:'→ Present Perfect'},{w:'usually, every day', ru:'→ Present Simple'},
      {w:'tomorrow, next…', ru:'→ Future'},
    ]},
    { type:'quiz', q:'«___ I have finished.» — какое слово подходит?', options:['yesterday','already','now'], answer:1,
      ru:'я уже закончил', explain:'Present Perfect любит already' },
  ]
},
{
  id: 'vocab-base', group: 'Слова', aspect: 'continuous', n: 19,
  title: 'Базовые слова темами',
  subtitle: 'ядро, которое встречается всюду',
  steps: [
    { type:'concept', lead:'Учи словами-темами, не вразнобой.',
      text:'Небольшое ядро покрывает большую часть простой речи. Ниже — стартовые группы.' },
    { type:'markers', title:'Люди', chips:[
      {w:'man / woman', ru:'мужчина / женщина'},{w:'friend', ru:'друг'},{w:'family', ru:'семья'},
      {w:'people', ru:'люди'},{w:'child', ru:'ребёнок'},
    ]},
    { type:'markers', title:'Время', chips:[
      {w:'day / week', ru:'день / неделя'},{w:'year', ru:'год'},{w:'morning', ru:'утро'},
      {w:'hour', ru:'час'},{w:'time', ru:'время'},
    ]},
    { type:'markers', title:'Действия', chips:[
      {w:'go', ru:'идти'},{w:'make / do', ru:'делать'},{w:'have', ru:'иметь'},
      {w:'want', ru:'хотеть'},{w:'know', ru:'знать'},{w:'think', ru:'думать'},
    ]},
    { type:'markers', title:'Место', chips:[
      {w:'home', ru:'дом'},{w:'work', ru:'работа'},{w:'city', ru:'город'},
      {w:'shop', ru:'магазин'},{w:'street', ru:'улица'},
    ]},
    { type:'note', html:'Приём: бери 5 слов, составь с каждым своё предложение и проговори вслух. Разберём вместе на тренировке.' },
  ]
},
];

