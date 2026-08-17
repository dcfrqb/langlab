/* ============================================================
   COURSE — Медицина (USMLE): First Aid как учебная программа.
   Манифест курса: движок не знает про шок и брадиаритмии,
   он знает только про этот объект.
   ============================================================ */
import { GROUPS, LESSONS } from './lessons.js';
import { QUESTIONS, TESTS } from './tests.js';

/* Категории = цветовой словарь курса. Красим по системе, а не по предмету:
   предметов в First Aid шестнадцать глав, цветов столько не бывает, а система
   («сердце», «инфекции», «неврология») — то, чем человек и навигируется. */
const CATEGORIES = [
  { key: 'cardio',  label: 'КАРДИО',      short: 'Сердце',      color: 'var(--c-pink)',   ink: 'var(--c-pink-ink)'   },
  { key: 'surgery', label: 'ХИРУРГИЯ',    short: 'Хирургия',    color: 'var(--c-teal)',   ink: 'var(--c-teal-ink)'   },
  { key: 'neuro',   label: 'НЕВРОЛОГИЯ',  short: 'Неврология',  color: 'var(--c-purple)', ink: 'var(--c-purple-ink)' },
  { key: 'infect',  label: 'ИНФЕКЦИИ',    short: 'Инфекции',    color: 'var(--c-green)',  ink: 'var(--c-green-ink)'  },
  { key: 'endo',    label: 'ЭНДОКРИНКА',  short: 'Эндокринка',  color: 'var(--c-blue)',   ink: 'var(--c-blue-ink)'   },
  { key: 'pharm',   label: 'ФАРМА',       short: 'Фарма',       color: 'var(--c-orange)', ink: 'var(--c-orange-ink)' },
  { key: 'general', label: 'ОБЩЕЕ',       short: 'Общее',       color: 'var(--c-now)',    ink: 'var(--c-now-ink)'    },
];

export const course = {
  id: 'medicine',
  title: 'Медицина',
  brand: { name: 'Medicine', suffix: '.usmle' },
  tagline: 'First Aid —<br>выжимка, дерево, проверка.',
  eyebrow: 'USMLE · First Aid · Step 1 и Step 2 CK',
  homeLede: 'Тема — это короткая выжимка из учебника: таблицы-сравнения, дерево решений там, ' +
            'где оно есть, английские термины и тест по пройденному. У каждого шага — ' +
            'страница First Aid, чтобы можно было свериться с оригиналом. Пройдено: ',
  testsLede: 'Вопросы только по пройденным темам: выбрать вариант, отметить все верные, ' +
             'вписать английский термин.',
  categories: CATEGORIES,
  groups: GROUPS,
  lessons: LESSONS,
  questions: QUESTIONS,
  tests: TESTS,
  /* опрос на уровень — языковая вещь (A1…B2): здесь программу собираем руками */
  survey: false,
  /* как называть книги в ссылках на источник; карты оглавлений
     генерируются в content/medicine/books/ скриптом tools/medicine/extract.py */
  books: {
    'fa-step1-2025': 'First Aid Step 1 · 2025',
    'fa-step2ck-2023': 'First Aid Step 2 CK · 2023',
    'fa-algorithms-2024': 'First Aid Clinical Algorithms · 2024',
  },
};
