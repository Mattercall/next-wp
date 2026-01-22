import { NextResponse } from "next/server";
import { siteConfig } from "@/site.config";
import { getPostCountForSitemap } from "@/lib/wordpress-sitemap";

const POSTS_PER_SITEMAP = 2000; // “small” and safe

export async function GET() {
  const base = siteConfig.site_domain.replace(/\/$/, "");
  const total = await getPostCountForSitemap();
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
