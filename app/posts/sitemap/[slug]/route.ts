// app/posts/sitemap/[slug]/route.ts
import { NextResponse } from "next/server";
import { siteConfig } from "@/site.config";

const WP = process.env.WORDPRESS_URL; // e.g. https://backend.mattercall.com
const POSTS_PER_SITEMAP = 1000; // chunk size (set higher in production)
const PER_PAGE = 100; // WP REST max is usually 100

type PostMini = { slug: string; modified: string };

function makeUrlset(items: { loc: string; lastmod?: string }[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ""}
  </url>`
  )
  .join("\n")}
</urlset>`;
}

async function getPublishedPostCount(): Promise<number> {
  if (!WP) return 0;

  const res = await fetch(
    `${WP}/wp-json/wp/v2/posts?status=publish&per_page=1&_fields=id`,
    { next: { revalidate: 3600 } }
  );

  const total = res.headers.get("x-wp-total");
  return total ? Number(total) : 0;
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  if (!WP) return new NextResponse("WORDPRESS_URL missing", { status: 500 });

  const { slug } = await context.params; // Next.js 16 typing: params is a Promise
  const raw = slug.replace(/\.xml$/i, "");
  const id = Number(raw);

  if (!Number.isFinite(id) || id < 0) {
    return new NextResponse("Invalid sitemap id", { status: 400 });
  }

  // ✅ Prevent infinite empty sitemaps: return 404 if chunk is out of range
  const total = await getPublishedPostCount();
  const startIndex = id * POSTS_PER_SITEMAP;

  if (total === 0) {
    // No published posts yet -> return an empty, valid urlset for 0.xml, 404 for others
    if (id !== 0) return new NextResponse("Not found", { status: 404 });

    return new NextResponse(makeUrlset([]), {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
      },
    });
  }

  if (startIndex >= total) {
    return new NextResponse("Not found", { status: 404 });
  }

  const endIndex = startIndex + POSTS_PER_SITEMAP;

  const startPage = Math.floor(startIndex / PER_PAGE) + 1;
  const endPage = Math.ceil(endIndex / PER_PAGE);

  const results: PostMini[] = [];

  // Sequential fetch (safer than blasting WP with parallel requests)
  for (let page = startPage; page <= endPage; page++) {
    const res = await fetch(
      `${WP}/wp-json/wp/v2/posts?status=publish&per_page=${PER_PAGE}&page=${page}&_fields=slug,modified`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) break;

    const data = (await res.json()) as PostMini[];
    results.push(...data);

    // If WP returned less than PER_PAGE, there are no more posts
    if (data.length < PER_PAGE) break;
  }

  // Slice the exact chunk window from the fetched pages
  const sliceStart = startIndex % PER_PAGE;
  const chunk = results.slice(sliceStart, sliceStart + POSTS_PER_SITEMAP);

  const base = siteConfig.site_domain.replace(/\/$/, "").replace(/\/posts$/, "");
  const urlset = makeUrlset(
    chunk.map((p) => ({
      loc: `${base}/${p.slug}`,
      lastmod: new Date(p.modified).toISOString(),
    }))
  );

  return new NextResponse(urlset, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
