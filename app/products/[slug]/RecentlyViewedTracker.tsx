"use client";

import { useEffect } from "react";

interface RecentlyViewedTrackerProps {
  productId: string;
}

export default function RecentlyViewedTracker({
  productId,
}: RecentlyViewedTrackerProps) {
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      return;
    }

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/recently-viewed/${productId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).catch((error) => {
      console.error(
        "Unable to save recently viewed product:",
        error,
      );
    });
  }, [productId]);

  return null;
}