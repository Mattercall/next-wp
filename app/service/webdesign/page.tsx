import type { Metadata } from "next";

import WebDesignLanding from "./webdesign";

const title = "Shopify Web Design & CRO | MatterCall";
const description =
  "Conversion-focused Shopify design and UX improvements that lift AOV, retention, and mobile checkout performance.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/service/webdesign",
  },
  openGraph: {
    title,
    description,
    url: "/service/webdesign",
  },
};

export default function Page() {
  return <WebDesignLanding />;
}
