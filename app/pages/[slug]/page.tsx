import {
  getPageBySlug,
  getFeaturedMediaById,
  getAuthorById,
  getAllPages,
} from "@/lib/wordpress";
import { generateContentMetadata, stripHtml } from "@/lib/metadata";
import { extractFaqSchemaFromHtml, matchesFaqHeadingText } from "@/lib/faq";

import { Section, Container, Article, Prose } from "@/components/craft";

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Script from "next/script";

function wrapFaqSection(html: string) {
  if (!html || html.includes("faq-section")) return html;

  const headingRe = /<(h2|h3)([^>]*)>([\s\S]*?)<\/\1>/gi;
  let match: RegExpExecArray | null;

  while ((match = headingRe.exec(html)) !== null) {
    const innerHtml = match[3] || "";
    if (!matchesFaqHeadingText(innerHtml)) {
      continue;
    }

    const startIndex = match.index;
    const afterHeadingIndex = startIndex + match[0].length;
    const afterFaq = html.slice(afterHeadingIndex);

    const nextH2 = afterFaq.search(/<h2[^>]*>/i);
    const endIndex = nextH2 >= 0 ? afterHeadingIndex + nextH2 : html.length;

    const before = html.slice(0, startIndex);
    const faqBlock = html.slice(startIndex, endIndex);
    const after = html.slice(endIndex);

    return `${before}<section class="faq-section">${faqBlock}</section>${after}`;
  }

  return html;
}

function safeJsonLd(obj: any) {
  // Prevent </script> injection edge case
  return JSON.stringify(obj).replace(/</g, "\\u003c");
}

export async function generateStaticParams() {
  const pages = await getAllPages();
  return pages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPageBySlug(slug);

  if (!post) {
    return {};
  }

  // next-wp typing often treats post.meta as {}
  // so we safely coerce via `any` + String()
  const meta = (post as any).meta || {};

  const title =
    String(meta._next_seo_title ?? "").trim() || post.title.rendered;

  const description =
    String(meta._next_meta_description ?? "").trim() ||
    stripHtml(post.excerpt.rendered);

  const canonicalOverride = String(meta._next_canonical ?? "").trim();
  const ogImageOverride = String(meta._next_og_image ?? "").trim();
  const noindex = Boolean(meta._next_noindex);

  // Use your existing metadata generator as the base
  const base = generateContentMetadata({
    title,
    description,
    slug: post.slug,
    basePath: "pages",
  });

  // Merge overrides only if provided
  const merged: Metadata = { ...base };

  if (canonicalOverride) {
    merged.alternates = {
      ...(base.alternates || {}),
      canonical: canonicalOverride,
    };

    // Keep OG url consistent with canonical if present
    merged.openGraph = {
      ...(base.openGraph || {}),
      url: canonicalOverride,
    };
  }

  if (ogImageOverride) {
    merged.openGraph = {
      ...(merged.openGraph || {}),
      images: [{ url: ogImageOverride }],
    };

    merged.twitter = {
      ...(merged.twitter || {}),
      images: [ogImageOverride],
    };
  }

  if (noindex) {
    merged.robots = { index: false, follow: false };
  }

  return merged;
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPageBySlug(slug);

  if (!post) {
    notFound();
  }

  const featuredMedia = post.featured_media
    ? await getFeaturedMediaById(post.featured_media)
    : null;

  const author = await getAuthorById(post.author);

  const date = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Extract FAQs from the rendered HTML content
  const faqSchema = extractFaqSchemaFromHtml(post.content.rendered);

  return (
    <Section>
      <Container>
        {/* Inject FAQ schema only if we detected FAQ items */}
        {faqSchema && (
          <Script
            id="faq-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }}
          />
        )}

        <Prose>
          <h1>
            <span
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            ></span>
          </h1>

          <div className="flex justify-between items-center gap-4 text-sm mb-4">
            <h5>
              Published {date} by{" "}
              {author.name && (
                <span>
                  <a href={`/posts/?author=${author.id}`}>{author.name}</a>{" "}
                </span>
              )}
            </h5>
          </div>

          {featuredMedia?.source_url && (
            <div className="h-96 my-12 md:h-[500px] overflow-hidden flex items-center justify-center border rounded-lg bg-accent/25">
              {/* eslint-disable-next-line */}
              <img
                className="w-full h-full object-cover"
                src={featuredMedia.source_url}
                alt={post.title.rendered}
              />
            </div>
          )}
        </Prose>

        <Article
          className="[&_p]:font-sans [&_p]:text-[14px] [&_p]:text-[color:var(--color-neutral-600)] [&_li]:font-sans [&_li]:text-[14px] [&_li]:text-[color:var(--color-neutral-600)] [&_blockquote]:font-sans [&_blockquote]:text-[14px] [&_blockquote]:text-[color:var(--color-neutral-600)] [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_table]:[-webkit-overflow-scrolling:touch] [&_table]:table-auto [&_th]:break-words [&_th]:[overflow-wrap:anywhere] [&_th]:whitespace-normal [&_td]:break-words [&_td]:[overflow-wrap:anywhere] [&_td]:whitespace-normal"
          dangerouslySetInnerHTML={{
            __html: wrapFaqSection(post.content.rendered),
          }}
        />
      </Container>
    </Section>
  );
}
