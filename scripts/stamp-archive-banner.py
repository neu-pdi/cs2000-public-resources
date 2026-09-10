#!/usr/bin/env python3
"""Mark every page of a built site as an archived semester.

Usage:
    scripts/stamp-archive-banner.py <dir> <display-name> [live-base-url]

Operates on a directory of already-built HTML (e.g. static/fall2025/) and makes two
edits to each page:

  1. A non-dismissible banner naming the past semester, inserted immediately after
     the opening <body> tag, so a student who lands on the page can't mistake it for
     the current site.
  2. <meta name="robots" content="noindex"> in <head>, so search engines drop the
     page -- search results being the likeliest way someone arrives here by accident.

Note this deliberately does NOT add a robots.txt Disallow rule: disallowing the path
would stop crawlers from fetching the pages at all, and they would therefore never
see the noindex directive.

Done as a post-build pass over the HTML, rather than via themeConfig.announcementBar
or a plugin, so it works no matter what config shape or Docusaurus version produced
the archive -- and so it can be applied to archives built before this script existed.

Idempotent, and the two edits are tracked independently: re-running adds only what is
missing, so an archive that already has the banner still picks up the meta tag. Exits
non-zero if a page ends up with neither edit.
"""

import html
import os
import re
import sys

BANNER_MARKER = 'data-archived-banner'
NOINDEX_MARKER = 'data-archived-noindex'
DEFAULT_LIVE_BASE = '/cs2000-public-resources/'

BODY_RE = re.compile(r'(<body[^>]*>)', re.I)
HEAD_RE = re.compile(r'(<head[^>]*>)', re.I)
ROBOTS_RE = re.compile(r'<meta[^>]+name=["\']robots["\']', re.I)


def banner_html(display_name: str, live_base: str) -> str:
    name = html.escape(display_name)
    href = html.escape(live_base)
    return (
        f'<div {BANNER_MARKER}="{name}" role="alert" style="'
        'box-sizing:border-box;width:100%;padding:14px 18px;'
        'background:#8c1d18;color:#fff;'
        'font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;'
        'font-size:1rem;line-height:1.45;text-align:center;'
        'border-bottom:3px solid #4a0f0c;">'
        '<strong style="text-transform:uppercase;letter-spacing:.04em;">'
        'Archived semester</strong>'
        ' &mdash; This is an old version of the course website, covering a past '
        f'semester: <strong>{name}</strong>.'
        f' <a href="{href}" style="color:#fff;font-weight:700;'
        'text-decoration:underline;white-space:nowrap;">'
        'Go to the current course website</a>'
        '</div>'
    )


NOINDEX_TAG = f'<meta name="robots" content="noindex" {NOINDEX_MARKER}>'


def main(argv: list[str]) -> int:
    if len(argv) > 1 and argv[1] in ('-h', '--help'):
        print(__doc__)
        return 0
    if len(argv) < 3:
        print(__doc__, file=sys.stderr)
        return 1

    root, display_name = argv[1], argv[2]
    live_base = argv[3] if len(argv) > 3 else DEFAULT_LIVE_BASE

    if not os.path.isdir(root):
        print(f'error: {root} is not a directory', file=sys.stderr)
        return 1

    banner = banner_html(display_name, live_base)

    pages = banners_added = noindex_added = 0
    no_body: list[str] = []
    no_head: list[str] = []
    foreign_robots: list[str] = []

    for dirpath, _, files in os.walk(root):
        for name in files:
            if not name.lower().endswith(('.html', '.htm')):
                continue
            path = os.path.join(dirpath, name)
            rel = os.path.relpath(path, root)
            with open(path, encoding='utf-8', errors='surrogateescape') as f:
                src = f.read()
            pages += 1
            out = src

            if BANNER_MARKER not in out:
                if BODY_RE.search(out):
                    out = BODY_RE.sub(lambda m: m.group(1) + banner, out, count=1)
                    banners_added += 1
                else:
                    no_body.append(rel)

            if NOINDEX_MARKER not in out:
                if ROBOTS_RE.search(out):
                    # Leave a pre-existing robots directive alone rather than emit
                    # two that could conflict.
                    foreign_robots.append(rel)
                elif HEAD_RE.search(out):
                    out = HEAD_RE.sub(lambda m: m.group(1) + NOINDEX_TAG, out, count=1)
                    noindex_added += 1
                else:
                    no_head.append(rel)

            if out != src:
                with open(path, 'w', encoding='utf-8', errors='surrogateescape') as f:
                    f.write(out)

    print(f'    {pages} page(s) scanned')
    print(f'    banner added to {banners_added}, noindex added to {noindex_added}')

    for label, items in (
        ('had no <body> tag (no banner added)', no_body),
        ('had no <head> tag (no noindex added)', no_head),
        ('already had their own robots meta (left alone)', foreign_robots),
    ):
        if items:
            print(f'    WARNING: {len(items)} file(s) {label}:')
            for rel in items[:10]:
                print(f'      {rel}')

    if pages == 0:
        print('error: no html files found -- wrong directory?', file=sys.stderr)
        return 1
    if len(no_body) == pages:
        print('error: no page could be stamped -- refusing to leave an unmarked archive',
              file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
