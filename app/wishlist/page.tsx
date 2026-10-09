"use client";

import { useEffect, useState } from "react";

export default function WishlistPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadWishlist() {
    try {
        const token = localStorage.getItem("access_token");

        const response = await fetch(
         `${process.env.NEXT_PUBLIC_API_URL}/wishlist`,
        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        },
        );

      if (!response.ok) {
        throw new Error("Unable to load wishlist");
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

  async function removeFromWishlist(productId: string) {
    try {
        const token = localStorage.getItem("access_token");

        const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/wishlist/${productId}`,
        {
            method: "DELETE",
            headers: {
            Authorization: `Bearer ${token}`,
            },
        },
        );

      if (!response.ok) {
        throw new Error("Unable to remove product");
      }

      setProducts((current) =>
        current.filter(
          (product) => product.id !== productId,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadWishlist();
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f3ef] px-6 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            My Account
          </p>

          <h1 className="mt-3 text-4xl font-bold text-gray-900 md:text-5xl">
            Wishlist
          </h1>

          <p className="mt-4 text-gray-500">
            Furniture you've saved for later.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-3xl bg-white p-10 text-center">
            <p className="text-gray-500">
              Loading your wishlist...
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && products.length === 0 && (
          <div className="rounded-3xl bg-white px-6 py-20 text-center shadow-sm">
            <div className="text-5xl">♡</div>

            <h2 className="mt-6 text-2xl font-bold">
              Your wishlist is empty
            </h2>

            <p className="mx-auto mt-3 max-w-md text-gray-500">
              Save furniture you love and come back to it whenever
              you're ready.
            </p>

            <a
              href="/shop"
              className="mt-7 inline-block rounded-full bg-gray-900 px-7 py-3 text-sm font-semibold text-white"
            >
              Explore Furniture
            </a>
          </div>
        )}

        {/* Products */}
        {!loading && products.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product: any) => (
              <div
                key={product.id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                <a
                  href={`/products/${product.slug}`}
                  className="group block"
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
                      {Number(product.price).toLocaleString(
                        "en-IN",
                      )}
                    </p>
                  </div>
                </a>

                <div className="px-5 pb-5">
                  <button
                    onClick={() =>
                      removeFromWishlist(product.id)
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-900 transition hover:border-red-500 hover:text-red-600"
                  >
                    Remove from Wishlist
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}