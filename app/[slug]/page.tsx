import {
  getPostBySlug,
  getFeaturedMediaById,
  getAuthorById,
  getCategoryById,
  getAllPostSlugs,
} from "@/lib/wordpress";
import { generateContentMetadata, stripHtml } from "@/lib/metadata";

import { Section, Container } from "@/components/craft";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Bookmark, Search, Share2, Star, User } from "lucide-react";

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Script from "next/script";

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

const tocItems = [
  { label: "Kurzüberblick", href: "#kurzueberblick" },
  { label: "Inhaltsverzeichnis", href: "#inhaltsverzeichnis" },
  { label: "Kriterien im Vergleich", href: "#kriterien" },
  { label: "Anbieter im Detail", href: "#anbieter" },
  { label: "Preisvergleich", href: "#preise" },
  { label: "Fazit", href: "#fazit" },
];

const navLinks = ["Vergleich", "Anbieter", "Tools", "Preise", "Blog"];

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

  const hasWordpress = Boolean(process.env.WORDPRESS_URL);

  if (!post && hasWordpress) notFound();

  const resolvedPost =
    post ||
    ({
      id: 0,
      slug,
      title: { rendered: "Print-on-Demand-Anbieter im Vergleich" },
      excerpt: { rendered: "Ein strukturierter Überblick über Anbieter, Preise und Qualität." },
      content: { rendered: "" },
      date: new Date().toISOString(),
      modified: new Date().toISOString(),
      featured_media: 0,
      author: 0,
      categories: [],
    } as any);

  const meta = (resolvedPost as any).meta || {};

  const featuredMedia = resolvedPost.featured_media
    ? await getFeaturedMediaById(resolvedPost.featured_media)
    : null;

  const author = resolvedPost.author ? await getAuthorById(resolvedPost.author) : null;

  const category =
    resolvedPost.categories && resolvedPost.categories.length > 0
      ? await getCategoryById(resolvedPost.categories[0])
      : null;

  const datePublishedIso = new Date(resolvedPost.date).toISOString();
  const dateModifiedIso = new Date(
    resolvedPost.modified || resolvedPost.date
  ).toISOString();

  const dateHuman = new Date(resolvedPost.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const authorName = author?.name || "Redaktion";

  // Use same SEO overrides for schema consistency
  const seoTitle =
    String(meta._next_seo_title ?? "").trim() || stripHtml(resolvedPost.title.rendered);
  const seoDescription =
    String(meta._next_meta_description ?? "").trim() || stripHtml(resolvedPost.excerpt.rendered);

  const canonicalUrl =
    String(meta._next_canonical ?? "").trim() || `${SITE_URL}/${resolvedPost.slug}`;

  const imageUrl =
    String(meta._next_og_image ?? "").trim() ||
    featuredMedia?.source_url ||
    ""; // ok to be empty; schema image is optional but recommended

  // FAQ schema (only if FAQs detected)
  const faqs = extractFaqsFromHtml(resolvedPost.content.rendered);
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
              name: stripHtml(resolvedPost.title.rendered),
              item: canonicalUrl,
            },
          ]
        : [
            {
              "@type": "ListItem",
              position: 3,
              name: stripHtml(resolvedPost.title.rendered),
              item: canonicalUrl,
            },
          ]),
    ],
  };

  return (
    <Section className="bg-white py-0 text-neutral-900">
      <Container className="max-w-[1440px] px-4 sm:px-6 lg:px-8">
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
        <header className="flex flex-wrap items-center justify-between gap-4 py-5 text-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-xs font-semibold text-white">
              CW
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              CompareWire
            </span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-neutral-600 lg:flex">
            {navLinks.map((link) => (
              <a key={link} href="#" className="transition hover:text-neutral-900">
                {link}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button className="hidden h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition hover:text-neutral-900 sm:flex">
              <Search className="h-4 w-4" />
            </button>
            <button className="hidden h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition hover:text-neutral-900 sm:flex">
              <User className="h-4 w-4" />
            </button>
            <Button className="rounded-full bg-neutral-900 px-5 text-sm text-white hover:bg-neutral-800">
              Vergleichen
            </Button>
          </div>
        </header>
      </Container>

      <div className="border-y border-neutral-100 bg-[#f7f7f3]">
        <Container className="max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 py-10 lg:grid-cols-[260px_minmax(0,1fr)_280px] lg:gap-8">
            <div className="hidden lg:block" />
            <div className="space-y-5 text-center lg:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
                Vergleich 2024
              </p>
              <h1 className="text-4xl font-semibold text-neutral-900 sm:text-5xl lg:text-6xl">
                Print-on-Demand-Anbieter im Vergleich
              </h1>
              <p className="text-base text-neutral-600 sm:text-lg">
                Ein umfassender Langform-Guide für Plattformen, Preise und Qualität mit klaren
                Empfehlungen für jedes Geschäftsmodell.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-neutral-500 lg:justify-start">
                <span className="font-medium text-neutral-700">{authorName}</span>
                <span>•</span>
                <span>{dateHuman}</span>
                <span>•</span>
                <span>18 Min. Lesezeit</span>
                <span>•</span>
                <span className="text-neutral-700">
                  {category?.name ? (
                    <Link href={`/posts/?category=${category.id}`} className="hover:underline">
                      {category.name}
                    </Link>
                  ) : (
                    "Vergleich"
                  )}
                </span>
              </div>
              <div className="flex items-center justify-center gap-3 text-neutral-500 lg:justify-start">
                <button className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white">
                  <Share2 className="h-4 w-4" />
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white">
                  <Bookmark className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="hidden lg:block" />
          </div>
        </Container>
      </div>

      <Container className="max-w-[1440px] px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)_280px] lg:gap-8">
          <aside className="hidden flex-col gap-6 lg:flex lg:sticky lg:top-24 lg:self-start">
            <Card className="border-neutral-200 shadow-sm">
              <CardHeader className="pb-3">
                <p className="text-sm font-semibold text-neutral-900">Inhalt</p>
                <p className="text-xs text-neutral-500">
                  Kurzüberblick und Tools für den Vergleich.
                </p>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-neutral-600">
                {tocItems.slice(0, 3).map((item) => (
                  <a key={item.href} href={item.href} className="block hover:text-neutral-900">
                    {item.label}
                  </a>
                ))}
              </CardContent>
            </Card>
            <Card className="border-none bg-[#66c084] text-neutral-900 shadow-sm">
              <CardContent className="space-y-2 p-5 text-sm font-semibold">
                <p className="text-xs uppercase tracking-[0.2em]">Promo</p>
                <p>Nur diese Woche:</p>
                <p className="text-lg">50€ Startguthaben sichern</p>
                <p className="text-xs font-normal">Code: POD50</p>
              </CardContent>
            </Card>
          </aside>

          <article className="space-y-10 text-neutral-700">
            <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
              {/* eslint-disable-next-line */}
              <img
                src={
                  featuredMedia?.source_url ||
                  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1400&q=80"
                }
                alt="Comparison cover"
                className="h-[320px] w-full object-cover sm:h-[420px]"
              />
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white px-6 py-5 text-base leading-7 text-neutral-700 shadow-sm">
              <p>
                Dieser Artikel liefert einen strukturierten Überblick über Print-on-Demand-Plattformen,
                inklusive Preisvergleich, Qualitätsbewertung und Praxis-Checklisten. Ziel ist eine
                klare Entscheidungshilfe für Einsteiger:innen und wachsende Shops.
              </p>
            </div>

            <div className="space-y-4 lg:hidden">
              <div className="hidden md:block rounded-xl border border-neutral-200 bg-white p-5">
                <p className="text-sm font-semibold text-neutral-900">Table of Contents</p>
                <ul className="mt-3 space-y-2 text-sm text-blue-600">
                  {tocItems.map((item) => (
                    <li key={item.href}>
                      <a href={item.href} className="hover:underline">
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <Accordion className="md:hidden">
                <AccordionItem value="toc">
                  <AccordionTrigger className="text-sm font-semibold text-neutral-900">
                    Inhaltsverzeichnis
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 text-sm text-blue-600">
                      {tocItems.map((item) => (
                        <li key={item.href}>
                          <a href={item.href} className="hover:underline">
                            {item.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <section id="kurzueberblick" className="space-y-5">
              <div className="flex items-center justify-between text-sm text-neutral-500">
                <p className="uppercase tracking-[0.2em] text-xs font-semibold">Kurzüberblick</p>
                <div className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  <Bookmark className="h-4 w-4" />
                </div>
              </div>
              <h2 className="text-3xl font-semibold text-neutral-900">Die wichtigsten Erkenntnisse</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod, tortor nec
                facilisis tempor, elit magna varius urna, non consequat risus neque eget ipsum.
                Pellentesque habitant morbi tristique senectus et netus.
              </p>
              <Card className="border-none bg-[#f6efe6] shadow-none">
                <CardContent className="p-5 text-sm text-neutral-700">
                  <p className="font-semibold text-neutral-900">Highlight</p>
                  <p className="mt-2">
                    Die besten Anbieter kombinieren schnelle Lieferzeiten mit transparenten
                    Produktionskosten und einer stabilen API-Anbindung.
                  </p>
                </CardContent>
              </Card>
              <ul className="list-disc space-y-2 pl-5 text-sm text-neutral-700">
                <li>Praxis-Check: Shops mit wenig Startkapital profitieren von flexiblen Mindestmengen.</li>
                <li>Qualitätssicherung bleibt der wichtigste Erfolgsfaktor im POD-Geschäft.</li>
                <li>Automatisierung spart bis zu 6 Stunden pro Woche im Fulfillment.</li>
              </ul>
            </section>

            <section id="inhaltsverzeichnis" className="space-y-5">
              <h2 className="text-2xl font-semibold text-neutral-900">Inhaltsverzeichnis</h2>
              <div className="rounded-xl border border-neutral-200 bg-white p-5">
                <ul className="space-y-2 text-sm text-blue-600">
                  {tocItems.map((item, index) => (
                    <li key={item.href}>
                      <a href={item.href} className="hover:underline">
                        {index + 1}. {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section id="kriterien" className="space-y-5">
              <h2 className="text-3xl font-semibold text-neutral-900">Kriterien im Vergleich</h2>
              <p>
                Integer dignissim risus et eros viverra, ut convallis risus egestas. Suspendisse
                potenti. Aenean sed lacinia nibh, vel dignissim justo. Maecenas fermentum consequat
                sapien, et ultricies est volutpat vel.
              </p>
              <div className="flex items-center gap-3 text-sm text-neutral-500">
                <Star className="h-4 w-4" />
                <span>Bewertungskriterien: Preis, Qualität, Versand, Integrationen</span>
              </div>
              <Card className="border-none bg-[#f6efe6] shadow-none">
                <CardContent className="p-5 text-sm text-neutral-700">
                  <p className="font-semibold text-neutral-900">Key Takeaway</p>
                  <p className="mt-2">
                    Anbieter mit lokalen Produktionsstätten reduzieren Retouren und bieten stabilere
                    Lieferzeiten.
                  </p>
                </CardContent>
              </Card>
              <ul className="list-disc space-y-2 pl-5 text-sm text-neutral-700">
                <li>Preisstruktur: Fixkosten vs. variable Gebühren pro Bestellung.</li>
                <li>Produktkatalog: Vielfalt bei Textil, Accessoires und Packaging.</li>
                <li>Support: Dedizierte Ansprechpartner:innen ab einem bestimmten Umsatz.</li>
              </ul>
            </section>

            <section id="anbieter" className="space-y-6">
              <h2 className="text-3xl font-semibold text-neutral-900">Anbieter im Detail</h2>
              {["Provider Alpha", "Provider Beta", "Provider Gamma"].map((provider) => (
                <div key={provider} className="space-y-4">
                  <h3 className="text-2xl font-semibold text-neutral-900">{provider}</h3>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras at ultrices risus.
                    Sed tristique, nunc at tincidunt fermentum, ex sapien ultrices neque, in maximus
                    lorem leo at mauris.
                  </p>
                  <ul className="list-disc space-y-2 pl-5 text-sm text-neutral-700">
                    <li>Stärken: stabile Lieferzeiten, große Produktpalette.</li>
                    <li>Schwächen: etwas höhere Basispreise.</li>
                    <li>Ideal für: Marken mit wiederkehrenden Bestellungen.</li>
                  </ul>
                </div>
              ))}
            </section>

            <section id="preise" className="space-y-5">
              <h2 className="text-3xl font-semibold text-neutral-900">Preisvergleich & Fazit</h2>
              <p>
                Vivamus sed nibh in libero fermentum egestas. Proin posuere, arcu non commodo
                fermentum, magna erat tempor purus, nec dictum dolor elit at metus. Morbi sed
                elementum nisi.
              </p>
              <Card className="border-none bg-[#f6efe6] shadow-none">
                <CardContent className="p-5 text-sm text-neutral-700">
                  <p className="font-semibold text-neutral-900">Quick Summary</p>
                  <p className="mt-2">
                    Für kostenbewusste Shops lohnt sich ein Anbieter mit flexiblen Mindestmengen,
                    während Premium-Brands auf lokale Produktion setzen sollten.
                  </p>
                </CardContent>
              </Card>
              <ul className="list-disc space-y-2 pl-5 text-sm text-neutral-700">
                <li>Durchschnittspreise liegen zwischen 12€ und 18€ pro Shirt.</li>
                <li>Rabatte ab 100 Bestellungen pro Monat sind üblich.</li>
                <li>Zusätzliche Gebühren für Branding oder Custom Packaging beachten.</li>
              </ul>
            </section>

            <section id="fazit" className="space-y-5">
              <h2 className="text-3xl font-semibold text-neutral-900">Fazit</h2>
              <p>
                Duis pharetra lorem sed purus egestas, in feugiat neque lacinia. Cras varius
                consectetur mauris, sed fermentum erat volutpat quis. Ut id lacus eget nisl
                convallis tincidunt non at purus.
              </p>
            </section>

            <div className="space-y-6 lg:hidden">
              <Card className="border-neutral-200 shadow-sm">
                <CardContent className="space-y-2 p-5 text-sm text-neutral-700">
                  <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                    Promo Angebot
                  </p>
                  <p className="text-lg font-semibold text-neutral-900">
                    Gratis Musterbox für neue Shops
                  </p>
                  <p>
                    Teste Materialien und Druckqualität mit ausgewählten Bestsellern.
                  </p>
                  <Button className="mt-2 w-full rounded-full bg-neutral-900 text-white hover:bg-neutral-800">
                    Jetzt sichern
                  </Button>
                </CardContent>
              </Card>
            </div>
          </article>

          <aside className="hidden flex-col gap-6 lg:flex lg:sticky lg:top-24 lg:self-start">
            <Card className="border-neutral-200 shadow-sm">
              <CardHeader className="pb-3">
                <p className="text-sm font-semibold text-neutral-900">Kurzbewertung</p>
                <div className="flex items-center gap-1 text-sm text-yellow-500">
                  {[...Array(5)].map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-yellow-400" />
                  ))}
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-neutral-600">
                <p>Gesamtwertung: 4.7/5</p>
                <p>Beste für Skalierung</p>
                <p>Schneller Support</p>
              </CardContent>
            </Card>

            <Card className="border-neutral-200 shadow-sm">
              <CardContent className="space-y-2 p-5 text-sm text-neutral-700">
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Quick Facts</p>
                <p>Produktion in 3 Werken</p>
                <p>Versand innerhalb 48h</p>
                <p>API + Shopify-Integration</p>
              </CardContent>
            </Card>

            <Card className="border-neutral-200 shadow-sm">
              <div className="overflow-hidden rounded-t-xl">
                {/* eslint-disable-next-line */}
                <img
                  src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80"
                  alt="Promo"
                  className="h-32 w-full object-cover"
                />
              </div>
              <CardContent className="space-y-3 p-5">
                <p className="text-sm font-semibold text-neutral-900">
                  Kostenlose Produktfotos sichern
                </p>
                <p className="text-xs text-neutral-600">
                  Hol dir ein Set an Studioaufnahmen für deinen Shop.
                </p>
                <Button className="w-full rounded-full bg-neutral-900 text-white hover:bg-neutral-800">
                  Mehr erfahren
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>

        <div className="mt-10 grid gap-6 lg:hidden">
          <Card className="border-neutral-200 shadow-sm">
            <CardContent className="space-y-2 p-5 text-sm text-neutral-700">
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Sidebar Widgets</p>
              <p>Sternebewertung, Facts & Aktionen</p>
              <Button className="mt-2 rounded-full bg-neutral-900 text-white hover:bg-neutral-800">
                Jetzt prüfen
              </Button>
            </CardContent>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
