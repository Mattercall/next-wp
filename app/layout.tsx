import "./globals.css";

import { Inter as FontSans } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { CookieConsent } from "@/components/cookie-consent";
import { Analytics } from "@vercel/analytics/react";
import { MetaPixel } from "@/components/MetaPixel";

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

// Set NEXT_PUBLIC_META_PIXEL_ID in your env (e.g. .env.local) to enable Meta Pixel.
const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

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
        {metaPixelId ? (
          <>
            <Script
              id="meta-pixel"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?` +
                  `n.callMethod.apply(n,arguments):n.queue.push(arguments)};` +
                  `if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';` +
                  `n.queue=[];t=b.createElement(e);t.async=!0;` +
                  `t.src=v;s=b.getElementsByTagName(e)[0];` +
                  `s.parentNode.insertBefore(t,s)}(window, document,'script',` +
                  `'https://connect.facebook.net/en_US/fbevents.js');` +
                  `fbq('init', '${metaPixelId}');`,
              }}
            />
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        ) : null}
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
        <MetaPixel />
        <Analytics />
      </body>
    </html>
  );
}
