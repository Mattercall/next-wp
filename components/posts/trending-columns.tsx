import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";

import { Post } from "@/lib/wordpress.d";
import { cn } from "@/lib/utils";

type TrendingColumn = {
  title: string;
  posts: Post[];
};

const getProviderLabel = (post: Post) =>
  post._embedded?.author?.[0]?.name ?? "Unknown provider";

const getTypeLabel = (post: Post) => {
  const tag = post._embedded?.["wp:term"]?.[1]?.[0]?.name;
  const category = post._embedded?.["wp:term"]?.[0]?.[0]?.name;
  if (tag) return tag;
  if (category) return category;
  if (post.format && post.format !== "standard") return post.format;
  return "Course";
};

const getRatingLabel = (post: Post) => {
  const meta = post.meta as Record<string, unknown>;
  const ratingRaw = meta?.rating;
  if (typeof ratingRaw === "number") return ratingRaw.toFixed(1);
  if (typeof ratingRaw === "string") return ratingRaw;
  return null;
};

export function TrendingColumns({ columns }: { columns: TrendingColumn[] }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Trending courses</h3>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {columns.map((column) => (
          <div
            key={column.title}
            className="rounded-3xl border bg-muted/20 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between pb-3 text-sm font-semibold">
              <span>{column.title}</span>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="divide-y rounded-2xl border bg-background">
              {column.posts.length === 0 ? (
                <div className="px-4 py-6 text-sm text-muted-foreground">
                  No posts available yet.
                </div>
              ) : (
                column.posts.map((post) => {
                  const media =
                    post._embedded?.["wp:featuredmedia"]?.[0] ?? null;
                  const provider = getProviderLabel(post);
                  const typeLabel = getTypeLabel(post);
                  const rating = getRatingLabel(post);

                  return (
                    <Link
                      key={post.id}
                      href={`/${post.slug}`}
                      className={cn(
                        "flex gap-3 px-4 py-3 text-sm transition",
                        "hover:bg-muted/40"
                      )}
                    >
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border bg-muted">
                        {media?.source_url ? (
                          <Image
                            src={media.source_url}
                            alt={post.title?.rendered || "Post thumbnail"}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                            N/A
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-xs text-muted-foreground">
                          {provider}
                        </p>
                        <div
                          className="line-clamp-2 font-medium text-foreground"
                          dangerouslySetInnerHTML={{
                            __html: post.title?.rendered || "Untitled",
                          }}
                        />
                        <p className="text-xs text-muted-foreground">
                          {typeLabel}
                        </p>
                      </div>
                      <div className="flex min-w-[60px] items-center justify-end gap-1 text-xs text-muted-foreground">
                        {rating ? (
                          <>
                            <Star className="h-3 w-3 fill-current text-amber-500" />
                            <span className="text-foreground">{rating}</span>
                          </>
                        ) : (
                          <span>—</span>
                        )}
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
