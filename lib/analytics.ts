import { track } from "@vercel/analytics";

type AnalyticsProperties = Record<string, string | number | boolean>;

export const trackEvent = (
  event: string,
  properties?: AnalyticsProperties
): void => {
  track(event, properties);
};
