import type { Metadata } from "next";

import ContactPage from "@/components/pages/contact-page";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/site-url";

const title = "Contact MatterCall";
const description =
  "Talk with MatterCall about SEO, paid media, and growth automation for Shopify and local businesses.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title,
    description,
    url: "/contact",
  },
};

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${SITE_URL}/contact#contactpage`,
  url: `${SITE_URL}/contact`,
  name: title,
  isPartOf: { "@id": `${SITE_URL}/#website` },
  about: { "@id": `${SITE_URL}/#organization` },
};

export default function Page() {
  return (
    <>
      <JsonLd data={contactSchema} idPrefix="contact" />
      <ContactPage />
    </>
  );
}
