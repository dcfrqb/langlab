/* ============================================================
   ALGORITHM — Шок: куда двигаться дальше.
   Источник: FA Clinical Algorithms 2024, 10-3 Shock, стр. 365.

   Дерево решений, а не картинка: движок ведёт по одной развилке
   за раз, поэтому важно, чтобы у каждого узла был ровно один вопрос.
   Термины — по-английски (как на экзамене), разбор — по-русски.
   ============================================================ */

export const algorithm = {
  id: 'shock',
  title: 'Шок',
  titleEn: 'Shock',
  subject: 'surgery',
  lede: 'Первая развилка — рука на коже больного: тёплая и сухая или холодная и липкая. ' +
        'Она делит все шоки на две половины ещё до анализов.',
  source: { book: 'fa-algorithms-2024', section: '10-3-shock', page: 365 },
  start: 'shock',

  /* сноски книги — своими словами, чтобы не гонять человека вниз страницы */
  notes: {
    shock: 'Состояние, при котором доставка или утилизация кислорода падает настолько, ' +
           'что начинают страдать органы.',
    neurogenic: 'Причины — травма спинного мозга, поперечный миелит.',
    allergens: 'Чаще всего на экзамене: морепродукты, орехи, препараты крови. ' +
               'Симптомы от выброса гистамина: уртикарная сыпь, гипотензия, свистящее дыхание.',
    pcwp: 'PCWP — давление заклинивания лёгочных капилляров: косвенно показывает ' +
          'давление наполнения левого предсердия.',
    pump: 'За «насос виноват» говорят недавний ИМ, тупая травма сердца, свежий грубый шум.',
    pci: 'PCI — чрескожное коронарное вмешательство.',
    virchow: 'Триада Вирхова — три условия тромбоза: венозный застой, повреждение сосуда, ' +
             'гиперкоагуляция.',
    beck: 'Триада Бека: гипотензия, ↑ JVP, приглушённые тоны сердца.',
  },

  /* kind: root · finding (что видим) · test (что делаем, чтобы увидеть) ·
     dx (диагноз) · tx (лечение). Ветка обязана кончаться на dx или tx. */
  nodes: [
    { id: 'shock', kind: 'root', label: 'Шок', labelEn: 'Shock', note: 'shock',
      ask: 'Какая у больного кожа?',
      next: [
        { to: 'cold-skin', label: 'холодная, липкая', labelEn: 'Cold, clammy skin' },
        { to: 'warm-skin', label: 'тёплая, сухая', labelEn: 'Warm dry skin' },
      ] },

    /* ---------- холодная кожа: насос или объём ---------- */
    { id: 'cold-skin', kind: 'finding', label: 'Кожа холодная, липкая', labelEn: 'Cold, clammy skin',
      why: 'Периферия зажата — сосуды сужены, значит проблема в объёме или в насосе.',
      ask: 'Что с венами шеи?',
      next: [
        { to: 'jvd', label: 'набухшие', labelEn: 'Distended neck veins' },
        { to: 'flat-neck-veins', label: 'спавшиеся', labelEn: 'Flat neck veins' },
      ] },

    { id: 'flat-neck-veins', kind: 'finding', label: 'Вены шеи спавшиеся', labelEn: 'Flat neck veins',
      why: 'Наполнять нечем — крови в системе мало.',
      next: [{ to: 'hypovolemic' }] },
    { id: 'hypovolemic', kind: 'dx', label: 'Гиповолемический шок', labelEn: 'Hypovolemic Shock',
      next: [{ to: 'hypovolemic-tx' }] },
    { id: 'hypovolemic-tx', kind: 'tx', label: 'Инфузия; при кровотечении — препараты крови',
      labelEn: 'IV fluids, blood products if hemorrhagic' },

    { id: 'jvd', kind: 'finding', label: 'Вены шеи набухшие', labelEn: 'Distended neck veins',
      why: 'Объём есть, но кровь не идёт вперёд — насос или помеха вокруг него.',
      next: [{ to: 'swan-ganz' }] },
    { id: 'swan-ganz', kind: 'test', label: 'Катетеризация Свана–Ганца', labelEn: 'Swan-Ganz catheterization',
      next: [{ to: 'pcwp-up' }] },
    { id: 'pcwp-up', kind: 'finding', label: '↑ PCWP', labelEn: '↑ PCWP', note: 'pcwp',
      next: [{ to: 'pump-function' }] },

    { id: 'pump-function', kind: 'finding', label: 'Есть ли основания винить сам насос?',
      labelEn: 'Concern for pump function', note: 'pump',
      ask: 'Сердце как насос скомпрометировано?',
      next: [
        { to: 'cardiogenic', label: 'да', labelEn: '+' },
        { to: 'obstructive', label: 'нет', labelEn: '−' },
      ] },

    { id: 'cardiogenic', kind: 'dx', label: 'Кардиогенный шок', labelEn: 'Cardiogenic Shock',
      next: [{ to: 'cardiogenic-tx' }] },
    { id: 'cardiogenic-tx', kind: 'tx', label: 'PCI, инотропы, диурез',
      labelEn: 'PCI, inotropes, diuresis', note: 'pci' },

    /* ---------- обструктивный: три помехи вокруг сердца ---------- */
    { id: 'obstructive', kind: 'dx', label: 'Обструктивный шок', labelEn: 'Obstructive Shock',
      why: 'Насос цел, но ему мешают снаружи — ищем чем именно.',
      ask: 'Что ещё находим?',
      next: [
        { to: 'becks-triad', label: 'триада Бека', labelEn: "Beck's triad" },
        { to: 'tension-ptx-signs', label: 'односторонне ослабленное дыхание, тимпанит',
          labelEn: '↑ JVP, unilaterally diminished breath sounds, hyperresonance' },
        { to: 'pe-signs', label: 'внезапная плевральная боль, тахикардия, одышка',
          labelEn: 'Sudden-onset pleuritic chest pain, tachycardia, respiratory alkalosis, dyspnea' },
      ] },

    { id: 'becks-triad', kind: 'finding', label: 'Триада Бека', labelEn: "Beck's triad", note: 'beck',
      next: [{ to: 'tamponade' }] },
    { id: 'tamponade', kind: 'dx', label: 'Тампонада сердца', labelEn: 'Cardiac Tamponade',
      next: [{ to: 'tamponade-tx' }] },
    { id: 'tamponade-tx', kind: 'tx', label: 'Перикардиоцентез', labelEn: 'Pericardiocentesis' },

    { id: 'tension-ptx-signs', kind: 'finding',
      label: '↑ JVP, дыхание ослаблено с одной стороны, коробочный звук',
      labelEn: '↑ JVP, unilaterally diminished breath sounds, hyperresonance to percussion',
      next: [{ to: 'tension-ptx' }] },
    { id: 'tension-ptx', kind: 'dx', label: 'Напряжённый пневмоторакс', labelEn: 'Tension Pneumothorax',
      next: [{ to: 'tension-ptx-tx' }] },
    { id: 'tension-ptx-tx', kind: 'tx', label: 'Игольчатая декомпрессия, затем дренаж',
      labelEn: 'Needle decompression, then chest tube' },

    { id: 'pe-signs', kind: 'finding',
      label: 'Внезапная плевральная боль, тахикардия, респираторный алкалоз, одышка, триада Вирхова',
      labelEn: "Sudden-onset pleuritic chest pain, tachycardia, respiratory alkalosis, dyspnea, Virchow's triad",
      note: 'virchow',
      next: [{ to: 'pe' }] },
    { id: 'pe', kind: 'dx', label: 'ТЭЛА', labelEn: 'Pulmonary Embolism',
      ask: 'Стабильна ли гемодинамика?',
      next: [
        { to: 'heparin', label: 'стабилен', labelEn: 'Hemodynamically stable' },
        { to: 'tpa', label: 'нестабилен', labelEn: 'Hemodynamically unstable' },
        { to: 'embolectomy', label: 'нестабилен + недавнее кровотечение или большая операция',
          labelEn: 'Hemodynamically unstable with recent bleed or major surgery' },
      ] },
    { id: 'heparin', kind: 'tx', label: 'Гепарин', labelEn: 'Heparin' },
    { id: 'tpa', kind: 'tx', label: 'tPA', labelEn: 'tPA' },
    { id: 'embolectomy', kind: 'tx', label: 'Эмболэктомия', labelEn: 'Embolectomy' },

    /* ---------- тёплая кожа: сосуды раскрыты ---------- */
    { id: 'warm-skin', kind: 'finding', label: 'Кожа тёплая, сухая', labelEn: 'Warm dry skin',
      why: 'Сосуды расширены — кровь ушла на периферию.',
      next: [{ to: 'distributive' }] },
    { id: 'distributive', kind: 'dx', label: 'Дистрибутивный шок', labelEn: 'Distributive Shock',
      ask: 'Что раскрыло сосуды?',
      next: [
        { to: 'sympathetic-loss', label: 'потеря симпатического тонуса',
          labelEn: 'Loss of sympathetic tone (bradycardia + hypotension)' },
        { to: 'infectious-signs', label: 'признаки инфекции', labelEn: 'Infectious signs' },
        { to: 'allergen-exposure', label: 'контакт с аллергеном + аллергические симптомы',
          labelEn: 'Exposure to allergen + allergic symptoms' },
      ] },

    { id: 'sympathetic-loss', kind: 'finding', label: 'Потеря симпатического тонуса: брадикардия + гипотензия',
      labelEn: 'Loss of sympathetic tone (bradycardia + hypotension)', note: 'neurogenic',
      why: 'Единственный шок, где сердце не разгоняется в ответ на падение давления.',
      next: [{ to: 'neurogenic' }] },
    { id: 'neurogenic', kind: 'dx', label: 'Нейрогенный шок', labelEn: 'Neurogenic Shock',
      next: [{ to: 'neurogenic-tx' }] },
    { id: 'neurogenic-tx', kind: 'tx', label: 'Инфузия ± вазопрессоры', labelEn: 'IV fluids ± pressors' },

    { id: 'infectious-signs', kind: 'finding', label: 'Признаки инфекции', labelEn: 'Infectious signs',
      next: [{ to: 'septic' }] },
    { id: 'septic', kind: 'dx', label: 'Септический шок', labelEn: 'Septic Shock',
      next: [{ to: 'septic-tx' }] },
    { id: 'septic-tx', kind: 'tx', label: 'Антибиотики, инфузия ± вазопрессоры, ранняя санация очага',
      labelEn: 'Antibiotics, IV fluids ± pressors, early source control' },

    { id: 'allergen-exposure', kind: 'finding', label: 'Контакт с аллергеном + аллергические симптомы',
      labelEn: 'Exposure to allergen + allergic symptoms', note: 'allergens',
      next: [{ to: 'anaphylactic' }] },
    { id: 'anaphylactic', kind: 'dx', label: 'Анафилактический шок', labelEn: 'Anaphylactic Shock',
      next: [{ to: 'anaphylactic-tx' }] },
    { id: 'anaphylactic-tx', kind: 'tx', label: 'Адреналин внутримышечно', labelEn: 'IM epinephrine' },
  ],
};
