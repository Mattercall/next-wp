import type { NextConfig } from "next";

const wordpressHostname = process.env.WORDPRESS_HOSTNAME;
const wordpressUrl = process.env.WORDPRESS_URL;
const wpOrigin = process.env.WP_ORIGIN;
const proxyMode = process.env.PROXY_MODE ?? "rewrite";

const storePaths = ["shop", "cart", "checkout", "receipt", "account"];
const normalizedWpOrigin = wpOrigin?.replace(/\/$/, "");

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
    const redirects = [];
    if (wordpressUrl) {
      redirects.push({
        source: "/admin",
        destination: `${wordpressUrl}/wp-admin`,
        permanent: true,
      });
    }

    if (normalizedWpOrigin && proxyMode === "redirect") {
      storePaths.forEach((path) => {
        redirects.push(
          {
            source: `/${path}`,
            destination: `${normalizedWpOrigin}/${path}`,
            statusCode: 302,
          },
          {
            source: `/${path}/:path*`,
            destination: `${normalizedWpOrigin}/${path}/:path*`,
            statusCode: 302,
          }
        );
      });
    }

    return redirects;
  },
  async rewrites() {
    if (!normalizedWpOrigin || proxyMode !== "rewrite") {
      return [];
    }

    return [
      ...storePaths.flatMap((path) => [
        {
          source: `/${path}`,
          destination: `${normalizedWpOrigin}/${path}`,
        },
        {
          source: `/${path}/:path*`,
          destination: `${normalizedWpOrigin}/${path}/:path*`,
        },
      ]),
      {
        source: "/wp-admin/admin-ajax.php",
        destination: `${normalizedWpOrigin}/wp-admin/admin-ajax.php`,
      },
      {
        source: "/wp-content/:path*",
        destination: `${normalizedWpOrigin}/wp-content/:path*`,
      },
      {
        source: "/wp-includes/:path*",
        destination: `${normalizedWpOrigin}/wp-includes/:path*`,
      },
    ];
  },
};

export default nextConfig;
