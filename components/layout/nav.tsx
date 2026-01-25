"use client";

import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/nav/mobile-nav";
import { serviceMenu, storeMenu } from "@/menu.config";
import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import Logo from "@/public/logo.svg";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";

interface NavProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
}

export function Nav({ className, children, id }: NavProps) {
  const handleBookCallClick = () => {
    trackEvent("book_call_click");
  };

  return (
    <nav
      className={cn("sticky z-50 top-0 bg-background", "border-b", className)}
      id={id}
    >
      <div
        id="nav-container"
        className="max-w-5xl mx-auto h-[var(--nav-height)] py-4 px-6 sm:px-8 flex justify-between items-center"
      >
        <Link
          className="hover:opacity-75 transition-all flex gap-4 items-center"
          href="/"
        >
          <Image
            src={Logo}
            alt="Logo"
            loading="eager"
            className="dark:invert"
            width={42}
            height={26.44}
          />
          <h2 className="text-sm">{siteConfig.site_name}</h2>
        </Link>
        <div className="hidden items-center gap-4 text-sm font-medium md:flex">
          {storeMenu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>
        {children}
        <div className="flex items-center gap-2">
          <div className="mx-2 hidden md:flex">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1">
                  Service
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[360px] rounded-2xl border border-muted/70 bg-background/95 p-2 shadow-xl backdrop-blur">
                <DropdownMenuLabel className="px-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Services
                </DropdownMenuLabel>
                <DropdownMenuGroup className="space-y-1">
                  {serviceMenu.map((item) => (
                    <DropdownMenuItem
                      key={item.href}
                      className="flex items-start gap-3 rounded-xl p-3 focus:bg-muted/60"
                      asChild
                    >
                      <Link
                        href={item.href}
                        className="flex w-full items-start gap-3"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-muted/60 bg-muted/30 text-xs font-semibold text-muted-foreground">
                          {item.fallback}
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-foreground">
                              {item.name}
                            </span>
                            <Badge className="rounded-full bg-blue-600 px-2 text-[10px] font-semibold text-white">
                              {item.accent}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {item.description}
                          </span>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button
            asChild
            className="hidden rounded-full px-5 sm:flex"
          >
            <Link href="/book-call" onClick={handleBookCallClick}>
              Book a growth call
            </Link>
          </Button>
          <MobileNav />
        </div>
      </div>
    </nav>
  );
}
