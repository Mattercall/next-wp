export const CATEGORY_SLUG_REDIRECTS: Record<string, string> = {
  // "old-slug": "new-slug",
};

export function getCategorySlugRedirect(slug: string): string | undefined {
  return CATEGORY_SLUG_REDIRECTS[slug];
}
