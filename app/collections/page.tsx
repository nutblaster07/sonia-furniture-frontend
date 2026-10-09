
import Link from "next/link";

const API_URL = "http://127.0.0.1:5000/api";

async function getCollections() {
  try {
    const response = await fetch(`${API_URL}/collections/active`, {
      cache: "no-store",
    });

    if (!response.ok) return [];

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch collections:", error);
    return [];
  }
}

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="bg-gray-50 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            Discover SONIA FURNITURE
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Our Collections
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-gray-600">
            Explore thoughtfully designed furniture collections for modern
            homes, offices and commercial spaces.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        {collections.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 p-10 text-center">
            <h2 className="text-xl font-semibold">
              No active collections found
            </h2>
            <p className="mt-3 text-gray-600">
              Please activate a collection in the admin dashboard and try again.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection: any) => (
              <article
                key={collection.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
              >
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  {collection.imageUrl ? (
                    <img
                      src={collection.imageUrl}
                      alt={collection.name}
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-semibold">
                    {collection.name}
                  </h2>

                  {collection.description && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                      {collection.description}
                    </p>
                  )}

                  <Link
                    href={`/shop?collection=${collection.slug}`}
                    className="mt-5 inline-block text-sm font-semibold underline underline-offset-4"
                  >
                    Explore Collection
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
