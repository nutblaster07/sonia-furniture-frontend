"use client";

import { useMemo, useState } from "react";
import WishlistButton from "../products/[slug]/WishlistButton";
import CompareButton from "../products/[slug]/CompareButton";
import ProductCard from "../../components/ProductCard";


interface ShopFiltersProps {
  products: any[];
  categories: any[];
}

export default function ShopFilters({
  products,
  categories,
}: ShopFiltersProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");
  const [featuredOnly, setFeaturedOnly] = useState(false);



  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const searchTerm = search.toLowerCase();

      result = result.filter((product) => {
        const name =
          product.name?.toLowerCase() || "";

        const description =
          product.shortDescription?.toLowerCase() || "";

        const material =
          product.material?.toLowerCase() || "";

        const categoryName =
          product.category?.name?.toLowerCase() || "";

        return (
          name.includes(searchTerm) ||
          description.includes(searchTerm) ||
          material.includes(searchTerm) ||
          categoryName.includes(searchTerm)
        );
      });
    }

   if (category !== "all") {
      const selectedCategory = categories.find(
        (item) => item.name === category,
      );

      if (selectedCategory?.parentId === null) {
        const childCategoryIds = categories
          .filter((item) => item.parentId === selectedCategory.id)
          .map((item) => item.id);

        result = result.filter((product) =>
          childCategoryIds.includes(product.categoryId),
        );
      } else {
        result = result.filter(
          (product) =>
            product.category?.name === category,
        );
      }
    }

    if (featuredOnly) {
      result = result.filter(
        (product) => product.isFeatured === true,
      );
    }

    if (sort === "price-low") {
      result.sort(
        (a, b) =>
          Number(a.basePrice ?? a.price ?? 0) -
          Number(b.basePrice ?? b.price ?? 0),
      );
    }

    if (sort === "price-high") {
      result.sort(
        (a, b) =>
          Number(b.basePrice ?? b.price ?? 0) -
          Number(a.basePrice ?? a.price ?? 0),
      );
    }

    if (sort === "name") {
      result.sort((a, b) =>
        a.name.localeCompare(b.name),
      );
    }

    return result;
  }, [products, search, category, sort, featuredOnly]);

  return (
    <>
      {/* Filters */}
      <div className="mb-10 rounded-2xl border border-gray-200 bg-gray-50 p-5">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Search */}
          <div>
            <label
              htmlFor="product-search"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              Search Furniture
            </label>

            <input
              id="product-search"
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search sofa, table, bed..."
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-900"
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category-filter"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              Category
            </label>

            <select
              id="category-filter"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-900"
            >
              <option value="all">All Categories</option>

              {categories
                .filter((item) => !item.parentId)
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((parent) => (
                  <optgroup key={parent.id} label={parent.name}>
                    {categories
                      .filter((child) => child.parentId === parent.id)
                      .sort((a, b) => a.sortOrder - b.sortOrder)
                      .map((child) => (
                        <option key={child.id} value={child.name}>
                          {child.name}
                        </option>
                      ))}
                  </optgroup>
                ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={featuredOnly}
                onChange={(e) => setFeaturedOnly(e.target.checked)}
                className="h-4 w-4"
              />
              Featured only
            </label>
          </div>

          {/* Sort */}
          <div>
            <label
              htmlFor="sort-products"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              Sort
            </label>

            <select
              id="sort-products"
              value={sort}
              onChange={(event) =>
                setSort(event.target.value)
              }
              className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-900"
            >
              <option value="default">
                Recommended
              </option>

              <option value="price-low">
                Price: Low to High
              </option>

              <option value="price-high">
                Price: High to Low
              </option>

              <option value="name">
                Name: A-Z
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Result Count */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-900">
            {filteredProducts.length}
          </span>{" "}
          furniture{" "}
          {filteredProducts.length === 1
            ? "product"
            : "products"}
        </p>

        {(search || category !== "all") && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setCategory("all");
            }}
            className="text-sm font-semibold underline underline-offset-4"
          >
            Clear Filters
          </button>
        )}
      </div>

     {/* Products */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </>
  );
}