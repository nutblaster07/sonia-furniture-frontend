import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getHomepageData } from "../../lib/api";

export default async function CategoriesPage() {
  const data = await getHomepageData();

  const categories = data.categories || [];

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Navbar />

      {/* Header */}
      <section className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            SONIA FURNITURE
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Furniture Categories
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-gray-600">
            Explore modern furniture for homes, offices
            and commercial spaces.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        {categories.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category: any) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  {category.imageUrl ? (
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">
                      {category.name}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                    Furniture Category
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold">
                    {category.name}
                  </h2>

                  {category.description && (
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
                      {category.description}
                    </p>
                  )}

                  <span className="mt-5 inline-block text-sm font-semibold underline underline-offset-4 transition-colors group-hover:text-gray-600">
                    Explore Category →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <h2 className="text-2xl font-semibold">
              No categories available
            </h2>

            <p className="mt-3 text-gray-500">
              Please check back soon.
            </p>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}