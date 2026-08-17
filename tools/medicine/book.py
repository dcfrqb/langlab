#!/usr/bin/env python3
"""
BOOK — чтение выжимки, сделанной extract.py. Инструмент автора контента:
найти тему в книгах, прочитать нужные страницы, свериться с оглавлением.

    tools/.venv/bin/python tools/medicine/book.py find "bradyarrhythmia"
    tools/.venv/bin/python tools/medicine/book.py page 365 --to 366
    tools/.venv/bin/python tools/medicine/book.py image 365
    tools/.venv/bin/python tools/medicine/book.py toc --grep shock

Номера страниц везде печатные (как в книге), а не порядковые в файле:
в цитате должно стоять то, что человек увидит, открыв учебник.
"""

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / 'tools' / 'medicine' / 'out'


def books(only=None):
    """Все разобранные книги; выжимки нет — значит extract.py ещё не гоняли."""
    found = []
    for d in sorted(OUT_DIR.glob('*/book.json')):
        meta = json.loads(d.read_text(encoding='utf-8'))
        if only and meta['id'] != only:
            continue
        found.append((meta, d.parent / 'pages.jsonl'))
    if not found:
        sys.exit('нет разобранных книг — сначала tools/medicine/extract.py'
                 + (f' (искал: {only})' if only else ''))
    return found


def pages_of(path):
    with path.open(encoding='utf-8') as f:
        for line in f:
            yield json.loads(line)


def flatten(nodes, trail=()):
    for n in nodes:
        here = trail + (n['title'],)
        yield n, here
        yield from flatten(n.get('children', []), here)


def section_at(meta, file_page):
    """Самый глубокий раздел, накрывающий эту страницу файла — это и есть «где мы»."""
    best = None
    for n, trail in flatten(meta['sections']):
        if n['from'] <= file_page <= n['to']:
            if best is None or (n['to'] - n['from']) <= (best[0]['to'] - best[0]['from']):
                best = (n, trail)
    return best


def cite(meta, page, trail, head=''):
    """
    Строка-источник в том виде, в каком она поедет в карточку контента.
    Колонтитул точнее оглавления (он свой на каждой странице), поэтому
    если он есть — называем тему по нему.
    """
    where = head or (' › '.join(trail[-2:]) if trail else '')
    return (f"{meta['short']} {meta.get('year') or ''}".strip()
            + f", стр. {page}" + (f" · {where}" if where else ''))


# служебные разделы: там термин встречается всегда и не значит ничего
SERVICE = {'contents', 'index', 'abbreviations', 'image and table acknowledgments',
           'contributors', 'editors', 'acknowledgments', 'cover', 'title page'}


def is_service(trail):
    return bool(trail) and trail[0].strip().lower() in SERVICE


def cmd_find(args):
    needle = args.query.lower()
    rx = re.compile(re.escape(needle), re.I)
    shown = 0

    for meta, pages_path in books(args.book):
        for p in pages_of(pages_path):
            text = p['text']
            if needle not in text.lower():
                continue
            hit = section_at(meta, p['i'])
            trail = hit[1] if hit else ()
            if is_service(trail) and not args.all:
                continue
            printed = p['label'] or f"файл {p['i']}"

            for m in list(rx.finditer(text))[:args.per_page]:
                a = max(0, m.start() - args.ctx)
                b = min(len(text), m.end() + args.ctx)
                snippet = ' '.join(text[a:b].split())
                print(f"\n— {cite(meta, printed, trail, p.get('head'))}  [файл {p['i']}]")
                print(f"  …{snippet}…")
                shown += 1
                if shown >= args.limit:
                    print(f"\n(показано {shown}, дальше обрезано — уточни запрос или --limit)")
                    return
    if not shown:
        print(f'ничего не нашлось: {args.query!r}')


def cmd_page(args):
    for meta, pages_path in books(args.book):
        want = str(args.page)
        end = str(args.to) if args.to else want
        printing = False

        for p in pages_of(pages_path):
            label = p['label']
            # печатный номер, а если такого нет — номер страницы в файле
            key = label or str(p['i'])
            if key == want:
                printing = True
            if printing:
                hit = section_at(meta, p['i'])
                trail = hit[1] if hit else ()
                print(f"\n{'=' * 60}\n{cite(meta, key, trail, p.get('head'))}  [файл {p['i']}"
                      + (f", {p['imgs']} илл." if p['imgs'] else '') + f"]\n{'=' * 60}")
                print(p['text'].strip() or '(нет текстового слоя — это скан)')
                if key == end:
                    return
        if printing:
            return
    print(f'страница {args.page} не найдена')


def cmd_image(args):
    """
    Страница картинкой. Схемы-алгоритмы вытаскиваются из PDF как россыпь
    подписей без связей между ними — восстановить дерево решений по одному
    тексту нельзя, надо смотреть на страницу.
    """
    try:
        import pymupdf
    except ImportError:
        sys.exit('нужен pymupdf: tools/.venv/bin/pip install -r tools/requirements.txt')

    for meta, pages_path in books(args.book):
        pdf = ROOT / meta['file']
        if not pdf.exists():
            continue
        want = str(args.page)
        target = next((p for p in pages_of(pages_path) if (p['label'] or str(p['i'])) == want), None)
        if not target:
            continue

        doc = pymupdf.open(pdf)
        out = Path(args.out) if args.out else OUT_DIR / meta['id'] / 'img' / f'p{want}.png'
        out.parent.mkdir(parents=True, exist_ok=True)
        doc[target['i'] - 1].get_pixmap(dpi=args.dpi).save(out)
        print(out)
        return
    print(f'страница {args.page} не найдена (или PDF книги не на месте)')


def cmd_toc(args):
    for meta, _ in books(args.book):
        print(f"\n{meta['title']} — {meta['pages']} стр., печатная нумерация сдвинута на {meta['offset']}")
        for n, trail in flatten(meta['sections']):
            depth = len(trail) - 1
            if args.depth and depth >= args.depth:
                continue
            if args.grep and args.grep.lower() not in n['title'].lower():
                continue
            print(f"{'  ' * depth}{n['page']:>5}  {n['id']:<40} {n['title'][:70]}")


def main():
    ap = argparse.ArgumentParser(description='поиск и чтение по разобранным учебникам')
    ap.add_argument('--book', help='id книги (по умолчанию — все)')
    sub = ap.add_subparsers(dest='cmd', required=True)

    f = sub.add_parser('find', help='искать по тексту')
    f.add_argument('query')
    f.add_argument('--limit', type=int, default=12, help='сколько совпадений показать')
    f.add_argument('--per-page', type=int, default=2, help='сколько совпадений с одной страницы')
    f.add_argument('--ctx', type=int, default=220, help='символов контекста вокруг')
    f.add_argument('--all', action='store_true', help='не отсеивать оглавление и указатель')
    f.set_defaults(fn=cmd_find)

    p = sub.add_parser('page', help='показать страницу целиком')
    p.add_argument('page', help='печатный номер страницы')
    p.add_argument('--to', help='по какую страницу включительно')
    p.set_defaults(fn=cmd_page)

    im = sub.add_parser('image', help='страница картинкой (смотреть схемы)')
    im.add_argument('page', help='печатный номер страницы')
    im.add_argument('--dpi', type=int, default=150)
    im.add_argument('--out', help='куда сохранить png')
    im.set_defaults(fn=cmd_image)

    t = sub.add_parser('toc', help='оглавление')
    t.add_argument('--grep', help='только разделы, где встречается это слово')
    t.add_argument('--depth', type=int, help='до какого уровня вложенности')
    t.set_defaults(fn=cmd_toc)

    args = ap.parse_args()
    args.fn(args)


if __name__ == '__main__':
    main()
