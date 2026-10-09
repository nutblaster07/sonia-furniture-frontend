"use client";

import { useEffect, useState } from "react";

export default function RecentlyViewedPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadRecentlyViewed() {
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/recently-viewed`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Unable to load recently viewed products");
      }

      const data = await response.json();

      setProducts(
        data.items?.map((item: any) => item.product) || [],
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecentlyViewed();
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f3ef] px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            My Account
          </p>

          <h1 className="mt-3 text-4xl font-bold text-gray-900 md:text-5xl">
            Recently Viewed
          </h1>

          <p className="mt-4 text-gray-500">
            Furniture you've recently explored.
          </p>
        </div>

        {loading && (
          <div className="rounded-3xl bg-white p-10 text-center">
            <p className="text-gray-500">
              Loading recently viewed products...
            </p>
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="rounded-3xl bg-white px-6 py-20 text-center shadow-sm">
            <div className="text-5xl">◷</div>

            <h2 className="mt-6 text-2xl font-bold">
              Nothing viewed yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-gray-500">
              Products you explore will appear here.
            </p>

            <a
              href="/shop"
              className="mt-7 inline-block rounded-full bg-gray-900 px-7 py-3 text-sm font-semibold text-white"
            >
              Explore Furniture
            </a>
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product: any) => (
              <a
                key={product.id}
                href={`/products/${product.slug}`}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                <div className="aspect-square overflow-hidden bg-gray-100">
                  {product.images?.[0]?.imageUrl ? (
                    <img
                      src={product.images[0].imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    {product.category?.name || "Furniture"}
                  </p>

                  <h2 className="mt-2 text-lg font-semibold">
                    {product.name}
                  </h2>

                  <p className="mt-2 font-bold">
                    ₹
                    {Number(
                      product.basePrice ?? product.price,
                    ).toLocaleString("en-IN")}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}