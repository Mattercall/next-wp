"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { pageview } from "@/lib/metaPixel";

export function MetaPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    pageview();
  }, [pathname, searchParams?.toString()]);

  return null;
}

// Verify events with the Meta Pixel Helper browser extension.
