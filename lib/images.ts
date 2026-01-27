const CDN_HOSTNAME =
  process.env.NEXT_PUBLIC_CDN_HOSTNAME ?? "cdn.mattercall.com";

export const isCdnImage = (src?: string | null) => {
  if (!src) return false;
  try {
    const { hostname } = new URL(src);
    return hostname === CDN_HOSTNAME;
  } catch {
    return false;
  }
};
