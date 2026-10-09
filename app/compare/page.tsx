"use client";

import { useEffect, useState } from "react";

export default function ComparePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadCompare() {
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/compare`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Unable to load comparison");
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

  async function removeFromCompare(productId: string) {
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/compare/${productId}`,
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
    loadCompare();
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f3ef] px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            My Account
          </p>

          <h1 className="mt-3 text-4xl font-bold text-gray-900 md:text-5xl">
            Compare Furniture
          </h1>

          <p className="mt-4 text-gray-500">
            Compare furniture before making your decision.
          </p>
        </div>

        {loading && (
          <div className="rounded-3xl bg-white p-10 text-center">
            <p className="text-gray-500">
              Loading comparison...
            </p>
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="rounded-3xl bg-white px-6 py-20 text-center shadow-sm">
            <div className="text-5xl">⇄</div>

            <h2 className="mt-6 text-2xl font-bold">
              Nothing to compare
            </h2>

            <p className="mx-auto mt-3 max-w-md text-gray-500">
              Add furniture to your comparison list to compare
              products side by side.
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
          <div className="overflow-x-auto rounded-3xl bg-white shadow-sm">
            <table className="min-w-[800px] w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="w-48 p-6 text-left text-sm font-semibold text-gray-500">
                    Product
                  </th>

                  {products.map((product) => (
                    <th
                      key={product.id}
                      className="min-w-[220px] p-6 text-left align-top"
                    >
                      <div className="overflow-hidden rounded-2xl bg-gray-100">
                        {product.images?.[0]?.imageUrl ? (
                          <img
                            src={product.images[0].imageUrl}
                            alt={product.name}
                            className="aspect-square h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex aspect-square items-center justify-center text-sm text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>

                      <h2 className="mt-4 text-lg font-bold">
                        {product.name}
                      </h2>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-6 font-semibold">
                    Category
                  </td>

                  {products.map((product) => (
                    <td key={product.id} className="p-6">
                      {product.category?.name || "Furniture"}
                    </td>
                  ))}
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="p-6 font-semibold">
                    Price
                  </td>

                  {products.map((product) => (
                    <td key={product.id} className="p-6 font-bold">
                      ₹
                      {Number(
                        product.basePrice ?? product.price,
                      ).toLocaleString("en-IN")}
                    </td>
                  ))}
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="p-6 font-semibold">
                    Material
                  </td>

                  {products.map((product) => (
                    <td key={product.id} className="p-6">
                      {product.material || "—"}
                    </td>
                  ))}
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="p-6 font-semibold">
                    Brand
                  </td>

                  {products.map((product) => (
                    <td key={product.id} className="p-6">
                      {product.brand || "SONIA FURNITURE"}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-6 font-semibold">
                    Action
                  </td>

                  {products.map((product) => (
                    <td key={product.id} className="p-6">
                      <button
                        onClick={() =>
                          removeFromCompare(product.id)
                        }
                        className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold transition hover:border-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}