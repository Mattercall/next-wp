import { siteConfig } from "@/site.config";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || siteConfig.site_domain).replace(
  /\/$/,
  "",
);
