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

      <Container className="pt-0">
        <Prose>
          <h1>
            <span dangerouslySetInnerHTML={{ __html: post.title.rendered }}></span>
          </h1>

          <div className="flex justify-between items-center gap-4 text-sm mb-4">
            <h5>
              Published {dateHuman} by{" "}
              {author?.name && (
                <span>
                  <a href={`/posts/?author=${author.id}`}>{author.name}</a>{" "}
                </span>
              )}
            </h5>

            {category?.name && (
              <Link
                href={`/posts/?category=${category.id}`}
                className={cn(badgeVariants({ variant: "outline" }), "no-underline!")}
              >
                {category.name}
              </Link>
            )}
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

        <Article dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
      </Container>
    </Section>
  );
}
