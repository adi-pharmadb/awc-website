// Loads the original Yoast JSON-LD sidecars so each page can inject its
// structured data into <head> verbatim — preserving rich-result eligibility.
const seoModules = import.meta.glob('../data/seo/**/*.json', { eager: true }) as Record<
  string,
  { default: any }
>;

export function getYoast(collection: string, slug: string): any | null {
  const key = `../data/seo/${collection}/${slug}.json`;
  return seoModules[key]?.default ?? null;
}

export function getJsonLd(collection: string, slug: string): unknown | null {
  return getYoast(collection, slug)?.schema ?? null;
}
