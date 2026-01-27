import type { NextConfig } from "next";

const wordpressHostname = process.env.WORDPRESS_HOSTNAME;
const wordpressUrl = process.env.WORDPRESS_URL;
const cdnHostname =
  process.env.WORDPRESS_CDN_HOSTNAME ?? "cdn.mattercall.com";

const wordpressHostFromUrl = (() => {
  if (!wordpressUrl) return null;
  try {
    return new URL(wordpressUrl).hostname;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: cdnHostname,
        port: "",
        pathname: "/**",
      },
      ...(wordpressHostname
        ? [
            {
              protocol: "https",
              hostname: wordpressHostname,
              port: "",
              pathname: "/**",
            },
          ]
        : []),
      ...(wordpressHostFromUrl && wordpressHostFromUrl !== wordpressHostname
        ? [
            {
              protocol: "https",
              hostname: wordpressHostFromUrl,
              port: "",
              pathname: "/**",
            },
          ]
        : []),
    ],
  },
  async redirects() {
    if (!wordpressUrl) {
      return [];
    }
    return [
      {
        source: "/admin",
        destination: `${wordpressUrl}/wp-admin`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
