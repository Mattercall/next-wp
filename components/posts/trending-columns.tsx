import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import { isCdnImage } from "@/lib/images";
import { Post } from "@/lib/wordpress.d";
import { cn } from "@/lib/utils";

type TrendingColumn = {
  title: string;
  posts: Post[];
};

const getProviderLabel = (post: Post) =>
  post._embedded?.author?.[0]?.name ?? "Unknown provider";

const getInitials = (value: string) => {
  const cleaned = value.replace(/<[^>]*>/g, "").trim();
  if (!cleaned) return "NA";
  const words = cleaned.split(/\s+/);
  const first = words[0]?.[0] ?? "";
  const second = words[1]?.[0] ?? words[0]?.[1] ?? "";
  return `${first}${second}`.toUpperCase();
};

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
        <h3 className="text-xl font-semibold">Trending courses</h3>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {columns.map((column) => (
          <div
            key={column.title}
            className="rounded-2xl border border-transparent bg-primary/10 p-4"
          >
            <div className="pb-3 text-sm font-semibold text-foreground">
              <span>
                {column.title} <span aria-hidden="true">→</span>
              </span>
            </div>
            <div className="space-y-3">
              {column.posts.length === 0 ? (
                <div className="rounded-xl border bg-background px-4 py-6 text-sm text-muted-foreground">
                  No posts available yet.
                </div>
              ) : (
                column.posts.map((post) => {
                  const media =
                    post._embedded?.["wp:featuredmedia"]?.[0] ?? null;
                  const provider = getProviderLabel(post);
                  const typeLabel = getTypeLabel(post);
                  const rating = getRatingLabel(post);
                  const initials = getInitials(
                    post.title?.rendered || provider
                  );
                  const avatarClasses = [
                    "bg-primary/15 text-primary",
                    "bg-accent/30 text-foreground",
                    "bg-secondary/30 text-secondary-foreground",
                    "bg-muted text-foreground",
                  ];
                  const avatarClass =
                    avatarClasses[post.id % avatarClasses.length];

                  return (
                    <Link
                      key={post.id}
                      href={`/${post.slug}`}
                      className={cn(
                        "flex gap-3 rounded-xl border bg-background px-3 py-2.5 text-sm transition",
                        "hover:bg-muted/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                            unoptimized={isCdnImage(media.source_url)}
                          />
                        ) : (
                          <div
                            className={cn(
                              "flex h-full w-full items-center justify-center text-xs font-semibold",
                              avatarClass
                            )}
                          >
                            {initials}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-foreground">
                            {getInitials(provider).slice(0, 1)}
                          </span>
                          <span className="truncate">{provider}</span>
                        </div>
                        <div
                          className="line-clamp-1 font-semibold text-foreground"
                          dangerouslySetInnerHTML={{
                            __html: post.title?.rendered || "Untitled",
                          }}
                        />
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span className="truncate">{typeLabel}</span>
                          {rating && (
                            <>
                              <span aria-hidden="true">·</span>
                              <Star className="h-3 w-3 fill-current text-foreground" />
                              <span className="text-foreground">{rating}</span>
                            </>
                          )}
                        </div>
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
