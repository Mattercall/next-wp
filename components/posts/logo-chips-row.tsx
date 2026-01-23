import { cn } from "@/lib/utils";

const logos = [
  "Google",
  "IBM",
  "Microsoft",
  "University of Illinois",
  "OpenAI",
  "Anthropic",
  "DeepLearning.AI",
  "Stanford University",
  "University of Pennsylvania",
];

export function LogoChipsRow() {
  return (
    <section className="space-y-3">
      <h3 className="text-base font-semibold">
        Learn from 350+ leading universities and companies
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {logos.map((logo) => (
          <div
            key={logo}
            className={cn(
              "flex items-center gap-2 rounded-full border bg-background px-3 py-2 text-xs font-medium text-muted-foreground",
              "whitespace-nowrap"
            )}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full border bg-muted text-[10px] font-semibold text-foreground">
              {logo[0]}
            </span>
            <span className="text-foreground/80">{logo}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
