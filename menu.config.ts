// Define the menu items
export const mainMenu = {
  home: "/",
  about: "/about",
  contact: "/contact",
};

export const storeMenu = [
  { href: "/shop", label: "Shop" },
  { href: "/cart", label: "Cart" },
  { href: "/account", label: "Account" },
];

export const serviceMenu = [
  {
    name: "SEO & Authority",
    href: "/service/seo",
    description: "Search visibility, content, and technical foundations.",
    accent: "Core",
    fallback: "SEO",
  },
  {
    name: "Paid Ads",
    href: "/service/advertising",
    description: "Google + Meta campaigns built for efficient acquisition.",
    accent: "Scale",
    fallback: "ADS",
  },
  {
    name: "Shopify Web Design",
    href: "/service/webdesign",
    description: "Conversion-first storefronts that lift AOV and repeat.",
    accent: "Shopify",
    fallback: "UX",
  },
  {
    name: "Backlink Growth",
    href: "/service/seo-backlink",
    description: "Authority placements that build trust and rankings.",
    accent: "Authority",
    fallback: "PR",
  },
];

export const contentMenu = {
  about: "/about",
  contact: "/contact",
  legal: "/legal",
};
