"use client";

import { useEffect, useState } from "react";

const statusStyles: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700",
  CONTACTED: "bg-yellow-100 text-yellow-700",
  IN_PROGRESS: "bg-purple-100 text-purple-700",
  RESOLVED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function MyEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadEnquiries() {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/enquiries/my`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Unable to load enquiries");
      }

      const data = await response.json();

      setEnquiries(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEnquiries();
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f3ef] px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            My Account
          </p>

          <h1 className="mt-3 text-4xl font-bold text-gray-900 md:text-5xl">
            My Enquiries
          </h1>

          <p className="mt-4 text-gray-500">
            View your furniture enquiries and their current status.
          </p>
        </div>

        {loading && (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-500">
              Loading your enquiries...
            </p>
          </div>
        )}

        {!loading && enquiries.length === 0 && (
          <div className="rounded-3xl bg-white px-6 py-20 text-center shadow-sm">
            <div className="text-5xl">✉</div>

            <h2 className="mt-6 text-2xl font-bold">
              No enquiries yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-gray-500">
              When you enquire about furniture, your enquiries will
              appear here.
            </p>

            <a
              href="/shop"
              className="mt-7 inline-block rounded-full bg-gray-900 px-7 py-3 text-sm font-semibold text-white"
            >
              Explore Furniture
            </a>
          </div>
        )}

        {!loading && enquiries.length > 0 && (
          <div className="space-y-5">
            {enquiries.map((enquiry) => (
              <article
                key={enquiry.id}
                className="rounded-3xl bg-white p-6 shadow-sm md:p-8"
              >
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                      Enquiry
                    </p>

                    <h2 className="mt-2 text-xl font-bold text-gray-900">
                      {enquiry.product?.name ||
                        "Furniture Enquiry"}
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                      Submitted{" "}
                      {new Date(
                        enquiry.createdAt,
                      ).toLocaleDateString("en-IN")}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full px-4 py-2 text-xs font-semibold ${
                      statusStyles[enquiry.status] ||
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {enquiry.status.replace("_", " ")}
                  </span>
                </div>

                <div className="mt-6 border-t border-gray-100 pt-6">
                  <p className="text-sm leading-7 text-gray-600">
                    {enquiry.message}
                  </p>
                </div>

                {enquiry.product && (
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                    <p className="text-sm text-gray-500">
                      Product enquiry
                    </p>

                    <a
                      href={`/products/${enquiry.product.slug}`}
                      className="rounded-full border border-gray-900 px-5 py-2 text-sm font-semibold transition hover:bg-gray-900 hover:text-white"
                    >
                      View Product
                    </a>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

        <div className="mt-8">
          <a
            href="/account"
            className="text-sm font-semibold text-gray-700 underline underline-offset-4"
          >
            ← Back to My Account
          </a>
        </div>
      </div>
    </main>
  );
}