/* ============================================================
   ЧАСТЬ 2 — ЧТЕНИЕ ПО ПРИЁМАМ.

   Намеренно НЕ полные задания. Полный текст с сорока вопросами
   тренирует выносливость, но не ставит приём: ошибся — и непонятно,
   где именно. Здесь один приём отрабатывается на одном-двух
   предложениях, где видно, что ты сделал.

   Фрагменты написаны для курса, а не взяты из настоящих текстов:
   так их можно резать до одного предложения и подгонять под приём.
   ============================================================ */

const GROUP = 'Часть 2 · Чтение по приёмам';

export const READING = [
  {
    id: 'skimming', group: GROUP, aspect: 'reading',
    title: 'Что читать, а что пропускать',
    subtitle: 'скольжение · первые предложения · служебные слова',
    steps: [
      { type: 'concept', lead: 'Полторы минуты на вопрос. Читать всё — не вариант.',
        text: 'Рабочий порядок такой: <b>60 секунд скользишь по тексту</b> (заголовок, первое ' +
              'предложение каждого абзаца, последний абзац) — чтобы построить карту «о чём где». ' +
              'Дальше читаешь вопрос и возвращаешься <b>в конкретный абзац</b>. Полностью и ' +
              'внимательно читаются только те два-три предложения, где лежит ответ.' },
      { type: 'table', title: 'Три скорости чтения — и когда какая',
        cols: ['Что делаешь', 'Когда'],
        rows: [
          { label: 'Skimming', cells: ['Скользишь по верхам, ловишь тему абзаца',
            'Первая минута с текстом и задания Matching headings'] },
          { label: 'Scanning', cells: ['Ищешь глазами конкретную зацепку: имя, год, число, термин',
            'Когда в вопросе есть то, что нельзя перефразировать'] },
          { label: 'Close reading', cells: ['Читаешь медленно, слово за словом',
            'Только найденные два-три предложения — и обязательно целиком'] },
        ],
        note: 'Главная ошибка — читать весь текст в режиме close reading. Времени хватит ' +
              'на первый текст и половину второго.' },
      { type: 'markers', title: 'Зацепки, которые не перефразируют — ищи их глазами',
        chips: [
          { w: '1996', ru: 'годы и даты' },
          { w: '42%', ru: 'проценты' },
          { w: 'Darwin', ru: 'имена' },
          { w: 'Iceland', ru: 'названия мест' },
          { w: 'photosynthesis', ru: 'термины' },
          { w: 'CAPITALS', ru: 'заглавные' },
          { w: '"quotes"', ru: 'кавычки' },
          { w: 'italics', ru: 'курсив' },
        ] },
      { type: 'note', html: 'Первое предложение абзаца несёт его тему примерно в <b>восьми случаях ' +
              'из десяти</b>. Исключение — абзацы, начинающиеся со связки-разворота (<i>However, ' +
              'Nevertheless, Yet</i>): там тема во втором предложении, а первое цепляется за предыдущий абзац.' },
      { type: 'drill', title: 'Одна строка — одна тема',
        task: 'Прочитай только первое предложение абзаца и скажи, о чём будет абзац. ' +
              'Пятнадцать секунд, не больше — это ровно то, что делаешь на скольжении.',
        items: [
          { label: 'абзац A',
            q: '<i>The idea that bees communicate through movement was once dismissed as fantasy.</i>',
            a: 'История отношения к открытию: раньше не верили — дальше почти наверняка про то, как это доказали.',
            why: '«was once dismissed» задаёт временную рамку «тогда → теперь». Абзац будет про перелом, ' +
                 'а не про механику танца пчёл. Это важно для Matching headings: заголовок ' +
                 '«How bees dance» сюда не подойдёт, а «Changing attitudes to a discovery» — да.' },
          { label: 'абзац B',
            q: '<i>However, the costs of the programme soon became difficult to justify.</i>',
            a: 'Тема в этом предложении не найдётся — она во втором. Здесь только разворот к предыдущему абзацу.',
            why: '«However» в начале — сигнал, что абзац спорит с предыдущим. На скольжении такие ' +
                 'абзацы читают на предложение глубже, иначе тема потеряется.' },
          { label: 'абзац C',
            q: '<i>Three factors explain why the technique spread so quickly across northern Europe.</i>',
            a: 'Перечисление причин распространения. Дальше будет список из трёх пунктов.',
            why: 'Числительное в первом предложении («Three factors») — подарок: оно и тема абзаца, ' +
                 'и структура. Такие абзацы часто становятся источником вопросов на completion.' },
        ] },
      { type: 'quiz', q: 'Ты потратил 12 минут и прочитал первый текст целиком и внимательно. Что не так?',
        options: ['Всё нормально, так и надо', 'На три текста уйдёт 36 минут только на чтение — ответить не успеешь',
                  'Надо было читать ещё внимательнее'], answer: 1,
        explain: 'Вдумчиво читают только те предложения, где лежит ответ. Всё остальное — скольжение.' },
      { type: 'quiz', q: 'В вопросе встретилось «in 1997». Какой приём применяешь?',
        options: ['Skimming — ищешь тему', 'Scanning — ищешь глазами само число', 'Читаешь абзац целиком'], answer: 1,
        explain: 'Числа, даты и имена собственные текст не перефразирует — их находят глазами за секунды.' },
    ],
  },

  {
    id: 'paraphrase', group: GROUP, aspect: 'reading',
    title: 'Охота за парафразом',
    subtitle: 'главный навык чтения · вопрос никогда не повторяет текст',
    steps: [
      { type: 'concept', lead: 'Если слова вопроса дословно есть в тексте — почти всегда это ловушка.',
        text: 'Экзамен устроен так, что вопрос <b>всегда переписан другими словами</b>. Поэтому ' +
              'искать надо не слово из вопроса, а его синоним. А совпавшее слово чаще всего стоит ' +
              'в предложении, которое отвечает не на тот вопрос — это называют <i>distractor</i>, ' +
              'и он там стоит специально.' },
      { type: 'vs',
        left:  { tag: 'в вопросе', en: 'The study was funded by the government.',
                 ru: 'Слова: funded, government' },
        right: { tag: 'в тексте', en: 'The research received its financial backing from the state.',
                 ru: 'funded → received financial backing · government → the state. Ни одного общего слова, ' +
                     'кроме служебных — и это нормальный уровень перефразирования для IELTS.' } },
      { type: 'table', title: 'Четыре способа переписать одно и то же',
        cols: ['В тексте', 'В вопросе'],
        rows: [
          { label: 'Синоним', cells: ['<i>rise sharply</i>', '<i>increase dramatically</i>'] },
          { label: 'Смена части речи', cells: ['<i>scientists discovered</i>', '<i>the discovery by scientists</i>'] },
          { label: 'Актив ↔ пассив', cells: ['<i>the council rejected the plan</i>', '<i>the plan was rejected</i>'] },
          { label: 'Обобщение', cells: ['<i>cars, buses and lorries</i>', '<i>road vehicles</i>'] },
        ],
        note: 'Четвёртый — самый коварный: «road vehicles» в вопросе не подсвечивает ничего в тексте, ' +
              'потому что там перечисление. Обобщения ищут по смыслу, а не глазами.' },
      { type: 'drill', title: 'Найди парафраз',
        task: 'Дан фрагмент и утверждение. Скажи, какими словами текст выражает подчёркнутое ' +
              'в утверждении — и только потом решай, верно оно или нет.',
        items: [
          { label: 'фрагмент 1',
            q: '<i>Although the museum charges no entry fee, visitor numbers have fallen every year since 2015.</i><br>' +
               'Утверждение: <b>Admission to the museum is free.</b>',
            a: 'charges no entry fee → is free. Утверждение верно.',
            why: 'Отрицание глагола («charges no») переписано прилагательным («is free»). ' +
                 'Обрати внимание: слова free в тексте нет вообще — искать его глазами было бы бесполезно.' },
          { label: 'фрагмент 2',
            q: '<i>The technique was abandoned after a decade, largely because skilled workers were scarce.</i><br>' +
               'Утверждение: <b>A shortage of trained staff contributed to the technique being dropped.</b>',
            a: 'skilled workers were scarce → a shortage of trained staff · abandoned → dropped · ' +
               'largely because → contributed to. Утверждение верно.',
            why: 'Три парафраза в одном предложении — обычное дело. «Largely because» → «contributed to» ' +
                 'ещё и ослабляет утверждение: текст говорит сильнее, чем утверждение, и это не мешает ' +
                 'ему быть верным.' },
          { label: 'фрагмент 3',
            q: '<i>Early maps of the region were drawn by traders rather than by surveyors.</i><br>' +
               'Утверждение: <b>Professional surveyors produced the first maps of the region.</b>',
            a: 'Текст говорит ровно обратное: rather than by surveyors. Утверждение неверно.',
            why: 'Конструкция «X rather than Y» — частая опора для False: в утверждении подставляют Y. ' +
                 'Слово surveyors в тексте есть, и именно оно притягивает взгляд — классический distractor.' },
          { label: 'фрагмент 4',
            q: '<i>The festival attracts around 40,000 people each summer.</i><br>' +
               'Утверждение: <b>The festival is the largest in the country.</b>',
            a: 'О размере относительно других фестивалей текст не говорит ничего. Not Given.',
            why: 'Сорок тысяч — много, и хочется додумать «значит, самый большой». Сравнения в тексте нет — ' +
                 'значит, нет и ответа. Додумывание за автора — причина примерно половины ошибок в TFNG.' },
        ] },
      { type: 'note', warn: true, html: 'Правило, экономящее баллы: <b>ответ должен быть найден в тексте ' +
              'пальцем</b>. Если ты не можешь показать предложение, из которого он следует, — это не ответ, ' +
              'а догадка. Догадки на IELTS почти всегда Not Given.' },
      { type: 'quiz', q: 'В тексте: <i>the scheme was funded entirely by private donations</i>. ' +
              'В вопросе: <i>the scheme received no public money</i>. Как связаны?',
        options: ['Это парафраз: entirely private = no public', 'Это разные утверждения', 'Not Given'], answer: 0,
        explain: '«Полностью частные» логически равно «никаких государственных». Переход через отрицание — ' +
                 'самый частый вид парафраза в TFNG.' },
      { type: 'quiz', q: 'Слово из вопроса нашлось в тексте дословно. Что это скорее всего значит?',
        options: ['Ответ найден', 'Скорее всего это distractor — проверь смысл предложения целиком',
                  'Вопрос напечатан с ошибкой'], answer: 1,
        explain: 'Дословные совпадения обычно расставлены как приманка. Читай предложение целиком ' +
                 'и сверяй смысл, а не слово.' },
    ],
  },

  {
    id: 'tfng', group: GROUP, aspect: 'reading',
    title: 'True · False · Not Given',
    subtitle: 'одно правило и одна ловушка',
    steps: [
      { type: 'concept', lead: 'Разница между False и Not Given — не в тексте, а в тебе.',
        text: '<b>True</b> — текст говорит то же самое. <b>False</b> — текст говорит ' +
              '<b>противоположное</b>. <b>Not Given</b> — текст об этом просто молчит. ' +
              'Ошибаются почти всегда в одну сторону: ставят False там, где надо Not Given, ' +
              'потому что утверждение «кажется неправдой». Тебе не надо знать, правда ли это. ' +
              'Надо знать, сказал ли это автор.' },
      { type: 'formula', title: 'Три решения',
        rows: [
          { label: 'текст подтверждает', html: '<b>TRUE</b>' },
          { label: 'текст противоречит', html: '<b>FALSE</b>' },
          { label: 'текст молчит или сказано про другое', html: '<b>NOT GIVEN</b>' },
        ] },
      { type: 'note', html: 'В варианте <b>Yes / No / Not Given</b> всё то же самое, только сверяешь ' +
              'не с фактами, а с <b>мнением автора</b>. Формулировка задания и выдаёт разницу: ' +
              '<i>agree with the information</i> — это TFNG, <i>agree with the claims of the writer</i> — YNNG.' },
      { type: 'drill', title: 'Одно предложение — одно решение',
        task: 'Здесь нет длинного текста намеренно: правило TFNG целиком помещается в одну строку, ' +
              'и отрабатывать его надо там же. Реши сам, потом открой разбор.',
        items: [
          { label: 'True или нет?',
            q: '<i>Coffee production in Brazil fell by 12% in 2019 following an unusually dry winter.</i><br>' +
               'Утверждение: <b>Dry weather affected Brazilian coffee output in 2019.</b>',
            a: 'TRUE.',
            why: 'following an unusually dry winter → dry weather affected. Причинная связь в тексте есть, ' +
                 'утверждение её лишь пересказывает мягче.' },
          { label: 'False или Not Given?',
            q: '<i>The library opened in 1904 and was extended twice.</i><br>' +
               'Утверждение: <b>The library was extended three times.</b>',
            a: 'FALSE.',
            why: 'Числа противоречат прямо: два — не три. Когда в тексте и в утверждении стоят разные ' +
                 'числа про одно и то же, это всегда False, а не Not Given.' },
          { label: 'False или Not Given?',
            q: '<i>The library opened in 1904 and was extended twice.</i><br>' +
               'Утверждение: <b>The extensions were funded by the city council.</b>',
            a: 'NOT GIVEN.',
            why: 'Про деньги в тексте нет ни слова — ни за, ни против. Хочется рассуждать «библиотека ' +
                 'городская, значит город и платил» — вот это рассуждение и есть ошибка.' },
          { label: 'осторожно',
            q: '<i>Some researchers argue that the effect is overstated.</i><br>' +
               'Утверждение: <b>All researchers believe the effect is overstated.</b>',
            a: 'FALSE.',
            why: '«Some» против «all» — прямое противоречие, а не молчание. Слова-кванторы ' +
                 '(some, all, most, never, always, only) — главный источник False: смотри на них ' +
                 'в первую очередь.' },
          { label: 'осторожно',
            q: '<i>The vaccine is usually given in two doses.</i><br>' +
               'Утверждение: <b>The vaccine must always be given in two doses.</b>',
            a: 'FALSE.',
            why: 'usually → must always: утверждение сильнее текста настолько, что противоречит ему. ' +
                 '«Usually» прямо допускает исключения, «always» их запрещает.' },
          { label: 'осторожно',
            q: '<i>The vaccine is usually given in two doses.</i><br>' +
               'Утверждение: <b>The second dose is given four weeks after the first.</b>',
            a: 'NOT GIVEN.',
            why: 'Тема та же, но про интервал текст молчит. Совпадение темы — не совпадение утверждения; ' +
                 'на этом ловят чаще всего.' },
        ] },
      { type: 'markers', title: 'Слова, из-за которых утверждение чаще всего становится False',
        chips: [
          { w: 'all / every', ru: 'все' },
          { w: 'only', ru: 'только' },
          { w: 'never', ru: 'никогда' },
          { w: 'always', ru: 'всегда' },
          { w: 'must', ru: 'обязан' },
          { w: 'the first', ru: 'первый' },
          { w: 'the main', ru: 'главный' },
          { w: 'more than', ru: 'больше чем' },
        ] },
      { type: 'note', warn: true, html: 'Тактическое правило на экзамене: <b>если раздумываешь дольше ' +
              '40 секунд — ставь Not Given</b>. Длинные раздумья означают, что ты достраиваешь смысл, ' +
              'которого в тексте нет, а это и есть определение Not Given.' },
      { type: 'quiz', q: 'Текст: <i>Most of the settlements were abandoned by 1300.</i> ' +
              'Утверждение: <i>Every settlement was abandoned by 1300.</i>',
        options: ['True', 'False', 'Not Given'], answer: 1,
        explain: 'Most ≠ every. Текст прямо допускает, что часть поселений осталась — утверждение это отрицает.' },
      { type: 'quiz', q: 'Текст: <i>The company opened offices in Berlin and Madrid.</i> ' +
              'Утверждение: <i>The Berlin office was more profitable.</i>',
        options: ['True', 'False', 'Not Given'], answer: 2,
        explain: 'Про прибыльность не сказано ничего. Тема совпала, утверждение — нет.' },
      { type: 'quiz', q: 'Задание сформулировано как «agree with the claims of the writer». Что это значит?',
        options: ['Сверять с фактами текста', 'Сверять с мнением автора — это Yes/No/Not Given',
                  'Разницы нет'], answer: 1,
        explain: 'Claims of the writer = мнение. Ответы там Yes / No / Not Given, и сверяешь ты позицию, а не факт.' },
    ],
  },

  {
    id: 'headings', group: GROUP, aspect: 'reading',
    title: 'Заголовок к абзацу',
    subtitle: 'тема против детали · почему заголовков всегда больше',
    steps: [
      { type: 'concept', lead: 'Заголовок описывает весь абзац. Не самое яркое предложение в нём.',
        text: 'Matching headings проваливают по одной причине: цепляются за <b>деталь</b>, которая ' +
              'бросилась в глаза. В списке заголовков специально лежат варианты, повторяющие ' +
              'по одному яркому слову из абзаца. Правильный заголовок обычно <b>не содержит слов ' +
              'из абзаца вообще</b> — он его обобщает.' },
      { type: 'table', title: 'Как отличить заголовок абзаца от заголовка предложения',
        cols: ['Признак', 'Что делать'],
        rows: [
          { label: 'Заголовок повторяет слово из абзаца', cells: [
            'Подозрительно', 'Проверь, покрывает ли он весь абзац или одну строку'] },
          { label: 'Заголовок покрывает 1–2 предложения из 8', cells: [
            'Это деталь', 'Отбрось: почти наверняка приманка'] },
          { label: 'Заголовок подходит сразу к двум абзацам', cells: [
            'Он слишком общий', 'Или ты неверно определил тему одного из них'] },
          { label: 'Заголовков больше, чем абзацев', cells: [
            'Так всегда', 'Лишние — это приманки, их не «пристраивают»'] },
        ] },
      { type: 'note', html: 'Рабочий порядок: <b>сначала абзац, потом список</b>. Прочитал абзац — ' +
              'сформулировал его тему своими словами в три слова — и только теперь пошёл искать ' +
              'похожий заголовок. Наоборот (читать список и примерять к абзацу) — прямой путь ' +
              'в ловушку: примерять можно почти всё.' },
      { type: 'drill', title: 'Тема или деталь',
        task: 'Дан короткий абзац и три заголовка. Выбери свой, потом открой разбор — ' +
              'важнее не угадать, а увидеть, почему остальные два поставлены рядом.',
        items: [
          { label: 'абзац 1',
            q: '<i>Wind turbines were once built almost exclusively on land. Offshore construction was ' +
               'considered too expensive, and early attempts in the 1990s were plagued by corrosion. ' +
               'Today, however, more than half of new European capacity is installed at sea, where ' +
               'winds are stronger and steadier.</i><br><br>' +
               'A — <i>The problem of corrosion</i><br>B — <i>A shift from land to sea</i><br>' +
               'C — <i>Why European energy prices are falling</i>',
            a: 'B — A shift from land to sea.',
            why: 'A — это одно предложение из трёх, деталь. C — про цены, которых в абзаце нет вообще. ' +
                 'B покрывает и «раньше на суше», и «теперь в море» — то есть весь абзац. ' +
                 'Заметь: слов «shift» и «sea» в первых двух предложениях нет — правильный заголовок ' +
                 'редко подсвечивается словами.' },
          { label: 'абзац 2',
            q: '<i>Fossil evidence for the earliest birds remains contested. A single feather found in ' +
               'Bavaria in 1861 was for decades treated as decisive. Recent scanning has cast doubt on ' +
               'whether it belonged to Archaeopteryx at all, and some researchers now argue the specimen ' +
               'proves nothing.</i><br><br>' +
               'A — <i>Doubts about a key piece of evidence</i><br>B — <i>The discovery of a feather in Bavaria</i><br>' +
               'C — <i>How birds evolved from dinosaurs</i>',
            a: 'A — Doubts about a key piece of evidence.',
            why: 'B описывает второе предложение — деталь, и она даже упомянута теми же словами, ' +
                 'что и в абзаце. Это признак приманки. C — тема шире абзаца: про эволюцию птиц ' +
                 'здесь нет ни слова, только про спорность улики.' },
          { label: 'абзац 3',
            q: '<i>Municipal recycling schemes vary enormously. In some cities residents sort waste into ' +
               'seven categories; in others everything goes into a single bin and is separated later at ' +
               'a central facility. Neither approach has proved consistently better.</i><br><br>' +
               'A — <i>Sorting waste into seven categories</i><br>B — <i>The best way to recycle</i><br>' +
               'C — <i>Different approaches, no clear winner</i>',
            a: 'C — Different approaches, no clear winner.',
            why: 'A — деталь одного города. B звучит как тема, но абзац прямо говорит обратное: ' +
                 'лучшего способа нет. Заголовок, противоречащий последнему предложению, — ' +
                 'типичная приманка для тех, кто дочитал до середины.' },
        ] },
      { type: 'quiz', q: 'Заголовок подходит сразу к двум абзацам. Что это значит?',
        options: ['Можно поставить в оба', 'Он слишком общий или тема одного абзаца определена неверно',
                  'В задании опечатка'], answer: 1,
        explain: 'Каждый заголовок используется один раз. Совпадение на два абзаца — сигнал, что ты ' +
                 'взял слишком широкую формулировку.' },
      { type: 'quiz', q: 'Заголовок дословно повторяет фразу из второго предложения абзаца. Скорее всего это…',
        options: ['Верный ответ — совпадение же', 'Приманка: он покрывает деталь, а не абзац',
                  'Ошибка составителей'], answer: 1,
        explain: 'Совпадение слов в Matching headings почти всегда указывает на деталь. Верный заголовок обобщает.' },
    ],
  },

  {
    id: 'completion', group: GROUP, aspect: 'reading',
    title: 'Пропуски и короткие ответы',
    subtitle: 'грамматика подсказывает ответ · лимит слов · орфография',
    steps: [
      { type: 'concept', lead: 'Половину ответа видно ещё до того, как ты открыл текст.',
        text: 'В заданиях на заполнение пропусков ответ <b>берётся из текста дословно</b> — менять ' +
              'форму слова нельзя. Зато сам пропуск подсказывает, что именно искать: по грамматике ' +
              'соседних слов почти всегда видно <b>часть речи</b>, а часто и число.' },
      { type: 'table', title: 'Что подсказывает пропуск', cols: ['Значит, ищем'],
        rows: [
          { label: '<i>a ____ of workers</i>', cells: ['Существительное в единственном числе (после «a»)'] },
          { label: '<i>the ____ increased</i>', cells: ['Существительное — подлежащее, скорее всего множественное'] },
          { label: '<i>was ____ by the council</i>', cells: ['Причастие: пассив — глагол в третьей форме'] },
          { label: '<i>____ conditions</i>', cells: ['Прилагательное'] },
          { label: '<i>in ____</i>', cells: ['Год, место или существительное — смотри по контексту'] },
          { label: '<i>____ %</i>', cells: ['Число. Ищи глазами, не читая'] },
        ] },
      { type: 'note', warn: true, html: 'Три способа потерять балл на верном по смыслу ответе: ' +
              '<b>превысить лимит слов</b> (артикль считается!), <b>изменить форму</b> ' +
              '(<i>developed</i> вместо <i>develop</i>), <b>ошибиться в написании</b>. ' +
              'Орфография проверяется строго — списывай побуквенно, даже если слово знакомое.' },
      { type: 'drill', title: 'Что стоит в пропуске',
        task: 'Не ищи ответ — определи, <b>какое слово по форме</b> туда может встать. ' +
              'Это тридцать секунд, которые отсекают половину неверных вариантов.',
        items: [
          { label: 'пропуск 1',
            q: '<i>The decline was caused by a sudden ____ in demand.</i>',
            a: 'Существительное в единственном числе: после «a sudden» может стоять только оно. ' +
               'В тексте ищем что-то вроде <i>drop / fall / collapse</i>.',
            why: 'Прилагательное «sudden» уже занято, значит пропуск — то, что оно определяет. ' +
                 'Артикль «a» отсекает множественное число: <i>drops</i> сюда не встанет.' },
          { label: 'пропуск 2',
            q: '<i>Samples were ____ at three-hour intervals.</i>',
            a: 'Третья форма глагола: <i>were ____</i> — это пассив. Например <i>collected / taken / analysed</i>.',
            why: 'Если вписать <i>collect</i> или <i>collecting</i>, ответ не засчитают, даже если ' +
                 'в тексте стоит это же слово в другой форме. Форму берут ровно ту, что в тексте.' },
          { label: 'пропуск 3',
            q: '<i>Write NO MORE THAN TWO WORDS. Ответ в тексте: «the northern coastline».</i>',
            a: '<i>northern coastline</i> — без артикля.',
            why: '«The northern coastline» — три слова, лимит два. Артикль почти всегда можно отбросить ' +
                 'без потери смысла, и именно так и делают, когда упираются в лимит.' },
          { label: 'пропуск 4',
            q: '<i>Numbers rose to ____ million by 1998.</i>',
            a: 'Число. Не читай абзац — просмотри его глазами на цифры.',
            why: 'Числовой пропуск — самый быстрый в тесте: полминуты сканирования вместо чтения. ' +
                 'На них хорошо добирать вопросы, когда время заканчивается.' },
        ] },
      { type: 'note', html: 'Ещё один бесплатный балл: <b>ответы почти всегда идут по порядку текста</b>. ' +
              'Если пропуск 24 нашёлся в пятом абзаце, ответ на 25-й — ниже. Это сужает поиск ' +
              'до пары абзацев и экономит больше времени, чем любой другой приём.' },
      { type: 'quiz', q: 'В тексте: <i>farmers were encouraged to plant</i>. Пропуск: <i>Farmers were ____ to plant</i>. Ответ?',
        options: ['encourage', 'encouraged', 'encouraging'], answer: 1,
        explain: 'Форму берут ровно ту, что стоит в тексте. Пассив требует третьей формы, и она там уже есть.' },
      { type: 'quiz', q: 'Лимит — ONE WORD ONLY. В тексте: <i>a wooden frame</i>. Что писать?',
        options: ['a wooden frame', 'wooden frame', 'frame — или wooden, смотря о чём спрашивают'], answer: 2,
        explain: 'При лимите в одно слово выбирают то единственное, которое отвечает на вопрос. ' +
                 'Два слова — автоматический ноль.' },
      { type: 'quiz', q: 'Ты нашёл ответ на вопрос 30 в первом абзаце, а на вопрос 29 — в шестом. Что это значит?',
        options: ['Нормально, порядок не важен', 'Скорее всего одна из находок неверна — completion идёт по порядку',
                  'Надо поменять ответы местами'], answer: 1,
        explain: 'Задания на заполнение обычно следуют порядку текста. Нарушение порядка — сигнал перепроверить.' },
    ],
  },
];
