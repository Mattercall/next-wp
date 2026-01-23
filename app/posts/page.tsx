import {
  getAllCategories,
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

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Posts",
  description: "Browse all our blog posts",
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
  searchParams: Promise<{
    category?: string;
    search?: string;
  }>;
}) {
  const params = await searchParams;
  const { category, search } = params;

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
  const createCategoryUrl = (categoryId: number) => {
    const params = new URLSearchParams();
    params.set("category", categoryId.toString());
    if (search) params.set("search", search);
    return `/posts${params.toString() ? `?${params.toString()}` : ""}`;
  };

  const trendingSections = resolvedTrending.map((item, index) => ({
    label: item.title,
    href: item.category ? createCategoryUrl(item.category.id) : "/posts",
    accent: getSpotlightAccent(item.category?.slug ?? item.slug),
    posts: trendingResponses[index].data,
  }));

  const categorySpotlightResponses = await Promise.all(
    categories.map((item) => getPostsByCategoryPaginated(item.id, 1, 3))
  );

  const categorySpotlights = categories.map((item, index) => ({
    label: item.name,
    href: createCategoryUrl(item.id),
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
            selectedCategory={category}
            getCategoryHref={createCategoryUrl}
          />
        </div>
      </Container>
    </Section>
  );
}
