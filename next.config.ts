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
      // Expose WP core sitemaps via the frontend domain
      { source: "/sitemap.xml", destination: `${wordpressUrl}/wp-sitemap.xml` },
      { source: "/wp-sitemap.xml", destination: `${wordpressUrl}/wp-sitemap.xml` },
      {
        source: "/wp-sitemap-:path*.xml",
        destination: `${wordpressUrl}/wp-sitemap-:path*.xml`,
      },
    ];
  },
};

export default nextConfig;
