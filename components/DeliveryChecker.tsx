"use client";

import { useState } from "react";

interface DeliveryResult {
  available: boolean;
  pincode: string;
  city: string;
  state: string;
  deliveryCharge: number;
  estimatedDays: number;
}

export default function DeliveryChecker() {
  const [pincode, setPincode] = useState("");
  const [result, setResult] = useState<DeliveryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function checkDelivery() {
    if (!/^\d{6}$/.test(pincode)) {
      setError("Please enter a valid 6-digit pincode.");
      setResult(null);
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/delivery/check?pincode=${pincode}`,
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to check delivery.");
        return;
      }

      setResult(data);
    } catch (error) {
      console.error(error);
      setError("Unable to check delivery. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-5">
      <h3 className="text-lg font-semibold text-gray-900">
        Check Delivery Availability
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        Enter your pincode to check delivery availability.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={pincode}
          onChange={(event) =>
            setPincode(
              event.target.value.replace(/\D/g, "").slice(0, 6),
            )
          }
          placeholder="Enter 6-digit pincode"
          maxLength={6}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-900"
        />

        <button
          type="button"
          onClick={checkDelivery}
          disabled={loading}
          className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Checking..." : "Check"}
        </button>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-5 rounded-xl bg-white p-4">
          {result.available ? (
            <>
              <p className="font-semibold text-green-700">
                ✓ Delivery available
              </p>

              <p className="mt-2 text-sm text-gray-600">
                {result.city}, {result.state}
              </p>

              <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <span className="text-gray-500">
                    Delivery charge
                  </span>
                  <p className="font-semibold text-gray-900">
                    ₹{result.deliveryCharge}
                  </p>
                </div>

                <div>
                  <span className="text-gray-500">
                    Estimated delivery
                  </span>
                  <p className="font-semibold text-gray-900">
                    {result.estimatedDays} days
                  </p>
                </div>
              </div>
            </>
          ) : (
            <p className="font-semibold text-red-600">
              ✕ Delivery is currently unavailable for this
              pincode.
            </p>
          )}
        </div>
      )}
    </div>
  );
}