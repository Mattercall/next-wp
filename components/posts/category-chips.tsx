import Link from "next/link";
import {
  BookOpen,
  BriefcaseBusiness,
  Brain,
  Code,
  GraduationCap,
  HeartPulse,
  Languages,
  Palette,
  Sigma,
  Sparkles,
  Tag,
  Users,
} from "lucide-react";

import { Category } from "@/lib/wordpress.d";
import { cn } from "@/lib/utils";

type CategoryChipsProps = {
  categories: Category[];
  selectedCategory?: string;
  getCategoryHref: (categorySlug: string) => string;
};

const iconMap: Record<string, typeof Tag> = {
  business: BriefcaseBusiness,
  "artificial-intelligence": Brain,
  "data-science": Sparkles,
  "computer-science": Code,
  "information-technology": BookOpen,
  "personal-development": GraduationCap,
  healthcare: HeartPulse,
  "language-learning": Languages,
  "social-sciences": Users,
  "arts-and-humanities": Palette,
  "physical-science-and-engineering": BookOpen,
  "math-and-logic": Sigma,
};

export function CategoryChips({
  categories,
  selectedCategory,
  getCategoryHref,
}: CategoryChipsProps) {
  return (
    <section className="space-y-3">
      <h3 className="text-lg font-semibold">Explore categories</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const Icon = iconMap[category.slug] ?? Tag;
          const isActive = selectedCategory === category.slug;
          return (
            <Link
              key={category.id}
              href={getCategoryHref(category.slug)}
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium",
                isActive
                  ? "border-primary bg-primary/10 text-primary"
                  : "bg-background text-foreground hover:bg-muted/40"
              )}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden />
              <span>{category.name}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
