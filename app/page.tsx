import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Pencil,
  Sparkles,
  Star,
  Zap,
  PenLine,
} from "lucide-react";

export default function Home() {
  return (
    <main>
      <HeroSection />
    </main>
  );
}

const underlineSvg =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='16' viewBox='0 0 220 16'%3E%3Cpath d='M4 11c24 3 48 3 72 2 28-1 52-2 86-3 17-1 34-1 54-3' stroke='%23000000' stroke-width='3' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M8 14c24 2 48 2 70 1 28-1 54-2 88-4 16-1 32-1 50-3' stroke='%23000000' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round' opacity='0.7'/%3E%3C/svg%3E";

const HeroSection = () => {
  return (
    <section
      className="relative w-full overflow-hidden bg-[#f8f9fb] py-24"
      style={{
        backgroundImage:
          "radial-gradient(circle at top, rgba(0,0,0,0.05), transparent 55%), linear-gradient(to right, rgba(0,0,0,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.035) 1px, transparent 1px)",
        backgroundSize: "100% 100%, 48px 48px, 48px 48px",
        backgroundPosition: "center, center, center",
      }}
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center px-4 text-center">
        <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-700 shadow-sm">
          <Badge className="rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] font-semibold text-neutral-800 shadow-none">
            New
          </Badge>
          <span className="flex items-center gap-1 text-[11px] text-neutral-700">
            Dashboard &amp; Marketing UI Blocks, AI Theme Generator, Shadcn MCP
            &amp; more...
            <Pencil className="h-3 w-3 text-neutral-500" />
          </span>
        </div>

        <div className="mt-8">
          <h1 className="text-balance text-4xl font-extrabold text-neutral-900 sm:text-5xl lg:text-6xl">
            Build Futuristic UIs with{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Shadcn Blocks</span>
              <span
                aria-hidden
                className="pointer-events-none absolute left-0 right-0 -bottom-3 h-4 bg-[length:100%_100%] bg-no-repeat"
                style={{ backgroundImage: `url("${underlineSvg}")` }}
              />
            </span>
            <br />
            at{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Warp Speed</span>
              <span
                aria-hidden
                className="pointer-events-none absolute left-0 right-0 -bottom-3 h-4 bg-[length:100%_100%] bg-no-repeat"
                style={{ backgroundImage: `url("${underlineSvg}")` }}
              />
            </span>{" "}
            <Zap className="inline h-10 w-10 text-orange-500" />
          </h1>
        </div>

        <div className="mt-6 max-w-3xl text-sm text-neutral-500 sm:text-base">
          <p>
            Accelerate your project development with ready-to-use, and fully
            customizable shadcn ui
          </p>
          <p className="mt-2 text-neutral-700">
            Components, Blocks, UI Kits, Boilerplates, Templates and Themes with
            AI Tools <PenLine className="ml-1 inline h-4 w-4 text-neutral-500" />
          </p>
        </div>

        <div className="mt-6 flex items-center gap-2 text-sm font-medium text-neutral-500">
          <span>Tailored for Founders</span>
          <span className="inline-block h-4 w-px bg-neutral-400" />
        </div>

        <div className="mt-6 flex flex-col items-center gap-4 text-sm text-neutral-600 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              {[
                "https://i.pravatar.cc/80?img=32",
                "https://i.pravatar.cc/80?img=12",
                "https://i.pravatar.cc/80?img=5",
                "https://i.pravatar.cc/80?img=20",
                "https://i.pravatar.cc/80?img=45",
              ].map((src, index) => (
                <img
                  key={src}
                  src={src}
                  alt={`Avatar ${index + 1}`}
                  className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-sm"
                />
              ))}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className="h-4 w-4 fill-orange-400 text-orange-400"
                  />
                ))}
                <span className="ml-2 text-sm font-semibold text-neutral-700">
                  4.5
                </span>
              </div>
              <span className="text-xs text-neutral-500">
                Loved by industry creators
              </span>
            </div>
          </div>
          <Separator orientation="vertical" className="h-8" />
          <div className="flex items-center gap-4 text-neutral-500">
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="h-5 w-5 fill-current"
            >
              <circle cx="12" cy="6" r="4" />
              <rect x="10" y="10" width="4" height="10" rx="2" />
            </svg>
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="h-5 w-5 fill-current"
            >
              <rect x="4" y="4" width="6" height="16" rx="2" />
              <rect x="14" y="4" width="6" height="16" rx="2" />
            </svg>
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="h-5 w-5 fill-current"
            >
              <path d="M4 14c4-6 12-6 16 0-4 4-12 4-16 0Z" />
              <path d="M4 10c4-4 12-4 16 0" />
            </svg>
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="h-5 w-5 fill-current"
            >
              <circle cx="8" cy="8" r="4" />
              <circle cx="16" cy="16" r="4" />
            </svg>
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="h-5 w-5 fill-current"
            >
              <path d="M12 3 3 9l9 12 9-12-9-6Z" />
            </svg>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
          <Button className="h-11 rounded-lg bg-black px-6 text-white hover:bg-black/90">
            Get all access <Sparkles className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-11 rounded-lg border-neutral-200 bg-white px-6 text-neutral-700"
          >
            Explore more <span className="ml-2">→</span>
          </Button>
        </div>
      </div>
    </section>
  );
};
