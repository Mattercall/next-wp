import {
  getPostsPaginated,
  getAllAuthors,
  getAllTags,
  getAllCategories,
  searchAuthors,
  searchTags,
  searchCategories,
  getPostsByCategoryPaginated,
} from "@/lib/wordpress";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Section, Container, Prose } from "@/components/craft";
import { PostCard } from "@/components/posts/post-card";
import { FilterPosts } from "@/components/posts/filter";
import { SearchInput } from "@/components/posts/search-input";
import { HeroCarousel } from "@/components/posts/hero-carousel";
import { QuickActions } from "@/components/posts/quick-actions";
import { LogoChipsRow } from "@/components/posts/logo-chips-row";
import { TrendingColumns } from "@/components/posts/trending-columns";
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
    author?: string;
    tag?: string;
    category?: string;
    page?: string;
    search?: string;
  }>;
}) {
  const params = await searchParams;
  const { author, tag, category, page: pageParam, search } = params;

  // Handle pagination
  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const postsPerPage = 9;

  // Fetch data based on search parameters using efficient pagination
  const [postsResponse, authors, tags, categories] = await Promise.all([
    getPostsPaginated(page, postsPerPage, { author, tag, category, search }),
    search ? searchAuthors(search) : getAllAuthors(),
    search ? searchTags(search) : getAllTags(),
    search ? searchCategories(search) : getAllCategories(),
  ]);

  const { data: posts, headers } = postsResponse;
  const { total, totalPages } = headers;

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

  const trendingColumns = resolvedTrending.map((item, index) => ({
    title: item.title,
    posts: trendingResponses[index].data,
  }));

  // Create pagination URL helper
  const createPaginationUrl = (newPage: number) => {
    const params = new URLSearchParams();
    if (newPage > 1) params.set("page", newPage.toString());
    if (category) params.set("category", category);
    if (author) params.set("author", author);
    if (tag) params.set("tag", tag);
    if (search) params.set("search", search);
    return `/posts${params.toString() ? `?${params.toString()}` : ""}`;
  };

  const createCategoryUrl = (categoryId: number) => {
    const params = new URLSearchParams();
    params.set("category", categoryId.toString());
    if (author) params.set("author", author);
    if (tag) params.set("tag", tag);
    if (search) params.set("search", search);
    return `/posts${params.toString() ? `?${params.toString()}` : ""}`;
  };

  return (
    <Section>
      <Container>
        <div className="space-y-12">
          <HeroCarousel />

          <QuickActions />

          <LogoChipsRow />

          <TrendingColumns columns={trendingColumns} />

          <CategoryChips
            categories={categories}
            selectedCategory={category}
            getCategoryHref={createCategoryUrl}
          />

          <div className="space-y-6">
            <Prose>
              <h2>All Posts</h2>
              <p className="text-muted-foreground">
                {total} {total === 1 ? "post" : "posts"} found
                {search && " matching your search"}
              </p>
            </Prose>

            <div className="space-y-4">
              <SearchInput defaultValue={search} />

              <FilterPosts
                authors={authors}
                tags={tags}
                categories={categories}
                selectedAuthor={author}
                selectedTag={tag}
                selectedCategory={category}
              />
            </div>

            {posts.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-3">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="flex h-24 w-full items-center justify-center rounded-lg border bg-accent/25">
                <p>No posts found</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center py-8">
                <Pagination>
                  <PaginationContent>
                    {page > 1 && (
                      <PaginationItem>
                        <PaginationPrevious href={createPaginationUrl(page - 1)} />
                      </PaginationItem>
                    )}

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((pageNum) => {
                        // Show current page, first page, last page, and 2 pages around current
                        return (
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          Math.abs(pageNum - page) <= 1
                        );
                      })
                      .map((pageNum, index, array) => {
                        const showEllipsis =
                          index > 0 && pageNum - array[index - 1] > 1;
                        return (
                          <div key={pageNum} className="flex items-center">
                            {showEllipsis && <span className="px-2">...</span>}
                            <PaginationItem>
                              <PaginationLink
                                href={createPaginationUrl(pageNum)}
                                isActive={pageNum === page}
                              >
                                {pageNum}
                              </PaginationLink>
                            </PaginationItem>
                          </div>
                        );
                      })}

                    {page < totalPages && (
                      <PaginationItem>
                        <PaginationNext href={createPaginationUrl(page + 1)} />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
