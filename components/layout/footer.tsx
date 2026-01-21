import { Container } from "@/components/craft";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Github,
  Instagram,
  Sparkles,
  Twitter,
  Youtube,
} from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <Container className="py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="text-base font-semibold">shadcn/studio</span>
            </div>
            <p className="text-sm text-muted-foreground">
              An open-source collection of copy-and-paste shadcn components,
              blocks, and templates – paired with a powerful theme generator to
              craft, customize, and ship faster.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="https://github.com"
                aria-label="GitHub"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <Github className="h-4 w-4" />
              </Link>
              <Link
                href="https://instagram.com"
                aria-label="Instagram"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <Instagram className="h-4 w-4" />
              </Link>
              <Link
                href="https://x.com"
                aria-label="X"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                href="https://youtube.com"
                aria-label="YouTube"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <Youtube className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-4 text-sm">
            <h3 className="text-base font-semibold">Company</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link className="hover:text-foreground" href="#">
                  About
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" href="#">
                  Features
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" href="#">
                  Works
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" href="#">
                  Career
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-4 text-sm">
            <h3 className="text-base font-semibold">Help</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link className="hover:text-foreground" href="#">
                  Customer Support
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" href="#">
                  Delivery Details
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" href="#">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" href="#">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-4 text-sm">
            <h3 className="text-base font-semibold">Subscribe to newsletter</h3>
            <form className="flex flex-col gap-3">
              <label className="sr-only" htmlFor="footer-email">
                Email address
              </label>
              <div className="flex items-center gap-2">
                <Input
                  id="footer-email"
                  type="email"
                  placeholder="Your email..."
                  className="h-10"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="h-10 w-10 bg-foreground text-background hover:bg-foreground/90"
                  aria-label="Submit email"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="h-px w-full bg-border" />
            </form>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="font-semibold tracking-tight">bestofjs</span>
              <span className="inline-flex items-center gap-1">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
                  P
                </span>
                Product Hunt
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
                  r
                </span>
                reddit
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
                  M
                </span>
                Medium
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="flex h-4 w-4 items-center justify-center rounded bg-muted text-[10px] font-semibold text-muted-foreground">
                  Y
                </span>
                Combinator
              </span>
              <span className="flex h-4 w-4 items-center justify-center rounded bg-muted text-[10px] font-semibold text-muted-foreground">
                YC
              </span>
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
                ★
              </span>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
