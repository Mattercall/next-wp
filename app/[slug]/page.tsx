import {
  getPostBySlug,
  getFeaturedMediaById,
  getAuthorById,
  getCategoryById,
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

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Script from "next/script";
import { Play } from "lucide-react";

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

  const { mediaHtml: leadingMediaHtml, contentHtml: contentForToc } =
    featuredMedia?.source_url
      ? { mediaHtml: null, contentHtml: post.content.rendered }
      : extractLeadingMedia(post.content.rendered);

  const isLeadingIframe = Boolean(leadingMediaHtml?.match(/<iframe/i));

  const { toc: tocItems, content: contentWithAnchors } =
    buildTocFromHtml(contentForToc);

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

        <div className="relative w-full bg-[#f7f3ee]">
          <div className="relative left-1/2 right-1/2 h-[276px] w-screen -translate-x-1/2 overflow-hidden">
            <div className="relative mx-auto flex h-full w-full max-w-[90rem] items-center px-6">
              <div className="grid h-full w-full grid-cols-1 items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,36rem)_minmax(0,1fr)]">
                <div className="relative hidden h-full items-end lg:flex">
                  <img
                    className="h-[180px] w-[240px] rounded-3xl object-cover shadow-lg"
                    src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80"
                    alt="Zwei Personen im Gespräch mit Laptop"
                  />
                </div>

                <div className="mx-auto flex h-full max-w-xl flex-col items-center justify-center text-center">
                  <p className={cn("mt-0", heroEyebrowClass)}>Shopify Starter</p>
                  <h2 className={cn("mt-3", heroHeadingClass)}>
                    Noch heute mit Shopify verkaufen.
                  </h2>
                  <p className={cn("mt-2", heroBodyClass)}>
                    Teste Shopify noch heute kostenlos und nutze Ressourcen, die dich
                    Schritt für Schritt begleiten.
                  </p>
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                    <Link href="/" className={primaryButtonClass}>
                      Kostenlos starten
                    </Link>
                    <Link
                      href="/"
                      className={cn(
                        secondaryButtonClass,
                        "inline-flex items-center gap-2",
                      )}
                    >
                      <Play className="h-4 w-4" />
                      So funktioniert Shopify
                    </Link>
                  </div>
                </div>

                <div className="relative hidden h-full items-center justify-end lg:flex">
                  <img
                    className="absolute right-0 top-6 h-[110px] w-[140px] rounded-2xl object-cover shadow-md"
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=500&q=80"
                    alt="Händler im Gespräch"
                  />
                  <img
                    className="absolute bottom-6 right-0 h-[190px] w-[250px] rounded-3xl object-cover shadow-lg"
                    src="https://images.unsplash.com/photo-1515165562835-c4c9cc9719a9?auto=format&fit=crop&w=900&q=80"
                    alt="Hand mit Smartphone über Paket"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-full">
          {tocItems.length > 0 && (
            <aside className="absolute top-0 hidden w-[310px] min-[1360px]:block [left:calc(50%-345px-310px-24px)]">
              <Card className="not-prose sticky top-24 border border-border/70 shadow-sm">
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
            </aside>
          )}

          <aside className="absolute top-0 hidden w-[310px] min-[1360px]:block [left:calc(50%+345px+24px)]">
            <Card className="not-prose sticky top-24 border border-border/70 shadow-sm">
              <CardContent className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                      For Business Shark
                    </p>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      Here, I focus on a range of items and features that we use
                      in life without them.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-full border border-border/70 px-2 py-1 text-xs text-muted-foreground"
                  >
                    •••
                  </button>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">
                    Choose a plan to get started
                  </p>
                  <div className="space-y-2">
                    {[
                      { label: "Branding", price: "$60" },
                      { label: "Marketing", price: "$120", checked: true },
                      { label: "Web Development", price: "$250" },
                      { label: "App Development", price: "$320" },
                    ].map((plan) => (
                      <label
                        key={plan.label}
                        className={cn(
                          "flex cursor-pointer items-center justify-between rounded-lg border border-border/70 px-3 py-2 text-sm",
                          plan.checked && "bg-muted/40 text-foreground",
                        )}
                      >
                        <span className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="plan"
                            defaultChecked={plan.checked}
                            className="h-4 w-4 accent-foreground"
                          />
                          {plan.label}
                        </span>
                        <span className="rounded-full border border-border/70 bg-muted/30 px-2 py-0.5 text-xs font-semibold text-foreground">
                          {plan.price}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Taxes</span>
                    <span>$32</span>
                  </div>
                  <div className="flex items-center justify-between font-semibold text-foreground">
                    <span>Total amount</span>
                    <span>$152</span>
                  </div>
                </div>

                <Button className="w-full rounded-full">Pay now</Button>
              </CardContent>
            </Card>
          </aside>

          <Container className="pt-0">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_690px_minmax(0,1fr)] lg:gap-12">
              <div className="w-full lg:col-start-2 lg:w-[690px] lg:justify-self-center">
                <Prose>
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
                        href={`/posts/?category=${category.id}`}
                        className={cn(
                          badgeVariants({ variant: "outline" }),
                          "no-underline!",
                        )}
                      >
                        {category.name}
                      </Link>
                    )}
                  </div>

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
                  className="max-w-none w-full [&_iframe]:aspect-video [&_iframe]:h-auto [&_iframe]:w-full [&_iframe]:rounded-lg [&_iframe]:border [&_iframe]:border-border/70 [&_iframe]:shadow-sm [&_img]:w-full [&_img]:rounded-lg [&_img]:border [&_img]:border-border/70 [&_img]:shadow-sm [&_video]:w-full [&_video]:rounded-lg [&_video]:border [&_video]:border-border/70 [&_video]:shadow-sm"
                  dangerouslySetInnerHTML={{ __html: contentWithAnchors }}
                />
              </div>
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
