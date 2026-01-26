import {
  getAllCategories,
  getCategoryById,
  searchCategories,
  getPostsByCategoryPaginated,
} from "@/lib/wordpress";

import { Section, Container } from "@/components/craft";
import { HeroCarousel } from "@/components/posts/hero-carousel";
import { QuickActions } from "@/components/posts/quick-actions";
import { LogoChipsRow } from "@/components/posts/logo-chips-row";
import {
  CategorySpotlightGrid,
  CategorySpotlightSection,
  getSpotlightAccent,
} from "@/components/posts/category-spotlight";
import { CategoryChips } from "@/components/posts/category-chips";

import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Posts",
  description: "Browse all our blog posts",
  alternates: {
    canonical: "/posts",
  },
};

export const dynamic = "auto";
export const revalidate = 3600;

const trendingConfig = [
  { slug: "most-popular", title: "Most popular" },
  { slug: "weekly-spotlight", title: "Weekly spotlight" },
  { slug: "in-demand-ai-skills", title: "In-demand AI skills" },
];

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const rawCategory = params.category;
  const categoryParam = Array.isArray(rawCategory)
    ? rawCategory[0]
    : typeof rawCategory === "string"
      ? rawCategory
      : undefined;
  const rawSearch = params.search;
  const search = Array.isArray(rawSearch)
    ? rawSearch[0]
    : typeof rawSearch === "string"
      ? rawSearch
      : undefined;

  if (categoryParam) {
    const categoryId = Number(categoryParam);
    if (!Number.isFinite(categoryId)) notFound();

    try {
      const category = await getCategoryById(categoryId);
      if (!category?.slug) notFound();

      const redirectParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (key === "category" || value === undefined) return;
        if (Array.isArray(value)) {
          value.forEach((entry) => redirectParams.append(key, entry));
        } else {
          redirectParams.set(key, value);
        }
      });

      const queryString = redirectParams.toString();
      permanentRedirect(
        `/category/${category.slug}${queryString ? `?${queryString}` : ""}`
      );
    } catch {
      notFound();
    }
  }

  // Fetch data based on search parameters using efficient pagination
  const [categories] = await Promise.all([
    search ? searchCategories(search) : getAllCategories(),
  ]);

  const categoryMap = new Map(categories.map((item) => [item.slug, item]));
  const usedCategoryIds = new Set<number>();
  const resolvedTrending = trendingConfig.map((item) => {
    let resolvedCategory = categoryMap.get(item.slug);
    if (!resolvedCategory) {
      resolvedCategory = categories.find(
        (categoryItem) => !usedCategoryIds.has(categoryItem.id)
      );
    }
    if (resolvedCategory) {
      usedCategoryIds.add(resolvedCategory.id);
    }
    return { ...item, category: resolvedCategory };
  });

  const trendingResponses = await Promise.all(
    resolvedTrending.map((item) =>
      item.category
        ? getPostsByCategoryPaginated(item.category.id, 1, 3)
        : Promise.resolve({ data: [], headers: { total: 0, totalPages: 0 } })
    )
  );

  // Create pagination URL helper
  const createCategoryUrl = (categorySlug: string) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    return `/category/${categorySlug}${
      params.toString() ? `?${params.toString()}` : ""
    }`;
  };

  const trendingSections = resolvedTrending.map((item, index) => ({
    label: item.title,
    href: item.category ? createCategoryUrl(item.category.slug) : "/posts",
    accent: getSpotlightAccent(item.category?.slug ?? item.slug),
    posts: trendingResponses[index].data,
  }));

  const categorySpotlightResponses = await Promise.all(
    categories.map((item) => getPostsByCategoryPaginated(item.id, 1, 3))
  );

  const categorySpotlights = categories.map((item, index) => ({
    label: item.name,
    href: createCategoryUrl(item.slug),
    accent: getSpotlightAccent(item.slug),
    posts: categorySpotlightResponses[index].data,
  }));

  return (
    <Section>
      <Container>
        <div className="space-y-12">
          <HeroCarousel />

          <QuickActions />

          <LogoChipsRow />

          <CategorySpotlightSection
            title="Trending courses"
            sections={trendingSections}
          />

          <CategorySpotlightGrid sections={categorySpotlights} />

          <CategoryChips
            categories={categories}
            selectedCategory={undefined}
            getCategoryHref={createCategoryUrl}
          />
        </div>
      </Container>
    </Section>
  );
}
