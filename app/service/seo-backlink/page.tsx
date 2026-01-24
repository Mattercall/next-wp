import type { Metadata } from "next";
import SeoBacklinkLanding from "./seo-backlink";

export const metadata: Metadata = {
  title: "SEO Backlink Service | MatterCall",
  description:
    "Earn dofollow backlinks that boost authority, rankings, and qualified traffic.",
  alternates: {
    canonical: "/service/seo-backlink",
  },
};

export default function Page() {
  return <SeoBacklinkLanding />;
}
