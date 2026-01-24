// Define the menu items
export const mainMenu = {
  home: "/",
  about: "https://github.com/9d8dev/next-wp",
  blog: "/posts",
};

export const serviceMenu = [
  {
    name: "SEO Strategy",
    href: "/service/seo",
    description: "Technical audits, content, and authority building.",
    accent: "Popular",
    fallback: "SEO",
  },
  {
    name: "Paid Media",
    href: "/service/paid-media",
    description: "High-intent campaigns with clear ROI reporting.",
    accent: "Growth",
    fallback: "PPC",
  },
  {
    name: "Content Studio",
    href: "/service/content",
    description: "Editorial systems, design, and production ops.",
    accent: "Premium",
    fallback: "CNT",
  },
  {
    name: "Analytics & CRO",
    href: "/service/analytics",
    description: "Conversion experiments with full-funnel insights.",
    accent: "Insight",
    fallback: "CRO",
  },
];

export const contentMenu = {
  categories: "/posts/categories",
  tags: "/posts/tags",
  authors: "/posts/authors",
};
