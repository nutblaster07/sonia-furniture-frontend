"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuSections = [
  {
    title: "Overview",
    items: [
      {
        name: "Dashboard",
        href: "/admin",
      },
    ],
  },
  {
    title: "Catalogue",
    items: [
      {
        name: "Products",
        href: "/admin/products",
      },
      {
        name: "Categories",
        href: "/admin/categories",
      },
      {
        name: "Collections",
        href: "/admin/collections",
      },
    ],
  },
  {
    title: "Homepage CMS",
    items: [
      {
        name: "Hero Banners",
        href: "/admin/homepage/banners",
      },
      {
        name: "Homepage Sections",
        href: "/admin/homepage",
      },
      {
        name: "Why SONIA",
        href: "/admin/homepage/why-sonia",
      },
      {
        name: "Custom Furniture Banner",
        href: "/admin/homepage/custom-furniture",
      },
    ],
  },
  {
    title: "Business",
    items: [
      {
        name: "Enquiries",
        href: "/admin/enquiries",
      },
      {
        name: "Custom Enquiries",
        href: "/admin/custom-enquiries",
      },
      {
        name: "Customers",
        href: "/admin/customers",
      },
      {
        name: "Reviews",
        href: "/admin/reviews",
      },
    ],
  },
  {
    title: "Content",
    items: [
      {
        name: "Projects",
        href: "/admin/projects",
      },
      {
        name: "Blog Posts",
        href: "/admin/blog",
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        name: "Delivery Locations",
        href: "/admin/delivery",
      },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f5f3ef]">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-72 shrink-0 border-r border-gray-200 bg-white lg:block">
          <div className="sticky top-0 flex h-screen flex-col">
            {/* Logo */}
            <div className="border-b border-gray-200 px-7 py-6">
              <Link
                href="/admin"
                className="text-xl font-bold tracking-[0.15em] text-gray-900"
              >
                SONIA
              </Link>

              <p className="mt-1 text-[10px] tracking-[0.3em] text-gray-500">
                FURNITURE ADMIN
              </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-6">
              {menuSections.map((section) => (
                <div key={section.title} className="mb-7">
                  <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                    {section.title}
                  </p>

                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const active =
                        item.href === "/admin"
                          ? pathname === "/admin"
                          : pathname.startsWith(item.href);

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`block rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                            active
                              ? "bg-gray-900 text-white"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          }`}
                        >
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* Bottom */}
            <div className="border-t border-gray-200 p-4">
              <Link
                href="/"
                className="block rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              >
                ← View Website
              </Link>

              <Link
                href="/account"
                className="mt-1 block rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              >
                My Account
              </Link>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1">
          {/* Mobile top bar */}
          <div className="border-b border-gray-200 bg-white px-5 py-4 lg:hidden">
            <Link
              href="/admin"
              className="text-lg font-bold tracking-[0.15em]"
            >
              SONIA FURNITURE
            </Link>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}