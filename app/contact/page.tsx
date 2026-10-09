"use client";

import { FormEvent, useEffect, useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [productLoading, setProductLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productSlug = params.get("product");

    if (!productSlug) {
      return;
    }

    async function loadProduct() {
      try {
        setProductLoading(true);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/slug/${productSlug}`,
        );

        if (!response.ok) {
          return;
        }

        const product = await response.json();

        setProductId(product.id);
        setProductName(product.name);
      } catch (error) {
        console.error(
          "Unable to load product:",
          error,
        );
      } finally {
        setProductLoading(false);
      }
    }

    loadProduct();
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
      productId: productId || undefined,
    };

    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");

      const endpoint = token
        ? `${process.env.NEXT_PUBLIC_API_URL}/enquiries/authenticated`
        : `${process.env.NEXT_PUBLIC_API_URL}/enquiries`;

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message ||
            "Failed to submit enquiry",
        );
      }

      setSubmitted(true);
      form.reset();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Information */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
              Get in Touch
            </p>

            <h1 className="mt-3 text-4xl font-bold md:text-5xl">
              Request an Enquiry
            </h1>

            <p className="mt-6 max-w-xl leading-8 text-gray-600">
              Interested in one of our products or looking
              for furniture made specifically for your space?
              Tell us what you need and our team will get in
              touch with you.
            </p>

            <div className="mt-10 space-y-5">
              <div>
                <h2 className="font-semibold">
                  Furniture Enquiries
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Product pricing, availability and
                  customization.
                </p>
              </div>

              <div>
                <h2 className="font-semibold">
                  Custom Furniture
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Share your requirements for specially
                  manufactured furniture.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
            {submitted ? (
              <div className="py-12 text-center">
                <div className="text-4xl">✓</div>

                <h2 className="mt-5 text-2xl font-bold">
                  Enquiry Submitted
                </h2>

                <p className="mt-3 text-gray-600">
                  Thank you. Our team will contact you
                  shortly.
                </p>

                <a
                  href="/account/enquiries"
                  className="mt-6 inline-block rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
                >
                  View My Enquiries
                </a>

                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 block w-full text-sm font-semibold text-gray-700 underline underline-offset-4"
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Product Information */}
                {productName && (
                  <div className="rounded-2xl bg-gray-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                      Product Enquiry
                    </p>

                    <h2 className="mt-2 text-lg font-semibold text-gray-900">
                      {productName}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Your enquiry will be linked to this
                      product.
                    </p>
                  </div>
                )}

                {productLoading && (
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">
                      Loading product information...
                    </p>
                  </div>
                )}

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="text-sm font-medium"
                  >
                    Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                    placeholder="Your name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="text-sm font-medium"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                    placeholder="you@example.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="text-sm font-medium"
                  >
                    Phone
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                    placeholder="Your phone number"
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="text-sm font-medium"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="mt-2 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                    placeholder={
                      productName
                        ? `Tell us what you would like to know about ${productName}...`
                        : "Tell us what furniture you are interested in..."
                    }
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{ color: "#ffffff" }}
                  className="w-full rounded-full bg-gray-900 px-6 py-4 text-sm font-semibold transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Submitting..."
                    : productName
                      ? "Enquire About This Product"
                      : "Submit Enquiry"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}