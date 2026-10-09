"use client";

import { useState } from "react";

interface WishlistButtonProps {
  productId: string;
  compact?: boolean;
}

export default function WishlistButton({
  productId,
  compact = false,
}: WishlistButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function addToWishlist() {
    const token = localStorage.getItem("access_token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/wishlist/${productId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Unable to add to wishlist",
        );
        return;
      }

      setMessage("Added to wishlist ♥");
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
        onClick={addToWishlist}
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
            ? "♡ Wishlist"
            : "♡ Add to Wishlist"}
      </button>

      {message && (
        <p
          className={
            compact
              ? "mt-2 text-xs text-gray-500"
              : "mt-3 text-sm text-gray-600"
          }
        >
          {message}
        </p>
      )}
    </div>
  );
}