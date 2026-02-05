import "server-only";

const storeUrl = process.env.WC_STORE_URL;
const consumerKey = process.env.WC_CONSUMER_KEY;
const consumerSecret = process.env.WC_CONSUMER_SECRET;

if (!storeUrl) {
  throw new Error("WC_STORE_URL is not set");
}

if (!consumerKey || !consumerSecret) {
  throw new Error("WC_CONSUMER_KEY or WC_CONSUMER_SECRET is not set");
}

export interface WooImage {
  id: number;
  src: string;
  alt?: string;
}

export interface WooAttribute {
  id: number;
  name: string;
  option?: string;
  options?: string[];
}

export interface WooProduct {
  id: number;
  name: string;
  slug: string;
  type: "simple" | "variable" | string;
  price: string;
  regular_price: string;
  sale_price: string;
  description: string;
  short_description: string;
  images: WooImage[];
  attributes: WooAttribute[];
  variations: number[];
  stock_status: "instock" | "outofstock" | "onbackorder" | string;
}

export interface WooVariation {
  id: number;
  price: string;
  regular_price: string;
  sale_price: string;
  stock_status: "instock" | "outofstock" | "onbackorder" | string;
  attributes: WooAttribute[];
}

export interface WooOrderLineItem {
  id: number;
  name: string;
  quantity: number;
  total: string;
}

export interface WooOrder {
  id: number;
  status: string;
  currency: string;
  total: string;
  total_tax: string;
  shipping_total: string;
  line_items: WooOrderLineItem[];
  billing: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
}

const restBaseUrl = new URL("/wp-json/wc/v3/", storeUrl!).toString();
const requiredConsumerKey = consumerKey!;
const requiredConsumerSecret = consumerSecret!;

async function wooRestFetch<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
  init: RequestInit = {},
  revalidate = 60
): Promise<T> {
  const url = new URL(path.replace(/^\//, ""), restBaseUrl);
  url.searchParams.set("consumer_key", requiredConsumerKey);
  url.searchParams.set("consumer_secret", requiredConsumerSecret);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url.toString(), {
    ...init,
    next: { revalidate },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`WooCommerce API error: ${response.status} ${errorText}`);
  }

  return response.json() as Promise<T>;
}

export async function getProducts({
  page = 1,
  perPage = 12,
  search,
  category,
}: {
  page?: number;
  perPage?: number;
  search?: string;
  category?: string;
}) {
  return wooRestFetch<WooProduct[]>("products", {
    page,
    per_page: perPage,
    search,
    category,
    status: "publish",
  });
}

export async function getProductBySlug(slug: string) {
  const products = await wooRestFetch<WooProduct[]>("products", {
    slug,
    status: "publish",
    per_page: 100,
  });
  const exactMatch = products.find((product) => product.slug === slug);
  if (exactMatch) {
    return exactMatch;
  }

  const searchResults = await wooRestFetch<WooProduct[]>("products", {
    search: slug,
    status: "publish",
    per_page: 100,
  });

  return searchResults.find((product) => product.slug === slug) ?? null;
}

export async function getProductById(id: number | string) {
  return wooRestFetch<WooProduct>(`products/${id}`);
}

export async function getProductVariations(productId: number) {
  return wooRestFetch<WooVariation[]>(`products/${productId}/variations`, {
    per_page: 100,
  });
}

export async function getOrder(orderId: string) {
  return wooRestFetch<WooOrder>(`orders/${orderId}`);
}

export async function getPaymentGateways() {
  return wooRestFetch<
    Array<{
      id: string;
      title: string;
      description: string;
      enabled: boolean;
      method_title: string;
      method_description: string;
    }>
  >("payment_gateways", {}, {}, 300);
}
