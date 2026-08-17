/* ============================================================
   ALGORITHM — Брадиаритмии: как дифференцировать.
   Источник: FA Clinical Algorithms 2024, 1-16, стр. 30.

   Три ветки от ЭКГ: предсердие · АВ-узел · система Гиса-Пуркинье.
   Дальше внутри каждой — свой признак на плёнке.
   ============================================================ */

export const algorithm = {
  id: 'bradyarrhythmias',
  title: 'Брадиаритмии',
  titleEn: 'Bradyarrhythmias',
  subject: 'cardio',
  lede: 'Всё начинается с одного вопроса к плёнке: где сломалось проведение — ' +
        'в предсердии, в АВ-узле или ниже, в системе Гиса-Пуркинье.',
  source: { book: 'fa-algorithms-2024', section: '1-16-bradyarrhythmias', page: 30 },
  start: 'symptoms',

  notes: {
    reversible: 'Обратимые причины ищут всегда до кардиостимулятора: ишемия (нижний ИМ), ' +
                'урежающие препараты (CCB, бета-блокаторы), гипотиреоз.',
    lph: '⚠️ В книге у обоих гемиблоков написано «left axis deviation». Для левого заднего ' +
         'гемиблока классически описывают отклонение оси ВПРАВО — сверься с оригиналом, ' +
         'похоже на опечатку издания.',
    bifascicular: 'Бифасцикулярный блок = БПНПГ + блокада одной из ветвей левой ножки.',
    trifascicular: 'Трифасцикулярный — к бифасцикулярному добавляется удлинение PR.',
  },

  nodes: [
    { id: 'symptoms', kind: 'root', label: 'Сердцебиение, синкопе, утомляемость',
      labelEn: 'Palpitations, Syncope, Fatigue',
      next: [{ to: 'ekg' }] },
    { id: 'ekg', kind: 'test', label: 'ЭКГ', labelEn: 'EKG',
      ask: 'Где сломалось проведение?',
      next: [
        { to: 'atrial', label: 'в предсердии', labelEn: 'Atrial origin' },
        { to: 'av', label: 'в АВ-узле', labelEn: 'AV origin' },
        { to: 'his', label: 'ниже, в системе Гиса-Пуркинье', labelEn: 'His-Purkinje conduction abnormalities' },
      ] },

    /* ---------- предсердие ---------- */
    { id: 'atrial', kind: 'finding', label: 'Предсердное происхождение', labelEn: 'Atrial origin',
      ask: 'Что на плёнке?',
      next: [
        { to: 'p-every-qrs', label: 'P перед каждым QRS, ЧСС <60', labelEn: 'P before every QRS, HR <60' },
        { to: 'p-absent', label: 'выпадение синусовых P дольше 3 с', labelEn: 'Transient absence of sinus P waves >3 sec' },
        { to: 'tachy-brady-sign', label: 'тахиаритмия с нарушенным СА-АВ проведением',
          labelEn: 'Tachyarrhythmia (Afib, Flutter, etc.) with abnormal SA-AV conduction' },
      ] },

    { id: 'p-every-qrs', kind: 'finding', label: 'P перед каждым QRS, ЧСС <60',
      labelEn: 'P before every QRS, HR <60', next: [{ to: 'sinus-brady' }] },
    { id: 'sinus-brady', kind: 'dx', label: 'Синусовая брадикардия', labelEn: 'Sinus Bradycardia',
      next: [{ to: 'reversible-workup' }] },

    { id: 'p-absent', kind: 'finding', label: 'Синусовые P пропадают дольше 3 секунд',
      labelEn: 'Transient absence of sinus P waves >3 sec', next: [{ to: 'sinus-pause' }] },
    { id: 'sinus-pause', kind: 'dx', label: 'Синусовая пауза / арест', labelEn: 'Sinus Pause/Arrest',
      next: [{ to: 'reversible-workup' }] },

    { id: 'tachy-brady-sign', kind: 'finding', label: 'Тахиаритмия с нарушенным СА-АВ проведением',
      labelEn: 'Tachyarrhythmia (Afib, Flutter, etc.) with abnormal SA-AV conduction',
      next: [{ to: 'tachy-brady' }] },
    { id: 'tachy-brady', kind: 'dx', label: 'Синдром тахи-бради', labelEn: 'Tachy-Brady Syndrome',
      next: [{ to: 'pacemaker' }] },

    { id: 'reversible-workup', kind: 'test', note: 'reversible',
      label: 'Тропонины (нижний ИМ), ревизия препаратов (CCB, ББ), ТТГ',
      labelEn: 'Troponins (inferior MI), medication review (CCB, BB), TSH (hypothyroidism)',
      ask: 'Что дальше — по причине и по состоянию?',
      next: [
        { to: 'no-reversible', label: 'обратимой причины нет', labelEn: '− No other reversible causes' },
        { to: 'asympt-stable', label: 'без симптомов, гемодинамика стабильна',
          labelEn: 'Asymptomatic and hemodynamically stable' },
        { to: 'unstable', label: 'симптомы или нестабильная гемодинамика',
          labelEn: 'Symptomatic or hemodynamic instability' },
        { to: 'long-pauses', label: 'паузы >3 с или ЧСС <40', labelEn: 'Pauses >3 seconds or HR <40' },
      ] },

    { id: 'no-reversible', kind: 'finding', label: 'Других обратимых причин нет',
      labelEn: 'No other reversible causes', next: [{ to: 'sick-sinus' }] },
    { id: 'sick-sinus', kind: 'dx', label: 'Синдром слабости синусового узла', labelEn: 'Sick Sinus Syndrome',
      next: [{ to: 'pacemaker' }] },

    { id: 'asympt-stable', kind: 'finding', label: 'Без симптомов, гемодинамика стабильна',
      labelEn: 'Asymptomatic and hemodynamically stable', next: [{ to: 'treat-cause' }] },
    { id: 'unstable', kind: 'finding', label: 'Симптомы или нестабильная гемодинамика',
      labelEn: 'Symptomatic or hemodynamic instability', next: [{ to: 'acls' }] },
    { id: 'long-pauses', kind: 'finding', label: 'Паузы дольше 3 секунд или ЧСС <40',
      labelEn: 'Pauses >3 seconds or HR <40', next: [{ to: 'pacemaker' }] },

    /* ---------- АВ-узел ---------- */
    { id: 'av', kind: 'finding', label: 'АВ-происхождение', labelEn: 'AV origin',
      ask: 'Как проводится P?',
      next: [
        { to: 'pr-long', label: 'PR >200 мс, но проводится всё', labelEn: 'PR >200 ms' },
        { to: 'p-dropped', label: 'часть P не доходит до QRS', labelEn: 'Intermittent P waves not followed by QRS' },
        { to: 'av-dissoc', label: 'не проводится ни одна P', labelEn: 'Complete absence of conducted P waves (AV dissociation)' },
      ] },

    { id: 'pr-long', kind: 'finding', label: 'PR больше 200 мс', labelEn: 'PR >200 ms',
      next: [{ to: 'first-degree' }] },
    { id: 'first-degree', kind: 'dx', label: 'АВ-блокада 1 степени', labelEn: '1st Degree Block',
      next: [{ to: 'lyme-workup' }] },
    { id: 'lyme-workup', kind: 'test',
      label: 'Титры на боррелиоз, инфильтративные болезни сердца, ревизия препаратов (ББ, CCB)',
      labelEn: 'Lyme titers, infiltrative heart disease, medication review (BB, CCB)',
      ask: 'Причина нашлась?',
      next: [
        { to: 'no-treatment', label: 'нет', labelEn: '−' },
        { to: 'treat-cause-1', label: 'да', labelEn: '+' },
      ] },
    { id: 'no-treatment', kind: 'tx', label: 'Лечение не требуется', labelEn: 'No treatment required' },
    { id: 'treat-cause-1', kind: 'tx', label: 'Лечить причину: ИМ, щитовидная железа, препараты, инфекции',
      labelEn: 'Treat underlying cause (MI, thyroid disease, medications, infections)' },

    { id: 'p-dropped', kind: 'finding', label: 'Отдельные P не проводятся',
      labelEn: 'Intermittent P waves not followed by QRS', next: [{ to: 'second-degree' }] },
    { id: 'second-degree', kind: 'dx', label: 'АВ-блокада 2 степени', labelEn: '2nd Degree AV Block',
      next: [{ to: 'med-review' }] },
    { id: 'med-review', kind: 'test', label: 'Ревизия препаратов (дигоксин, CCB, ББ), тропонины (правый ИМ)',
      labelEn: 'Medication review (digoxin, CCB, BB), troponins (right MI)',
      ask: 'Как ведёт себя интервал P-R перед выпадением?',
      next: [
        { to: 'pr-lengthens', label: 'удлиняется от цикла к циклу',
          labelEn: 'Progressively ↑ P-R interval until dropped beat' },
        { to: 'pr-constant', label: 'постоянный, выпадение внезапное',
          labelEn: 'Constant P-R in conducted beats, RR interval contains dropped beat = 2 P-P intervals' },
      ] },
    { id: 'pr-lengthens', kind: 'finding', label: 'P-R удлиняется, пока удар не выпадет',
      labelEn: 'Progressively ↑ P-R interval until dropped beat', next: [{ to: 'mobitz1' }] },
    { id: 'mobitz1', kind: 'dx', label: 'Мобитц I (Венкебах)', labelEn: 'Mobitz type I (Wenckebach)',
      ask: 'Есть симптомы?',
      next: [
        { to: 'mobitz1-asympt', label: 'нет', labelEn: 'Asymptomatic' },
        { to: 'mobitz1-sympt', label: 'сердцебиение, синкопе', labelEn: 'Symptoms (palpitations, syncope)' },
      ] },
    { id: 'mobitz1-asympt', kind: 'finding', label: 'Без симптомов', labelEn: 'Asymptomatic',
      next: [{ to: 'treat-cause-m1' }] },
    { id: 'treat-cause-m1', kind: 'tx', label: 'Лечить причину: ИМ, щитовидная железа, препараты, инфекции',
      labelEn: 'Treat underlying cause (MI, thyroid disease, medications, infections)' },
    { id: 'mobitz1-sympt', kind: 'finding', label: 'Сердцебиение, синкопе',
      labelEn: 'Symptoms (palpitations, syncope)', next: [{ to: 'pacemaker' }] },

    { id: 'pr-constant', kind: 'finding',
      label: 'P-R постоянный, RR с выпадением = два интервала P-P',
      labelEn: 'Constant P-R in conducted beats, RR interval contains dropped beat = 2 P-P intervals',
      next: [{ to: 'mobitz2' }] },
    { id: 'mobitz2', kind: 'dx', label: 'Мобитц II', labelEn: 'Mobitz Type II',
      next: [{ to: 'pacemaker' }] },

    { id: 'av-dissoc', kind: 'finding', label: 'Ни одна P не проводится (АВ-диссоциация)',
      labelEn: 'Complete absence of conducted P waves (AV dissociation)', next: [{ to: 'third-degree' }] },
    { id: 'third-degree', kind: 'dx', label: 'АВ-блокада 3 степени', labelEn: '3rd Degree AV Block',
      next: [{ to: 'pacemaker' }] },

    /* ---------- система Гиса-Пуркинье ---------- */
    { id: 'his', kind: 'finding', label: 'Нарушение проведения в системе Гиса-Пуркинье',
      labelEn: 'His-Purkinje conduction abnormalities',
      ask: 'Какая картина на плёнке?',
      next: [
        { to: 'lbbb-signs', label: 'QRS >120 мс, положительный R в I, aVL, V6',
          labelEn: 'QRS >120 ms and positive R in I, aVL, V6' },
        { to: 'rbbb-signs', label: 'QRS >120 мс, rsR′ в V1 («заячьи уши»), отрицательный S в V6',
          labelEn: 'QRS >120 ms, rsR\' in V1 ("rabbit ears"), negative S in V6' },
        { to: 'lah-signs', label: 'отклонение оси влево, QRS вверх в I, вниз в aVF (ширина QRS нормальная)',
          labelEn: 'Left axis deviation + upright QRS in I, negative QRS in aVF (normal QRS duration)' },
        { to: 'lph-signs', label: 'QRS вниз в I и aVL, вверх в II, III, aVF (ширина QRS нормальная)',
          labelEn: 'Left axis deviation + negative QRS in I and aVL, upright in II, III, and aVF (normal QRS duration)' },
        { to: 'alternating-bbb', label: 'блокада ножек чередуется', labelEn: 'Alternating BBB' },
      ] },

    { id: 'lbbb-signs', kind: 'finding', label: 'QRS >120 мс, положительный R в I, aVL, V6',
      labelEn: 'QRS >120 ms and positive R in I, aVL, V6', next: [{ to: 'lbbb' }] },
    { id: 'lbbb', kind: 'dx', label: 'Блокада левой ножки (LBBB)', labelEn: 'LBBB',
      next: [{ to: 'ischemic-workup' }] },
    { id: 'ischemic-workup', kind: 'test', label: 'Обследование на ишемию: тропонин, ЭКГ в динамике',
      labelEn: 'Ischemic work-up (troponin, trend EKG)',
      next: [{ to: 'mi', label: 'положительно', labelEn: '+' }] },
    { id: 'mi', kind: 'dx', label: 'Инфаркт миокарда', labelEn: 'MI',
      next: [{ to: 'chest-pain-ref' }] },
    { id: 'chest-pain-ref', kind: 'ref', label: 'Дальше — по алгоритму «Боль в груди / ОКС»',
      labelEn: 'See Chest Pain/ACS, pp. 2–5', goto: 'chest-pain' },

    { id: 'rbbb-signs', kind: 'finding', label: 'QRS >120 мс, rsR′ в V1, отрицательный S в V6',
      labelEn: 'QRS >120 ms, rsR\' in V1 ("rabbit ears"), negative S in V6', next: [{ to: 'rbbb' }] },
    { id: 'rbbb', kind: 'dx', label: 'Блокада правой ножки (RBBB)', labelEn: 'RBBB' },

    { id: 'lah-signs', kind: 'finding', label: 'Ось влево, QRS вверх в I, вниз в aVF',
      labelEn: 'Left axis deviation + upright QRS in I, negative QRS in aVF (normal QRS duration)',
      next: [{ to: 'lah' }] },
    { id: 'lah', kind: 'dx', label: 'Передний левый гемиблок', labelEn: 'Left Anterior Hemiblock',
      next: [{ to: 'rbbb-plus-fascicle' }] },

    { id: 'lph-signs', kind: 'finding', label: 'QRS вниз в I и aVL, вверх в II, III, aVF',
      labelEn: 'Left axis deviation + negative QRS in I and aVL, upright in II, III, and aVF (normal QRS duration)',
      note: 'lph', next: [{ to: 'lph' }] },
    { id: 'lph', kind: 'dx', label: 'Задний левый гемиблок', labelEn: 'Left Posterior Hemiblock',
      next: [{ to: 'rbbb-plus-fascicle' }] },

    { id: 'rbbb-plus-fascicle', kind: 'finding', label: 'БПНПГ + одна ветвь левой ножки',
      labelEn: 'RBBB + 1 fascicle', next: [{ to: 'bifascicular' }] },
    { id: 'bifascicular', kind: 'dx', label: 'Бифасцикулярный блок', labelEn: 'Bifascicular Block',
      note: 'bifascicular', next: [{ to: 'pr-prolongation' }] },
    { id: 'pr-prolongation', kind: 'finding', label: 'Добавилось удлинение PR', labelEn: 'PR prolongation',
      next: [{ to: 'trifascicular' }] },
    { id: 'trifascicular', kind: 'dx', label: 'Трифасцикулярный блок', labelEn: 'Trifascicular Block',
      note: 'trifascicular' },

    { id: 'alternating-bbb', kind: 'finding', label: 'Чередующаяся блокада ножек', labelEn: 'Alternating BBB',
      next: [{ to: 'pacemaker' }] },

    /* ---------- общие исходы ---------- */
    { id: 'treat-cause', kind: 'tx', label: 'Лечить причину: ИМ, щитовидная железа, препараты, инфекции',
      labelEn: 'Treat underlying cause (MI, thyroid disease, medications, infections)' },
    { id: 'acls', kind: 'tx', label: 'Протокол ACLS: атропин, временный трансвенозный ЭКС',
      labelEn: 'ACLS protocol: Atropine, transvenous pacemaker' },
    { id: 'pacemaker', kind: 'tx', label: 'Постоянный кардиостимулятор', labelEn: 'Permanent pacemaker' },
  ],
};
