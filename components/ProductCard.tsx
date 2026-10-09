"use client";

import Link from "next/link";
import WishlistButton from "../app/products/[slug]/WishlistButton";
import CompareButton from "../app/products/[slug]/CompareButton";

type ProductCardProps = {
  product: any;
};

export default function ProductCard({ product }: ProductCardProps) {
  const image =
    product.images?.[0]?.imageUrl ||
    "https://via.placeholder.com/600x600?text=SONIA+FURNITURE";

  const price = Number(product.basePrice ?? product.price ?? 0);

  return (
    <article className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <Link href={`/products/${product.slug}`}>
          <img
            src={image}
            alt={product.images?.[0]?.altText || product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>

        {product.isFeatured && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-800 shadow-sm">
            Featured
          </span>
        )}

        <div className="absolute right-3 top-3 flex gap-2">
          <WishlistButton productId={product.id} compact />
          <CompareButton productId={product.id} compact />
        </div>
      </div>

      <div className="p-5">
        <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
          {product.category?.name || "Furniture"}
        </p>

        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-2 text-lg font-semibold text-gray-900 hover:underline">
            {product.name}
          </h3>
        </Link>

        {product.shortDescription && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
            {product.shortDescription}
          </p>
        )}

        <p className="mt-4 text-lg font-semibold text-gray-900">
          ₹{price.toLocaleString("en-IN")}
        </p>

        <div className="mt-5 flex gap-3">
          <Link
            href={`/products/${product.slug}`}
            className="flex-1 rounded-full border border-gray-900 px-4 py-2.5 text-center text-sm font-semibold text-gray-900 transition hover:bg-gray-900 hover:text-white"
          >
            View Product
          </Link>

          <Link
            href={`/contact?product=${product.slug}`}
            className="flex-1 rounded-full bg-gray-900 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-gray-700"
          >
            Enquire
          </Link>
        </div>
      </div>
    </article>
  );
}