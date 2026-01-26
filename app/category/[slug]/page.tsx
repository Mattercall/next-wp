import Link from "next/link";
import Script from "next/script";
import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";

import { Section, Container } from "@/components/craft";
import { PostCard } from "@/components/posts/post-card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  getAllCategories,
  getCategoryBySlug,
  getPostsByCategoryPaginated,
} from "@/lib/wordpress";
import { getCategorySlugRedirect } from "@/lib/category-slug-redirects";
import { stripHtml } from "@/lib/metadata";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://frontend.mattercall.com";

export const dynamic = "auto";
export const revalidate = 3600;

function safeJsonLd(obj: unknown) {
  return JSON.stringify(obj, null, 2).replace(/<\/script/gi, "<\\/script");
}

function getQueryString(
  searchParams: Record<string, string | string[] | undefined>,
  excludeKey?: string
) {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (key === excludeKey || value === undefined) return;
    if (Array.isArray(value)) {
      value.forEach((entry) => params.append(key, entry));
    } else {
      params.set(key, value);
    }
  });

  return params.toString();
}

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const { slug } = await params;
  let category: Awaited<ReturnType<typeof getCategoryBySlug>> | undefined;
  try {
    category = await getCategoryBySlug(slug);
  } catch {
    return {};
  }
  if (!category) return {};

  const pageParam = searchParams ? await searchParams : {};
  const rawPage = pageParam.page;
  const pageValue = Array.isArray(rawPage)
    ? rawPage[0]
    : typeof rawPage === "string"
      ? rawPage
      : "1";
  const page = Number(pageValue);
  const isPaginated = Number.isFinite(page) && page > 1;

  const title = `${category.name} Articles`;
  const description = category.description
    ? stripHtml(category.description)
    : `Browse the latest posts in the ${category.name} category.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/category/${category.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/category/${category.slug}`,
      type: "website",
    },
    robots: isPaginated
      ? {
          index: false,
          follow: true,
        }
      : undefined,
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const redirectSlug = getCategorySlugRedirect(slug);
  if (redirectSlug && redirectSlug !== slug) {
    const queryString = getQueryString(resolvedSearchParams);
    permanentRedirect(
      `/category/${redirectSlug}${queryString ? `?${queryString}` : ""}`
    );
  }

  const rawPage = resolvedSearchParams.page;
  const pageParam = Array.isArray(rawPage)
    ? rawPage[0]
    : typeof rawPage === "string"
      ? rawPage
      : undefined;
  const currentPage = pageParam ? Number(pageParam) : 1;
  if (!Number.isFinite(currentPage) || currentPage < 1) notFound();

  let category: Awaited<ReturnType<typeof getCategoryBySlug>> | undefined;
  try {
    category = await getCategoryBySlug(slug);
  } catch {
    notFound();
  }
  if (!category) notFound();

  if (category.slug !== slug) {
    const queryString = getQueryString(resolvedSearchParams);
    permanentRedirect(
      `/category/${category.slug}${queryString ? `?${queryString}` : ""}`
    );
  }

  const { data: posts, headers } = await getPostsByCategoryPaginated(
    category.id,
    currentPage,
    9
  );
  const totalPages = headers.totalPages;

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
      {
        "@type": "ListItem",
        position: 3,
        name: category.name,
        item: `${SITE_URL}/category/${category.slug}`,
      },
    ],
  };

  const buildPageHref = (page: number) => {
    const params = new URLSearchParams(
      getQueryString(resolvedSearchParams, "page")
    );
    if (page > 1) params.set("page", page.toString());
    return `/category/${category.slug}${
      params.toString() ? `?${params.toString()}` : ""
    }`;
  };

  return (
    <Section>
      <Container>
        <Script
          id="category-breadcrumb-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }}
        />

        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/posts">Blog</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground">{category.name}</li>
          </ol>
        </nav>

        <header className="mb-8 space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            {category.name}
          </h1>
          {category.description ? (
            <p className="text-muted-foreground">
              {stripHtml(category.description)}
            </p>
          ) : null}
        </header>

        {posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            No posts available in this category yet.
          </p>
        )}

        {totalPages > 1 ? (
          <div className="mt-10">
            <Pagination>
              <PaginationContent>
                {currentPage > 1 ? (
                  <PaginationItem>
                    <PaginationPrevious href={buildPageHref(currentPage - 1)} />
                  </PaginationItem>
                ) : null}
                {currentPage > 1 ? (
                  <PaginationItem>
                    <PaginationLink href={buildPageHref(1)} size="default">
                      1
                    </PaginationLink>
                  </PaginationItem>
                ) : null}
                <PaginationItem>
                  <PaginationLink
                    href={buildPageHref(currentPage)}
                    size="default"
                    isActive
                  >
                    {currentPage}
                  </PaginationLink>
                </PaginationItem>
                {currentPage < totalPages ? (
                  <PaginationItem>
                    <PaginationLink
                      href={buildPageHref(totalPages)}
                      size="default"
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                ) : null}
                {currentPage < totalPages ? (
                  <PaginationItem>
                    <PaginationNext href={buildPageHref(currentPage + 1)} />
                  </PaginationItem>
                ) : null}
              </PaginationContent>
            </Pagination>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
