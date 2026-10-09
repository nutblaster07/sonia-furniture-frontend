
"use client";

import { useEffect, useState } from "react";
import LogoutButton from "./LogoutButton";


const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://sonia-furniture-backend-production.up.railway.app/api";


interface User {
  id?: string;
  name?: string;
  email?: string;
  phone?: string | null;
  role?: string;
}

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("Please log in to view your account details.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        if (response.status === 401) {
          setError("Your session has expired. Please log in again.");
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to fetch your account details.");
        }

        const data = await response.json();
        setUser(data.user ?? data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading your account.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f3ef] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            My Account
          </p>

          <h1 className="mt-3 text-4xl font-bold text-gray-900 md:text-5xl">
            Welcome to SONIA FURNITURE
          </h1>

          <p className="mt-4 text-gray-500">
            Manage your furniture preferences, wishlist and enquiries.
          </p>
        </div>

        <section className="rounded-3xl bg-white p-8 shadow-sm">
          {loading ? (
            <p className="text-gray-500">Loading your account details...</p>
          ) : error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : (
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <p className="text-sm text-gray-500">Signed in as</p>

                <h2 className="mt-1 text-xl font-semibold text-gray-900">
                  {user?.name || "Name not provided"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {user?.email || "Email not available"}
                </p>

                {user?.phone && (
                  <p className="mt-2 text-sm text-gray-600">
                    Phone: {user.phone}
                  </p>
                )}

                {user?.role && (
                  <p className="mt-2 text-xs uppercase tracking-wide text-gray-500">
                    Role: {user.role}
                  </p>
                )}
              </div>

              <LogoutButton />
            </div>
          )}
        </section>

        <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <a
            href="/wishlist"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1"
          >
            <div className="text-2xl">♡</div>
            <h2 className="mt-5 text-xl font-semibold">Wishlist</h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Save furniture you love for later.
            </p>
          </a>

          <a
            href="/recently-viewed"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1"
          >
            <div className="text-2xl">◷</div>
            <h2 className="mt-5 text-xl font-semibold">Recently Viewed</h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Quickly return to furniture you've viewed.
            </p>
          </a>

          <a
            href="/compare"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1"
          >
            <div className="text-2xl">⇄</div>
            <h2 className="mt-5 text-xl font-semibold">Compare</h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Compare furniture before making a decision.
            </p>
          </a>

          <a
            href="/account/enquiries"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1"
          >
            <div className="text-2xl">✉</div>
            <h2 className="mt-5 text-xl font-semibold">My Enquiries</h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              View your furniture enquiries and their status.
            </p>
          </a>
        </section>

        <section className="mt-8 rounded-3xl bg-gray-900 p-8 text-white md:p-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
              Custom Furniture
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Have a unique furniture requirement?
            </h2>

            <p className="mt-4 leading-7 text-gray-400">
              Tell us about your space and requirements. Our team can help
              create furniture specifically for you.
            </p>

            <a
              href="/custom-furniture"
              className="mt-7 inline-block rounded-full bg-white px-7 py-3 text-sm font-semibold text-gray-900"
            >
              Request Custom Furniture
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
