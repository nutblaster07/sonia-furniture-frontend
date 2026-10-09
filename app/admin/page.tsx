"use client";

import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:5000/api";

type DashboardSummary = {
  totalProducts: number;
  totalCustomers: number;
  newEnquiries: number;
  customEnquiries: number;
  pendingReviews: number;
  projects: number;
};

export default function AdminDashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
       const token = localStorage.getItem("access_token");

        const response = await fetch(`${API_URL}/dashboard/summary`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });

       if (!response.ok) {
  const errorText = await response.text();

  console.error(
    "Dashboard API:",
    response.status,
    errorText,
  );

  throw new Error(
    `Dashboard API failed: ${response.status} ${errorText}`,
  );
}

        const data = await response.json();
        setSummary(data);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <p className="text-gray-600">Loading dashboard...</p>
      </main>
    );
  }

  if (!summary) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <p className="text-red-600">Unable to load dashboard.</p>
      </main>
    );
  }

  const cards = [
    {
      title: "Products",
      value: summary.totalProducts,
    },
    {
      title: "Customers",
      value: summary.totalCustomers,
    },
    {
      title: "New Enquiries",
      value: summary.newEnquiries,
    },
    {
      title: "Custom Enquiries",
      value: summary.customEnquiries,
    },
    {
      title: "Pending Reviews",
      value: summary.pendingReviews,
    },
    {
      title: "Projects",
      value: summary.projects,
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
            SONIA FURNITURE
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-gray-900">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your furniture business from one place.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-gray-200 bg-white p-6"
            >
              <p className="text-sm text-gray-500">{card.title}</p>

              <p className="mt-3 text-3xl font-semibold text-gray-900">
                {card.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}