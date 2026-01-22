import {
  getPostBySlug,
  getFeaturedMediaById,
  getAuthorById,
  getCategoryById,
  getAllPostSlugs,
} from "@/lib/wordpress";
import { generateContentMetadata, stripHtml } from "@/lib/metadata";
import { decodeEntities } from "@/lib/html";

import { Section, Container, Article, Prose } from "@/components/craft";
import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Script from "next/script";

/**
 * Extract FAQs from WP HTML content.
 * Expected structure:
 *  - A heading: <h2>FAQ</h2> or <h2>FAQs</h2> or <h2>Häufige Fragen</h2> (also works with <h3>)
 *  - Each question as <h3>Question...</h3>
 *  - Answer is the content until the next <h3> or end of FAQ block
 */
type FaqItem = { question: string; answerText: string };

function extractFaqsFromHtml(html: string): FaqItem[] {
  if (!html) return [];

  // Find the FAQ section heading
  const sectionRe =
    /<(h2|h3)[^>]*>\s*(faq|faqs|frequently asked questions|häufige fragen|haeufige fragen)\s*<\/\1>/i;

  const sectionMatch = html.match(sectionRe);
  if (!sectionMatch || sectionMatch.index == null) return [];

  const startIndex = sectionMatch.index + sectionMatch[0].length;
  const afterFaq = html.slice(startIndex);

  // Stop at next H2 to avoid grabbing other sections
  const nextH2 = afterFaq.search(/<h2[^>]*>/i);
  const faqBlock = nextH2 >= 0 ? afterFaq.slice(0, nextH2) : afterFaq;

  // Q/A pairs where Q is an H3
  const qaRe = /<h3[^>]*>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3[^>]*>|$)/gi;

  const out: FaqItem[] = [];
  let m: RegExpExecArray | null;

  while ((m = qaRe.exec(faqBlock)) !== null) {
    const qHtml = m[1] || "";
    const aHtml = (m[2] || "").trim();

    const question = decodeEntities(stripHtml(qHtml));
    const answerText = decodeEntities(stripHtml(aHtml));

    // guardrails: skip empty/very short content
    if (!question || question.length < 3) continue;
    if (!answerText || answerText.length < 3) continue;

    out.push({ question, answerText });
  }

  return out;
}

function safeJsonLd(obj: any) {
  // Prevent </script> injection edge case
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
    decodeEntities(stripHtml(post.excerpt.rendered));

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
  const post = await getPostBySlug(slug);

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

  const category = await getCategoryById(post.categories[0]);

  // Extract FAQs from the rendered HTML content
  const faqs = extractFaqsFromHtml(post.content.rendered);

  const faqSchema =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.answerText,
            },
          })),
        }
      : null;

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

            <Link
              href={`/posts/?category=${category.id}`}
              className={cn(
                badgeVariants({ variant: "outline" }),
                "no-underline!"
              )}
            >
              {category.name}
            </Link>
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
