import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

const wordpressHostname = process.env.WORDPRESS_HOSTNAME;
const wordpressUrl = process.env.WORDPRESS_URL;
const cdnHostname = process.env.WORDPRESS_CDN_HOSTNAME ?? "cdn.mattercall.com";

const wordpressHostFromUrl = (() => {
  if (!wordpressUrl) return null;
  try {
    return new URL(wordpressUrl).hostname;
  } catch {
    return null;
  }
})();

const remotePatterns: RemotePattern[] = [
  {
    protocol: "https",
    hostname: cdnHostname,
    pathname: "/**",
  },
];

if (wordpressHostname) {
  remotePatterns.push({
    protocol: "https",
    hostname: wordpressHostname,
    pathname: "/**",
  });
}

if (wordpressHostFromUrl && wordpressHostFromUrl !== wordpressHostname) {
  remotePatterns.push({
    protocol: "https",
    hostname: wordpressHostFromUrl,
    pathname: "/**",
  });
}

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns,
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
};

export default nextConfig;
