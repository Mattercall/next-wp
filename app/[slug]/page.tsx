import {
  getPostBySlug,
  getFeaturedMediaById,
  getAuthorById,
  getCategoryById,
  getCategoriesByIds,
  getAllPostSlugs,
} from "@/lib/wordpress";
import { generateContentMetadata, stripHtml } from "@/lib/metadata";

import { Section, Container, Article, Prose } from "@/components/craft";
import { badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  heroBodyClass,
  heroEyebrowClass,
  heroHeadingClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/marketing/cta-styles";
import { ProductCardsStrip } from "@/components/featured-cards/product-cards-strip";
import { FeaturedCardsSection } from "@/components/featured-cards/featured-cards-section";
import ProductSidebar from "./product-sidebar";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import type { Metadata } from "next";
import Script from "next/script";
import { Play } from "lucide-react";

const blogHeadingTypography =
  "[&_h1]:text-[30px] [&_h2]:text-[24px] [&_h3]:text-[18px] [&_h5]:text-[12px]";

/**
 * ===== Site config (set via env if you want) =====
 * Make sure NEXT_PUBLIC_SITE_URL is your real domain (not next-wp.com).
 */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://frontend.mattercall.com";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || ""; // e.g. "Mattercall Blog"
const TWITTER_SITE = process.env.NEXT_PUBLIC_TWITTER_SITE || ""; // e.g. "@mattercall"
const PUBLISHER_NAME = process.env.NEXT_PUBLIC_PUBLISHER_NAME || SITE_NAME || "Mattercall";
const PUBLISHER_LOGO_URL = process.env.NEXT_PUBLIC_PUBLISHER_LOGO_URL || ""; // e.g. "https://frontend.mattercall.com/logo.png"

/**
 * ===== FAQ extraction from WP HTML =====
 * Expected:
 *  - <h2>FAQs</h2> (or FAQ / Häufige Fragen)
 *  - each question in <h3>Question</h3>
 *  - answer content until next <h3> or end of FAQ block
 */
type FaqItem = { question: string; answerText: string };
type TocItem = { id: string; text: string };
type CategoryProduct = {
  name?: string;
  price?: string;
  image?: string;
  link?: string;
};

function decodeEntities(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function extractFaqsFromHtml(html: string): FaqItem[] {
  if (!html) return [];

  const sectionRe =
    /<(h2|h3)[^>]*>\s*(faq|faqs|frequently asked questions|häufige fragen|haeufige fragen)\s*<\/\1>/i;

  const sectionMatch = html.match(sectionRe);
  if (!sectionMatch || sectionMatch.index == null) return [];

  const startIndex = sectionMatch.index + sectionMatch[0].length;
  const afterFaq = html.slice(startIndex);

  // stop at next h2
  const nextH2 = afterFaq.search(/<h2[^>]*>/i);
  const faqBlock = nextH2 >= 0 ? afterFaq.slice(0, nextH2) : afterFaq;

  const qaRe = /<h3[^>]*>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3[^>]*>|$)/gi;

  const out: FaqItem[] = [];
  let m: RegExpExecArray | null;

  while ((m = qaRe.exec(faqBlock)) !== null) {
    const qHtml = m[1] || "";
    const aHtml = (m[2] || "").trim();

    const question = decodeEntities(stripHtml(qHtml));
    const answerText = decodeEntities(stripHtml(aHtml));

    if (!question || question.length < 3) continue;
    if (!answerText || answerText.length < 3) continue;

    out.push({ question, answerText });
  }

  return out;
}

function wrapFaqSection(html: string) {
  if (!html || html.includes("faq-section")) return html;

  const sectionRe =
    /<(h2|h3)[^>]*>\s*(faq|faqs|frequently asked questions|häufige fragen|haeufige fragen)\s*<\/\1>/i;

  const sectionMatch = html.match(sectionRe);
  if (!sectionMatch || sectionMatch.index == null) return html;

  const startIndex = sectionMatch.index;
  const afterHeadingIndex = startIndex + sectionMatch[0].length;
  const afterFaq = html.slice(afterHeadingIndex);

  const nextH2 = afterFaq.search(/<h2[^>]*>/i);
  const endIndex = nextH2 >= 0 ? afterHeadingIndex + nextH2 : html.length;

  const before = html.slice(0, startIndex);
  const faqBlock = html.slice(startIndex, endIndex);
  const after = html.slice(endIndex);

  return `${before}<section class="faq-section">${faqBlock}</section>${after}`;
}

function safeJsonLd(obj: any) {
  return JSON.stringify(obj).replace(/</g, "\\u003c");
}

function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sanitizeCtaValue(value: unknown) {
  return stripHtml(String(value ?? "")).trim();
}

function extractYoutubeId(url: string) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();

    if (host.includes("youtu.be")) {
      return parsed.pathname.replace("/", "").trim() || null;
    }

    if (host.includes("youtube.com")) {
      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.pathname.split("/")[2] || null;
      }

      if (parsed.pathname.startsWith("/shorts/")) {
        return parsed.pathname.split("/")[2] || null;
      }

      const videoId = parsed.searchParams.get("v");
      if (videoId) return videoId;
    }
  } catch {
    return null;
  }

  return null;
}

function escapeHtmlAttribute(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderYoutubeEmbeds(html: string) {
  if (!html) return html;

  const buildEmbed = (videoId: string, title?: string) => {
    const safeTitle = escapeHtmlAttribute(
      title?.trim() || "YouTube video player",
    );

    return `<figure class="wp-block-embed is-type-video is-provider-youtube wp-block-embed-youtube wp-embed-aspect-16-9 wp-has-aspect-ratio">
  <div class="wp-block-embed__wrapper">
    <iframe loading="lazy"
            title="${safeTitle}"
            src="https://www.youtube.com/embed/${videoId}?feature=oembed"
            width="500"
            height="281"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen></iframe>
  </div>
</figure>`;
  };

  const withOembed = html.replace(
    /<oembed\s+url=["']([^"']+)["']\s*><\/oembed>/gi,
    (match, url) => {
      const videoId = extractYoutubeId(String(url));
      return videoId ? buildEmbed(videoId) : match;
    },
  );

  const withBlockWrapper = withOembed.replace(
    /<div class="wp-block-embed__wrapper">\s*(https?:\/\/[^\s<]+)\s*<\/div>/gi,
    (match, url) => {
      const videoId = extractYoutubeId(String(url));
      return videoId ? buildEmbed(videoId) : match;
    },
  );

  const withParagraphUrl = withBlockWrapper.replace(
    /<p>\s*(https?:\/\/[^\s<]+)\s*<\/p>/gi,
    (match, url) => {
      const videoId = extractYoutubeId(String(url));
      return videoId ? buildEmbed(videoId) : match;
    },
  );

  const withParagraphAnchor = withParagraphUrl.replace(
    /<p>\s*<a[^>]+href=["']([^"']+)["'][^>]*>[^<]*<\/a>\s*<\/p>/gi,
    (match, url) => {
      const videoId = extractYoutubeId(String(url));
      return videoId ? buildEmbed(videoId) : match;
    },
  );

  return withParagraphAnchor.replace(
    /<p>\s*\[embed\]\s*(https?:\/\/[^\s<\]]+)\s*\[\/embed\]\s*<\/p>/gi,
    (match, url) => {
      const videoId = extractYoutubeId(String(url));
      return videoId ? buildEmbed(videoId) : match;
    },
  );
}

function parseCategoryProducts(value: unknown): CategoryProduct[] {
  if (Array.isArray(value)) {
    return value as CategoryProduct[];
  }

  if (typeof value !== "string" || !value.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as CategoryProduct[]) : [];
  } catch {
    return [];
  }
}

function extractLeadingMedia(html: string) {
  if (!html) return { mediaHtml: null, contentHtml: html };

  const figureRe = /<figure[\s\S]*?(<img|<iframe|<video)[\s\S]*?<\/figure>/i;
  const mediaRe = /<(img|iframe|video)\b[\s\S]*?(?:<\/\1>)?/i;

  const figureMatch = figureRe.exec(html);
  const mediaMatch = mediaRe.exec(html);

  let match: RegExpExecArray | null = null;

  if (figureMatch && (mediaMatch == null || figureMatch.index <= mediaMatch.index)) {
    match = figureMatch;
  } else if (mediaMatch) {
    match = mediaMatch;
  }

  if (!match || match.index == null) {
    return { mediaHtml: null, contentHtml: html };
  }

  const before = html.slice(0, match.index);
  const after = html.slice(match.index + match[0].length);

  return { mediaHtml: match[0], contentHtml: `${before}${after}` };
}

function buildTocFromHtml(html: string) {
  const toc: TocItem[] = [];
  const slugCounts = new Map<string, number>();
  const usedIds = new Set<string>();

  const getUniqueId = (baseSlug: string) => {
    let count = slugCounts.get(baseSlug) ?? 0;
    let candidate = baseSlug;

    do {
      count += 1;
      candidate = count === 1 ? baseSlug : `${baseSlug}-${count}`;
    } while (usedIds.has(candidate));

    slugCounts.set(baseSlug, count);
    usedIds.add(candidate);
    return candidate;
  };

  const content = html.replace(
    /<h2([^>]*)>([\s\S]*?)<\/h2>/gi,
    (match, attrs, inner) => {
      const text = decodeEntities(stripHtml(inner)).trim();
      if (!text) return match;

      const idMatch = String(attrs).match(/\sid=["']([^"']+)["']/i);
      const existingId = idMatch?.[1];
      const baseSlug = existingId || slugifyHeading(text) || "section";
      const id = getUniqueId(baseSlug);

      toc.push({ id, text });

      if (existingId && existingId === id) {
        return match;
      }

      const spacer = attrs && String(attrs).trim().length > 0 ? " " : "";
      return `<h2${attrs}${spacer}id="${id}">${inner}</h2>`;
    },
  );

  return { toc, content };
}

type ContentSection = { html: string; insertAfter: boolean };

function splitContentByEverySecondH2(html: string, maxInserts = 4): ContentSection[] {
  if (!html) {
    return [{ html: "", insertAfter: false }];
  }

  const sections: ContentSection[] = [];
  const h2Regex = /<h2\b[^>]*>[\s\S]*?<\/h2>/gi;
  let lastIndex = 0;
  let h2Count = 0;
  let insertCount = 0;
  let match: RegExpExecArray | null;

  while ((match = h2Regex.exec(html)) !== null) {
    h2Count += 1;
    if (h2Count % 2 === 0 && insertCount < maxInserts) {
      const endIndex = match.index + match[0].length;
      sections.push({ html: html.slice(lastIndex, endIndex), insertAfter: true });
      lastIndex = endIndex;
      insertCount += 1;
    }
  }

  sections.push({ html: html.slice(lastIndex), insertAfter: false });

  return sections.filter((section) => section.html || section.insertAfter);
}

export async function generateStaticParams() {
  return await getAllPostSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return {};

  const meta = (post as any).meta || {};

  const title = String(meta._next_seo_title ?? "").trim() || post.title.rendered;
  const description =
    String(meta._next_meta_description ?? "").trim() || stripHtml(post.excerpt.rendered);

  const canonicalOverride = String(meta._next_canonical ?? "").trim();
  const ogImageOverride = String(meta._next_og_image ?? "").trim();
  const noindex = Boolean(meta._next_noindex);

  const base = generateContentMetadata({
    title,
    description,
    slug: post.slug,
    basePath: "",
  });

  const merged: Metadata = { ...base };

  if (canonicalOverride) {
    merged.alternates = { ...(base.alternates || {}), canonical: canonicalOverride };
    merged.openGraph = { ...(base.openGraph || {}), url: canonicalOverride };
  }

  if (ogImageOverride) {
    merged.openGraph = { ...(merged.openGraph || {}), images: [{ url: ogImageOverride }] };
    merged.twitter = { ...(merged.twitter || {}), images: [ogImageOverride] };
  }

  // Optional nice-to-haves:
  if (SITE_NAME) {
    merged.openGraph = { ...(merged.openGraph || {}), siteName: SITE_NAME };
  }
  if (TWITTER_SITE) {
    merged.twitter = { ...(merged.twitter || {}), site: TWITTER_SITE };
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
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const meta = (post as any).meta || {};

  const featuredMedia = post.featured_media
    ? await getFeaturedMediaById(post.featured_media)
    : null;

  const author = await getAuthorById(post.author);

  const rawPrimaryCategoryId = Number(meta._yoast_wpseo_primary_category);
  const primaryCategoryId = Number.isFinite(rawPrimaryCategoryId)
    ? rawPrimaryCategoryId
    : null;

  const categoryIds = Array.from(
    new Set(
      primaryCategoryId && post.categories.includes(primaryCategoryId)
        ? [primaryCategoryId, ...post.categories]
        : post.categories,
    ),
  );

  const categories = categoryIds.length ? await getCategoriesByIds(categoryIds) : [];
  const categoriesById = new Map(categories.map((cat) => [cat.id, cat]));
  const orderedCategories = categoryIds
    .map((id) => categoriesById.get(id))
    .filter(Boolean);
  const category =
    orderedCategories[0] ??
    (post.categories[0] ? await getCategoryById(post.categories[0]) : undefined);

  const categoryProducts = orderedCategories.flatMap((cat) => {
    const meta = (cat?.meta as Record<string, unknown>) || {};
    return parseCategoryProducts(meta._next_cat_products ?? "[]");
  });

  const normalizedCategoryProducts = categoryProducts
    .map((product) => {
      const name = String(product?.name ?? "").trim();
      const price = String(product?.price ?? "").trim();
      const image = String(product?.image ?? "").trim();
      const link = String(product?.link ?? "").trim();

      if (!name || !price) {
        return null;
      }

      return { name, price, image, link };
    })
    .filter(
      (
        product,
      ): product is {
        name: string;
        price: string;
        image: string;
        link: string;
      } => Boolean(product),
    );

  const productCardItems = normalizedCategoryProducts.filter(
    (product) => product.image && product.link,
  );

  const hasCategoryProducts = normalizedCategoryProducts.length > 0;
  const hasProductCards = productCardItems.length > 0;

  const ctaCategory = orderedCategories.find((cat) => {
    const meta = (cat?.meta as Record<string, unknown>) || {};
    const title = sanitizeCtaValue(meta._next_cat_cta_title);
    const text = sanitizeCtaValue(meta._next_cat_cta_text);
    return Boolean(title || text);
  });

  const ctaMeta = (ctaCategory?.meta as Record<string, unknown>) || {};

  const ctaTitle = ctaCategory ? sanitizeCtaValue(ctaMeta._next_cat_cta_title) : "";
  const ctaText = ctaCategory ? sanitizeCtaValue(ctaMeta._next_cat_cta_text) : "";
  const ctaSubtext = ctaCategory ? sanitizeCtaValue(ctaMeta._next_cat_cta_subtext) : "";

  const ctaButtons = [
    {
      label: sanitizeCtaValue(ctaMeta._next_cat_cta_btn1_label),
      href: sanitizeCtaValue(ctaMeta._next_cat_cta_btn1_url),
    },
    {
      label: sanitizeCtaValue(ctaMeta._next_cat_cta_btn2_label),
      href: sanitizeCtaValue(ctaMeta._next_cat_cta_btn2_url),
    },
  ].filter((button) => button.label && button.href);

  const heroButtons = ctaCategory ? ctaButtons : [];
  const hasHeroCta = Boolean(ctaTitle && ctaText && ctaSubtext && heroButtons.length > 0);

  const datePublishedIso = new Date(post.date).toISOString();
  const dateModifiedIso = new Date(post.modified || post.date).toISOString();

  const dateHuman = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Use same SEO overrides for schema consistency
  const seoTitle = String(meta._next_seo_title ?? "").trim() || stripHtml(post.title.rendered);
  const seoDescription =
    String(meta._next_meta_description ?? "").trim() || stripHtml(post.excerpt.rendered);

  const canonicalUrl =
    String(meta._next_canonical ?? "").trim() || `${SITE_URL}/${post.slug}`;

  const imageUrl =
    String(meta._next_og_image ?? "").trim() ||
    featuredMedia?.source_url ||
    ""; // ok to be empty; schema image is optional but recommended

  // FAQ schema (only if FAQs detected)
  const faqs = extractFaqsFromHtml(post.content.rendered);
  const faqSchema =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answerText },
          })),
        }
      : null;

  const contentWithEmbeds = renderYoutubeEmbeds(post.content.rendered);

  const { mediaHtml: leadingMediaHtml, contentHtml: contentForToc } =
    featuredMedia?.source_url
      ? { mediaHtml: null, contentHtml: contentWithEmbeds }
      : extractLeadingMedia(contentWithEmbeds);

  const isLeadingIframe = Boolean(leadingMediaHtml?.match(/<iframe/i));

  const { toc: tocItems, content: contentWithAnchors } =
    buildTocFromHtml(contentForToc);
  const contentWithFaqStyles = wrapFaqSection(contentWithAnchors);
  const contentSections = hasProductCards
    ? splitContentByEverySecondH2(contentWithFaqStyles, 4)
    : [{ html: contentWithFaqStyles, insertAfter: false }];

  // BlogPosting schema
  const blogPostingSchema: any = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    headline: seoTitle,
    description: seoDescription,
    datePublished: datePublishedIso,
    dateModified: dateModifiedIso,
    author: {
      "@type": "Person",
      name: author?.name || "Unknown",
    },
    publisher: {
      "@type": "Organization",
      name: PUBLISHER_NAME,
      ...(PUBLISHER_LOGO_URL
        ? {
            logo: {
              "@type": "ImageObject",
              url: PUBLISHER_LOGO_URL,
            },
          }
        : {}),
    },
    ...(imageUrl ? { image: [imageUrl] } : {}),
  };

  // BreadcrumbList schema (optional)
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_URL}/posts`,
      },
      ...(category?.name
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: category.name,
              item: `${SITE_URL}/category/${category.slug}`,
            },
            {
              "@type": "ListItem",
              position: 4,
              name: stripHtml(post.title.rendered),
              item: canonicalUrl,
            },
          ]
        : [
            {
              "@type": "ListItem",
              position: 3,
              name: stripHtml(post.title.rendered),
              item: canonicalUrl,
            },
          ]),
    ],
  };

  return (
    <>
      <Section className="pt-0 pb-8 md:pt-0 md:pb-12">
        {/* BlogPosting schema (always) */}
        <Script
          id="blogposting-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(blogPostingSchema) }}
        />

        {/* Breadcrumb schema (optional but recommended) */}
        <Script
          id="breadcrumb-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }}
        />

        {/* FAQ schema only if FAQs exist */}
        {faqSchema && (
          <Script
            id="faq-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }}
          />
        )}

        {hasHeroCta && (
          <div className="relative w-full blog-hero-gradient">
            <div className="relative left-1/2 right-1/2 h-[276px] w-screen -translate-x-1/2 overflow-hidden">
              <div className="relative mx-auto flex h-full w-full max-w-[90rem] items-center px-6">
                <div className="grid h-full w-full grid-cols-1 items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,36rem)_minmax(0,1fr)]">
                  <div className="relative hidden h-full items-end lg:flex" aria-hidden="true" />

                  <div className="mx-auto flex h-full max-w-xl flex-col items-center justify-center text-center">
                    <p className={cn("mt-0", heroEyebrowClass)}>{ctaTitle}</p>
                    <h2 className={cn("mt-3", heroHeadingClass)}>{ctaText}</h2>
                    <p className={cn("mt-2", heroBodyClass)}>{ctaSubtext}</p>
                    {heroButtons.length > 0 && (
                      <div className="mt-5 flex w-full flex-col items-center gap-3 md:flex-row md:flex-wrap md:justify-center">
                        {heroButtons[0] && (
                          <Link
                            href={heroButtons[0].href}
                            className={cn(
                              primaryButtonClass,
                              "inline-flex w-full items-center justify-center text-center md:w-auto",
                            )}
                          >
                            {heroButtons[0].label}
                          </Link>
                        )}
                        {heroButtons[1] && (
                          <Link
                            href={heroButtons[1].href}
                            className={cn(
                              secondaryButtonClass,
                              "inline-flex w-full items-center justify-center gap-2 text-center md:w-auto",
                            )}
                          >
                            <Play className="h-4 w-4" />
                            {heroButtons[1].label}
                          </Link>
                        )}
                      </div>
                    )}
                  </div>

                  <div
                    className="relative hidden h-full items-center justify-end lg:flex"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="relative w-full overflow-visible">
          <Container className="pt-0">
            <div className="relative">
              <div className="relative z-10 mx-auto w-full min-w-0 max-w-[690px]">
                <Prose className={blogHeadingTypography}>
                  <h1>
                    <span
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    ></span>
                  </h1>

                  {featuredMedia?.source_url ? (
                    <Card className="not-prose my-6 overflow-hidden border border-border/70 shadow-sm">
                      <CardContent className="p-0">
                        {/* eslint-disable-next-line */}
                        <img
                          className="h-96 w-full object-cover md:h-[500px]"
                          src={featuredMedia.source_url}
                          alt={post.title.rendered}
                        />
                      </CardContent>
                    </Card>
                  ) : (
                    leadingMediaHtml && (
                      <Card className="not-prose my-6 overflow-hidden border border-border/70 shadow-sm">
                        <CardContent className="p-0">
                          <div
                            className={cn(
                              "w-full overflow-hidden rounded-lg",
                              isLeadingIframe
                                ? "relative aspect-video [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:h-full [&_iframe]:w-full"
                                : "[&_img]:h-auto [&_img]:w-full [&_video]:h-auto [&_video]:w-full",
                            )}
                            dangerouslySetInnerHTML={{ __html: leadingMediaHtml }}
                          />
                        </CardContent>
                      </Card>
                    )
                  )}

                  <div className="mb-4 flex items-center justify-between gap-4 text-sm">
                    <h5>
                      Published {dateHuman} by{" "}
                      {author?.name && (
                        <span>
                          <a href={`/posts/?author=${author.id}`}>
                            {author.name}
                          </a>{" "}
                        </span>
                      )}
                    </h5>

                    {category?.name && (
                      <Link
                        href={`/category/${category.slug}`}
                        className={cn(
                          badgeVariants({ variant: "outline" }),
                          "no-underline!",
                        )}
                      >
                        {category.name}
                      </Link>
                    )}
                  </div>

                  {hasProductCards ? (
                    <div className="not-prose mb-6 w-full max-w-full">
                      <FeaturedCardsSection embedded>
                        <ProductCardsStrip
                          products={productCardItems}
                          rowClassName="sm:overflow-x-auto sm:snap-x sm:snap-mandatory"
                        />
                      </FeaturedCardsSection>
                    </div>
                  ) : null}

                  {tocItems.length > 0 && (
                    <details className="not-prose mb-6 lg:hidden">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full justify-between"
                      >
                        <summary className="list-none cursor-pointer">
                          Table of Contents
                        </summary>
                      </Button>
                      <Card className="mt-3 border border-border/70 shadow-sm">
                        <CardContent className="space-y-3 p-5">
                          <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
                            {tocItems.map((item) => (
                              <li key={item.id}>
                                <a
                                  href={`#${item.id}`}
                                  className="underline-offset-4 hover:text-foreground hover:underline"
                                >
                                  {item.text}
                                </a>
                              </li>
                            ))}
                          </ol>
                        </CardContent>
                      </Card>
                    </details>
                  )}
                </Prose>

                <Article
                  className={cn(
                    blogHeadingTypography,
                    "max-w-none w-full [&_iframe]:aspect-video [&_iframe]:h-auto [&_iframe]:w-full [&_iframe]:rounded-lg [&_iframe]:border [&_iframe]:border-border/70 [&_iframe]:shadow-sm [&_img]:w-full [&_img]:rounded-lg [&_img]:border [&_img]:border-border/70 [&_img]:shadow-sm [&_video]:w-full [&_video]:rounded-lg [&_video]:border [&_video]:border-border/70 [&_video]:shadow-sm [&_p]:font-sans [&_p]:text-[14px] [&_p]:text-[color:var(--color-neutral-600)] [&_li]:font-sans [&_li]:text-[14px] [&_li]:text-[color:var(--color-neutral-600)] [&_blockquote]:font-sans [&_blockquote]:text-[14px] [&_blockquote]:text-[color:var(--color-neutral-600)]",
                  )}
                >
                  {contentSections.map((section, index) => (
                    <Fragment key={`section-${index}`}>
                      {section.html ? (
                        <div
                          dangerouslySetInnerHTML={{ __html: section.html }}
                        />
                      ) : null}
                      {section.insertAfter ? (
                        <div className="not-prose my-6 w-full max-w-full">
                          <FeaturedCardsSection embedded>
                            <ProductCardsStrip
                              products={productCardItems}
                              rowClassName="sm:overflow-x-auto sm:snap-x sm:snap-mandatory"
                            />
                          </FeaturedCardsSection>
                        </div>
                      ) : null}
                    </Fragment>
                  ))}
                </Article>
              </div>

              <aside className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-[310px] -translate-x-[calc(690px/2+310px+3rem)] pt-8 min-[1360px]:block z-0">
                {tocItems.length > 0 && (
                  <Card className="not-prose pointer-events-auto sticky top-[calc(6rem+2rem)] w-full border border-border/70 shadow-sm">
                    <CardContent className="space-y-3 p-5">
                      <p className="text-sm font-semibold text-foreground">
                        Table of Contents
                      </p>
                      <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
                        {tocItems.map((item) => (
                          <li key={item.id}>
                            <a
                              href={`#${item.id}`}
                              className="underline-offset-4 hover:text-foreground hover:underline"
                            >
                              {item.text}
                            </a>
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>
                )}
              </aside>

              <aside className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-[310px] translate-x-[calc(690px/2+3rem)] pt-8 min-[1360px]:block z-0">
                {hasCategoryProducts ? (
                  <ProductSidebar products={normalizedCategoryProducts} />
                ) : null}
              </aside>
            </div>
          </Container>
        </div>
      </Section>

      <section className="py-0">
        <div className="bg-foreground text-background">
          <div className="mx-auto grid w-full max-w-5xl lg:grid-cols-2">
            <div className="h-64 w-full sm:h-80 lg:h-full">
              <img
                className="h-full w-full object-cover"
                src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80"
                alt="Person nutzt Smartphone für den Versand"
              />
            </div>
            <div className="flex flex-col justify-center gap-4 p-6 sm:p-8 lg:p-12">
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Aktuelle Neuigkeiten von Shopify erfahren
                </h2>
                <p className="text-sm text-muted-foreground sm:text-base">
                  Abonniere unseren Blog und erhalte kostenlose E-Commerce-Tipps,
                  Inspiration und Ressourcen direkt in deinem Posteingang.
                </p>
              </div>
              <form className="space-y-3" aria-label="Newsletter anmelden">
                <label htmlFor="newsletter-email" className="sr-only">
                  E-Mail-Adresse
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input
                    id="newsletter-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="E-Mail-Adresse hier eingeben"
                    className="rounded-full bg-background text-foreground"
                  />
                  <Button
                    type="submit"
                    className="h-10 rounded-full bg-emerald-400 px-6 text-sm font-semibold text-foreground hover:bg-emerald-500"
                  >
                    Abonnieren
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Du kannst dich jederzeit abmelden. Mit der Eingabe deiner
                  E-Mail-Adresse stimmst du dem Erhalt von Marketing-E-Mails zu.
                </p>
              </form>
            </div>
          </div>
        </div>

        <div className="bg-emerald-400 text-foreground">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-center px-6 py-12 text-center sm:px-8 lg:py-16">
            <h2 className="text-3xl font-semibold uppercase tracking-tight sm:text-4xl lg:text-5xl">
              <span className="block">MIT SHOPIFY</span>
              <span className="block">ÜBERALL</span>
              <span className="block">VERKAUFEN</span>
            </h2>
            <p className="mt-4 max-w-2xl text-sm text-foreground/80 sm:text-base">
              Learning by Doing: Teste Shopify kostenlos und entdecke alle Tools, die
              du für die Gründung, den Betrieb und den Ausbau deines Business
              benötigst.
            </p>
            <Button className="mt-6 rounded-full px-6" size="lg">
              Kostenlos starten
            </Button>
            <p className="mt-3 text-xs text-foreground/80">
              Kostenlos einsteigen und 3 Monate nur 1 €/Monat zahlen
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
