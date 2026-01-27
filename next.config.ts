import type { NextConfig } from "next";

const wordpressHostname = process.env.WORDPRESS_HOSTNAME;
const wordpressUrl = process.env.WORDPRESS_URL;

// Add any CDN hostnames you want to allow here:
const cdnHostnames = ["cdn.mattercall.com"];

const nextConfig: NextConfig = {
  output: "standalone",

  images: {
    remotePatterns: [
      // CDN(s)
      ...cdnHostnames.map((hostname) => ({
        protocol: "https" as const,
        hostname,
        port: "",
        pathname: "/**",
      })),

      // WordPress host from env (optional)
      ...(wordpressHostname
        ? [
            {
              protocol: "https" as const,
              hostname: wordpressHostname,
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
