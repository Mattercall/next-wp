export type MetaPixelParams = Record<string, unknown>;

type FbqFunction = (command: string, event: string, params?: MetaPixelParams) => void;

declare global {
  interface Window {
    fbq?: FbqFunction;
    _fbq?: FbqFunction;
  }
}

const getPixelId = () => process.env.NEXT_PUBLIC_META_PIXEL_ID;

const canUsePixel = () => {
  if (typeof window === "undefined") {
    return false;
  }

  if (!getPixelId()) {
    return false;
  }

  return typeof window.fbq === "function";
};

export const pageview = () => {
  if (!canUsePixel()) {
    return;
  }

  window.fbq?.("track", "PageView");
};

export const event = (name: string, params: MetaPixelParams = {}) => {
  if (!canUsePixel()) {
    return;
  }

  window.fbq?.("track", name, params);
};

export const purchase = (
  value: number,
  currency: string,
  extra: MetaPixelParams = {},
) => {
  if (!canUsePixel()) {
    return;
  }

  window.fbq?.("track", "Purchase", {
    value,
    currency,
    ...extra,
  });
};
