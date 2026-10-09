"use client";

import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const email = formData.get("email");
    const password = formData.get("password");

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Invalid email or password",
        );
      }

        console.log("LOGIN RESPONSE:", data);
        //console.log("TOKEN:", data.access_token);

        if (data.accessToken) {
            localStorage.setItem("access_token", data.accessToken);
        }

    

        window.location.href = "/account";
    } catch (error: any) {
      setError(
        error.message || "Unable to login. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f3ef] px-6 py-12">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">
          
          {/* Left Side */}
          <div className="hidden bg-gray-900 p-12 text-white md:flex md:flex-col md:justify-between">
            <div>
              <a
                href="/"
                className="text-2xl font-bold tracking-[0.15em]"
              >
                SONIA
              </a>

              <p className="mt-1 text-xs tracking-[0.3em] text-gray-400">
                FURNITURE
              </p>
            </div>

            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-gray-400">
                Welcome Back
              </p>

              <h2 className="mt-4 text-4xl font-bold leading-tight">
                Your space.
                <br />
                Your style.
                <br />
                Your furniture.
              </h2>

              <p className="mt-6 max-w-sm leading-7 text-gray-400">
                Sign in to manage your enquiries, wishlist and
                furniture preferences.
              </p>
            </div>

            <p className="text-xs text-gray-500">
              Modern furniture • Crafted in India
            </p>
          </div>

          {/* Right Side */}
          <div className="p-8 sm:p-12 md:p-14">
            <div className="mx-auto max-w-md">
              <div className="md:hidden">
                <a
                  href="/"
                  className="text-xl font-bold tracking-[0.15em]"
                >
                  SONIA FURNITURE
                </a>
              </div>

              <div className="mt-8 md:mt-0">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                  Customer Account
                </p>

                <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
                  Welcome back
                </h1>

                <p className="mt-3 text-gray-500">
                  Sign in to continue to your account.
                </p>
              </div>

              {error && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleLogin}
                className="mt-8 space-y-5"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-gray-800"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-gray-800"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                    placeholder="Enter your password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{ color: "#ffffff" }}
                  className="w-full rounded-xl bg-gray-900 px-6 py-4 text-sm font-semibold transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <div className="my-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs text-gray-400">
                  OR
                </span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <p className="text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <a
                  href="/signup"
                  className="font-semibold text-gray-900 underline underline-offset-4"
                >
                  Create Account
                </a>
              </p>

              <a
                href="/"
                className="mt-8 block text-center text-sm text-gray-500 hover:text-gray-900"
              >
                ← Back to SONIA FURNITURE
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}