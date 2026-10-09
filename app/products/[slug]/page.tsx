import RecentlyViewedTracker from "./RecentlyViewedTracker";
import WishlistButton from "./WishlistButton";
import CompareButton from "./CompareButton";
import DeliveryChecker from "../../../components/DeliveryChecker";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getProduct(slug: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/slug/${slug}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const product = await getProduct(slug);


  

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center">
       
        <div className="text-center">
          <h1 className="text-3xl font-bold">Product Not Found</h1>

          <a
            href="/shop"
            className="mt-4 inline-block underline"
          >
            Back to Shop
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
         <RecentlyViewedTracker productId={product.id} />
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Product Images */}
          <div>
            <div className="aspect-square overflow-hidden rounded-2xl bg-gray-100">
              {product.images?.[0]?.imageUrl ? (
                <img
                  src={product.images[0].imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>

            {product.images?.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {product.images.map((image: any) => (
                  <div
                    key={image.id}
                    className="aspect-square overflow-hidden rounded-xl bg-gray-100"
                  >
                    <img
                      src={image.imageUrl}
                      alt={image.altText || product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="flex flex-col justify-center">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
              {product.category?.name || "Furniture"}
            </p>

            <h1 className="mt-3 text-4xl font-bold md:text-5xl">
              {product.name}
            </h1>

            <p className="mt-5 text-2xl font-semibold">
              ₹{Number(product.basePrice).toLocaleString("en-IN")}
            </p>

            {product.description && (
              <p className="mt-6 leading-8 text-gray-600">
                {product.description}
              </p>
            )}
            {product.material && (
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                  Material
                </p>
                <p className="mt-1 text-sm font-medium text-gray-800">
                  {product.material}
                </p>
              </div>
            )}
            {product.customizationAvailable && (
                <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-700">
                    Customization Available
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Customize dimensions, materials, colours and other
                    furniture requirements based on your space and needs.
                  </p>

                  <a
                    href={`/contact?product=${product.slug}`}
                    className="mt-4 inline-block text-sm font-semibold underline underline-offset-4"
                  >
                    Enquire for Customization →
                  </a>
                </div>
              )}

            <div className="mt-8 flex flex-col gap-3">
              <a
                href={`/contact?product=${product.slug}`}
                className="rounded-full bg-gray-900 px-8 py-4 text-center text-sm font-semibold text-white transition hover:bg-gray-700"
              >
                Request Enquiry
              </a>

              <a
                href={`https://wa.me/918509158655?text=${encodeURIComponent(
                  `Hello SONIA FURNITURE, I am interested in ${product.name}. Price: ₹${Number(product.basePrice).toLocaleString("en-IN")}. Product link: ${`http://localhost:3000/products/${product.slug}`}. Please share more details.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#25D366] px-8 py-4 text-center text-sm font-semibold text-white transition hover:bg-[#1DA851]"
              >
                WhatsApp Enquiry
              </a>

              <a
                href="tel:+918509158655"
                className="rounded-full border border-gray-300 px-8 py-4 text-center text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
              >
                Call Now: +91 85091 58655
              </a>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <WishlistButton productId={product.id} />
                <CompareButton productId={product.id} />
              </div>

              <DeliveryChecker />
            </div>


            <div className="mt-10 border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-500">
                Made for modern Indian spaces
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Customization options available on request.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}