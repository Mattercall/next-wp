"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface CartTotals {
  total_items: string;
  total_price: string;
  total_tax: string;
  total_shipping: string;
  currency_code: string;
  currency_minor_unit: number;
}

interface CartItem {
  key: string;
  id: number;
  name: string;
  quantity: number;
  prices: {
    price: string;
    regular_price: string;
    sale_price: string;
    currency_code: string;
    currency_minor_unit: number;
  };
  totals: {
    total: string;
    total_tax: string;
    currency_code: string;
    currency_minor_unit: number;
  };
  images?: Array<{ id: number; src: string; alt?: string }>;
  variation?: Array<{ attribute: string; value: string }>;
}

interface ShippingRate {
  rate_id: string;
  name: string;
  price: string;
  currency_code: string;
  currency_minor_unit: number;
}

interface ShippingPackage {
  package_id: number;
  shipping_rates: ShippingRate[];
}

interface CartResponse {
  cart_key?: string;
  nonce?: string;
  items: CartItem[];
  totals: CartTotals;
  shipping_rates?: ShippingPackage[];
}

interface CartContextValue {
  cart: CartResponse | null;
  cartKey: string | null;
  isLoading: boolean;
  error: string | null;
  refreshCart: () => Promise<void>;
  addItem: (options: {
    id: number;
    quantity?: number;
    variationId?: number;
  }) => Promise<void>;
  updateItem: (options: { key: string; quantity: number }) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const CART_KEY_STORAGE = "woo_cart_key";
const CART_NONCE_STORAGE = "woo_store_api_nonce";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [cartKey, setCartKey] = useState<string | null>(null);
  const [nonce, setNonce] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const storeCartKey = useCallback((key: string | null) => {
    setCartKey(key);
    if (key) {
      localStorage.setItem(CART_KEY_STORAGE, key);
    } else {
      localStorage.removeItem(CART_KEY_STORAGE);
    }
  }, []);

  const storeNonce = useCallback((value: string | null) => {
    setNonce(value);
    if (value) {
      localStorage.setItem(CART_NONCE_STORAGE, value);
    } else {
      localStorage.removeItem(CART_NONCE_STORAGE);
    }
  }, []);

  const request = useCallback(async (input: string, init?: RequestInit) => {
    const response = await fetch(input, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(nonce ? { "X-WC-Store-API-Nonce": nonce } : {}),
        ...(init?.headers ?? {}),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "WooCommerce request failed");
    }

    return data as CartResponse;
  }, [nonce]);

  const refreshCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const query = cartKey ? `?cartKey=${cartKey}` : "";
      const data = await request(`/api/woo/cart${query}`);
      if (data.cart_key) {
        storeCartKey(data.cart_key);
      }
      if (data.nonce) {
        storeNonce(data.nonce);
      }
      setCart(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load cart");
    } finally {
      setIsLoading(false);
    }
  }, [cartKey, request, storeCartKey, storeNonce]);

  const addItem = useCallback(
    async ({ id, quantity = 1, variationId }: { id: number; quantity?: number; variationId?: number }) => {
      setIsLoading(true);
      try {
        const data = await request("/api/woo/cart/add-item", {
          method: "POST",
          body: JSON.stringify({
            id,
            quantity,
            variationId,
            cartKey,
          }),
        });
        if (data.cart_key) {
          storeCartKey(data.cart_key);
        }
        if (data.nonce) {
          storeNonce(data.nonce);
        }
        setCart(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add item");
      } finally {
        setIsLoading(false);
      }
    },
    [cartKey, request, storeCartKey, storeNonce]
  );

  const updateItem = useCallback(
    async ({ key, quantity }: { key: string; quantity: number }) => {
      setIsLoading(true);
      try {
        const data = await request("/api/woo/cart/update-item", {
          method: "POST",
          body: JSON.stringify({
            key,
            quantity,
            cartKey,
          }),
        });
        if (data.cart_key) {
          storeCartKey(data.cart_key);
        }
        if (data.nonce) {
          storeNonce(data.nonce);
        }
        setCart(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update item");
      } finally {
        setIsLoading(false);
      }
    },
    [cartKey, request, storeCartKey, storeNonce]
  );

  const removeItem = useCallback(
    async (key: string) => {
      setIsLoading(true);
      try {
        const data = await request("/api/woo/cart/remove-item", {
          method: "POST",
          body: JSON.stringify({ key, cartKey }),
        });
        if (data.cart_key) {
          storeCartKey(data.cart_key);
        }
        if (data.nonce) {
          storeNonce(data.nonce);
        }
        setCart(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to remove item");
      } finally {
        setIsLoading(false);
      }
    },
    [cartKey, request, storeCartKey, storeNonce]
  );

  const clearCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await request("/api/woo/cart/clear", {
        method: "POST",
        body: JSON.stringify({ cartKey }),
      });
      if (data.cart_key) {
        storeCartKey(data.cart_key);
      } else {
        storeCartKey(null);
      }
      if (data.nonce) {
        storeNonce(data.nonce);
      }
      setCart(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to clear cart");
    } finally {
      setIsLoading(false);
    }
  }, [cartKey, request, storeCartKey, storeNonce]);

  useEffect(() => {
    const stored = localStorage.getItem(CART_KEY_STORAGE);
    if (stored) {
      setCartKey(stored);
    }
    const storedNonce = localStorage.getItem(CART_NONCE_STORAGE);
    if (storedNonce) {
      setNonce(storedNonce);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const value = useMemo(
    () => ({
      cart,
      cartKey,
      isLoading,
      error,
      refreshCart,
      addItem,
      updateItem,
      removeItem,
      clearCart,
    }),
    [cart, cartKey, isLoading, error, refreshCart, addItem, updateItem, removeItem, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
