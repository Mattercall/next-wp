export const revalidate = 60;

async function getProduct(slug: string) {
  const res = await fetch(
    `https://backend.mattercall.com/wp-json/next/v1/products/${slug}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const data = await getProduct(params.slug);
  if (!data?.product) return <div>Not found</div>;

  const p = data.product;
  return (
    <main style={{ padding: 24 }}>
      <h1>{p.name}</h1>
      <div>{p.price} {p.currency}</div>
      <div dangerouslySetInnerHTML={{ __html: p.description }} />
    </main>
  );
}
