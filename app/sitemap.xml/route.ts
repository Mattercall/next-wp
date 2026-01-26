// app/sitemap.xml/route.ts
import { NextResponse } from "next/server";
import { siteConfig } from "@/site.config";

const WP = process.env.WORDPRESS_URL;
const POSTS_PER_SITEMAP = 1000;

async function getPublishedPostCount(): Promise<number> {
  if (!WP) return 0;

  const res = await fetch(
    `${WP}/wp-json/wp/v2/posts?status=publish&per_page=1&_fields=id`,
    { next: { revalidate: 3600 } }
  );

  const total = res.headers.get("x-wp-total");
  return total ? Number(total) : 0;
}

export async function GET() {
  const base = siteConfig.site_domain.replace(/\/$/, "");
  const total = await getPublishedPostCount();
  const chunks = Math.max(1, Math.ceil(total / POSTS_PER_SITEMAP));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${base}/sitemap-static.xml</loc></sitemap>
${Array.from({ length: chunks }, (_, i) => `  <sitemap><loc>${base}/posts/sitemap/${i}.xml</loc></sitemap>`).join("\n")}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
