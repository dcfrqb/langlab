/* ============================================================
   ЧАСТЬ 3 — ПИСЬМО ПО КИРПИЧИКАМ.

   Целого эссе здесь нет ни одного — намеренно. Написать 250 слов
   и получить «ну, где-то 6» бесполезно: непонятно, что чинить.
   Поэтому каждая тема — один кирпич (вступление, тезис, связка,
   предложение про тренд), и упражнение к нему помещается в строку.

   Целое собирается на последней теме части и дальше — вживую,
   когда кирпичи уже держат форму.
   ============================================================ */

const GROUP = 'Часть 3 · Письмо по кирпичикам';

export const WRITING = [
  {
    id: 't2-question', group: GROUP, aspect: 'writing',
    title: 'Разобрать вопрос Task 2',
    subtitle: 'четыре типа задания · что каждый требует',
    steps: [
      { type: 'concept', lead: 'Самая дорогая ошибка Task 2 делается до первого написанного слова.',
        text: 'Экзаменатор в первую очередь смотрит, <b>ответил ли ты на заданный вопрос</b>. ' +
              'Спросили «согласен ли ты» — а написано «плюсы и минусы»: это потолок 5 по Task response, ' +
              'каким бы английским это ни было написано. Типов заданий по сути четыре, ' +
              'и различить их — вопрос двадцати секунд.' },
      { type: 'table', title: 'Четыре типа и что они требуют',
        cols: ['Формулировка', 'Что обязано быть в эссе'],
        rows: [
          { label: 'Opinion', cells: ['<i>To what extent do you agree or disagree?</i>',
            'Одна ясная позиция во вступлении, и она же в выводе. Метаться нельзя'] },
          { label: 'Discussion', cells: ['<i>Discuss both views and give your own opinion.</i>',
            'Три части: их взгляд, другой взгляд, твой. Забыть «свой» — самая частая потеря балла'] },
          { label: 'Problem–solution', cells: ['<i>What problems does this cause and what can be done?</i>',
            'Решений столько же, сколько проблем. Одна проблема без решения — ответ неполный'] },
          { label: 'Two-part', cells: ['<i>Why is this happening? Is it a positive development?</i>',
            'Два вопроса — два ответа. Ответить на один = половина задания'] },
        ],
        note: 'Пятого типа нет, но формулировки маскируются: <i>Do the advantages outweigh the ' +
              'disadvantages?</i> — это opinion, а не «плюсы и минусы»: нужно решить, что перевешивает.' },
      { type: 'drill', title: 'Определи тип за 20 секунд',
        task: 'Прочитай формулировку и скажи, что обязано быть в эссе. Только структура — ' +
              'содержание тут ни при чём.',
        items: [
          { label: 'задание 1',
            q: '<i>Some people believe that unpaid community service should be part of every school ' +
               'curriculum. To what extent do you agree or disagree?</i>',
            a: 'Opinion. Нужна одна позиция, заявленная во вступлении и удержанная до вывода.',
            why: '«To what extent» разрешает частичное согласие («в основном согласен, но…») — ' +
                 'и это часто сильнее, чем крайность. Но позиция всё равно должна быть одна ' +
                 'и явно названная, а не «с одной стороны, с другой стороны».' },
          { label: 'задание 2',
            q: '<i>Some think children should start school at six; others believe four is better. ' +
               'Discuss both views and give your own opinion.</i>',
            a: 'Discussion. Три обязательных блока: за шесть, за четыре, и что думаешь ты.',
            why: 'Здесь чаще всего теряют балл, забыв третий блок или спрятав его в одном предложении ' +
                 'вывода. «Give your own opinion» — это отдельное требование, а не украшение.' },
          { label: 'задание 3',
            q: '<i>More people are working from home. Why is this happening, and is it a positive ' +
               'development?</i>',
            a: 'Two-part. Два разных вопроса — причины и оценка. Два тела абзацев, по одному на вопрос.',
            why: 'Соблазн написать всё эссе про причины: их проще придумать. Но вторая половина ' +
                 'вопроса без ответа — это ровно половина Task response.' },
          { label: 'задание 4',
            q: '<i>Do the advantages of studying abroad outweigh the disadvantages?</i>',
            a: 'Opinion, замаскированный. Нужно решить, что перевешивает, а не перечислить обе стороны.',
            why: 'Если написать «есть такие плюсы, есть такие минусы» и не сказать, что тяжелее, — ' +
                 'на вопрос ты не ответил. Слово outweigh требует вердикта.' },
        ] },
      { type: 'note', html: 'После типа — второй шаг разбора: найти <b>ключевые слова темы</b> ' +
              'и не подменить их. В вопросе «should <b>unpaid</b> community service be part of ' +
              '<b>every</b> school curriculum» слова unpaid и every несут задание. Эссе про пользу ' +
              'волонтёрства вообще — это уже другая тема, и балл за неё ниже.' },
      { type: 'quiz', q: '<i>Discuss both views and give your own opinion.</i> Ты описал обе точки зрения ' +
              'и закончил выводом «оба взгляда имеют право на существование». Что не так?',
        options: ['Всё в порядке — обе стороны показаны', 'Своего мнения нет, а его требуют явно',
                  'Вывод слишком короткий'], answer: 1,
        explain: '«Оба имеют право» — это не мнение, а уход от ответа. Требуется сказать, ' +
                 'какая позиция твоя.' },
      { type: 'quiz', q: 'Задание про «unpaid community service in schools». Ты пишешь про пользу ' +
              'волонтёрства для общества в целом. Что будет с баллом?',
        options: ['Хорошо — шире взгляд', 'Task response просядет: тема подменена', 'Ничего не изменится'], answer: 1,
        explain: 'Подмена темы — прямое снижение Task response, даже при отличном английском.' },
    ],
  },

  {
    id: 't2-intro', group: GROUP, aspect: 'writing',
    title: 'Вступление в два предложения',
    subtitle: 'перефразировать тему · заявить позицию',
    steps: [
      { type: 'concept', lead: 'Вступление — это два предложения. Больше не нужно, меньше рискованно.',
        text: 'Первое: <b>перефразированная тема вопроса</b> — не переписанная, а сказанная своими ' +
              'словами. Второе: <b>твоя позиция или план эссе</b>. Всё. Ни «Nowadays in the modern ' +
              'world», ни общих слов про важность темы: они не оцениваются вовсе, а время съедают.' },
      { type: 'formula', title: 'Каркас вступления',
        rows: [
          { label: 'предложение 1', html: 'тема вопроса <b>другими словами</b>' },
          { label: 'предложение 2', html: '<b>позиция</b> (opinion) или <b>что будет в эссе</b> (discussion)' },
        ] },
      { type: 'vs',
        left:  { tag: 'заученное — не оценивается',
                 en: 'Nowadays, in this modern era, the issue of whether students should wear uniforms ' +
                     'is a highly controversial topic that is widely discussed all over the world.',
                 ru: 'Двадцать восемь слов, из которых по делу — «students should wear uniforms». ' +
                     'Остальное экзаменатор просто вычеркнет как memorised language.' },
        right: { tag: 'работает',
                 en: 'Many schools require pupils to wear a standard uniform, though a growing number ' +
                     'have dropped the practice. In my view, uniforms do more good than harm, ' +
                     'mainly because they reduce visible inequality.',
                 ru: 'Тема пересказана своими словами, позиция названа, и даже намечен главный довод. ' +
                     'Тридцать слов, каждое работает.' } },
      { type: 'drill', title: 'Перефразируй тему',
        task: 'Возьми формулировку вопроса и скажи то же самое другими словами. ' +
              'Правило: <b>менять минимум два слова из трёх</b>, но не менять смысл.',
        items: [
          { label: 'перефраз 1',
            q: 'Тема: <i>Governments should spend more money on public transport.</i>',
            a: 'It is often argued that state funding for buses and trains should be increased.',
            why: 'governments → state · spend money on → funding for · public transport → buses and trains · ' +
                 'more → increased. Приём «обобщение → перечисление» (public transport → buses and trains) ' +
                 'работает и в обратную сторону — тот же, что мы искали в чтении.' },
          { label: 'перефраз 2',
            q: 'Тема: <i>Many young people today prefer to live in cities rather than in the countryside.</i>',
            a: 'A large share of the younger generation now chooses urban rather than rural life.',
            why: 'many → a large share · young people → the younger generation · prefer → chooses · ' +
                 'cities/countryside → urban/rural. Пара urban ↔ rural — та самая точная лексика, ' +
                 'за которую поднимают Lexical resource: она короче и точнее исходной.' },
          { label: 'перефраз 3',
            q: 'Тема: <i>Some believe that traditional skills are disappearing because of technology.</i>',
            a: 'It is sometimes claimed that technological change is eroding long-established crafts.',
            why: 'some believe → it is sometimes claimed · traditional skills → long-established crafts · ' +
                 'disappearing → eroding. Обрати внимание: технология стала подлежащим, а глагол — ' +
                 'переходным. Смена грамматической конструкции считается перефразированием тоже, ' +
                 'и её видит критерий Grammatical range.' },
          { label: 'ловушка',
            q: 'Тема: <i>Children should be taught financial management at school.</i><br>' +
               'Ученик написал: <i>Kids should be taught money management in school.</i>',
            a: 'Это не перефразирование — три слова из пяти те же самые.',
            why: 'children → kids ещё и снижает регистр: kids для академического эссе разговорно. ' +
                 'Рабочий вариант: <i>Schools should include personal finance in the curriculum.</i> — ' +
                 'сменились и лексика, и конструкция.' },
        ] },
      { type: 'markers', title: 'Как заявить позицию — без «I think» в каждом абзаце',
        chips: [
          { w: 'In my view,', ru: 'на мой взгляд' },
          { w: 'I would argue that', ru: 'я бы утверждал' },
          { w: 'This essay will argue that', ru: 'в этом эссе я покажу' },
          { w: 'While … , I believe …', ru: 'хотя …, я считаю …' },
          { w: 'On balance,', ru: 'взвесив всё' },
          { w: 'I am largely convinced that', ru: 'я в основном убеждён' },
        ] },
      { type: 'note', warn: true, html: 'Позиция во вступлении и позиция в выводе должны <b>совпадать</b>. ' +
              'Начал «в основном согласен» — закончи тем же. Развернуться в середине — это удар ' +
              'по Coherence: экзаменатор читает вывод и не понимает, что ты в итоге думаешь.' },
      { type: 'quiz', q: 'Сколько предложений должно быть во вступлении Task 2?',
        options: ['Два: перефраз темы и позиция', 'Пять — надо ввести читателя в тему',
                  'Одно — сразу к делу'], answer: 0,
        explain: 'Два предложения — рабочий минимум и максимум. Всё остальное лучше потратить на тела абзацев.' },
      { type: 'quiz', q: 'Тема: <i>Working from home is becoming more common.</i> Какой перефраз рабочий?',
        options: ['Working from home is becoming more popular.',
                  'Remote employment is increasingly widespread.',
                  'Nowadays working from home is a controversial issue.'], answer: 1,
        explain: 'Первый меняет одно слово, третий добавляет пустое «controversial issue» и не пересказывает тему.' },
    ],
  },

  {
    id: 't2-body', group: GROUP, aspect: 'writing',
    title: 'Абзац как один довод',
    subtitle: 'тезис → объяснение → пример → вывод',
    steps: [
      { type: 'concept', lead: 'Один абзац — одна мысль. Две мысли в абзаце режут Coherence.',
        text: 'Рабочая схема тела абзаца: <b>тезис</b> (одно предложение, о чём абзац) → ' +
              '<b>объяснение</b> (почему это так — механизм, а не повтор) → <b>пример</b> ' +
              '(конкретика) → <b>вывод</b> (как это связано с вопросом). Четыре предложения, ' +
              'иногда пять. Двух таких абзацев хватает на 250 слов.' },
      { type: 'formula', title: 'Четыре кирпича абзаца',
        rows: [
          { label: 'Topic sentence', html: 'о чём этот абзац — <b>одной фразой</b>' },
          { label: 'Explanation', html: 'почему так происходит — <b>механизм</b>' },
          { label: 'Example', html: 'конкретный случай, цифра, ситуация' },
          { label: 'Link', html: 'как это отвечает на вопрос задания' },
        ] },
      { type: 'note', html: 'Слабое место почти у всех — <b>объяснение</b>. Его подменяют повтором тезиса ' +
              'другими словами: «Uniforms reduce inequality. This is because they make students more equal.» ' +
              'Это одно и то же предложение дважды. Объяснение обязано добавлять <b>механизм</b>: ' +
              'что именно происходит и почему.' },
      { type: 'drill', title: 'Дострой абзац',
        task: 'Дан тезис. Скажи, каким должно быть <b>объяснение</b> — не пересказ тезиса, а механизм. ' +
              'Потом сверься.',
        items: [
          { label: 'тезис 1',
            q: '<i>School uniforms reduce visible inequality between pupils.</i>',
            a: 'When clothing is standardised, the most obvious marker of family income disappears from ' +
               'the classroom, so children are judged on behaviour and work rather than on what they can afford.',
            why: 'Механизм назван: одежда — видимый маркер дохода, убрали одежду — убрали маркер. ' +
                 'Сравни с пустым вариантом «because everyone looks the same»: он повторяет тезис, ' +
                 'а не объясняет его.' },
          { label: 'тезис 2',
            q: '<i>Remote work can damage the careers of junior employees.</i>',
            a: 'Much of early professional learning happens by observation — overhearing how a senior ' +
               'colleague handles a difficult client, for instance. Video calls carry the content of ' +
               'a conversation but not the surrounding context, so beginners lose the informal training ' +
               'an office provides.',
            why: 'Объяснение вводит понятие, которого не было в тезисе (обучение через наблюдение), ' +
                 'и показывает, что именно ломается. Это то, что критерий Task response называет ' +
                 '«extended and supported ideas».' },
          { label: 'тезис 3',
            q: '<i>Higher fuel taxes are an unfair way to cut emissions.</i>',
            a: 'Fuel costs make up a far larger share of a low income than a high one, and people in ' +
               'rural areas often have no alternative to driving. The same tax therefore falls hardest ' +
               'on those least able to change their behaviour.',
            why: 'Здесь объяснение делает работу за два предложения: показывает механизм ' +
                 '(доля расходов + отсутствие альтернативы) и прямо возвращается к слову из тезиса ' +
                 '(unfair → falls hardest). Это и есть Link.' },
        ] },
      { type: 'drill', title: 'Пример без «for example, in my country»',
        task: 'Пример не обязан быть настоящим фактом — он обязан быть конкретным. ' +
              'Сравни две попытки поддержать один и тот же тезис.',
        items: [
          { label: 'слабо → сильно',
            q: 'Тезис: <i>Free museum entry increases visits from low-income families.</i><br>' +
               'Попытка: <i>For example, in my country, many people go to museums because they are free.</i>',
            a: 'When British national museums abolished entry charges in 2001, visitor numbers roughly ' +
               'doubled within a decade, with the sharpest rise among first-time visitors.',
            why: 'Конкретика — это место, время и что изменилось. «In my country many people» ' +
                 'не добавляет ничего к тезису и читается как заполнение объёма. ' +
                 'Точность цифры экзаменатор не проверяет — он оценивает, поддержан ли довод.' },
          { label: 'слабо → сильно',
            q: 'Тезис: <i>Long commutes reduce wellbeing.</i><br>' +
               'Попытка: <i>For instance, people who travel a lot are often tired and unhappy.</i>',
            a: 'A worker with a ninety-minute journey each way loses fifteen hours a week — the equivalent ' +
               'of two working days — and that time is taken almost entirely from sleep and family.',
            why: 'Никакого источника, но пример конкретен: цифра, пересчёт, что именно теряется. ' +
                 'Это «relevant example» в терминах критерия.' },
        ] },
      { type: 'note', warn: true, html: 'Абзац из одного предложения и абзац на 150 слов одинаково ' +
              'портят Coherence. Ориентир — <b>4–5 предложений, 80–110 слов</b>. Два тела абзацев ' +
              'плюс вступление и вывод дают 260–290 слов: ровно то, что нужно.' },
      { type: 'quiz', q: 'Тезис: <i>Cycling to work improves health.</i> Какое продолжение — объяснение, а не повтор?',
        options: ['This is because cycling is good for your health.',
                  'Thirty minutes of moderate exercise a day lowers the risk of heart disease, and a commute supplies it without any extra time.',
                  'Many people cycle to work nowadays.'], answer: 1,
        explain: 'Второй вариант называет механизм: сколько нагрузки, что она даёт, откуда берётся время. ' +
                 'Первый — тот же тезис другими словами.' },
      { type: 'quiz', q: 'Сколько мыслей должно быть в одном теле абзаца?',
        options: ['Одна — и раскрытая до конца', 'Две-три, чтобы показать кругозор', 'Сколько поместится'], answer: 0,
        explain: 'Одна раскрытая мысль сильнее трёх названных. Несколько мыслей в абзаце — прямой минус по Coherence.' },
    ],
  },

  {
    id: 't2-cohesion', group: GROUP, aspect: 'writing',
    title: 'Связность без связок',
    subtitle: 'cohesion — это не количество linking words',
    steps: [
      { type: 'concept', lead: 'Связки — самый переоценённый инструмент в подготовке к IELTS.',
        text: 'Критерий называется <b>Coherence and cohesion</b>, и связки отвечают только за вторую ' +
              'половину. Более того: <i>Firstly… Moreover… In addition… Furthermore…</i> в каждом ' +
              'предложении читаются как механическая расстановка — и балл за это <b>снижают</b>, ' +
              'а не повышают. Настоящая связность держится на трёх вещах попроще.' },
      { type: 'table', title: 'Чем на самом деле держится текст', cols: ['Как это выглядит'],
        rows: [
          { label: 'Местоимения и указатели', cells: [
            '<i>…a shortage of teachers. <b>This</b> has forced schools to increase class sizes.</i>'] },
          { label: 'Повтор ключевого слова', cells: [
            '<i>…rising <b>rents</b>. When <b>rents</b> outpace wages, young people simply stay at home.</i>'] },
          { label: 'Синоним вместо повтора', cells: [
            '<i>…the <b>scheme</b> was expensive. Critics argued the <b>programme</b> had no clear goal.</i>'] },
          { label: 'Порядок «известное → новое»', cells: [
            'Каждое предложение начинается с того, что читатель уже знает, и заканчивается новым'] },
        ],
        note: 'Заметь: ни в одной строке нет ни одной linking word. Это связный текст.' },
      { type: 'vs',
        left:  { tag: 'связки вместо связи',
                 en: 'Firstly, cars cause pollution. Moreover, they are expensive. Furthermore, they ' +
                     'cause traffic. In addition, parking is difficult. Finally, they are dangerous.',
                 ru: 'Пять связок на пять предложений — и ни одной мысли, раскрытой дальше названия. ' +
                     'Экзаменатор видит список, а не рассуждение.' },
        right: { tag: 'связь без связок',
                 en: 'Cars are the main source of urban air pollution. That pollution is concentrated ' +
                     'exactly where people live, which is why the health costs fall on city residents ' +
                     'rather than on drivers passing through.',
                 ru: 'Ноль linking words. Связывают повтор (pollution → that pollution) и указатель ' +
                     '(which). Мысль при этом развивается, а не перечисляется.' } },
      { type: 'drill', title: 'Убери лишнее',
        task: 'В каждом фрагменте есть связка, которая не работает. Найди её и скажи, чем заменить.',
        items: [
          { label: 'фрагмент 1',
            q: '<i>Moreover, the cost of housing has risen sharply. Furthermore, wages have stagnated. ' +
               'In addition, young people cannot save.</i>',
            a: 'Убрать все три. <i>The cost of housing has risen sharply while wages have stagnated, ' +
               'so young people can no longer save.</i>',
            why: 'Три предложения были одной мыслью, разрезанной на куски и склеенной связками. ' +
                 'Соединив их подчинением (while, so), получаем сложное предложение — а заодно ' +
                 'балл по Grammatical range, которого у трёх простых предложений не было.' },
          { label: 'фрагмент 2',
            q: '<i>Air travel is convenient. However, it is fast.</i>',
            a: '<i>However</i> здесь неверно по смыслу: противопоставления нет. Нужно ' +
               '<i>Air travel is convenient, and above all fast.</i>',
            why: 'Связка, поставленная не по смыслу, хуже её отсутствия: она сообщает экзаменатору, ' +
                 'что слово выучено, но не понято. Это прямо описано в дескрипторах как ' +
                 '«mechanical use of cohesive devices».' },
          { label: 'фрагмент 3',
            q: '<i>Firstly, I will discuss the advantages. Secondly, I will discuss the disadvantages. ' +
               'Finally, I will give my opinion.</i>',
            a: 'Выбросить целиком. Эссе на 250 слов не нуждается в оглавлении.',
            why: 'Это тридцать слов из лимита, потраченных на пересказ структуры, которая и так видна. ' +
                 'В Task 1 такое же вступление-оглавление стоит ещё дороже — там лимит 150 слов.' },
        ] },
      { type: 'markers', title: 'Связки, которые стоит знать — по одной на функцию',
        chips: [
          { w: 'while / whereas', ru: 'противопоставление в одном предложении' },
          { w: 'yet', ru: 'но (сильнее, чем but)' },
          { w: 'since / as', ru: 'потому что' },
          { w: 'so that', ru: 'чтобы' },
          { w: 'in that', ru: 'в том смысле что' },
          { w: 'which is why', ru: 'вот почему' },
          { w: 'even if', ru: 'даже если' },
          { w: 'rather than', ru: 'а не' },
        ] },
      { type: 'note', html: 'Практический ориентир: <b>не больше одной связки на абзац</b> в начале ' +
              'предложения. Остальные соединения — внутри предложений (which, while, since) и через ' +
              'повтор ключевых слов. Так текст читается как рассуждение, а не как список.' },
      { type: 'quiz', q: 'Что из этого поднимает Coherence and cohesion сильнее всего?',
        options: ['Начать каждое предложение со связки',
                  'Связать предложения повтором ключевого слова и указателями (this, such)',
                  'Использовать как можно более редкие связки'], answer: 1,
        explain: 'Связки — лишь часть критерия, и механическая расстановка его снижает. ' +
                 'Работают повторы, указатели и порядок «известное → новое».' },
      { type: 'quiz', q: '<i>Air travel is convenient. However, it is fast.</i> Что не так?',
        options: ['Ничего', 'However означает противопоставление, а его тут нет', 'Слишком короткие предложения'], answer: 1,
        explain: 'Быстро и удобно — не противопоставление. Связка не по смыслу читается как выученная наугад.' },
    ],
  },

  {
    id: 't1-language', group: GROUP, aspect: 'writing',
    title: 'Task 1: язык изменения',
    subtitle: 'что выросло, насколько и как быстро',
    steps: [
      { type: 'concept', lead: 'Task 1 — это не сочинение. Это точный пересказ картинки.',
        text: 'Всё задание сводится к нескольким операциям: сказать, что <b>выросло или упало</b>, ' +
              '<b>насколько</b>, <b>как быстро</b> и <b>по сравнению с чем</b>. Лексика этих операций ' +
              'конечна — её можно выучить целиком за один заход, и дальше она работает на любом графике.' },
      { type: 'scale', title: 'Рост и падение: от резкого к едва заметному',
        rows: [
          { d: '↑↑', kind: 'up',   en: 'soared · rocketed', ru: 'взлетело — только для драматичных скачков' },
          { d: '↑',  kind: 'up',   en: 'rose sharply · increased dramatically', ru: 'резко выросло' },
          { d: '↑',  kind: 'up',   en: 'rose steadily · climbed gradually', ru: 'росло ровно' },
          { d: '→',  kind: '',     en: 'levelled off · plateaued · remained stable', ru: 'вышло на плато' },
          { d: '↓',  kind: 'down', en: 'declined gradually · edged down', ru: 'плавно снижалось' },
          { d: '↓',  kind: 'down', en: 'fell sharply · dropped dramatically', ru: 'резко упало' },
          { d: '↓↓', kind: 'down', en: 'plummeted · collapsed', ru: 'обвалилось' },
        ] },
      { type: 'table', title: 'Одно и то же двумя конструкциями',
        cols: ['Глагол + наречие', 'Прилагательное + существительное'],
        lede: 'Каждое изменение можно сказать двумя способами. Умение переключаться между ними — ' +
              'и есть Grammatical range в Task 1, и стоит оно дешевле, чем редкие слова.',
        rows: [
          { label: 'Рост', cells: ['<i>Sales <b>rose sharply</b>.</i>',
            '<i>There was <b>a sharp rise</b> in sales.</i>'] },
          { label: 'Падение', cells: ['<i>Prices <b>fell steadily</b>.</i>',
            '<i>Prices showed <b>a steady fall</b>.</i>'] },
          { label: 'Колебание', cells: ['<i>Numbers <b>fluctuated slightly</b>.</i>',
            '<i>There were <b>slight fluctuations</b> in numbers.</i>'] },
        ],
        note: 'Существительные считаются: rise, fall, decline, increase, drop, growth, fluctuation. ' +
              'Прилагательные к ним: sharp, steady, gradual, slight, marginal, dramatic, significant.' },
      { type: 'markers', title: 'Насколько и когда — служебные конструкции',
        chips: [
          { w: 'by 12%', ru: 'на 12% (величина изменения)' },
          { w: 'to 40 million', ru: 'до 40 млн (конечное значение)' },
          { w: 'from … to …', ru: 'с … до …' },
          { w: 'a fivefold increase', ru: 'рост в пять раз' },
          { w: 'twice as many as', ru: 'вдвое больше чем' },
          { w: 'accounted for 30%', ru: 'составляло 30%' },
          { w: 'peaked at', ru: 'достигло пика в' },
          { w: 'bottomed out at', ru: 'достигло минимума в' },
          { w: 'over the period', ru: 'за рассматриваемый период' },
          { w: 'respectively', ru: 'соответственно' },
        ] },
      { type: 'note', warn: true, html: 'Классическая ошибка: <b>rose by 40%</b> и <b>rose to 40%</b> — ' +
              'разные вещи. <i>by</i> — насколько изменилось, <i>to</i> — до какого значения дошло. ' +
              'Перепутать их значит написать неверные данные, а это бьёт по Task achievement, ' +
              'а не по грамматике.' },
      { type: 'drill', title: 'Одна линия — одно предложение',
        task: 'Описана одна линия графика словами. Скажи это по-английски одним предложением — ' +
              'с величиной и характером изменения. Полного задания здесь нет намеренно: ' +
              'предложение про линию — это и есть кирпич, из которого Task 1 собирается.',
        items: [
          { label: 'линия 1',
            q: 'Продажи книг: 2010 — 12 млн, ровный рост до 2016, там 20 млн, дальше плато до 2020.',
            a: 'Book sales climbed steadily from 12 million in 2010 to 20 million in 2016, after which ' +
               'they levelled off.',
            why: 'Одно предложение вместо трёх: ровный рост, конечная точка, плато. Конструкция ' +
                 '«after which» связывает без единой linking word и стоит дороже, чем «Then it was stable».' },
          { label: 'линия 2',
            q: 'Число посетителей: 2015 — 800 тыс., в 2016 обвал до 300 тыс., потом медленное ' +
               'восстановление до 500 тыс. к 2020.',
            a: 'Visitor numbers plummeted from 800,000 to just 300,000 in 2016, before recovering ' +
               'gradually to half a million by 2020.',
            why: '«Just» перед числом подчёркивает провал — так делают в отчётах. ' +
                 '«Half a million» вместо «500,000» — вариативность, за которую и стоит ' +
                 'Lexical resource. «Before + -ing» связывает два периода одним предложением.' },
          { label: 'линия 3',
            q: 'Доля возобновляемой энергии: в 2000 — 5%, к 2020 — 25%.',
            a: 'The share of renewable energy rose fivefold over the period, from 5% in 2000 to 25% in 2020.',
            why: 'Кратность («fivefold») экзаменатор считает сильным ходом: ты не просто списал ' +
                 'две цифры, а увидел отношение между ними. И заметь: <i>from … to …</i>, ' +
                 'а не <i>by 20%</i> — здесь важны обе границы.' },
          { label: 'сравнение',
            q: 'В 2020: Германия — 40%, Франция — 20%.',
            a: 'In 2020 the figure for Germany was twice that for France, at 40% and 20% respectively.',
            why: '«The figure for X» — рабочая замена бесконечным повторам названий. ' +
                 '«Respectively» экономит целое предложение. Сравнения в Task 1 требуются прямо ' +
                 'формулировкой задания («make comparisons where relevant»).' },
        ] },
      { type: 'quiz', q: 'Продажи выросли с 20 до 28 млн. Как правильно?',
        options: ['rose by 28 million', 'rose to 28 million', 'rose by 40% — на 8 из 20'], answer: 2,
        explain: 'И «rose to 28 million», и «rose by 8 million», и «rose by 40%» верны — а вот ' +
                 '«rose by 28 million» означало бы рост до 48. Вариант с процентом здесь точнее всего.' },
      { type: 'quiz', q: 'Какое слово описывает «вышло на плато и держится»?',
        options: ['plummeted', 'levelled off', 'soared'], answer: 1,
        explain: 'Levelled off / plateaued / remained stable — три способа сказать одно и то же.' },
    ],
  },

  {
    id: 't1-overview', group: GROUP, aspect: 'writing',
    title: 'Task 1: overview решает всё',
    subtitle: 'единственный обязательный абзац · где цифры, а где нет',
    steps: [
      { type: 'concept', lead: 'Без overview балл за Task 1 не поднимется выше 5, каким бы английским это ни было.',
        text: 'Overview — это <b>два предложения про общую картину</b> сразу после вступления: ' +
              'что главное видно на графике, если отойти на шаг. Не самые крупные цифры, ' +
              'а <b>тенденция</b>: что растёт, что падает, кто впереди, что не меняется. ' +
              'Цифр в overview быть не должно — они идут ниже, в теле.' },
      { type: 'formula', title: 'Структура Task 1 целиком',
        rows: [
          { label: 'Вступление · 1 предложение', html: 'что показывает график — <b>перефразированная подпись</b>' },
          { label: 'Overview · 2 предложения', html: 'главное <b>без цифр</b>' },
          { label: 'Тело 1 · 3–4 предложения', html: 'первая группа данных <b>с цифрами</b>' },
          { label: 'Тело 2 · 3–4 предложения', html: 'вторая группа <b>с цифрами</b>' },
        ] },
      { type: 'note', html: 'Вывода (conclusion) в Task 1 <b>нет</b>. Overview стоит вместо него — ' +
              'и стоит в начале, а не в конце: экзаменатор должен увидеть общую картину сразу. ' +
              'Если время кончилось на теле — overview уже написан, и балл спасён.' },
      { type: 'drill', title: 'Overview или деталь',
        task: 'Скажи, годится ли предложение в overview. Проверка простая: ' +
              'оно про <b>всю</b> картинку — или про одну точку на ней?',
        items: [
          { label: 'кандидат 1',
            q: '<i>In 2015, coffee consumption in Sweden reached 9.2 kg per person.</i>',
            a: 'Нет. Это одна точка и точная цифра — место в теле абзаца.',
            why: 'Признак детали: конкретный год плюс конкретное число. В overview такое не ставят, ' +
                 'даже если это самое большое значение на графике.' },
          { label: 'кандидат 2',
            q: '<i>Overall, consumption rose in all four countries, though the gap between the highest ' +
               'and lowest narrowed considerably.</i>',
            a: 'Да. Это и есть overview: общее направление плюс главное отличие.',
            why: 'Покрывает все четыре страны и весь период, цифр нет, но сказано содержательно. ' +
                 'Слово «Overall» — самый простой маркер: экзаменатор находит overview за секунду.' },
          { label: 'кандидат 3',
            q: '<i>The graph shows coffee consumption in four countries between 2000 and 2020.</i>',
            a: 'Нет — это вступление, а не overview. Оно только называет тему, ничего не сообщая.',
            why: 'Самая частая подмена: человек пишет вступление, считает его за overview ' +
                 'и теряет балл. Проверка: если предложение можно написать, не глядя на график, — ' +
                 'это вступление.' },
          { label: 'кандидат 4',
            q: '<i>The process begins with the collection of raw material and ends with packaging, ' +
               'passing through seven stages in total.</i>',
            a: 'Да — overview для схемы процесса.',
            why: 'У диаграммы процесса общая картина — это начало, конец и число стадий. ' +
                 'Тенденций там нет, и искать их не надо: overview подстраивается под тип картинки.' },
        ] },
      { type: 'table', title: 'Что считать «главным» — по типу картинки',
        cols: ['Что идёт в overview'],
        rows: [
          { label: 'График во времени', cells: ['Общее направление всех линий + кто выше всех к концу'] },
          { label: 'Столбцы / таблица', cells: ['Самое большое и самое маленькое значение — <b>без цифр</b>, словами'] },
          { label: 'Круговые диаграммы', cells: ['Что доминирует в каждой диаграмме и что изменилось между ними'] },
          { label: 'Карта', cells: ['Что изменилось в целом: застроилось, расширилось, исчезло'] },
          { label: 'Схема процесса', cells: ['Начало, конец, число стадий, есть ли цикл'] },
        ] },
      { type: 'drill', title: 'Собери overview',
        task: 'Дан словесный портрет графика. Напиши overview — два предложения, без цифр.',
        items: [
          { label: 'график 1',
            q: 'Четыре страны, потребление энергии 1990–2020. Все растут. Китай стартовал ниже всех ' +
               'и к концу обогнал всех. США почти не менялись.',
            a: 'Overall, energy consumption increased in all four countries over the period. The most ' +
               'striking change was in China, which began as the smallest consumer but ended as the ' +
               'largest, while consumption in the United States remained broadly flat.',
            why: 'Два предложения, ноль цифр, и при этом сказано главное: общий рост, самый заметный ' +
                 'сдвиг и одно исключение. Конструкция «which began … but ended …» экономит целое ' +
                 'предложение и работает на Grammatical range.' },
          { label: 'график 2',
            q: 'Три круговые диаграммы: как люди добирались до работы в 1990, 2005, 2020. ' +
               'Машина везде на первом месте, но её доля падает. Велосипед вырос сильнее всех.',
            a: 'Cars remained the dominant means of commuting throughout the period, although their ' +
               'share declined steadily. The clearest growth was in cycling, which rose in every ' +
               'decade shown.',
            why: 'Для круговых диаграмм overview — это «кто главный» и «что изменилось между ними». ' +
                 'Слова dominant и share — базовая лексика долей, и без них про пироги писать тяжело.' },
        ] },
      { type: 'terms', title: 'Слова для долей и групп', items: [
        { en: 'account for', ru: 'составлять (долю)', hint: 'X accounted for a third of the total' },
        { en: 'the figure for X', ru: 'показатель для X', hint: 'спасает от повтора названий' },
        { en: 'the proportion of', ru: 'доля' },
        { en: 'the majority / a minority of', ru: 'большинство / меньшинство' },
        { en: 'roughly / approximately', ru: 'примерно', hint: 'вместо точной цифры, когда график читается неточно' },
        { en: 'just under / just over', ru: 'чуть меньше / чуть больше' },
        { en: 'the remaining', ru: 'оставшиеся' },
        { en: 'dominant', ru: 'преобладающий' },
        { en: 'broadly flat / unchanged', ru: 'практически без изменений' },
        { en: 'overtook', ru: 'обогнал', hint: 'ключевое слово, когда линии пересекаются' },
      ] },
      { type: 'quiz', q: 'Где стоит overview в Task 1?',
        options: ['В конце, вместо вывода', 'Сразу после вступления', 'Не важно, лишь бы был'], answer: 1,
        explain: 'Сразу после вступления. Вывода в Task 1 нет вообще — overview его заменяет.' },
      { type: 'quiz', q: 'Что НЕ должно быть в overview?',
        options: ['Слово «overall»', 'Точные цифры', 'Упоминание всех групп данных'], answer: 1,
        explain: 'Цифры идут в тело абзацев. Overview — про картину целиком, словами.' },
      { type: 'quiz', q: 'Написал Task 1 без overview, но с подробными данными. Потолок балла?',
        options: ['7 — данные же есть', '5 по Task achievement', 'Никак не влияет'], answer: 1,
        explain: 'Отсутствие overview — прямое ограничение по Task achievement, независимо от качества языка.' },
    ],
  },
];
