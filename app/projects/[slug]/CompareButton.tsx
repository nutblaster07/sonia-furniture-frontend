"use client";

import { useState } from "react";

interface CompareButtonProps {
  productId: string;
  compact?: boolean;
}

export default function CompareButton({
  productId,
  compact = false,
}: CompareButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function addToCompare() {
    const token = localStorage.getItem("access_token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/compare/${productId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to add to compare");
        return;
      }

      setMessage("Added");
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={addToCompare}
        disabled={loading}
        className={
          compact
            ? "rounded-full border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 transition-all duration-300 hover:border-gray-900 hover:bg-gray-900 hover:text-white disabled:opacity-50"
            : "rounded-full border border-gray-900 px-8 py-4 text-sm font-semibold transition hover:bg-gray-900 hover:text-white disabled:opacity-50"
        }
      >
        {loading
          ? "Adding..."
          : compact
            ? "⇄ Compare"
            : "⇄ Add to Compare"}
      </button>

      {message && (
        <p className="mt-2 text-xs text-gray-500">
          {message}
        </p>
      )}
    </div>
  );
}