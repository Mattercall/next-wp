import type { Metadata } from "next";
import AdvertisingLanding from "./advertising";

export const metadata: Metadata = {
  title: "Paid Advertising Service | MatterCall",
  description:
    "Launch high-performing Facebook Ads and Google Ads campaigns that drive qualified traffic and conversions.",
  alternates: {
    canonical: "/service/advertising",
  },
};

export default function Page() {
  return <AdvertisingLanding />;
}
