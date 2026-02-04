export function formatStorePrice(
  amount: string | number | null | undefined,
  currencyCode: string | null | undefined,
  minorUnit = 2
) {
  if (!currencyCode || amount === null || amount === undefined) {
    return String(amount ?? "");
  }

  const numeric = typeof amount === "string" ? Number(amount) : amount;
  if (Number.isNaN(numeric)) {
    return String(amount);
  }

  const value = numeric / 10 ** minorUnit;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(value);
}

export function formatDecimalPrice(
  amount: string | number | null | undefined,
  currencyCode: string | null | undefined
) {
  if (!currencyCode || amount === null || amount === undefined) {
    return String(amount ?? "");
  }

  const numeric = typeof amount === "string" ? Number(amount) : amount;
  if (Number.isNaN(numeric)) {
    return String(amount);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(numeric);
}
