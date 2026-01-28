type ServiceEnvConfig = {
  webhookUrl?: string;
  checkoutUrl?: string;
  webhookKey: string;
  checkoutKey: string;
};

const toEnvPrefix = (slug: string) => slug.toUpperCase().replace(/-/g, "_");

export const getServiceEnvConfig = (slug: string): ServiceEnvConfig => {
  const prefix = toEnvPrefix(slug);
  const webhookKey = `${prefix}_FORM_WEBHOOK`;
  const checkoutKey = `${prefix}_STRIPE_CHECKOUT_URL`;

  return {
    webhookKey,
    checkoutKey,
    webhookUrl: process.env[webhookKey],
    checkoutUrl: process.env[checkoutKey],
  };
};
