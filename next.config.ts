import type { NextConfig } from "next";

const wordpressHostname = process.env.WORDPRESS_HOSTNAME;
const wordpressUrl = process.env.WORDPRESS_URL;

const nextConfig: NextConfig = {
  output: "standalone",

  images: {
    remotePatterns: wordpressHostname
      ? [
          {
            protocol: "https",
            hostname: wordpressHostname,
            port: "",
            pathname: "/**",
          },
        ]
      : [],
  },

  async redirects() {
    if (!wordpressUrl) return [];

    return [
      {
        source: "/admin",
        destination: `${wordpressUrl}/wp-admin`,
        permanent: true,
      },
    ];
  },

  async rewrites() {
    if (!wordpressUrl) return [];

    return [
      // Main sitemap on the frontend
      { source: "/sitemap.xml", destination: `${wordpressUrl}/wp-sitemap.xml` },

      // Optional: expose WP's original path too
      { source: "/wp-sitemap.xml", destination: `${wordpressUrl}/wp-sitemap.xml` },

      // Proxy all split sitemap files like:
      // /wp-sitemap-posts-post-1.xml
      // /wp-sitemap-taxonomies-category-1.xml
      // etc.
      { source: "/wp-sitemap-:slug*", destination: `${wordpressUrl}/wp-sitemap-:slug*` },
    ];
  },
};

export default nextConfig;
