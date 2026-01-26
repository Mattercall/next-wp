import type { Metadata } from "next";

import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/site-url";
import SeoBacklinkLanding from "./seo-backlink";

const title = "Backlink Building Services | MatterCall";
const description =
  "Earn high-authority backlinks and digital PR placements that improve rankings and drive qualified traffic.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/service/seo-backlink",
  },
  openGraph: {
    title,
    description,
    url: "/service/seo-backlink",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_URL}/service/seo-backlink#service`,
  name: "Backlink Building",
  serviceType: "SEO Backlink Building",
  description,
  provider: { "@id": `${SITE_URL}/#organization` },
  url: `${SITE_URL}/service/seo-backlink`,
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
      name: "Backlink Building",
      item: `${SITE_URL}/service/seo-backlink`,
    },
  ],
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={[serviceSchema, breadcrumbSchema]}
        idPrefix="service-seo-backlink"
      />
      <SeoBacklinkLanding />
    </>
  );
}
