# WooCommerce Storefront Setup

## Required environment variables

Add these values to your `.env.local` (or the platform env config):

```
WC_STORE_URL="https://your-store-domain.com"
WC_CONSUMER_KEY="ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
WC_CONSUMER_SECRET="cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
NEXT_PUBLIC_WC_CURRENCY="USD"
```

## WooCommerce settings checklist

1. Enable the WooCommerce REST API keys used above (WooCommerce → Settings → Advanced → REST API).
2. Ensure the WooCommerce Store API is active (WooCommerce core + WooCommerce Blocks enabled).
3. Enable at least one payment gateway (WooCommerce → Settings → Payments).
4. Configure shipping zones/rates to return shipping methods in the cart.

## Local dev test plan

1. `pnpm dev`
2. Visit `/shop` and open a product.
3. Add the product to cart and confirm the cart count/line item.
4. Refresh `/cart` to confirm cart persistence.
5. Proceed to `/checkout`, fill out billing details, select a payment method, and place the order.
6. Confirm `/order-received` shows the order summary.

## Notes

- Checkout uses the WooCommerce Store API and assumes at least one enabled payment method.
- If no shipping methods are configured, the shipping selector will be hidden.
- For live card payments, configure a gateway (e.g. Stripe) that supports the Store API.
