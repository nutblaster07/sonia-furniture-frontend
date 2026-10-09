


import { getHomepageData } from "../lib/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default async function Home() {
  const data = await getHomepageData();

  const hero = data.banners?.[0];
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-100">
  {hero?.imageUrl && (
    <img
      src={hero.imageUrl}
      alt={hero.title}
      className="absolute inset-0 h-full w-full object-cover"
    />
  )}

  <div className="absolute inset-0 bg-black/40" />

  <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
    <div className="max-w-3xl text-white">
      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em]">
        SONIA FURNITURE
      </p>

      <h2 className="text-5xl font-bold leading-tight md:text-7xl">
        {hero?.title || "Furniture Made for Modern Living"}
      </h2>

      {hero?.subtitle && (
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/90">
          {hero.subtitle}
        </p>
      )}

      <div className="mt-8">
        <a
          href={hero?.buttonLink || "/shop"}
          className="inline-block rounded-full bg-white px-7 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-200"
        >
          {hero?.buttonText || "Explore Furniture"}
        </a>
      </div>
    </div>
  </div>
</section>

      {/* Temporary sections */}
      <section className="mx-auto max-w-7xl px-6 py-20">
  <div className="mb-10 flex items-end justify-between">
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
        Our Selection
      </p>

      <h2 className="mt-2 text-3xl font-bold md:text-4xl">
        Featured Furniture
      </h2>
    </div>

    <a
      href="/shop"
      className="hidden text-sm font-semibold underline underline-offset-4 md:block"
    >
      View All
    </a>
  </div>

  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {data.products?.map((product: any) => (
      <div
        key={product.id}
        className="group overflow-hidden rounded-2xl border border-gray-200 bg-white"
      >
        <div className="aspect-square overflow-hidden bg-gray-100">
          {product.images?.[0]?.imageUrl ? (
            <img
              src={product.images[0].imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              No Image
            </div>
          )}
        </div>

        <div className="p-5">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            {product.category?.name || "Furniture"}
          </p>

          <h3 className="mt-2 text-lg font-semibold">
            {product.name}
          </h3>

          <p className="mt-2 text-lg font-bold">
            ₹{Number(product.basePrice).toLocaleString("en-IN")}
          </p>

         <div className="mt-4 flex flex-wrap gap-4">
            <a
              href={`/products/${product.slug}`}
              className="text-sm font-semibold underline underline-offset-4"
            >
              View Product
            </a>

            <a
              href={`/contact?product=${product.slug}`}
              className="text-sm font-semibold underline underline-offset-4"
            >
              Enquire About This Product
            </a>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>
```tsx
{/* Featured Collections */}
{data.collections?.length > 0 && (
  <section className="mx-auto max-w-7xl px-6 py-20">
    <div className="mb-10 flex items-end justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
          Curated for You
        </p>

        <h2 className="mt-2 text-3xl font-bold md:text-4xl">
          Featured Collections
        </h2>

        <p className="mt-3 max-w-xl text-gray-600">
          Explore thoughtfully designed furniture collections for every space.
        </p>
      </div>

      <a
        href="/collections"
        className="hidden text-sm font-semibold underline underline-offset-4 md:block"
      >
        View All
      </a>
    </div>

    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {data.collections.map((collection: any) => (
        <a
          key={collection.id}
          href={`/collections/${collection.slug}`}
          className="group overflow-hidden rounded-2xl border border-gray-200 bg-white"
        >
          <div className="aspect-[4/3] overflow-hidden bg-gray-100">
            {collection.imageUrl ? (
              <img
                src={collection.imageUrl}
                alt={collection.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>

          <div className="p-5">
            <h3 className="text-xl font-semibold">
              {collection.name}
            </h3>

            {collection.description && (
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
                {collection.description}
              </p>
            )}

            <span className="mt-4 inline-block text-sm font-semibold underline underline-offset-4">
              Explore Collection
            </span>
          </div>
        </a>
      ))}
    </div>
  </section>
)}
```

<section className="mx-auto max-w-7xl px-6 py-20">
  <div className="mb-10">
    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
      Explore
    </p>

    <h2 className="mt-2 text-3xl font-bold md:text-4xl">
      Shop by Category
    </h2>
  </div>

  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {data.categories?.map((category: any) => (
      <a
        key={category.id}
        href={`/shop?category=${category.slug}`}
        className="group overflow-hidden rounded-2xl border border-gray-200 bg-white"
      >
        <div className="aspect-[4/3] overflow-hidden bg-gray-100">
          {category.imageUrl ? (
            <img
              src={category.imageUrl}
              alt={category.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="text-xl font-semibold">
            {category.name}
          </h3>

          {category.description && (
            <p className="mt-2 text-sm leading-6 text-gray-600">
              {category.description}
            </p>
          )}

          <span className="mt-4 inline-block text-sm font-semibold underline underline-offset-4">
            Explore Category
          </span>
        </div>
      </a>
    ))}
  </div>
</section>

<section className="bg-gray-50">
  <div className="mx-auto max-w-7xl px-6 py-20">
    <div className="mb-10">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
        Find Your Style
      </p>

      <h2 className="mt-2 text-3xl font-bold md:text-4xl">
        Shop by Room
      </h2>
    </div>

    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {data.rooms?.map((room: any) => (
        <a
          key={room.id}
          href={`/shop?room=${room.slug}`}
          className="group relative overflow-hidden rounded-2xl bg-gray-200"
        >
          <div className="aspect-[4/5]">
            {room.imageUrl ? (
              <img
                src={room.imageUrl}
                alt={room.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 pt-20">
            <h3 className="text-xl font-semibold text-white">
              {room.name}
            </h3>

            {room.description && (
              <p className="mt-1 text-sm text-white/80">
                {room.description}
              </p>
            )}
          </div>
        </a>
      ))}
    </div>
  </div>
</section>

<section className="bg-gray-900 text-white">
  <div className="mx-auto max-w-7xl px-6 py-20">
    <div className="max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
        Why Choose Us
      </p>

      <h2 className="mt-3 text-3xl font-bold md:text-4xl">
        Why SONIA FURNITURE
      </h2>

      <p className="mt-4 leading-7 text-gray-400">
        Furniture designed with purpose and manufactured with care.
      </p>
    </div>

    <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {data.whySonia?.map((item: any) => (
        <div
          key={item.id}
          className="rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          {item.icon && (
            <div className="mb-5 text-sm uppercase tracking-widest text-gray-400">
              {item.icon}
            </div>
          )}

          <h3 className="text-xl font-semibold">
            {item.title}
          </h3>

          {item.description && (
            <p className="mt-3 text-sm leading-6 text-gray-400">
              {item.description}
            </p>
          )}
        </div>
      ))}
    </div>
  </div>
</section>
<section className="relative overflow-hidden bg-gray-100">
  {data.customFurnitureBanners?.[0]?.imageUrl && (
    <img
      src={data.customFurnitureBanners[0].imageUrl}
      alt={data.customFurnitureBanners[0].title}
      className="absolute inset-0 h-full w-full object-cover"
    />
  )}

  <div className="absolute inset-0 bg-black/50" />

  <div className="relative mx-auto max-w-7xl px-6 py-24">
    <div className="max-w-2xl text-white">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
        Made for You
      </p>

      <h2 className="mt-3 text-4xl font-bold md:text-5xl">
        {data.customFurnitureBanners?.[0]?.title ||
          "Furniture Made for Your Space"}
      </h2>

      {data.customFurnitureBanners?.[0]?.subtitle && (
        <p className="mt-5 text-lg leading-8 text-white/85">
          {data.customFurnitureBanners[0].subtitle}
        </p>
      )}

      <a
        href={
          data.customFurnitureBanners?.[0]?.buttonLink ||
          "/custom-furniture"
        }
        className="mt-8 inline-block rounded-full bg-white px-7 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-200"
      >
        {data.customFurnitureBanners?.[0]?.buttonText ||
          "Request Custom Furniture"}
      </a>
    </div>
  </div>
</section>
<section className="mx-auto max-w-7xl px-6 py-20">
  <div className="mb-10">
    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
      Customer Experiences
    </p>

    <h2 className="mt-2 text-3xl font-bold md:text-4xl">
      What Our Customers Say
    </h2>
  </div>

  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {data.reviews?.map((review: any) => (
      <div
        key={review.id}
        className="rounded-2xl border border-gray-200 bg-white p-6"
      >
        {/* Rating */}
        <div className="flex gap-1 text-lg">
          {Array.from({ length: 5 }).map((_, index) => (
            <span
              key={index}
              className={
                index < review.rating
                  ? "text-black"
                  : "text-gray-300"
              }
            >
              ★
            </span>
          ))}
        </div>

        {/* Review title */}
        {review.title && (
          <h3 className="mt-5 text-lg font-semibold">
            {review.title}
          </h3>
        )}

        {/* Review comment */}
        <p className="mt-3 leading-7 text-gray-600">
          “{review.comment}”
        </p>

        {/* Product */}
        {review.product && (
          <p className="mt-5 text-sm font-medium text-gray-900">
            {review.product.name}
          </p>
        )}
      </div>
    ))}
  </div>
</section>
<section className="bg-gray-50">
  <div className="mx-auto max-w-7xl px-6 py-20">
    <div className="mb-10 flex items-end justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
          Our Work
        </p>

        <h2 className="mt-2 text-3xl font-bold md:text-4xl">
          Featured Projects
        </h2>
      </div>

      <a
        href="/projects"
        className="hidden text-sm font-semibold underline underline-offset-4 md:block"
      >
        View All Projects
      </a>
    </div>

    <div className="grid gap-6 md:grid-cols-2">
      {data.projects?.map((project: any) => (
        <a
          key={project.id}
          href={`/projects/${project.slug}`}
          className="group overflow-hidden rounded-2xl bg-white"
        >
          <div className="aspect-[16/10] overflow-hidden bg-gray-200">
            {project.images?.[0]?.imageUrl ? (
              <img
                src={project.images[0].imageUrl}
                alt={project.images[0].altText || project.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="flex flex-wrap gap-3 text-xs uppercase tracking-wide text-gray-500">
              {project.category && <span>{project.category}</span>}
              {project.location && <span>• {project.location}</span>}
            </div>

            <h3 className="mt-3 text-2xl font-semibold">
              {project.title}
            </h3>

            {project.description && (
              <p className="mt-3 line-clamp-2 leading-7 text-gray-600">
                {project.description}
              </p>
            )}

            <span className="mt-5 inline-block text-sm font-semibold underline underline-offset-4">
              View Project
            </span>
          </div>
        </a>
      ))}
    </div>
  </div>
</section>

<section className="bg-gray-900 text-white">
  <div className="mx-auto max-w-7xl px-6 py-20">
    <div className="grid gap-10 md:grid-cols-2 md:items-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
          Let's Build Your Space
        </p>

        <h2 className="mt-3 text-4xl font-bold md:text-5xl">
          Have a furniture idea?
        </h2>

        <p className="mt-5 max-w-xl leading-7 text-gray-400">
          Tell us what you need. Our team can help you choose from our
          collection or create furniture specifically for your space.
        </p>
      </div>

      <div className="md:flex md:justify-end">
        <a
          href="/contact"
          className="inline-block rounded-full bg-white px-8 py-4 text-sm font-semibold text-gray-900 transition hover:bg-gray-200"
        >
          Request an Enquiry
        </a>
      </div>
    </div>
  </div>
</section>

      {/* Footer */}
        <Footer />
    </main>
  );
}