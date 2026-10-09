"use client";

import { FormEvent, useState } from "react";

interface DeliveryResult {
  available: boolean;
  message?: string;
  pincode?: string;
  city?: string;
  state?: string;
  deliveryCharge?: number;
  estimatedDays?: number;
}

export default function DeliveryPage() {
  const [pincode, setPincode] = useState("");
  const [result, setResult] = useState<DeliveryResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function checkDelivery(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!/^\d{6}$/.test(pincode)) {
      setResult({
        available: false,
        message: "Please enter a valid 6-digit PIN code.",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/delivery/check?pincode=${pincode}`,
      );

      const data = await response.json();

      setResult(data);
    } catch (error) {
      console.error(error);

      setResult({
        available: false,
        message: "Unable to check delivery. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <section className="bg-gray-900 text-white">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
            Delivery Availability
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Check Delivery to Your Location
          </h1>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-gray-400">
            Enter your PIN code to check delivery availability, estimated
            delivery time and delivery charges.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-xl px-6 py-16">
        <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
          <form onSubmit={checkDelivery}>
            <label className="text-sm font-medium">
              Enter PIN Code
            </label>

            <div className="mt-3 flex gap-3">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={pincode}
                onChange={(event) =>
                  setPincode(
                    event.target.value.replace(/\D/g, ""),
                  )
                }
                placeholder="e.g. 734003"
                className="min-w-0 flex-1 rounded-full border border-gray-300 px-5 py-3 outline-none focus:border-gray-900"
              />

              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {loading ? "Checking..." : "Check"}
              </button>
            </div>
          </form>

          {result && (
            <div
              className={`mt-8 rounded-2xl p-6 ${
                result.available
                  ? "bg-gray-100"
                  : "bg-red-50"
              }`}
            >
              {result.available ? (
                <>
                  <h2 className="text-xl font-semibold">
                    Delivery Available
                  </h2>

                  <p className="mt-2 text-gray-600">
                    {result.city}, {result.state}
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-white p-4">
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        Estimated Delivery
                      </p>

                      <p className="mt-2 font-semibold">
                        {result.estimatedDays} days
                      </p>
                    </div>

                    <div className="rounded-xl bg-white p-4">
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        Delivery Charge
                      </p>

                      <p className="mt-2 font-semibold">
                        ₹
                        {Number(
                          result.deliveryCharge ?? 0,
                        ).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-red-700">
                    Delivery Not Available
                  </h2>

                  <p className="mt-2 text-sm text-red-600">
                    {result.message ||
                      "We currently do not deliver to this PIN code."}
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}