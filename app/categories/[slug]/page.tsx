
import Link from "next/link";

type ProductImage = {
  id: string;
  url: string;
  alt?: string | null;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  basePrice: number | string;
  images: ProductImage[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getCategoryProducts(slug: string): Promise<Product[]> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  const response = await fetch(
    `${API_URL}/products/category/${encodeURIComponent(slug)}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error(`Failed to load category products: ${response.status}`);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Unexpected response from the category products API.");
  }

  return data;
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const products = await getCategoryProducts(slug);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <Link
        href="/categories"
        className="mb-6 inline-block text-sm underline"
      >
        ← All Categories
      </Link>

      <h1 className="mb-8 text-3xl font-bold capitalize">
        {slug.replace(/-/g, " ")}
      </h1>

      {products.length === 0 ? (
        <p>No active products found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => {
            const image = product.images?.[0];

            return (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="overflow-hidden rounded-lg border transition hover:shadow-md"
              >
                {image?.url ? (
                  <img
                    src={image.url}
                    alt={image.alt || product.name}
                    className="h-56 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-56 items-center justify-center bg-gray-100 text-gray-500">
                    No image available
                  </div>
                )}

                <div className="p-4">
                  <h2 className="font-semibold">{product.name}</h2>
                  <p className="mt-2">
                    ₹{Number(product.basePrice).toLocaleString("en-IN")}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
