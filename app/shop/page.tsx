import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ShopFilters from "./ShopFilters";
import { getHomepageData } from "../../lib/api";

export default async function ShopPage() {
const data = await getHomepageData();

const productsResponse = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/products?status=ACTIVE&limit=100`,
  {
    cache: "no-store",
  },
);

const productsData = await productsResponse.json();

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
            Shop Furniture
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-gray-600">
            Explore our collection of modern furniture
            designed and manufactured for Indian homes,
            offices and commercial spaces.
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-7xl px-6 py-16">
      <ShopFilters
        products={productsData.data || []}
        categories={data.categories || []}
      />
      </section>

      <Footer />
    </main>
  );
}