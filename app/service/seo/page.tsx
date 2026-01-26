import type { Metadata } from "next";

import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/site-url";
import SeoLanding from "./seo";

const title = "SEO Services for Shopify & Local Businesses | MatterCall";
const description =
  "Technical SEO, content strategy, and authority building to drive qualified traffic and measurable revenue growth.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/service/seo",
  },
  openGraph: {
    title,
    description,
    url: "/service/seo",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_URL}/service/seo#service`,
  name: "SEO Services",
  serviceType: "SEO",
  description,
  provider: { "@id": `${SITE_URL}/#organization` },
  url: `${SITE_URL}/service/seo`,
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "SEO Services",
      item: `${SITE_URL}/service/seo`,
    },
  ],
};

export default function Page() {
  return (
    <>
      <JsonLd data={[serviceSchema, breadcrumbSchema]} idPrefix="service-seo" />
      <SeoLanding />
    </>
  );
}
