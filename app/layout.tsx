import "./globals.css";

import { Inter as FontSans } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { CookieConsent } from "@/components/cookie-consent";
import { Analytics } from "@vercel/analytics/react";

import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";
import { SITE_URL } from "@/lib/site-url";
import JsonLd from "@/components/seo/JsonLd";

import type { Metadata } from "next";

const font = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "MatterCall",
    template: "%s | MatterCall",
  },
  description: siteConfig.site_description,
  metadataBase: new URL(SITE_URL),
};

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "MatterCall",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.svg`,
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: `${SITE_URL}/contact`,
    },
  ],
  // add your real social URLs when ready
  sameAs: [],
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
        <JsonLd data={[organization, website]} idPrefix="global" />
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
