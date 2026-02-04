export const revalidate = 60; // refresh products every 60s (or 0 for always)

async function getProducts() {
  const res = await fetch(
    "https://backend.mattercall.com/wp-json/next/v1/products?per_page=12&page=1",
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export default async function ShopPage() {
  const data = await getProducts();

  return (
    <main style={{ padding: 24 }}>
      <h1>Shop</h1>
      <ul>
        {data.products.map((p: any) => (
          <li key={p.id}>
            <a href={`/product/${p.slug}`}>{p.name}</a> — {p.price} {p.currency}
          </li>
        ))}
      </ul>
    </main>
  );
}
