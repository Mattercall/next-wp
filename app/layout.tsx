import "./globals.css";

import { Inter as FontSans } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { CookieConsent } from "@/components/cookie-consent";
import { Analytics } from "@vercel/analytics/react";

import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";

import type { Metadata } from "next";

const font = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "MatterCall – SEO, Ads & Automation for Shopify & Local Businesses",
  description:
    "Done-for-you growth systems: conversion pages, Google & Meta ads, SEO backlinks, and follow-up automation to drive more orders and bookings.",
  openGraph: {
    title: "MatterCall – SEO, Ads & Automation for Shopify & Local Businesses",
    description:
      "Done-for-you growth systems: conversion pages, Google & Meta ads, SEO backlinks, and follow-up automation to drive more orders and bookings.",
  },
  twitter: {
    title: "MatterCall – SEO, Ads & Automation for Shopify & Local Businesses",
    description:
      "Done-for-you growth systems: conversion pages, Google & Meta ads, SEO backlinks, and follow-up automation to drive more orders and bookings.",
  },
  metadataBase: new URL(siteConfig.site_domain),
  alternates: {
    canonical: "/",
  },
};

const SITE_URL = "https://mattercall.com";

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "MatterCall",
  url: SITE_URL,
  // use a stable logo URL you control (not a build-hash path if possible)
  logo: `${SITE_URL}/logo.png`,
  sameAs: [
    // add your real social URLs
  ],
};

const website = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "MatterCall",
  url: SITE_URL,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
        />
      </head>
      <body className={cn("min-h-screen font-sans antialiased", font.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Nav />
          {children}
          <Footer />
          <CookieConsent />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
