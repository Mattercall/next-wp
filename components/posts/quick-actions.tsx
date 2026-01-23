import Link from "next/link";
import { Briefcase, GraduationCap, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

const actions = [
  {
    title: "Launch a new career",
    href: "/posts?search=career",
    icon: Briefcase,
  },
  {
    title: "Gain in-demand skills",
    href: "/posts?search=skills",
    icon: Sparkles,
  },
  {
    title: "Earn a degree",
    href: "/posts?search=degree",
    icon: GraduationCap,
  },
];

export function QuickActions() {
  return (
    <section aria-label="Quick actions">
      <div className="grid gap-4 md:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.title}
              href={action.href}
              className={cn(
                "flex items-center justify-between rounded-2xl border bg-muted/30 px-5 py-4 text-sm font-medium",
                "transition hover:bg-muted/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              )}
            >
              <span>{action.title}</span>
              <Icon className="h-5 w-5 text-muted-foreground" aria-hidden />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
