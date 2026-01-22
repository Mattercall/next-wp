import {
  getPostBySlug,
  getFeaturedMediaById,
  getAuthorById,
  getCategoryById,
  getAllPostSlugs,
} from "@/lib/wordpress";
import { generateContentMetadata, stripHtml } from "@/lib/metadata";

import { Section, Container, Article } from "@/components/craft";
import { badgeVariants } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Script from "next/script";
import { MoreHorizontal } from "lucide-react";

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
type TocItem = { id: string; text: string; level: number };

function decodeEntities(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildTocAndContent(html: string) {
  const headings: TocItem[] = [];
  const slugCounts = new Map<string, number>();

  const updatedHtml = html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (match, level, attrs, inner) => {
      const existingIdMatch = String(attrs).match(/id=["']([^"']+)["']/i);
      const headingText = decodeEntities(stripHtml(inner || ""));
      const baseSlug = slugifyHeading(headingText) || "section";

      const count = slugCounts.get(baseSlug) ?? 0;
      slugCounts.set(baseSlug, count + 1);

      const id = existingIdMatch?.[1] ?? (count ? `${baseSlug}-${count + 1}` : baseSlug);

      headings.push({ id, text: headingText, level: Number(level) });

      if (existingIdMatch) return match;

      return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
    },
  );

  return { html: updatedHtml, headings };
}

function getReadingTimeMinutes(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
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

function safeJsonLd(obj: any) {
  return JSON.stringify(obj).replace(/</g, "\\u003c");
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

  const category = await getCategoryById(post.categories[0]);

  const datePublishedIso = new Date(post.date).toISOString();
  const dateModifiedIso = new Date(post.modified || post.date).toISOString();

  const dateHuman = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const excerptText = stripHtml(post.excerpt.rendered).trim();
  const { html: contentHtml, headings } = buildTocAndContent(post.content.rendered);
  const readingTimeMinutes = getReadingTimeMinutes(stripHtml(post.content.rendered));

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
              item: `${SITE_URL}/posts/?category=${category.id}`,
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
    <Section className="bg-white">
      <Container className="max-w-7xl">
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

        <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1fr)_280px] lg:grid-cols-[260px_minmax(0,720px)_300px] lg:gap-8">
          <aside className="order-2 hidden lg:order-1 lg:block">
            <div className="sticky top-24 flex max-h-[calc(100vh-6rem)] flex-col gap-6">
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold tracking-normal text-foreground">
                    Table of contents
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {headings.length > 0 ? (
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {headings.map((heading) => (
                        <li
                          key={heading.id}
                          className={cn(
                            "leading-snug",
                            heading.level === 3 && "pl-4 text-xs",
                          )}
                        >
                          <a
                            href={`#${heading.id}`}
                            className="text-foreground/70 transition hover:text-foreground"
                          >
                            {heading.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No sections available.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </aside>

          <div className="order-1 lg:order-2">
            <div className="space-y-8">
              {headings.length > 0 && (
                <Card className="shadow-sm lg:hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold tracking-normal text-foreground">
                      Table of contents
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <details className="group">
                      <summary className="cursor-pointer text-sm font-medium text-foreground">
                        Jump to section
                      </summary>
                      <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                        {headings.map((heading) => (
                          <li
                            key={heading.id}
                            className={cn(
                              "leading-snug",
                              heading.level === 3 && "pl-4 text-xs",
                            )}
                          >
                            <a
                              href={`#${heading.id}`}
                              className="text-foreground/70 transition hover:text-foreground"
                            >
                              {heading.text}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </CardContent>
                </Card>
              )}

              <header className="space-y-4">
                <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                  <span dangerouslySetInnerHTML={{ __html: post.title.rendered }}></span>
                </h1>

                {excerptText && (
                  <p className="text-lg text-muted-foreground">{excerptText}</p>
                )}

                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
                  {author?.avatar_urls?.["96"] && (
                    // eslint-disable-next-line
                    <img
                      src={author.avatar_urls["96"]}
                      alt={author.name}
                      className="h-9 w-9 rounded-full border object-cover"
                    />
                  )}
                  {author?.name && (
                    <span>
                      <a
                        href={`/posts/?author=${author.id}`}
                        className="font-medium text-foreground hover:underline"
                      >
                        {author.name}
                      </a>
                    </span>
                  )}
                  <span className="text-muted-foreground">•</span>
                  <span>{dateHuman}</span>
                  <span className="text-muted-foreground">•</span>
                  <span>{readingTimeMinutes} min read</span>
                  {category?.name && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <Link
                        href={`/posts/?category=${category.id}`}
                        className={cn(
                          badgeVariants({ variant: "outline" }),
                          "no-underline! text-foreground",
                        )}
                      >
                        {category.name}
                      </Link>
                    </>
                  )}
                </div>
              </header>

              {featuredMedia?.source_url && (
                <div className="h-72 overflow-hidden rounded-xl border bg-accent/25 md:h-[420px]">
                  {/* eslint-disable-next-line */}
                  <img
                    className="h-full w-full object-cover"
                    src={featuredMedia.source_url}
                    alt={post.title.rendered}
                  />
                </div>
              )}

              <Article
                className={cn(
                  "max-w-none text-foreground/90",
                  "[&_h2]:scroll-mt-24 [&_h3]:scroll-mt-24",
                  "[&_p]:text-[1rem] [&_p]:leading-7",
                  "[&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-2xl",
                  "[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-xl",
                  "[&_a]:text-blue-600 hover:[&_a]:text-blue-700",
                  "[&_blockquote]:rounded-lg [&_blockquote]:border [&_blockquote]:border-border/60 [&_blockquote]:bg-muted/40 [&_blockquote]:px-6 [&_blockquote]:py-4 [&_blockquote]:text-foreground/80",
                  "[&_.is-style-callout]:rounded-xl [&_.is-style-callout]:border [&_.is-style-callout]:border-amber-100 [&_.is-style-callout]:bg-amber-50/70 [&_.is-style-callout]:px-6 [&_.is-style-callout]:py-4",
                )}
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            </div>
          </div>

          <aside className="order-3">
            <div className="sticky top-24 flex max-h-[calc(100vh-6rem)] flex-col gap-6 overflow-auto">
              <Card className="border-border/60 shadow-sm">
                <div className="space-y-5 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        For Business Shark
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Here, I focus on a range of items and features that we use in
                        life without them
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground"
                      aria-label="Open plan menu"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <p className="text-sm font-semibold text-foreground">
                      Choose a plan to get started
                    </p>
                    <div className="space-y-3">
                      {[
                        { name: "Branding", price: "$60" },
                        { name: "Marketing", price: "$120", selected: true },
                        { name: "Web Development", price: "$250" },
                        { name: "App Development", price: "$320" },
                      ].map((plan) => (
                        <div
                          key={plan.name}
                          className="flex items-center gap-3 rounded-xl border border-border/70 bg-white px-3 py-2.5"
                        >
                          <Checkbox
                            checked={plan.selected}
                            readOnly
                            aria-label={`${plan.name} plan`}
                            className="h-4 w-4 border-border/70 accent-black"
                          />
                          <span className="text-sm font-medium text-foreground">
                            {plan.name}
                          </span>
                          <span className="ml-auto rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-foreground">
                            {plan.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-border/60" />

                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>Taxes</span>
                      <span className="text-foreground">$32</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Total amount</span>
                      <span className="text-lg font-semibold text-foreground">
                        $152
                      </span>
                    </div>
                  </div>

                  <Button className="h-11 w-full rounded-full bg-black text-white shadow-sm hover:bg-black/90">
                    Pay now
                  </Button>
                </div>
              </Card>

              {author?.name && (
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold tracking-normal text-foreground">
                      Author
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-3">
                      {author.avatar_urls?.["96"] && (
                        // eslint-disable-next-line
                        <img
                          src={author.avatar_urls["96"]}
                          alt={author.name}
                          className="h-12 w-12 rounded-full border object-cover"
                        />
                      )}
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {author.name}
                        </p>
                        {author.description && (
                          <p className="text-xs text-muted-foreground">
                            {author.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <a
                      href={`/posts/?author=${author.id}`}
                      className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                      View all posts
                    </a>
                  </CardContent>
                </Card>
              )}
            </div>
          </aside>
        </div>
      </Container>
    </Section>
  );
}
