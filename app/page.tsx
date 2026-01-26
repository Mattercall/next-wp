import type { Metadata } from "next";

import HomePage from "@/components/pages/home-page";

export const metadata: Metadata = {
  title: "MatterCall — SEO, Backlinks, Google & Meta Ads",
  description:
    "MatterCall helps Shopify brands and local businesses grow with SEO & backlinks, Google and Meta ads, and automation to convert leads into revenue.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MatterCall — SEO, Backlinks, Google & Meta Ads",
    description:
      "MatterCall helps Shopify brands and local businesses grow with SEO & backlinks, Google and Meta ads, and automation to convert leads into revenue.",
    url: "/",
  },
};

export default function Page() {
  return <HomePage />;
}
