"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = "http://127.0.0.1:5000/api";

type Category = {
  id: string;
  name: string;
  parentId?: string | null;
};

type ProductImage = {
  imageUrl: string;
  altText: string;
};

export default function NewProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    slug: "",
    basePrice: "",
    categoryId: "",
    shortDescription: "",
    description: "",
    material: "",
    status: "ACTIVE",
    isFeatured: false,
    customizationAvailable: false,
  });

  const [images, setImages] = useState<ProductImage[]>([
    {
      imageUrl: "",
      altText: "",
    },
  ]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const token = localStorage.getItem("access_token");

        const response = await fetch(`${API_URL}/categories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Unable to load categories");
        }

        const data = await response.json();

        setCategories(data.data || data);
      } catch (error: any) {
        console.error(error);

        setError(error.message || "Unable to load categories");
      } finally {
        setLoadingCategories(false);
      }
    }

    loadCategories();
  }, []);

  function updateField(
    field: string,
    value: string | boolean,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function createSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function handleNameChange(value: string) {
    setForm((current) => ({
      ...current,
      name: value,
      slug: createSlug(value),
    }));
  }

  function addImageField() {
    setImages((current) => [
      ...current,
      {
        imageUrl: "",
        altText: "",
      },
    ]);
  }

  function removeImageField(index: number) {
    setImages((current) =>
      current.filter((_, imageIndex) => imageIndex !== index),
    );
  }

  function updateImageField(
    index: number,
    field: "imageUrl" | "altText",
    value: string,
  ) {
    setImages((current) =>
      current.map((image, imageIndex) =>
        imageIndex === index
          ? {
              ...image,
              [field]: value,
            }
          : image,
      ),
    );
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("You are not logged in.");
      }

      if (!form.categoryId) {
        throw new Error("Please select a category.");
      }

      if (!form.name.trim()) {
        throw new Error("Please enter a product name.");
      }

      if (!form.slug.trim()) {
        throw new Error("Please enter a product slug.");
      }

      if (!form.basePrice) {
        throw new Error("Please enter a base price.");
      }

      /*
       * STEP 1:
       * Create the product.
       */
      const response = await fetch(`${API_URL}/products`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          name: form.name,
          slug: form.slug,
          basePrice: Number(form.basePrice),
          categoryId: form.categoryId,
          shortDescription:
            form.shortDescription || undefined,
          description: form.description || undefined,
          material: form.material || undefined,
          status: form.status,
          isFeatured: form.isFeatured,
          customizationAvailable:
            form.customizationAvailable,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          Array.isArray(data.message)
            ? data.message.join(", ")
            : data.message || "Unable to create product",
        );
      }

      /*
       * The newly created product ID.
       */
      const productId = data.id;

      if (!productId) {
        throw new Error(
          "Product was created, but product ID was not returned.",
        );
      }

      /*
       * STEP 2:
       * Save product images.
       *
       * Empty image fields are ignored.
       */
      const validImages = images.filter(
        (image) => image.imageUrl.trim() !== "",
      );

      for (let index = 0; index < validImages.length; index++) {
        const image = validImages[index];

        const imageResponse = await fetch(
          `${API_URL}/products/${productId}/images`,
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },

            body: JSON.stringify({
              imageUrl: image.imageUrl.trim(),
              altText: image.altText.trim() || undefined,
              sortOrder: index,
            }),
          },
        );

        const imageData = await imageResponse.json();

        if (!imageResponse.ok) {
          throw new Error(
            Array.isArray(imageData.message)
              ? imageData.message.join(", ")
              : imageData.message ||
                  `Unable to save image ${index + 1}`,
          );
        }
      }

      /*
       * STEP 3:
       * Go back to the product list.
       */
      router.push("/admin/products");
    } catch (error: any) {
      console.error("Create product error:", error);

      setError(
        error.message || "Unable to create product",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link
              href="/admin/products"
              className="text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              ← Back to Products
            </Link>

            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
              Catalogue
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              Add Product
            </h1>

            <p className="mt-2 text-gray-600">
              Create a new furniture product.
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
        >

          {/* =========================
              BASIC INFORMATION
          ========================== */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Basic Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Main information displayed on the product page.
              </p>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              {/* Name */}
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-800">
                  Product Name
                </label>

                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(event) =>
                    handleNameChange(event.target.value)
                  }
                  placeholder="Modern 3 Seater Sofa"
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-gray-900"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="text-sm font-semibold text-gray-800">
                  Slug
                </label>

                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(event) =>
                    updateField(
                      "slug",
                      event.target.value,
                    )
                  }
                  placeholder="modern-3-seater-sofa"
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-gray-900"
                />
              </div>

              {/* Price */}
              <div>
                <label className="text-sm font-semibold text-gray-800">
                  Base Price
                </label>

                <input
                  type="number"
                  required
                  min="0"
                  value={form.basePrice}
                  onChange={(event) =>
                    updateField(
                      "basePrice",
                      event.target.value,
                    )
                  }
                  placeholder="27999"
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-gray-900"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-sm font-semibold text-gray-800">
                  Category
                </label>

                <select
                  required
                  value={form.categoryId}
                  disabled={loadingCategories}
                  onChange={(event) =>
                    updateField(
                      "categoryId",
                      event.target.value,
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-gray-900"
                >
                  <option value="">
                    {loadingCategories
                      ? "Loading categories..."
                      : "Select category"}
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Material */}
              <div>
                <label className="text-sm font-semibold text-gray-800">
                  Material
                </label>

                <input
                  type="text"
                  value={form.material}
                  onChange={(event) =>
                    updateField(
                      "material",
                      event.target.value,
                    )
                  }
                  placeholder="Solid Wood"
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-gray-900"
                />
              </div>

              {/* Short Description */}
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-800">
                  Short Description
                </label>

                <textarea
                  rows={3}
                  value={form.shortDescription}
                  onChange={(event) =>
                    updateField(
                      "shortDescription",
                      event.target.value,
                    )
                  }
                  placeholder="A short description of the furniture..."
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-gray-900"
                />
              </div>

              {/* Full Description */}
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-800">
                  Full Description
                </label>

                <textarea
                  rows={6}
                  value={form.description}
                  onChange={(event) =>
                    updateField(
                      "description",
                      event.target.value,
                    )
                  }
                  placeholder="Describe the product in detail..."
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-gray-900"
                />
              </div>
            </div>
          </section>

          {/* =========================
              PRODUCT IMAGES
          ========================== */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">

            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Product Images
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add one or more image URLs for this product.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">

              {images.map((image, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Image {index + 1}
                    </h3>

                    {images.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeImageField(index)
                        }
                        className="text-sm font-semibold text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="mt-4 space-y-4">

                    {/* Image URL */}
                    <div>
                      <label className="text-sm font-semibold text-gray-800">
                        Image URL
                      </label>

                      <input
                        type="url"
                        value={image.imageUrl}
                        onChange={(event) =>
                          updateImageField(
                            index,
                            "imageUrl",
                            event.target.value,
                          )
                        }
                        placeholder="https://images.unsplash.com/..."
                        className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-gray-900"
                      />

                      <p className="mt-1 text-xs text-gray-500">
                        Example: https://images.unsplash.com/...
                      </p>
                    </div>

                    {/* Alt Text */}
                    <div>
                      <label className="text-sm font-semibold text-gray-800">
                        Alt Text
                      </label>

                      <input
                        type="text"
                        value={image.altText}
                        onChange={(event) =>
                          updateImageField(
                            index,
                            "altText",
                            event.target.value,
                          )
                        }
                        placeholder="Modern 3 seater sofa"
                        className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-gray-900"
                      />
                    </div>

                    {/* Image Preview */}
                    {image.imageUrl && (
                      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                        <img
                          src={image.imageUrl}
                          alt={
                            image.altText ||
                            `Product image ${index + 1}`
                          }
                          className="h-56 w-full object-cover"
                          onError={(event) => {
                            event.currentTarget.style.display =
                              "none";
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Add Another Image */}
              <button
                type="button"
                onClick={addImageField}
                className="rounded-xl border border-gray-900 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-900 hover:text-white"
              >
                + Add Another Image
              </button>
            </div>
          </section>

          {/* =========================
              PUBLISHING
          ========================== */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">

            <h2 className="text-lg font-semibold text-gray-900">
              Publishing & Features
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Control how this product appears on the website.
            </p>

            <div className="mt-6 space-y-5">

              {/* Status */}
              <div>
                <label className="text-sm font-semibold text-gray-800">
                  Status
                </label>

                <select
                  value={form.status}
                  onChange={(event) =>
                    updateField(
                      "status",
                      event.target.value,
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-gray-900 md:max-w-md"
                >
                  <option value="ACTIVE">
                    Active
                  </option>

                  <option value="INACTIVE">
                    Inactive
                  </option>
                </select>
              </div>

              {/* Featured */}
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(event) =>
                    updateField(
                      "isFeatured",
                      event.target.checked,
                    )
                  }
                  className="mt-1 h-4 w-4"
                />

                <span>
                  <span className="block text-sm font-semibold text-gray-900">
                    Featured Product
                  </span>

                  <span className="mt-1 block text-sm text-gray-500">
                    Show this product in featured furniture
                    sections.
                  </span>
                </span>
              </label>

              {/* Customization */}
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={form.customizationAvailable}
                  onChange={(event) =>
                    updateField(
                      "customizationAvailable",
                      event.target.checked,
                    )
                  }
                  className="mt-1 h-4 w-4"
                />

                <span>
                  <span className="block text-sm font-semibold text-gray-900">
                    Customization Available
                  </span>

                  <span className="mt-1 block text-sm text-gray-500">
                    Allow customers to enquire for customized
                    dimensions, materials and requirements.
                  </span>
                </span>
              </label>
            </div>
          </section>

          {/* =========================
              ACTIONS
          ========================== */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <Link
              href="/admin/products"
              className="rounded-xl border border-gray-300 px-6 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Creating Product..."
                : "Create Product"}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}