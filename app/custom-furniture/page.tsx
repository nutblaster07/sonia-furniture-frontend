"use client";

import { FormEvent, useState } from "react";

export default function CustomFurniturePage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      furnitureType: formData.get("furnitureType"),
      dimensions: formData.get("dimensions"),
      material: formData.get("material"),
      budget: formData.get("budget"),
      message: formData.get("message"),
    };

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/custom-enquiries`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to submit custom enquiry");
      }

      setSubmitted(true);
      form.reset();
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Hero */}
      <section className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
            Custom Furniture
          </p>

          <h1 className="mt-4 max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
            Furniture Made for Your Space
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-400">
            Have a unique idea or specific requirements? Tell us what you
            need and our team can help design and manufacture it for you.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">
              Tell Us What You Need
            </h2>

            <p className="mt-5 leading-8 text-gray-600">
              Share your furniture requirements, preferred materials,
              dimensions and budget. Our team will review your request
              and get in touch with you.
            </p>

            <div className="mt-10 space-y-6">
              <div>
                <h3 className="font-semibold">Custom Dimensions</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Furniture designed according to your available space.
                </p>
              </div>

              <div>
                <h3 className="font-semibold">Material Selection</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Share your preferred material, finish or style.
                </p>
              </div>

              <div>
                <h3 className="font-semibold">Made in India</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Designed and manufactured by SONIA FURNITURE.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-gray-50 p-6 md:p-8">
            {submitted ? (
              <div className="py-12 text-center">
                <div className="text-4xl">✓</div>

                <h2 className="mt-5 text-2xl font-bold">
                  Request Submitted
                </h2>

                <p className="mt-3 text-gray-600">
                  Thank you. Our team will review your requirements and
                  contact you shortly.
                </p>

                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-gray-900"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-gray-900"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <input
                    name="phone"
                    type="tel"
                    required
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-gray-900"
                    placeholder="Your phone number"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Furniture Type
                  </label>
                  <input
                    name="furnitureType"
                    type="text"
                    required
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-gray-900"
                    placeholder="e.g. Sofa, Bed, Dining Table"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Dimensions
                  </label>
                  <input
                    name="dimensions"
                    type="text"
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-gray-900"
                    placeholder="e.g. 6 ft × 3 ft"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Preferred Material
                  </label>
                  <input
                    name="material"
                    type="text"
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-gray-900"
                    placeholder="e.g. Solid Wood, Plywood"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Budget
                  </label>
                  <input
                    name="budget"
                    type="text"
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-gray-900"
                    placeholder="e.g. ₹50,000"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Requirements
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    className="mt-2 w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-gray-900"
                    placeholder="Describe your furniture requirements..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-gray-900 px-6 py-4 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Submitting..."
                    : "Request Custom Furniture"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}