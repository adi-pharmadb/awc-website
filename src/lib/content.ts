// Helpers for turning migrated WordPress content into clean card/teaser data.

const LIVE = 'https://www.ayurvedicwellnesscentre.com.au';

/** Absolute live wp-content URL -> root-relative local path (served from public/). */
export function localImage(url?: string | null): string | undefined {
  if (!url) return undefined;
  return url.replace(LIVE + '/wp-content/', '/wp-content/').replace(/^http:\/\/[^/]+\/wp-content\//, '/wp-content/');
}

/** First image referenced in a markdown body. */
export function firstImage(body?: string): string | undefined {
  if (!body) return undefined;
  const m = body.match(/!\[[^\]]*\]\(([^)\s]+)/) || body.match(/<img[^>]+src=["']([^"']+)["']/);
  return m?.[1];
}

/** Best hero/card image for an entry: featured (og) image, else first inline image. */
export function cardImage(entry: { data: { ogImage?: string }; body?: string }): string | undefined {
  return localImage(entry.data.ogImage) || localImage(firstImage(entry.body));
}

export function readingTime(body?: string): number {
  const words = (body || '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function formatDate(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
}

const routable = (e: any) => !e.data.draft && !String(e.data.robots).startsWith('noindex');
export { routable };

/** Clean a WordPress title for display (drop site suffix + trailing taglines). */
export function clean(title: string): string {
  return title.replace(/\s*[|]\s*Ayurvedic Wellness.*$/i, '').replace(/\s*[|].*$/, '').trim();
}

const THERAPY_RE = /massage|shirodhara|abhyanga|pizzichil|basti|sweda|nasya|udvartana|kizhi|champi|facial|panchakarma|detox|rasayan|relaxation|package|energiser|dhara|remedial|couples|therapeutic|rejuvenation|anti-ag|pinda|spa|cleanse|ritual/i;
const CONDITION_RE = /stress|anxiety|insomnia|depression|ocd|migraine|headache|allerg|asthma|fatigue|sinus|diabet|blood-pressure|hypertension|fatty-liver|gastritis|crohn|colitis|irritable-bowel|ibs|constipation|infertility|menopause|menstr|pms|dysmen|foot-problem|joint|arthr|skin|eczema|ulcer|thyroid|vagus|ailment/i;

/** Split a service into 'therapy' (a treatment) or 'condition' (a concern treated). */
export function serviceKind(slug: string): 'therapy' | 'condition' {
  if (THERAPY_RE.test(slug)) return 'therapy';
  if (CONDITION_RE.test(slug)) return 'condition';
  return 'therapy';
}
