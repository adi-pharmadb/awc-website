#!/usr/bin/env python3
"""
Full media migration. Static wp-content assets are NOT behind the bot wall, so we
download every image referenced across all content + the curated brand/hero set,
into public/wp-content/uploads/... (path preserved), then rewrite content markdown
to root-relative local paths. Idempotent; concurrent.
"""
import concurrent.futures as cf
import json
import os
import re
import urllib.request
from urllib.parse import urlparse, unquote, quote

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXPORT = os.path.join(ROOT, "..", "awc-rest-export.json")
PUBLIC = os.path.join(ROOT, "public")
CONTENT = os.path.join(ROOT, "src", "content")
DOMAIN = "https://www.ayurvedicwellnesscentre.com.au"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36"

# Curated brand/hero assets (from live-site inspection) — high value for the redesign.
CURATED = [
    "/wp-content/uploads/2023/05/background_banner.jpg",
    "/wp-content/uploads/2023/05/background_services.png",
    "/wp-content/uploads/2023/05/background_about_us-1-scaled.jpg",
    "/wp-content/uploads/2023/05/backgroud_about_us.png",
    "/wp-content/uploads/2023/05/background_ways.png",
    "/wp-content/uploads/2023/05/background_video.jpg",
    "/wp-content/uploads/2023/05/background_testimonial_section.jpg",
    "/wp-content/uploads/2023/05/What-Is-Ayurveda.jpg",
    "/wp-content/uploads/2023/05/CONTACT-US.jpg",
    "/wp-content/uploads/2022/08/AWC-logo-black.png",
    "/wp-content/uploads/2017/06/cropped-AMP-300x300.png",
    "/wp-content/uploads/2017/06/cropped-AMP-190x190.png",
]


def collect_urls():
    bundle = json.load(open(EXPORT, encoding="utf-8"))
    urls = set()
    img_re = re.compile(r'(?:src|data-src|data-large_image)=["\']([^"\']+)["\']', re.I)
    srcset_re = re.compile(r'(?:srcset|data-srcset)=["\']([^"\']+)["\']', re.I)
    bg_re = re.compile(r'url\(["\']?([^"\')]+)["\']?\)')
    for items in bundle["items"].values():
        for it in items:
            html = (it.get("content", {}) or {}).get("rendered", "") or ""
            for m in img_re.findall(html):
                urls.add(m)
            for ss in srcset_re.findall(html):
                for part in ss.split(","):
                    u = part.strip().split(" ")[0]
                    if u:
                        urls.add(u)
            for m in bg_re.findall(html):
                urls.add(m)
            y = it.get("yoast_head_json", {}) or {}
            if y.get("og_image"):
                for oi in y["og_image"]:
                    if oi.get("url"):
                        urls.add(oi["url"])
    for c in CURATED:
        urls.add(DOMAIN + c)
    # keep only this domain's uploads, skip data: and svg placeholders
    keep = set()
    for u in urls:
        if u.startswith("//"):
            u = "https:" + u
        if u.startswith("/wp-content"):
            u = DOMAIN + u
        if "/wp-content/uploads/" in u and u.startswith("http") and not u.startswith("data:"):
            keep.add(u)
    return sorted(keep)


def local_path(url):
    """Map a wp-content URL to a local public path, preserving the uploads tree."""
    p = unquote(urlparse(url).path)  # /wp-content/uploads/...
    return os.path.join(PUBLIC, p.lstrip("/"))


def download(url):
    dest = local_path(url)
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        return ("skip", url)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    try:
        pr = urlparse(url)
        safe = pr._replace(path=quote(pr.path)).geturl()  # percent-encode non-ASCII paths
        req = urllib.request.Request(safe, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=30) as r:
            data = r.read()
        if len(data) < 100:
            return ("tiny", url)
        with open(dest, "wb") as f:
            f.write(data)
        return ("ok", url)
    except Exception as e:
        return (f"ERR {type(e).__name__}", url)


def rewrite_markdown():
    """Make every absolute image URL in content root-relative (served from public/)."""
    changed = 0
    for dirpath, _, files in os.walk(CONTENT):
        for fn in files:
            if not fn.endswith(".md"):
                continue
            fp = os.path.join(dirpath, fn)
            txt = open(fp, encoding="utf-8").read()
            new = txt.replace(DOMAIN + "/wp-content/", "/wp-content/")
            new = new.replace("http://www.ayurvedicwellnesscentre.com.au/wp-content/", "/wp-content/")
            if new != txt:
                open(fp, "w", encoding="utf-8").write(new)
                changed += 1
    return changed


def main():
    urls = collect_urls()
    print(f"collected {len(urls)} unique image URLs")
    results = {}
    with cf.ThreadPoolExecutor(max_workers=16) as ex:
        for status, url in ex.map(download, urls):
            results[status] = results.get(status, 0) + 1
    print("download results:", results)
    n = rewrite_markdown()
    print(f"rewrote image paths in {n} markdown files")
    total = sum(1 for _, _, f in os.walk(PUBLIC) for f in f) if os.path.isdir(PUBLIC) else 0
    print(f"public/ now holds {total} files")


if __name__ == "__main__":
    main()
