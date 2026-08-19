/* ============================================================
   ЧАСТЬ 4 — ЛЕКСИКА, ШАБЛОНЫ И ПРАВИЛА.

   Справочная часть: сюда возвращаются перед экзаменом, а не проходят
   один раз. Всё, что здесь лежит в шагах type:'terms', собирается
   на экран «Фразы» (#/terms) с поиском — это и есть тот самый
   отдельный раздел с полезной лексикой.

   Граница проведена сознательно: каркас фразы учить можно и нужно,
   готовое содержательное предложение — нельзя. Заученные куски,
   не отвечающие на вопрос, экзаменатор просто вычёркивает и
   оценивает то, что осталось.
   ============================================================ */

const GROUP = 'Часть 4 · Лексика, шаблоны и правила';

export const LEXIS = [
  {
    id: 'templates', group: GROUP, aspect: 'lexis',
    title: 'Шаблоны, которые можно',
    subtitle: 'каркас против заученного текста · где проходит граница',
    steps: [
      { type: 'concept', lead: 'Каркас — можно. Готовое содержательное предложение — нет.',
        text: 'Дескрипторы прямо говорят: <b>memorised language не оценивается</b>. Но заученным ' +
              'считается кусок, который несёт <b>содержание</b> и подошёл бы к любой теме ' +
              '(«Nowadays this is a controversial issue discussed all over the world»). ' +
              'А служебный каркас — «While X, I would argue that Y» — содержания не несёт: ' +
              'он пустой, пока ты не вписал в него свою мысль. Такие каркасы учить не только можно, ' +
              'но и нужно: они экономят время и держат структуру.' },
      { type: 'vs',
        left:  { tag: 'вычеркнут',
                 en: 'It is undeniable that this topic has both advantages and disadvantages which ' +
                     'people have debated for many years.',
                 ru: 'Подойдёт к любому вопросу на свете — значит, не отвечает ни на один. ' +
                     'Двадцать слов лимита впустую.' },
        right: { tag: 'засчитан',
                 en: 'While remote work clearly suits experienced staff, I would argue that it ' +
                     'disadvantages those at the start of their careers.',
                 ru: 'Каркас тот же самый («While X, I would argue that Y»), но заполнен ' +
                     'содержанием именно этого вопроса. Экзаменатор видит позицию, а не заготовку.' } },
      { type: 'table', title: 'Каркасы по месту в эссе', cols: ['Что вписывать'],
        rows: [
          { label: '<i>It is often argued that …</i>', cells: ['перефразированная тема, во вступлении'] },
          { label: '<i>While … , I would argue that …</i>', cells: ['уступка + твоя позиция'] },
          { label: '<i>The main reason for this is that …</i>', cells: ['тезис тела абзаца'] },
          { label: '<i>This matters because …</i>', cells: ['объяснение, а не повтор тезиса'] },
          { label: '<i>A clear illustration of this is …</i>', cells: ['переход к примеру'] },
          { label: '<i>Those who disagree point out that …</i>', cells: ['чужая позиция в discussion'] },
          { label: '<i>The evidence therefore suggests that …</i>', cells: ['вывод, без новых доводов'] },
          { label: '<i>On balance, … outweigh …</i>', cells: ['вердикт в вопросе на «что перевешивает»'] },
        ],
        note: 'Восьми каркасов хватает на любое Task 2. Больше учить смысла нет — ' +
              'место в голове лучше отдать точным словам по теме.' },
      { type: 'table', title: 'Каркасы Task 1', cols: ['Где стоит'],
        rows: [
          { label: '<i>The chart compares … over a period of …</i>', cells: ['вступление'] },
          { label: '<i>Overall, it is clear that …</i>', cells: ['первое предложение overview'] },
          { label: '<i>The most striking change was …</i>', cells: ['второе предложение overview'] },
          { label: '<i>Looking at the figures in more detail, …</i>', cells: ['переход к телу'] },
          { label: '<i>The figure for X stood at … , compared with … for Y.</i>', cells: ['сравнение с цифрами'] },
          { label: '<i>A similar pattern can be seen in …</i>', cells: ['второй объект, чтобы не повторяться'] },
        ] },
      { type: 'drill', title: 'Заполни каркас',
        task: 'Каркас пустой ровно до тех пор, пока в него не вписано содержание этого вопроса. ' +
              'Попробуй сам, потом сверься.',
        items: [
          { label: 'каркас 1',
            q: 'Тема: <i>Should museums be free?</i><br>Каркас: <i>While … , I would argue that …</i>',
            a: 'While free entry undoubtedly costs the state money, I would argue that the wider ' +
               'social return justifies the expense.',
            why: 'Уступка признаёт сильную сторону оппонента — это то, что дескрипторы называют ' +
                 '«well-developed response». Позиция при этом остаётся одна и ясная.' },
          { label: 'каркас 2',
            q: 'Тема: <i>Why do people move to cities?</i><br>Каркас: <i>The main reason for this is that …</i>',
            a: 'The main reason for this is that wages in urban areas remain substantially higher, ' +
               'even after the cost of housing is taken into account.',
            why: '«Even after … is taken into account» — то самое усложнение предложения, которое ' +
                 'видит Grammatical range. Тезис из-за него не стал длиннее по мысли, только точнее.' },
          { label: 'ловушка',
            q: 'Ученик начал эссе так: <i>In today’s fast-paced modern world, this is a topic ' +
               'that has generated considerable debate among people from all walks of life.</i>',
            a: 'Вычеркнут целиком: подходит к любой теме, содержания нет.',
            why: 'Двадцать три слова из 250 потрачены, а Task response не сдвинулся. ' +
                 'Тот же объём, потраченный на перефразирование самой темы, дал бы балл.' },
        ] },
      { type: 'terms', title: 'Каркасы, которые стоит знать наизусть', items: [
        { en: 'It is often argued that…', ru: 'Часто утверждают, что…', hint: 'вступление, вместо «Some people say»' },
        { en: 'While X, I would argue that Y', ru: 'Хотя X, я считаю, что Y', hint: 'уступка + позиция' },
        { en: 'The main reason for this is that…', ru: 'Главная причина в том, что…' },
        { en: 'This matters because…', ru: 'Это важно потому, что…', hint: 'вводит объяснение, а не повтор' },
        { en: 'A clear illustration of this is…', ru: 'Наглядный пример этого —', hint: 'вместо «For example»' },
        { en: 'Those who disagree point out that…', ru: 'Несогласные указывают, что…' },
        { en: 'On balance, the benefits outweigh…', ru: 'В целом польза перевешивает…', hint: 'вердикт' },
        { en: 'The evidence therefore suggests that…', ru: 'Всё это говорит о том, что…', hint: 'вывод' },
        { en: 'The chart compares… over a period of…', ru: 'График сравнивает… за период…', hint: 'Task 1' },
        { en: 'Overall, it is clear that…', ru: 'В целом видно, что…', hint: 'начало overview' },
        { en: 'The most striking change was…', ru: 'Самое заметное изменение —', hint: 'вторая строка overview' },
        { en: 'Looking at the figures in more detail,…', ru: 'Если посмотреть подробнее,…', hint: 'переход к телу' },
      ] },
      { type: 'quiz', q: 'Что из этого экзаменатор скорее всего не засчитает?',
        options: ['While cities offer more jobs, I would argue that the cost of living cancels this out.',
                  'It is undeniable that this issue has both positive and negative sides.',
                  'The main reason for this is that rents have risen faster than wages.'], answer: 1,
        explain: 'Второй вариант подходит к любой теме — значит, ничего не сообщает про эту. ' +
                 'Остальные два содержат мысль по вопросу.' },
      { type: 'quiz', q: 'Почему каркас «While X, I would argue that Y» можно учить, а «Nowadays this is a controversial issue» — нет?',
        options: ['Первый короче', 'Первый пустой без твоего содержания, второй уже несёт готовый смысл',
                  'Второй грамматически неверен'], answer: 1,
        explain: 'Заученным считается кусок, несущий содержание. Служебный каркас содержания не несёт.' },
    ],
  },

  {
    id: 'topic-lexis', group: GROUP, aspect: 'lexis',
    title: 'Лексика частых тем',
    subtitle: 'шесть тем, которые приходят чаще всего',
    steps: [
      { type: 'concept', lead: 'Тем в Task 2 много, но по-настоящему частых — примерно шесть.',
        text: 'Образование, работа, окружающая среда, технологии, здоровье, город и общество. ' +
              'Готовить содержание под каждую бессмысленно, а вот <b>15–20 точных слов на тему</b> ' +
              'окупаются сразу: именно точность лексики, а не редкость, поднимает Lexical resource. ' +
              '<i>Congestion</i> вместо <i>a lot of cars</i> — это плюс, а вычурное слово не по месту — минус.' },
      { type: 'terms', title: 'Образование и работа', items: [
        { en: 'the curriculum', ru: 'учебная программа', hint: 'не «programme of study»' },
        { en: 'compulsory / optional subjects', ru: 'обязательные / по выбору' },
        { en: 'rote learning', ru: 'зубрёжка', hint: 'частый минус в эссе про экзамены' },
        { en: 'critical thinking', ru: 'критическое мышление' },
        { en: 'vocational training', ru: 'профессиональное обучение', hint: 'противопоставляют академическому' },
        { en: 'tuition fees', ru: 'плата за обучение' },
        { en: 'graduate employability', ru: 'трудоустраиваемость выпускников' },
        { en: 'job security', ru: 'стабильность занятости' },
        { en: 'work–life balance', ru: 'баланс работы и жизни' },
        { en: 'burnout', ru: 'выгорание' },
        { en: 'the skills gap', ru: 'разрыв между навыками и спросом' },
        { en: 'automation', ru: 'автоматизация' },
      ] },
      { type: 'terms', title: 'Среда и город', items: [
        { en: 'carbon emissions', ru: 'выбросы углерода' },
        { en: 'renewable energy', ru: 'возобновляемая энергия' },
        { en: 'fossil fuels', ru: 'ископаемое топливо' },
        { en: 'landfill', ru: 'свалка, полигон отходов' },
        { en: 'single-use plastic', ru: 'одноразовый пластик' },
        { en: 'congestion', ru: 'пробки, перегруженность дорог', hint: 'одно слово вместо «too many cars»' },
        { en: 'urban sprawl', ru: 'расползание города' },
        { en: 'green spaces', ru: 'зелёные зоны' },
        { en: 'affordable housing', ru: 'доступное жильё' },
        { en: 'public transport network', ru: 'сеть общественного транспорта' },
        { en: 'biodiversity loss', ru: 'утрата биоразнообразия' },
        { en: 'a carbon footprint', ru: 'углеродный след' },
      ] },
      { type: 'terms', title: 'Технологии, здоровье, общество', items: [
        { en: 'screen time', ru: 'время у экрана' },
        { en: 'digital literacy', ru: 'цифровая грамотность' },
        { en: 'data privacy', ru: 'приватность данных' },
        { en: 'misinformation', ru: 'недостоверная информация', hint: 'точнее, чем «fake news»' },
        { en: 'a sedentary lifestyle', ru: 'сидячий образ жизни' },
        { en: 'preventive healthcare', ru: 'профилактическая медицина' },
        { en: 'life expectancy', ru: 'ожидаемая продолжительность жизни' },
        { en: 'an ageing population', ru: 'стареющее население' },
        { en: 'the welfare state', ru: 'социальное государство' },
        { en: 'social mobility', ru: 'социальная мобильность' },
        { en: 'income inequality', ru: 'неравенство доходов' },
        { en: 'civic participation', ru: 'гражданское участие' },
      ] },
      { type: 'note', html: 'Как это учить, чтобы работало: не списком, а <b>парами с глаголом</b>. ' +
              '<i>reduce congestion · cut emissions · widen the skills gap · tackle inequality · ' +
              'raise tuition fees</i>. Слово без сочетаемости на письме превращается в ошибку: ' +
              '«make a congestion» — это тот самый случай, когда редкое слово снижает балл.' },
      { type: 'markers', title: 'Глаголы, которые сочетаются почти со всем',
        chips: [
          { w: 'tackle', ru: 'взяться за (проблему)' },
          { w: 'address', ru: 'решать, обращаться к' },
          { w: 'curb', ru: 'обуздать, ограничить' },
          { w: 'ease', ru: 'смягчить' },
          { w: 'undermine', ru: 'подрывать' },
          { w: 'exacerbate', ru: 'усугублять' },
          { w: 'foster', ru: 'способствовать' },
          { w: 'prioritise', ru: 'ставить в приоритет' },
        ] },
      { type: 'drill', title: 'Скажи точнее',
        task: 'Замени расплывчатую фразу одним точным словом или устойчивым сочетанием.',
        items: [
          { label: 'замена 1', q: '<i>There are too many cars in the city centre.</i>',
            a: 'The city centre suffers from severe congestion.',
            why: 'Одно слово вместо описания. «Suffer from» — стандартная сочетаемость для проблем: ' +
                 'suffer from congestion / pollution / shortages.' },
          { label: 'замена 2', q: '<i>Poor people find it hard to move up in society.</i>',
            a: 'Social mobility remains limited for low-income households.',
            why: 'Понятие вместо описания и нейтральный регистр вместо «poor people» — ' +
                 'академический тон это и есть. «Low-income households» точнее: речь о семьях, а не о людях вообще.' },
          { label: 'замена 3', q: '<i>Factories put a lot of bad things into the air.</i>',
            a: 'Industrial activity is a major source of airborne pollutants.',
            why: '«Bad things» — детская лексика в эссе на 6+. Заметь, что конструкция тоже сменилась ' +
                 'на «is a source of», а это уже вклад в Grammatical range.' },
          { label: 'замена 4', q: '<i>The government should do something about house prices.</i>',
            a: 'Policymakers should act to improve the supply of affordable housing.',
            why: '«Do something» — признак того, что решения у автора нет. Конкретный глагол ' +
                 '(act to improve the supply) сразу показывает, о чём именно речь, и это оценивает ' +
                 'Task response, а не только лексика.' },
        ] },
      { type: 'quiz', q: 'Какая замена лучше для «there are a lot of cars»?',
        options: ['there is a big quantity of automobiles', 'traffic congestion is severe',
                  'there exist numerous vehicular units'], answer: 1,
        explain: 'Точное устойчивое сочетание. Два других — попытка звучать сложно, и обе звучат неестественно.' },
      { type: 'quiz', q: 'Почему редкое слово может снизить Lexical resource?',
        options: ['Редких слов вообще нельзя', 'Если нарушена сочетаемость или регистр — это ошибка, а не богатство',
                  'Экзаменатор их не знает'], answer: 1,
        explain: 'Критерий оценивает точность, а не редкость. Неверная сочетаемость считается ошибкой лексики.' },
    ],
  },

  {
    id: 'hedging', group: GROUP, aspect: 'lexis',
    title: 'Насколько сильно утверждать',
    subtitle: 'hedging · booster · почему осторожность звучит умнее',
    steps: [
      { type: 'concept', lead: 'Академическое письмо почти никогда не говорит «всегда» и «все».',
        text: 'Категоричное утверждение легко опровергнуть, поэтому в академическом тексте его ' +
              '<b>смягчают</b>: <i>tends to · is likely to · in most cases</i>. Это называется hedging, ' +
              'и это одна из самых дешёвых прибавок к Lexical resource: слова простые, ' +
              'а текст сразу звучит взрослее. Обратный инструмент — booster ' +
              '(<i>clearly · undoubtedly</i>) — для мест, где ты действительно уверен.' },
      { type: 'scale', title: 'Шкала уверенности',
        rows: [
          { d: '100%', kind: 'up',   en: 'invariably · without exception', ru: 'без исключений — почти никогда не оправдано' },
          { d: '90%',  kind: 'up',   en: 'clearly · undoubtedly · certainly', ru: 'booster: там, где спорить не о чем' },
          { d: '70%',  kind: '',     en: 'generally · in most cases · as a rule', ru: 'рабочая зона' },
          { d: '60%',  kind: '',     en: 'tends to · is likely to · often', ru: 'рабочая зона' },
          { d: '40%',  kind: 'down', en: 'may · might · can', ru: 'возможность, не утверждение' },
          { d: '20%',  kind: 'down', en: 'it is possible that · arguably', ru: 'осторожно, когда доказать нечем' },
        ] },
      { type: 'vs',
        left:  { tag: 'легко опровергнуть',
                 en: 'Social media destroys teenagers’ concentration and makes them unable to study.',
                 ru: 'Достаточно одного контрпримера, чтобы утверждение развалилось. ' +
                     'Экзаменатор читает это как неточность, а не как силу.' },
        right: { tag: 'защищено',
                 en: 'Heavy social media use tends to fragment attention, and this appears to affect ' +
                     'younger users most.',
                 ru: 'Три смягчения (heavy, tends to, appears to) — и утверждение стало ' +
                     'и точнее, и труднее опровергнуть. Слова при этом простейшие.' } },
      { type: 'drill', title: 'Смягчи утверждение',
        task: 'Переделай категоричную фразу так, чтобы её нельзя было опрокинуть одним контрпримером. ' +
              'Ограничение: не длиннее исходной больше чем на пять слов.',
        items: [
          { label: 'смягчение 1', q: '<i>People who study abroad always find better jobs.</i>',
            a: 'Graduates who study abroad tend to have better job prospects.',
            why: 'always → tend to и find better jobs → have better job prospects. Второе смягчение ' +
                 'важнее первого: «prospects» говорит о вероятности, а не о факте.' },
          { label: 'смягчение 2', q: '<i>Video games cause violent behaviour in children.</i>',
            a: 'Some research suggests a link between violent games and aggression in younger children.',
            why: 'Причинность («cause») заменена связью («a link») — это ровно та разница, ' +
                 'которую делают в научном тексте. Плюс указан источник утверждения ' +
                 '(«some research suggests»), а не подано как общеизвестное.' },
          { label: 'обратный ход', q: '<i>It is possible that clean water might perhaps be somewhat ' +
               'important for public health.</i>',
            a: 'Access to clean water is clearly essential to public health.',
            why: 'Смягчать очевидное — тоже ошибка: текст начинает звучать неуверенно везде, ' +
                 'и сильные места теряют вес. Здесь нужен booster, а не hedge.' },
        ] },
      { type: 'terms', title: 'Смягчение и усиление', items: [
        { en: 'tend to', ru: 'обычно, склонны', hint: 'самое рабочее смягчение: короткое и незаметное' },
        { en: 'be likely to', ru: 'скорее всего' },
        { en: 'in most cases', ru: 'в большинстве случаев' },
        { en: 'to some extent', ru: 'в какой-то мере' },
        { en: 'appear to / seem to', ru: 'по-видимому' },
        { en: 'arguably', ru: 'можно утверждать, что', hint: 'даёт заявить сильное без доказательства' },
        { en: 'a contributing factor', ru: 'один из факторов', hint: 'вместо «the cause»' },
        { en: 'be associated with', ru: 'связано с', hint: 'связь, а не причинность' },
        { en: 'clearly / undoubtedly', ru: 'очевидно, несомненно', hint: 'booster — экономно' },
        { en: 'far from certain', ru: 'далеко не очевидно' },
      ] },
      { type: 'note', html: 'Практический ориентир: <b>одно смягчение на утверждение</b>. Три подряд ' +
              '(«it may possibly perhaps be…») читаются как неуверенность в собственном английском ' +
              'и снижают балл так же, как категоричность.' },
      { type: 'quiz', q: 'Какой вариант сильнее с точки зрения экзаменатора?',
        options: ['Technology always improves education.', 'Technology tends to improve access to education.',
                  'Technology may possibly perhaps improve education somewhat.'], answer: 1,
        explain: 'Первый опровергается контрпримером, третий — нагромождение смягчений. ' +
                 'Второй точен: одно смягчение и уточнённый объект (access to education).' },
      { type: 'quiz', q: 'Чем заменить «causes», если доказательств причинности нет?',
        options: ['is associated with', 'definitely makes', 'always leads to'], answer: 0,
        explain: '«Is associated with» заявляет связь, не утверждая причину, — стандартный ход академического письма.' },
    ],
  },

  {
    id: 'academic-tone', group: GROUP, aspect: 'lexis',
    title: 'Регистр: разговорное в академическое',
    subtitle: 'что вычёркивать не глядя',
    steps: [
      { type: 'concept', lead: 'Балл снимают не за незнание слов, а за не тот регистр.',
        text: 'Task 2 — это <b>полуформальное академическое эссе</b>. Разговорные слова, сокращения ' +
              'и обращения к читателю в нём читаются как ошибка стиля. Хорошая новость: ' +
              'список того, что надо вычеркнуть, короткий и закрывается за один заход.' },
      { type: 'table', title: 'Замены, которые работают всегда', cols: ['Вместо этого'],
        rows: [
          { label: '<i>a lot of / lots of</i>', cells: ['<i>a considerable number of · a great deal of</i>'] },
          { label: '<i>big / huge</i>', cells: ['<i>substantial · significant · considerable</i>'] },
          { label: '<i>get</i>', cells: ['<i>obtain · receive · become</i> — смотря по смыслу'] },
          { label: '<i>kids</i>', cells: ['<i>children · young people</i>'] },
          { label: '<i>things / stuff</i>', cells: ['<i>factors · aspects · issues</i>'] },
          { label: '<i>bad / good</i>', cells: ['<i>harmful · detrimental / beneficial · valuable</i>'] },
          { label: '<i>nowadays</i>', cells: ['<i>in recent decades · over the past twenty years</i>'] },
          { label: '<i>people think</i>', cells: ['<i>it is widely held that · many argue that</i>'] },
          { label: '<i>and so on / etc.</i>', cells: ['убрать: перечислять надо конечным списком'] },
          { label: '<i>don’t · isn’t · it’s</i>', cells: ['писать полностью: <i>do not · is not · it is</i>'] },
        ] },
      { type: 'mistake', pairs: [
        { bad: 'You should always recycle your rubbish.',
          good: 'Households should be encouraged to recycle waste.',
          why: 'Обращение к читателю на «ты» в академическом эссе неуместно. Подлежащим делают того, ' +
               'о ком речь: households, governments, employers.' },
        { bad: 'In my opinion, I think that this is a bad thing.',
          good: 'In my view, this development is harmful.',
          why: 'Двойное «по-моему» (in my opinion + I think) — избыточность. И «bad thing» ' +
               'ничего не сообщает: чем именно плохо?' },
        { bad: 'Nowadays, technology is developing so fast, isn’t it?',
          good: 'Technology has advanced rapidly over the past two decades.',
          why: 'Разделительный вопрос — устная конструкция. И «nowadays» лучше заменять ' +
               'конкретным периодом: он точнее и звучит взрослее.' },
        { bad: 'Governments should give more money for education, sports, healthcare and so on.',
          good: 'Governments should increase spending on education and healthcare in particular.',
          why: '«And so on» показывает, что список кончился раньше мысли. Лучше назвать два пункта ' +
               'и раскрыть их, чем перечислить пять и не раскрыть ни одного.' },
      ] },
      { type: 'drill', title: 'Перепиши в академический регистр',
        task: 'Смени регистр, не меняя смысла. Длиннее делать не обязательно — часто выходит короче.',
        items: [
          { label: 'регистр 1', q: '<i>Lots of kids these days spend a huge amount of time on their phones.</i>',
            a: 'Many children now spend a considerable amount of time on mobile devices.',
            why: 'lots of → many · kids → children · these days → now · huge → considerable · ' +
                 'phones → mobile devices. Пять точечных замен, конструкция та же — и предложение ' +
                 'сменило уровень.' },
          { label: 'регистр 2', q: '<i>I think the government should do something about this problem ASAP.</i>',
            a: 'In my view, this issue requires immediate government action.',
            why: '«Do something» → «requires action», ASAP → immediate. Заодно ушёл разговорный порядок: ' +
                 'подлежащим стала проблема, а не «правительство должно».' },
          { label: 'регистр 3', q: '<i>It’s a well-known fact that everybody knows smoking is bad for you.</i>',
            a: 'The harmful effects of smoking are well documented.',
            why: 'Тавтология («well-known fact» + «everybody knows») убрана целиком, «bad for you» — ' +
                 'разговорное. Пассив здесь на месте: важен факт, а не кто его установил.' },
        ] },
      { type: 'note', warn: true, html: 'Три вещи, за которые снимают почти автоматически: ' +
              '<b>сокращения</b> (don’t, it’s), <b>обращение к читателю</b> (you should) ' +
              'и <b>восклицательные знаки</b>. Ни одна из них не про знание английского — ' +
              'и все три легко убираются на вычитке.' },
      { type: 'quiz', q: 'Что из этого уместно в Task 2?',
        options: ['Isn’t it obvious that this is wrong?', 'It is widely held that this approach is flawed.',
                  'You know that this is a bad idea.'], answer: 1,
        explain: 'Первый — разделительный вопрос, третий — обращение к читателю. Оба устные.' },
      { type: 'quiz', q: 'Чем заменить «nowadays» в начале эссе?',
        options: ['In today’s modern world', 'In recent decades / over the past twenty years', 'Ничем, оно нормальное'], answer: 1,
        explain: '«Nowadays» не ошибка, но затёрто; конкретный период точнее. «In today’s modern world» — ' +
                 'тавтология и типичный заученный оборот.' },
    ],
  },

  {
    id: 'common-errors', group: GROUP, aspect: 'grammar',
    title: 'Ошибки, которые стоят балла',
    subtitle: 'артикли · исчисляемость · согласование',
    steps: [
      { type: 'concept', lead: 'На 6.5 и 7 разница часто не в словах, а в количестве мелких ошибок.',
        text: 'Критерий называется <b>Grammatical range and accuracy</b> — и вторая половина ' +
              'работает жёстко: балл 7 требует, чтобы <b>большинство предложений были без ошибок</b>. ' +
              'У русскоговорящих набор промахов очень предсказуемый — и потому дешёвый в починке.' },
      { type: 'mistake', pairs: [
        { bad: 'Government should invest in education.',
          good: 'The government should invest in education. / Governments should…',
          why: 'Артикли — ошибка номер один. Правило-минимум: конкретный, известный из контекста ' +
               'объект → the; вообще про всех → множественное без артикля.' },
        { bad: 'I have many informations about this problem.',
          good: 'I have a great deal of information about this problem.',
          why: 'Information, research, advice, knowledge, equipment, evidence — неисчисляемые. ' +
               'Ни -s, ни «many», ни «a».' },
        { bad: 'The amount of people is increasing.',
          good: 'The number of people is increasing.',
          why: 'Amount — для неисчисляемого (the amount of water), number — для исчисляемого. ' +
               'Ошибка заметная и очень частая.' },
        { bad: 'Every students must attend the lectures.',
          good: 'Every student must attend the lectures. / All students must…',
          why: 'Every и each требуют единственного числа. Хочется множественного — бери all.' },
        { bad: 'This tendency is growing since 2010.',
          good: 'This tendency has been growing since 2010.',
          why: 'Since требует перфекта. Present Continuous с since — одна из самых узнаваемых ошибок.' },
        { bad: 'People which live in cities…',
          good: 'People who live in cities…',
          why: 'Who — для людей, which — для вещей, that — для обоих в определительных придаточных.' },
        { bad: 'It depends from the situation.',
          good: 'It depends on the situation.',
          why: 'Предлог тянется из русского («зависит от»). Тот же случай: influence on, ' +
               'reason for, solution to, increase in.' },
        { bad: 'In conclusion, I want to say that the advantages are more than disadvantages.',
          good: 'In conclusion, the advantages clearly outweigh the disadvantages.',
          why: '«I want to say that» — пустой оборот, «more than» вместо outweigh — калька. ' +
               'Вывод короче и точнее без обоих.' },
      ] },
      { type: 'table', title: 'Предлоги, которые тянет из русского', cols: ['Верно'],
        rows: [
          { label: '<i>depend from</i>', cells: ['<i>depend <b>on</b></i>'] },
          { label: '<i>influence on smth (глагол)</i>', cells: ['<i>influence smth</i> · но <i>an influence <b>on</b></i>'] },
          { label: '<i>reason of</i>', cells: ['<i>reason <b>for</b></i>'] },
          { label: '<i>solution of</i>', cells: ['<i>solution <b>to</b></i>'] },
          { label: '<i>increase of 10%</i>', cells: ['<i>increase <b>of</b> 10%</i> (сущ.) · <i>increase <b>by</b> 10%</i> (глагол)'] },
          { label: '<i>in the same time</i>', cells: ['<i><b>at</b> the same time</i>'] },
          { label: '<i>on my opinion</i>', cells: ['<i><b>in</b> my opinion</i>'] },
          { label: '<i>discuss about</i>', cells: ['<i>discuss</i> — без предлога вообще'] },
        ] },
      { type: 'note', html: 'Вычитка за пять минут по фиксированному списку ловит больше, чем чтение ' +
              '«на общее впечатление». Порядок такой: <b>1)</b> окончания -s у глаголов в третьем лице ' +
              'и у множественного числа · <b>2)</b> артикли перед каждым существительным · ' +
              '<b>3)</b> времена: не съехал ли с прошедшего на настоящее · <b>4)</b> предлоги ' +
              'из списка выше.' },
      { type: 'drill', title: 'Найди и почини',
        task: 'В каждом предложении ровно одна ошибка. Найди её, потом сверься с разбором.',
        items: [
          { label: 'ошибка 1', q: '<i>The number of students who studies abroad has doubled.</i>',
            a: '<i>who <b>study</b> abroad</i> — сказуемое согласуется со students, а не с number.',
            why: 'Придаточное относится к students (множественное). Классическая ловушка: ' +
                 'рядом стоит «the number», и рука сама пишет -s.' },
          { label: 'ошибка 2', q: '<i>Many researches show that sleep affects memory.</i>',
            a: '<i>Much <b>research</b> shows…</i> — research неисчисляемое.',
            why: 'Заодно поменялось и сказуемое: research в единственном числе, значит shows. ' +
                 'Одна ошибка в исчисляемости тянет за собой вторую в согласовании.' },
          { label: 'ошибка 3', q: '<i>Since 2015 the city is building a new metro line.</i>',
            a: '<i>Since 2015 the city <b>has been building</b> a new metro line.</i>',
            why: 'Since всегда требует перфекта. Present Continuous здесь читается как ошибка ' +
                 'времени — а времена в дескрипторах названы прямо.' },
          { label: 'ошибка 4', q: '<i>This solution of the problem is too expensive.</i>',
            a: '<i>This solution <b>to</b> the problem is too expensive.</i>',
            why: 'Solution to, а не of. Предлог тянется из русского «решение проблемы».' },
        ] },
      { type: 'quiz', q: 'Какое предложение без ошибки?',
        options: ['The amount of people who lives here is growing.',
                  'The number of people who live here is growing.',
                  'The number of people who lives here are growing.'], answer: 1,
        explain: 'Number — для исчисляемого, «who live» согласуется с people, «is growing» — с number.' },
      { type: 'quiz', q: '<i>Since 2010 the population ____ by 15%.</i>',
        options: ['is growing', 'has grown', 'grows'], answer: 1,
        explain: 'Since требует перфекта: has grown.' },
      { type: 'quiz', q: 'Что верно?',
        options: ['It depends from the situation.', 'It depends of the situation.', 'It depends on the situation.'], answer: 2,
        explain: 'Depend on. Предлог здесь калькируется из русского чаще всего.' },
    ],
  },
];
