import type { Metadata } from "next";

import AdvertisingLanding from "./advertising";

const title = "Google & Meta Ads Management | MatterCall";
const description =
  "Performance-first paid media across Google and Meta, built to convert demand into revenue with smart targeting and creative testing.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/service/advertising",
  },
  openGraph: {
    title,
    description,
    url: "/service/advertising",
  },
};

export default function Page() {
  return <AdvertisingLanding />;
}
