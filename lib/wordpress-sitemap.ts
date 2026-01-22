const WP = process.env.WORDPRESS_URL; // https://backend.mattercall.com

type PostMini = { slug: string; modified: string };

export async function getPostCountForSitemap(): Promise<number> {
  if (!WP) throw new Error("WORDPRESS_URL is missing");

  const res = await fetch(`${WP}/wp-json/wp/v2/posts?per_page=1&_fields=id`, {
    next: { revalidate: 3600 },
  });

  const total = res.headers.get("x-wp-total");
  return total ? Number(total) : 0;
}

export async function getPostsForSitemapChunk(
  chunkId: number,
  chunkSize: number
): Promise<PostMini[]> {
  if (!WP) throw new Error("WORDPRESS_URL is missing");

  const perPage = 100; // WP max
  const startIndex = chunkId * chunkSize;
  const endIndex = startIndex + chunkSize;

  const startPage = Math.floor(startIndex / perPage) + 1;
  const endPage = Math.ceil(endIndex / perPage);

  const results: PostMini[] = [];

  // Sequential fetch = safer for your server (no burst)
  for (let page = startPage; page <= endPage; page++) {
    const res = await fetch(
      `${WP}/wp-json/wp/v2/posts?per_page=${perPage}&page=${page}&_fields=slug,modified`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) break;
    const data = (await res.json()) as PostMini[];
    results.push(...data);
  }

  const sliceStart = startIndex % perPage;
  return results.slice(sliceStart, sliceStart + chunkSize);
}
