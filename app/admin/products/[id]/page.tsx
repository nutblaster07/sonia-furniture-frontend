
"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const API_URL = "http://127.0.0.1:5000/api";

type Category = {
  id: string;
  name: string;
};

type ProductImage = {
  id?: string;
  imageUrl: string;
  altText: string;
  sortOrder?: number;
};

type ProductForm = {
  name: string;
  slug: string;
  basePrice: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  material: string;
  status: string;
  isFeatured: boolean;
  customizationAvailable: boolean;
};

const emptyForm: ProductForm = {
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
};

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [newImages, setNewImages] = useState<ProductImage[]>([
    { imageUrl: "", altText: "" },
  ]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          throw new Error("Please log in first.");
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [productResponse, categoriesResponse] =
          await Promise.all([
            fetch(`${API_URL}/products/${productId}`, {
              headers,
              cache: "no-store",
            }),
            fetch(`${API_URL}/categories`, {
              headers,
              cache: "no-store",
            }),
          ]);

        if (!productResponse.ok) {
          throw new Error("Unable to load product.");
        }

        if (!categoriesResponse.ok) {
          throw new Error("Unable to load categories.");
        }

        const product = await productResponse.json();
        const categoriesData = await categoriesResponse.json();

        setForm({
          name: product.name ?? "",
          slug: product.slug ?? "",
          basePrice: String(product.basePrice ?? ""),
          categoryId: product.categoryId ?? "",
          shortDescription: product.shortDescription ?? "",
          description: product.description ?? "",
          material: product.material ?? "",
          status: product.status ?? "ACTIVE",
          isFeatured: Boolean(product.isFeatured),
          customizationAvailable: Boolean(
            product.customizationAvailable,
          ),
        });

        setCategories(
          Array.isArray(categoriesData)
            ? categoriesData
            : categoriesData.data ?? [],
        );

        setImages(
          (product.images ?? []).map((image: ProductImage) => ({
            ...image,
            altText: image.altText ?? "",
          })),
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load product.",
        );
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      loadData();
    }
  }, [productId]);

  function updateField(
    field: keyof ProductForm,
    value: string | boolean,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateExistingImage(
    index: number,
    field: "imageUrl" | "altText",
    value: string,
  ) {
    setImages((current) =>
      current.map((image, i) =>
        i === index ? { ...image, [field]: value } : image,
      ),
    );
  }

  function updateNewImage(
    index: number,
    field: "imageUrl" | "altText",
    value: string,
  ) {
    setNewImages((current) =>
      current.map((image, i) =>
        i === index ? { ...image, [field]: value } : image,
      ),
    );
  }

  function addNewImage() {
    setNewImages((current) => [
      ...current,
      { imageUrl: "", altText: "" },
    ]);
  }

  function removeNewImage(index: number) {
    setNewImages((current) =>
      current.filter((_, i) => i !== index),
    );
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("Please log in first.");
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // Update product details.
      const productResponse = await fetch(
        `${API_URL}/products/${productId}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({
            name: form.name,
            slug: form.slug,
            basePrice: Number(form.basePrice),
            categoryId: form.categoryId,
            shortDescription: form.shortDescription || undefined,
            description: form.description || undefined,
            material: form.material || undefined,
            status: form.status,
            isFeatured: form.isFeatured,
            customizationAvailable: form.customizationAvailable,
          }),
        },
      );

      const productData = await productResponse.json();

      if (!productResponse.ok) {
        throw new Error(
          Array.isArray(productData.message)
            ? productData.message.join(", ")
            : productData.message || "Unable to update product.",
        );
      }

      // Save changes to existing images.
      // The existing image API does not provide a PATCH route,
      // so image URL changes are handled by replacing that image.
      for (const image of images) {
        if (!image.id) continue;

        const originalResponse = await fetch(
          `${API_URL}/products/${productId}/images`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (!originalResponse.ok) {
          throw new Error("Unable to verify existing images.");
        }

        const currentImages = await originalResponse.json();
        const original = currentImages.find(
          (item: ProductImage) => item.id === image.id,
        );

        if (
          original &&
          (original.imageUrl !== image.imageUrl.trim() ||
            (original.altText ?? "") !== image.altText.trim())
        ) {
          const deleteResponse = await fetch(
            `${API_URL}/products/${productId}/images/${image.id}`,
            {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            },
          );

          if (!deleteResponse.ok) {
            throw new Error("Unable to replace an existing image.");
          }

          const addResponse = await fetch(
            `${API_URL}/products/${productId}/images`,
            {
              method: "POST",
              headers,
              body: JSON.stringify({
                imageUrl: image.imageUrl.trim(),
                altText: image.altText.trim() || undefined,
                sortOrder: image.sortOrder ?? 0,
              }),
            },
          );

          const addData = await addResponse.json();

          if (!addResponse.ok) {
            throw new Error(
              Array.isArray(addData.message)
                ? addData.message.join(", ")
                : addData.message || "Unable to save updated image.",
            );
          }
        }
      }

      // Add new images.
      const validNewImages = newImages.filter(
        (image) => image.imageUrl.trim() !== "",
      );

      for (let i = 0; i < validNewImages.length; i++) {
        const image = validNewImages[i];

        const imageResponse = await fetch(
          `${API_URL}/products/${productId}/images`,
          {
            method: "POST",
            headers,
            body: JSON.stringify({
              imageUrl: image.imageUrl.trim(),
              altText: image.altText.trim() || undefined,
              sortOrder: images.length + i,
            }),
          },
        );

        const imageData = await imageResponse.json();

        if (!imageResponse.ok) {
          throw new Error(
            Array.isArray(imageData.message)
              ? imageData.message.join(", ")
              : imageData.message || "Unable to add image.",
          );
        }
      }

        router.push("/admin/products");
        router.refresh();       

      // Reload the current record to show saved image IDs and values.
      const refreshed = await fetch(
        `${API_URL}/products/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        },
      );

      if (refreshed.ok) {
        const updatedProduct = await refreshed.json();

        setImages(
          (updatedProduct.images ?? []).map(
            (image: ProductImage) => ({
              ...image,
              altText: image.altText ?? "",
            }),
          ),
        );

        setNewImages([{ imageUrl: "", altText: "" }]);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update product.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteImage(image: ProductImage) {
    if (!image.id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this image?",
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `${API_URL}/products/${productId}/images/${image.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || "Unable to delete image.",
        );
      }

      setImages((current) =>
        current.filter((item) => item.id !== image.id),
      );

      setMessage("Image deleted successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete image.",
      );
    }
  }

  if (loading) {
    return (
      <main className="p-10 text-gray-600">
        Loading product...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin/products"
          className="text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          ← Back to Products
        </Link>

        <h1 className="mt-5 text-3xl font-bold text-gray-900">
          Edit Product
        </h1>

        <p className="mt-2 text-gray-600">
          Update product details and manage its images.
        </p>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {message}
          </div>
        )}

        <form onSubmit={saveProduct} className="mt-8 space-y-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
            <h2 className="text-lg font-semibold text-gray-900">
              Product Details
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-800">
                  Product Name
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-800">
                  Slug
                </label>
                <input
                  required
                  value={form.slug}
                  onChange={(e) => updateField("slug", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-800">
                  Base Price (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={form.basePrice}
                  onChange={(e) =>
                    updateField("basePrice", e.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-800">
                  Category
                </label>
                <select
                  required
                  value={form.categoryId}
                  onChange={(e) =>
                    updateField("categoryId", e.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-800">
                  Material
                </label>
                <input
                  value={form.material}
                  onChange={(e) =>
                    updateField("material", e.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-800">
                  Short Description
                </label>
                <textarea
                  rows={3}
                  value={form.shortDescription}
                  onChange={(e) =>
                    updateField("shortDescription", e.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-800">
                  Full Description
                </label>
                <textarea
                  rows={6}
                  value={form.description}
                  onChange={(e) =>
                    updateField("description", e.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
            <h2 className="text-lg font-semibold text-gray-900">
              Existing Images
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Change an image URL or alt text, then save your changes.
              You can also delete images individually.
            </p>

            {images.length === 0 && (
              <p className="mt-5 rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
                No images have been added to this product yet.
              </p>
            )}

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {images.map((image, index) => (
                <div
                  key={image.id ?? index}
                  className="rounded-xl border border-gray-200 p-4"
                >
                  {image.imageUrl && (
                    <img
                      src={image.imageUrl}
                      alt={image.altText || "Product image"}
                      className="h-48 w-full rounded-lg bg-gray-100 object-cover"
                    />
                  )}

                  <div className="mt-4">
                    <label className="text-sm font-semibold text-gray-800">
                      Image URL
                    </label>
                    <input
                      type="url"
                      required
                      value={image.imageUrl}
                      onChange={(e) =>
                        updateExistingImage(
                          index,
                          "imageUrl",
                          e.target.value,
                        )
                      }
                      className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                    />
                  </div>

                  <div className="mt-3">
                    <label className="text-sm font-semibold text-gray-800">
                      Alt Text
                    </label>
                    <input
                      value={image.altText}
                      onChange={(e) =>
                        updateExistingImage(
                          index,
                          "altText",
                          e.target.value,
                        )
                      }
                      className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteImage(image)}
                    className="mt-4 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    Delete Image
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
            <h2 className="text-lg font-semibold text-gray-900">
              Add Images
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add additional image URLs. They will be saved when you
              click Save Changes.
            </p>

            <div className="mt-5 space-y-4">
              {newImages.map((image, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">
                      New Image {index + 1}
                    </h3>

                    {newImages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="text-sm font-semibold text-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <label className="mt-4 block text-sm font-semibold text-gray-800">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={image.imageUrl}
                    onChange={(e) =>
                      updateNewImage(index, "imageUrl", e.target.value)
                    }
                    placeholder="https://images.unsplash.com/..."
                    className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900"
                  />

                  <label className="mt-4 block text-sm font-semibold text-gray-800">
                    Alt Text
                  </label>
                  <input
                    value={image.altText}
                    onChange={(e) =>
                      updateNewImage(index, "altText", e.target.value)
                    }
                    placeholder="Furniture image description"
                    className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900"
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={addNewImage}
                className="rounded-xl border border-gray-900 px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-900 hover:text-white"
              >
                + Add Another Image
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
            <h2 className="text-lg font-semibold text-gray-900">
              Publishing & Features
            </h2>

            <div className="mt-6 space-y-5">
              <div>
                <label className="text-sm font-semibold text-gray-800">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => updateField("status", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 md:max-w-md"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) =>
                    updateField("isFeatured", e.target.checked)
                  }
                  className="mt-1 h-4 w-4"
                />
                <span>
                  <span className="block text-sm font-semibold text-gray-900">
                    Featured Product
                  </span>
                  <span className="text-sm text-gray-500">
                    Show this product in featured furniture sections.
                  </span>
                </span>
              </label>

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={form.customizationAvailable}
                  onChange={(e) =>
                    updateField(
                      "customizationAvailable",
                      e.target.checked,
                    )
                  }
                  className="mt-1 h-4 w-4"
                />
                <span>
                  <span className="block text-sm font-semibold text-gray-900">
                    Customization Available
                  </span>
                  <span className="text-sm text-gray-500">
                    Allow customers to enquire about custom dimensions,
                    materials and requirements.
                  </span>
                </span>
              </label>
            </div>
          </section>

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
              className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-60"
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
