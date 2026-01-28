type ServiceEnvConfig = {
  webhookUrl?: string;
  checkoutUrl?: string;
  webhookKey: string;
  checkoutKey: string;
  missingKeys: string[];
};

const toEnvPrefix = (slug: string) => slug.toUpperCase().replace(/-/g, "_");

export const getServiceEnvConfig = (slug: string): ServiceEnvConfig => {
  const prefix = toEnvPrefix(slug);
  const webhookKey = `${prefix}_FORM_WEBHOOK`;
  const checkoutKey = `${prefix}_STRIPE_CHECKOUT_URL`;
  const webhookUrl = process.env[webhookKey];
  const checkoutUrl = process.env[checkoutKey];
  const missingKeys = [!webhookUrl ? webhookKey : null, !checkoutUrl ? checkoutKey : null].filter(
    (key): key is string => Boolean(key)
  );

  return {
    webhookKey,
    checkoutKey,
    webhookUrl,
    checkoutUrl,
    missingKeys,
  };
};
