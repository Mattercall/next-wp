import { NextResponse } from "next/server";
import { siteConfig } from "@/site.config";

export async function GET() {
  const base = siteConfig.site_domain.replace(/\/$/, "");
  const now = new Date().toISOString();

  const urls = [
    `${base}/`,
    `${base}/posts`,
    `${base}/pages`,
    `${base}/posts/authors`,
    `${base}/posts/categories`,
    `${base}/posts/tags`,
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (loc) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${now}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
