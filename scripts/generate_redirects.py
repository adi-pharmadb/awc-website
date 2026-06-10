#!/usr/bin/env python3
"""
Find every broken internal link inside migrated content and map it to the best
current page (by slug-token overlap), with sensible section fallbacks. Emits
src/redirects.mjs for astro.config to consume — so no internal link 404s.
"""
import json
import os
import re
import glob
import collections

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = os.path.join(ROOT, 'src', 'content')
DIST = os.path.join(ROOT, 'dist')

STOP = {'the', 'a', 'and', 'for', 'in', 'of', 'at', 'to', 'sydney', 'bondi', 'junction',
        'ayurvedic', 'ayurveda', 'treatment', 'treatments', 'massage', '2', 'best'}


def tokens(slug: str):
    return set(t for t in re.split(r'[-_/]', slug.lower()) if t and t not in STOP)


def load_items():
    items = []
    for f in glob.glob(os.path.join(CONTENT, '*', '*.md')):
        t = open(f, encoding='utf-8').read()
        coll = os.path.basename(os.path.dirname(f))
        path = (re.search(r'^path:\s*"([^"]+)"', t, re.M) or [None, None])[1]
        slug = (re.search(r'^slug:\s*"([^"]+)"', t, re.M) or [None, None])[1]
        if path and slug:
            items.append({'coll': coll, 'path': path, 'slug': slug, 'tok': tokens(slug)})
    return items


def built(url: str) -> bool:
    u = url.strip('/')
    return (url == '/' or os.path.exists(os.path.join(DIST, u, 'index.html'))
            or os.path.exists(os.path.join(ROOT, 'public', u)))


def collect_broken():
    linkre = re.compile(r'\]\((/[^)\s]*)\)')
    counts = collections.Counter()
    for f in glob.glob(os.path.join(CONTENT, '*', '*.md')):
        body = open(f, encoding='utf-8').read().split('---', 2)[-1]
        for m in linkre.findall(body):
            url = m.split('#')[0].split('?')[0]
            if url.startswith('/wp-content'):
                continue
            if not url.endswith('/'):
                url += '/'
            counts[url] += 1
    return {u: c for u, c in counts.items() if not built(u)}


def fallback(url: str) -> str:
    u = url.lower()
    last = url.strip('/').split('/')[-1]
    if u.startswith('/product'):
        return '/shop/'
    if any(k in u for k in ['doctor', 'dr-', 'meet-our']):
        return '/team/'
    if any(k in last for k in ['package', 'massage', 'shirodhara', 'abhyanga', 'pizzichil',
                               'basti', 'sweda', 'nasya', 'udvartana', 'kizhi', 'champi',
                               'dhara', 'panchakarma', 'detox', 'facial', 'spa', 'rejuven']):
        return '/treatments/'
    if any(k in last for k in ['stress', 'anxiety', 'insomnia', 'skin', 'colitis', 'ulcer',
                               'pain', 'arthr', 'menopause', 'ibs', 'sinus']):
        return '/conditions/'
    if any(k in u for k in ['consult', 'appointment', 'booking']):
        return '/book-appointment/'
    if any(k in u for k in ['/blog', '/page/', '/2016/', '/2015/', 'recipes']):
        return '/journal/'
    if 'dosha' in u:
        return '/what-is-your-dosha/'
    return '/treatments/'


def best_match(url, items):
    tk = tokens(url.strip('/').split('/')[-1])
    if not tk:
        return None, 0
    best, score = None, 0.0
    for it in items:
        if not it['tok']:
            continue
        inter = len(tk & it['tok'])
        if inter == 0:
            continue
        j = inter / len(tk | it['tok'])
        # prefer same area: product->products, etc.
        if url.startswith('/product') and it['coll'] != 'products':
            j *= 0.6
        if j > score:
            best, score = it, j
    return best, score


# hand-picked overrides where heuristics can't infer intent
OVERRIDES = {
    '/blog/': '/journal/',
    '/product-category/gift-voucher/': '/shop/',
    '/product/kizhi-gift-voucher/': '/shop/',
    '/nasya-nasal-head-treatment/': '/services/ayurveda-nasya-treatment/',
    '/photos-on-this-website/': '/about-us/',
}

# collection priority when a slug exists in more than one collection
PRIORITY = {'services': 0, 'products': 1, 'doctors': 2, 'pages': 3, 'blog': 4, 'testimonials': 5}


def main():
    items = load_items()
    by_slug = {}
    for it in sorted(items, key=lambda i: PRIORITY.get(i['coll'], 9)):
        by_slug.setdefault(it['slug'], it)  # first (highest priority) wins
    broken = collect_broken()
    redirects = {}
    exact, strong, weak = 0, 0, 0
    for url, _ in sorted(broken.items()):
        last = url.strip('/').split('/')[-1]
        if url in OVERRIDES:
            redirects[url] = OVERRIDES[url]; strong += 1
        elif last in by_slug:                         # exact slug match
            redirects[url] = by_slug[last]['path']; exact += 1
        else:
            m, score = best_match(url, items)
            if m and score >= 0.5:
                redirects[url] = m['path']; strong += 1
            else:
                redirects[url] = fallback(url); weak += 1
    print(f'exact={exact} matched={strong} fallback={weak}')
    # write JS module
    out = os.path.join(ROOT, 'src', 'redirects.mjs')
    with open(out, 'w', encoding='utf-8') as f:
        f.write('// Auto-generated: old WordPress URLs -> best current page (no internal 404s).\n')
        f.write('// Regenerate with `python3 scripts/generate_redirects.py` after content changes.\n')
        f.write('export default ' + json.dumps(redirects, indent=2, sort_keys=True) + ';\n')
    print(f'{len(broken)} broken links -> {strong} matched, {weak} section-fallback -> {out}')
    for u in sorted(redirects):
        print(f'  {u:55} -> {redirects[u]}')


if __name__ == '__main__':
    main()
