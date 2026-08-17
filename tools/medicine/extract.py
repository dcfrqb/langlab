#!/usr/bin/env python3
"""
EXTRACT — учебник в PDF → две вещи:

  1) tools/medicine/out/<id>/  — рабочая выжимка (в git НЕ едет):
        pages.jsonl   постранично: индекс в файле, печатный номер, текст
        book.json     то же, что карта ниже, только в JSON

  2) content/medicine/books/<id>.js — карта книги (едет в git):
        оглавление с диапазонами страниц. Текста книги здесь нет —
        только по какой странице что искать. На эту карту ссылаются
        карточки контента («источник: FA Algorithms, 1-16, стр. 53»).

Печатный номер страницы и номер страницы в файле — разные вещи
(обложка, предисловие, римские цифры), поэтому храним оба: печатный
показываем человеку, файловый нужен, чтобы открыть PDF в нужном месте.

Запуск:
    tools/.venv/bin/python tools/medicine/extract.py "content/medicine/<файл>.pdf" \\
        --id fa-algorithms-2024 --short "FA Algorithms"
"""

import argparse
import json
import re
import sys
from collections import Counter
from pathlib import Path

try:
    import pymupdf
except ImportError:
    sys.exit('нет pymupdf. Установить: python3 -m venv tools/.venv && '
             'tools/.venv/bin/pip install -r tools/requirements.txt')

ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / 'tools' / 'medicine' / 'out'
BOOKS_DIR = ROOT / 'content' / 'medicine' / 'books'


def fix_title(text):
    """
    Заголовок закладки: убрать переносы и склеить разъехавшиеся римские цифры
    («SECTION I I I» → «SECTION III») — так их набрали в самом PDF.
    """
    text = ' '.join(text.split())
    return re.sub(r'\b([IVX])(?: ([IVX]))+\b', lambda m: m.group(0).replace(' ', ''), text)


def slug(text):
    """Заголовок раздела → id: '1-16 Bradyarrhythmias' → '1-16-bradyarrhythmias'."""
    s = text.lower().replace('&', ' and ')
    s = re.sub(r'[^a-z0-9]+', '-', s).strip('-')
    return s[:60] or 'section'


def clean(text):
    """Мягкие переносы и неразрывные пробелы ломают поиск — убираем их сразу."""
    text = text.replace('­', '').replace(' ', ' ').replace(' ', ' ')
    text = text.replace(' ', ' ').replace('ﬁ', 'fi').replace('ﬂ', 'fl')
    return re.sub(r'[ \t]+', ' ', text)


def running_head(page, band=0.065):
    """
    Колонтитул страницы: «ENDOCRINE · SECTION III · endocrine—pathology».

    В оглавлении First Aid Step 1 всего 39 закладок на 844 страницы — раздел там
    это целая глава. А колонтитул есть на каждой странице и называет тему точно.
    Во всех трёх книгах он лежит выше 6.5% высоты страницы, а текст начинается
    ниже 7.5% — по этой границе и режем.
    """
    height = page.rect.height
    parts = []
    for block in page.get_text('dict')['blocks']:
        for line in block.get('lines', []):
            if line['bbox'][1] >= height * band:
                continue
            text = ' '.join(''.join(s['text'] for s in line['spans']).split())
            text = text.lstrip('`').strip()          # маркер-стрелка в Step 1
            if not text or text.isdigit():           # номер страницы — не заголовок
                continue
            if text not in parts:
                parts.append(text)
    return ' · '.join(parts)[:90]


def read_pages(doc):
    """Постранично: печатная метка, колонтитул, текст, сколько картинок."""
    pages = []
    for i, page in enumerate(doc):
        label = (page.get_label() or '').strip()
        pages.append({
            'i': i + 1,                       # номер страницы в файле, с единицы
            'label': label,                   # печатный номер: '53', 'xx', 'Cover'
            'head': running_head(page),       # тема страницы по колонтитулу
            'imgs': len(page.get_images()),
            'text': clean(page.get_text('text')),
        })
    return pages


def sniff_labels(doc, edge=0.12):
    """
    Метки страниц в PDF бывают выдраны — книгу прогнали через онлайн-конвертер,
    и печатной нумерации в файле больше нет. Тогда снимаем номер с колонтитула:
    берём числа-одиночки у верхнего и нижнего края страницы.

    Доверять отдельной странице нельзя (цифра из таблицы у края притворится
    номером), поэтому решает самый частый сдвиг между файловым и печатным
    номером: он держится на сотнях страниц, а мусор — на единицах.

    Возвращает (сдвиг, на скольких страницах подтверждён).
    """
    deltas = Counter()
    for i, page in enumerate(doc):
        height = page.rect.height
        for block in page.get_text('dict')['blocks']:
            for line in block.get('lines', []):
                text = ''.join(s['text'] for s in line['spans']).strip()
                if not (text.isdigit() and len(text) <= 4):
                    continue
                top = line['bbox'][1]
                if top < height * edge or top > height * (1 - edge):
                    deltas[(i + 1) - int(text)] += 1
    if not deltas:
        return None, 0
    return deltas.most_common(1)[0]


def page_offset(pages):
    """
    Насколько печатная нумерация сдвинута относительно файловой.
    Берём самое частое расхождение по страницам с арабскими номерами:
    единичные сбои (вклейки, вкладки) не должны сдвигать всю книгу.
    """
    deltas = Counter()
    for p in pages:
        if p['label'].isdigit():
            deltas[p['i'] - int(p['label'])] += 1
    return deltas.most_common(1)[0][0] if deltas else 0


def build_tree(toc, page_count, pages):
    """
    Плоский список закладок [уровень, заголовок, страница] → дерево с диапазонами.

    Раздел кончается там, где начинается следующий раздел того же или более
    высокого уровня; последний — на конце книги. Без этого «стр. 53» есть,
    а «где эта тема заканчивается» — нет, и цитировать нечего.
    """
    label_of = {p['i']: p['label'] for p in pages}
    nodes = []
    for level, title, start in toc:
        if start < 1:                          # закладка без цели — пропускаем
            continue
        nodes.append({'level': level, 'title': fix_title(title), 'from': start})

    for idx, node in enumerate(nodes):
        end = page_count
        for nxt in nodes[idx + 1:]:
            if nxt['level'] <= node['level']:
                end = max(node['from'], nxt['from'] - 1)
                break
        node['to'] = end

    # сборка вложенности по уровням
    root, stack = [], []
    used = Counter()
    for node in nodes:
        ident = slug(node['title'])
        used[ident] += 1
        if used[ident] > 1:                    # одинаковые заголовки в разных главах
            ident = f"{ident}-{used[ident]}"

        item = {
            'id': ident,
            'title': node['title'],
            'from': node['from'],
            'to': node['to'],
            'page': label_of.get(node['from'], ''),
            'pageTo': label_of.get(node['to'], ''),
        }
        while stack and stack[-1]['level'] >= node['level']:
            stack.pop()
        if stack:
            stack[-1]['item'].setdefault('children', []).append(item)
        else:
            root.append(item)
        stack.append({'level': node['level'], 'item': item})

    return root


def js_module(book):
    """Карта книги как ES-модуль: контент в проекте — это js, а не json."""
    body = json.dumps(book, ensure_ascii=False, indent=2)
    return (
        '/* ============================================================\n'
        f'   BOOK — {book["title"]}\n'
        '   Сгенерировано tools/medicine/extract.py — руками не править.\n'
        '   Текста книги здесь нет: только оглавление и номера страниц,\n'
        '   чтобы карточки контента могли сослаться на источник.\n'
        '   ============================================================ */\n\n'
        f'export const book = {body};\n'
    )


def main():
    ap = argparse.ArgumentParser(description='PDF учебника → карта книги + постраничная выжимка')
    ap.add_argument('pdf', help='путь к PDF')
    ap.add_argument('--id', required=True, help='id книги, напр. fa-step1-2025')
    ap.add_argument('--title', help='название (по умолчанию — из метаданных PDF)')
    ap.add_argument('--short', help='короткое имя для ссылок в карточках')
    ap.add_argument('--year', type=int, help='год издания')
    args = ap.parse_args()

    pdf_path = Path(args.pdf)
    if not pdf_path.exists():
        sys.exit(f'нет файла: {pdf_path}')

    doc = pymupdf.open(pdf_path)
    if doc.is_encrypted:
        sys.exit('PDF зашифрован — сначала снять защиту')

    print(f'{pdf_path.name}: {doc.page_count} стр., читаю…', flush=True)
    pages = read_pages(doc)
    toc = doc.get_toc(simple=True)
    empty = sum(1 for p in pages if len(p['text'].strip()) < 20)

    # если печатной нумерации в файле нет — снимаем её с колонтитулов
    sniffed = None
    if sum(1 for p in pages if p['label']) < len(pages) // 2:
        offset, support = sniff_labels(doc)
        if offset is not None and support >= max(20, doc.page_count * 0.3):
            for p in pages:
                printed = p['i'] - offset
                p['label'] = str(printed) if printed >= 1 else ''
            sniffed = (offset, support)
        else:
            print('  ⚠ печатных номеров нет ни в метках, ни в колонтитулах — '
                  'ссылки придётся давать по номеру страницы в файле')

    book = {
        'id': args.id,
        'title': args.title or (doc.metadata.get('title') or pdf_path.stem).strip(),
        'short': args.short or args.id,
        'year': args.year,
        'file': str(pdf_path).replace(str(ROOT) + '/', ''),
        'pages': doc.page_count,
        'offset': page_offset(pages),
        # откуда взялись печатные номера: из самого PDF или сняты с колонтитулов
        'labels': 'headers' if sniffed else 'pdf',
        'sections': build_tree(toc, doc.page_count, pages),
    }

    out = OUT_DIR / args.id
    out.mkdir(parents=True, exist_ok=True)
    with (out / 'pages.jsonl').open('w', encoding='utf-8') as f:
        for p in pages:
            f.write(json.dumps(p, ensure_ascii=False) + '\n')
    (out / 'book.json').write_text(json.dumps(book, ensure_ascii=False, indent=2), encoding='utf-8')

    BOOKS_DIR.mkdir(parents=True, exist_ok=True)
    (BOOKS_DIR / f'{args.id}.js').write_text(js_module(book), encoding='utf-8')

    def count(nodes):
        return sum(1 + count(n.get('children', [])) for n in nodes)

    print(f'  оглавление: {count(book["sections"])} разделов ({len(toc)} закладок)')
    print(f'  печатная нумерация сдвинута на {book["offset"]}: '
          f'файловая {book["offset"] + 1} = печатная 1'
          + (f' — номера сняты с колонтитулов, сходится на {sniffed[1]} стр.' if sniffed else ''))
    if empty:
        print(f'  ⚠ страниц без текстового слоя: {empty} — там сканы, поиск их не найдёт')
    print(f'  → {out}/pages.jsonl (в git не едет)')
    print(f'  → content/medicine/books/{args.id}.js (в git едет)')


if __name__ == '__main__':
    main()
