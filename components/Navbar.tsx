
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://sonia-furniture-backend-production.up.railway.app/api";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    async function checkLogin() {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setIsLoggedIn(false);
        setAuthChecked(true);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);

          if (response.status === 401) {
            localStorage.removeItem("access_token");
          }
        }
      } catch (error) {
        console.error("Unable to verify login:", error);
        // Keep the token and allow the user to retry if the API is unavailable.
        setIsLoggedIn(Boolean(token));
      } finally {
        setAuthChecked(true);
      }
    }

    checkLogin();

    // Re-check when the token changes in another tab.
    function handleStorage(event: StorageEvent) {
      if (event.key === "access_token") {
        checkLogin();
      }
    }

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const accountHref = isLoggedIn ? "/account" : "/login";
  const accountLabel = isLoggedIn ? "My Account" : "Account";

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/70 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="group flex flex-col">
          <span className="text-xl font-semibold tracking-[0.18em] text-gray-950 transition duration-300 group-hover:tracking-[0.22em]">
            SONIA
          </span>

          <span className="text-[9px] font-medium tracking-[0.35em] text-gray-500">
            FURNITURE
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <NavLink href="/" label="Home" />
          <NavLink href="/shop" label="Shop" />
          <NavLink
            href="/custom-furniture"
            label="Custom Furniture"
          />
          <NavLink href="/contact" label="Contact" />
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href={authChecked && isLoggedIn ? "/account" : "/login"}
            className="rounded-full border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-900 hover:text-gray-950 hover:shadow-sm"
          >
            {authChecked && isLoggedIn ? "My Account" : "Login"}
          </Link>

          <Link
            href="/wishlist"
            className="group rounded-full border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-900 hover:text-gray-950 hover:shadow-sm"
          >
            ♡ Wishlist
          </Link>

          <Link
            href={accountHref}
            className="rounded-full border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-900 hover:text-gray-950 hover:shadow-sm"
          >
            {accountLabel}
          </Link>

          <Link
            href="/contact"
            className="rounded-full bg-gray-950 px-6 py-3 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-lg"
          >
            Request Enquiry
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 transition-all duration-300 hover:border-gray-950 hover:bg-gray-50 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`overflow-hidden border-t border-gray-200/70 bg-white transition-all duration-300 md:hidden ${
          menuOpen
            ? "max-h-[600px] opacity-100"
            : "max-h-0 border-t-0 opacity-0"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl flex-col px-6 py-5">
          <MobileNavLink
            href="/"
            label="Home"
            onClick={() => setMenuOpen(false)}
          />

          <MobileNavLink
            href="/shop"
            label="Shop"
            onClick={() => setMenuOpen(false)}
          />

          <MobileNavLink
            href="/custom-furniture"
            label="Custom Furniture"
            onClick={() => setMenuOpen(false)}
          />

          <MobileNavLink
            href="/login"
            label={authChecked && isLoggedIn ? "My Account" : "Login"}
            onClick={() => setMenuOpen(false)}
          />

          <MobileNavLink
            href="/wishlist"
            label="Wishlist"
            onClick={() => setMenuOpen(false)}
          />

          <MobileNavLink
            href={accountHref}
            label={accountLabel}
            onClick={() => setMenuOpen(false)}
          />

          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="mt-4 rounded-full bg-gray-950 px-6 py-3.5 text-center text-sm font-medium text-white transition-all duration-300 hover:bg-gray-800"
          >
            Request Enquiry
          </Link>
        </nav>
      </div>
    </header>
  );
}

function NavLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group relative py-2 text-sm font-medium text-gray-600 transition-colors duration-300 hover:text-gray-950"
    >
      {label}

      <span className="absolute bottom-0 left-0 h-px w-0 bg-gray-950 transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}

function MobileNavLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="border-b border-gray-100 py-4 text-sm font-medium text-gray-700 transition-all duration-300 hover:pl-2 hover:text-gray-950"
    >
      {label}
    </Link>
  );
}
