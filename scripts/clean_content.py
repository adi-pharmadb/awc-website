#!/usr/bin/env python3
"""
Polish migrated markdown bodies (frontmatter is left untouched so SEO stays intact):
  1. strip ugly external dabuttonfactory "Book Appointment" button images
  2. rewrite internal links from the old absolute domain to root-relative paths
  3. tidy doubled blank lines / dangling emphasis left behind
"""
import os
import re

CONTENT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'src', 'content')
DOMAINS = [
    'https://www.ayurvedicwellnesscentre.com.au',
    'http://www.ayurvedicwellnesscentre.com.au',
    'https://ayurvedicwellnesscentre.com.au',
    'http://ayurvedicwellnesscentre.com.au',
]

def clean_body(body: str) -> str:
    # linked button image: [![alt](dabuttonfactory...)](href)
    body = re.sub(r'\[!\[[^\]]*\]\(https?://dabuttonfactory[^)]*\)\]\([^)]*\)', '', body)
    # bare button image
    body = re.sub(r'!\[[^\]]*\]\(https?://dabuttonfactory[^)]*\)', '', body)
    # internal links -> root-relative
    for d in DOMAINS:
        body = body.replace(f']({d}/', '](/')
        body = body.replace(f']({d})', '](/)')
    # dangling bold wrappers left empty: **  ** or ** **
    body = re.sub(r'\*\*\s*\*\*', '', body)
    # collapse 3+ blank lines
    body = re.sub(r'\n{3,}', '\n\n', body)
    return body


def main():
    changed = 0
    for dp, _, files in os.walk(CONTENT):
        for fn in files:
            if not fn.endswith('.md'):
                continue
            fp = os.path.join(dp, fn)
            txt = open(fp, encoding='utf-8').read()
            parts = txt.split('---', 2)
            if len(parts) == 3:
                fm, body = parts[1], parts[2]
                new_body = clean_body(body)
                if new_body != body:
                    open(fp, 'w', encoding='utf-8').write(f'---{fm}---{new_body}')
                    changed += 1
    print(f'cleaned {changed} files')


if __name__ == '__main__':
    main()
