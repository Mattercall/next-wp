import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import { isCdnImage } from "@/lib/images";
import { cn } from "@/lib/utils";
import { Post } from "@/lib/wordpress.d";

export type SpotlightAccent =
  | "blue"
  | "cyan"
  | "indigo"
  | "green"
  | "amber"
  | "rose"
  | "purple"
  | "slate";

const ACCENT_PALETTE: SpotlightAccent[] = [
  "blue",
  "cyan",
  "indigo",
  "green",
  "amber",
  "rose",
  "purple",
  "slate",
];

const ACCENT_BY_CATEGORY_SLUG: Record<string, SpotlightAccent> = {
  business: "green",
  design: "purple",
  development: "blue",
  marketing: "rose",
  data: "cyan",
  ai: "indigo",
  "in-demand-ai-skills": "cyan",
  "weekly-spotlight": "indigo",
  "most-popular": "blue",
};

const hashSlug = (slug: string) =>
  slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

export const getSpotlightAccent = (slug?: string | null): SpotlightAccent => {
  if (!slug) return ACCENT_PALETTE[0];
  const mapped = ACCENT_BY_CATEGORY_SLUG[slug];
  if (mapped) return mapped;
  return ACCENT_PALETTE[hashSlug(slug) % ACCENT_PALETTE.length];
};

const getProviderLabel = (post: Post) =>
  post._embedded?.author?.[0]?.name ?? "Unknown provider";

const getProviderAvatar = (post: Post) =>
  post._embedded?.author?.[0]?.avatar_urls?.["24"] ??
  post._embedded?.author?.[0]?.avatar_urls?.["48"] ??
  null;

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

type SpotlightSection = {
  label: string;
  href: string;
  accent: SpotlightAccent;
  posts: Post[];
};

export function CategorySpotlightSection({
  title,
  sections,
}: {
  title: string;
  sections: SpotlightSection[];
}) {
  return (
    <section className="space-y-3">
      <h3 className="text-xl font-semibold">{title}</h3>
      <CategorySpotlightGrid sections={sections} />
    </section>
  );
}

export function CategorySpotlightGrid({
  sections,
}: {
  sections: SpotlightSection[];
}) {
  return (
    <div className="grid gap-[var(--spotlight-gap)] md:grid-cols-2 lg:grid-cols-3">
      {sections.map((section) => (
        <CategorySpotlightCard key={section.label} {...section} />
      ))}
    </div>
  );
}

export function CategorySpotlightCard({
  label,
  href,
  accent,
  posts,
}: SpotlightSection) {
  return (
    <div
      className="rounded-[var(--spotlight-radius-outer)] p-[var(--spotlight-card-padding)]"
      style={{ backgroundColor: `var(--spotlight-tint-${accent})` }}
    >
      <div className="mb-3 text-sm font-semibold text-foreground">
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground/80"
        >
          <span>{label}</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
      <div className="space-y-3">
        {posts.length === 0 ? (
          <div className="rounded-[var(--spotlight-radius-inner)] border border-[color:var(--spotlight-border)] bg-background px-[var(--spotlight-row-padding)] py-6 text-sm text-muted-foreground">
            No posts available yet.
          </div>
        ) : (
          posts.map((post) => <CategorySpotlightRow key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}

export function CategorySpotlightRow({ post }: { post: Post }) {
  const media = post._embedded?.["wp:featuredmedia"]?.[0] ?? null;
  const provider = getProviderLabel(post);
  const typeLabel = getTypeLabel(post);
  const rating = getRatingLabel(post);
  const providerAvatar = getProviderAvatar(post);
  const providerInitials = getInitials(provider).slice(0, 1);

  return (
    <Link
      href={`/${post.slug}`}
      className={cn(
        "flex gap-3 rounded-[var(--spotlight-radius-inner)] border border-[color:var(--spotlight-border)] bg-background px-[var(--spotlight-row-padding)] py-[10px] text-sm transition-colors",
        "hover:bg-muted/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
    >
      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-[10px] border border-[color:var(--spotlight-border)] bg-muted">
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
          <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-muted-foreground">
            {getInitials(post.title?.rendered || provider)}
          </div>
        )}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {providerAvatar ? (
            <Image
              src={providerAvatar}
              alt={provider}
              width={16}
              height={16}
              className="h-4 w-4 rounded-full"
              unoptimized={isCdnImage(providerAvatar)}
            />
          ) : (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-foreground">
              {providerInitials}
            </span>
          )}
          <span className="truncate">{provider}</span>
        </div>
        <div
          className="line-clamp-1 text-sm font-semibold text-foreground"
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
}
