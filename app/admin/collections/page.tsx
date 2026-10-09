
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

const API_URL = "http://127.0.0.1:5000/api";

type Product = {
  id: string;
  name: string;
  slug: string;
  basePrice: number | string;
  status?: string;
};

type CollectionProduct = {
  productId: string;
  sortOrder: number;
  product: Product;
};

type Collection = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  products: CollectionProduct[];
};

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  imageUrl: "",
  isActive: true,
  isFeatured: false,
  sortOrder: "0",
};

type CollectionForm = typeof emptyForm;

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<CollectionForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [selectedProducts, setSelectedProducts] = useState<
    Record<string, string>
  >({});
  const [productOrders, setProductOrders] = useState<
    Record<string, string>
  >({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const getToken = () => localStorage.getItem("access_token");

  const requestHeaders = (json = false) => {
    const token = getToken();

    return {
      ...(json ? { "Content-Type": "application/json" } : {}),
      Authorization: `Bearer ${token}`,
    };
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = getToken();

      if (!token) {
        throw new Error("Please log in as an administrator.");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [collectionResponse, productResponse] = await Promise.all([
        fetch(`${API_URL}/collections`, {
          headers,
          cache: "no-store",
        }),
        fetch(`${API_URL}/products?limit=100`, {
          headers,
          cache: "no-store",
        }),
      ]);

      const collectionData = await collectionResponse.json();
      const productData = await productResponse.json();

      if (!collectionResponse.ok) {
        throw new Error(
          collectionData.message || "Unable to load collections.",
        );
      }

      if (!productResponse.ok) {
        throw new Error(
          productData.message || "Unable to load products.",
        );
      }

      setCollections(
        Array.isArray(collectionData) ? collectionData : [],
      );

      setProducts(
        Array.isArray(productData)
          ? productData
          : productData.data ?? [],
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load collections.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  function createSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function updateField<K extends keyof CollectionForm>(
    field: K,
    value: CollectionForm[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function resetForm() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setError("");
    setMessage("");
  }

  function startEdit(collection: Collection) {
    setEditingId(collection.id);

    setForm({
      name: collection.name ?? "",
      slug: collection.slug ?? "",
      description: collection.description ?? "",
      imageUrl: collection.imageUrl ?? "",
      isActive: collection.isActive,
      isFeatured: collection.isFeatured,
      sortOrder: String(collection.sortOrder ?? 0),
    });

    setError("");
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function saveCollection(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const token = getToken();

      if (!token) {
        throw new Error("Please log in as an administrator.");
      }

      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || undefined,
        imageUrl: form.imageUrl.trim() || undefined,
        isActive: form.isActive,
        isFeatured: form.isFeatured,
        sortOrder: Number(form.sortOrder),
      };

      const response = await fetch(
        editingId
          ? `${API_URL}/collections/${editingId}`
          : `${API_URL}/collections`,
        {
          method: editingId ? "PATCH" : "POST",
          headers: requestHeaders(true),
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          Array.isArray(data.message)
            ? data.message.join(", ")
            : data.message || "Unable to save collection.",
        );
      }

      setMessage(
        editingId
          ? "Collection updated successfully."
          : "Collection created successfully.",
      );

      resetForm();
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save collection.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteCollection(collection: Collection) {
    if (
      !window.confirm(
        `Delete collection "${collection.name}"?`,
      )
    ) {
      return;
    }

    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/collections/${collection.id}`,
        {
          method: "DELETE",
          headers: requestHeaders(),
        },
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || "Unable to delete collection.",
        );
      }

      setMessage("Collection deleted successfully.");
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete collection.",
      );
    }
  }

  async function addProduct(collection: Collection) {
    const productId = selectedProducts[collection.id];

    if (!productId) {
      setError("Please select a product to add.");
      return;
    }

    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/collections/${collection.id}/products`,
        {
          method: "POST",
          headers: requestHeaders(true),
          body: JSON.stringify({
            productId,
            sortOrder: collection.products.length,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to add product to collection.",
        );
      }

      setSelectedProducts((current) => ({
        ...current,
        [collection.id]: "",
      }));

      setMessage("Product added to collection.");
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to add product.",
      );
    }
  }

  async function removeProduct(
    collection: Collection,
    product: CollectionProduct,
  ) {
    if (
      !window.confirm(
        `Remove "${product.product.name}" from "${collection.name}"?`,
      )
    ) {
      return;
    }

    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/collections/${collection.id}/products/${product.productId}`,
        {
          method: "DELETE",
          headers: requestHeaders(),
        },
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || "Unable to remove product.",
        );
      }

      setMessage("Product removed from collection.");
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to remove product.",
      );
    }
  }

  async function saveProductOrder(
    collection: Collection,
    product: CollectionProduct,
  ) {
    const sortOrder = Number(
      productOrders[`${collection.id}:${product.productId}`] ??
        product.sortOrder,
    );

    if (!Number.isInteger(sortOrder) || sortOrder < 0) {
      setError("Display order must be a non-negative integer.");
      return;
    }

    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/collections/${collection.id}/products/${product.productId}`,
        {
          method: "PATCH",
          headers: requestHeaders(true),
          body: JSON.stringify({ sortOrder }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update product order.",
        );
      }

      setMessage("Product display order updated.");
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update product order.",
      );
    }
  }

  const filteredCollections = collections.filter((collection) =>
    `${collection.name} ${collection.slug}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <Link
              href="/admin"
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              ← Admin Dashboard
            </Link>

            <h1 className="mt-4 text-3xl font-bold text-gray-900">
              Collections
            </h1>

            <p className="mt-2 text-gray-600">
              Create furniture collections and manage their products.
            </p>
          </div>

          <button
            type="button"
            onClick={resetForm}
            className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-700"
          >
            + New Collection
          </button>
        </div>

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

        {/* Create and edit collection */}
        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingId ? "Edit Collection" : "Add Collection"}
          </h2>

          <form
            onSubmit={saveCollection}
            className="mt-6 space-y-6"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-gray-800">
                  Collection Name *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(event) => {
                    const name = event.target.value;
                    updateField("name", name);

                    if (!editingId) {
                      updateField("slug", createSlug(name));
                    }
                  }}
                  placeholder="Living Room Essentials"
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-800">
                  Slug *
                </label>
                <input
                  required
                  value={form.slug}
                  onChange={(event) =>
                    updateField("slug", event.target.value)
                  }
                  placeholder="living-room-essentials"
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-800">
                  Display Order
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.sortOrder}
                  onChange={(event) =>
                    updateField("sortOrder", event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-800">
                  Image URL
                </label>
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(event) =>
                    updateField("imageUrl", event.target.value)
                  }
                  placeholder="https://images.unsplash.com/..."
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900"
                />

                {form.imageUrl && (
                  <img
                    src={form.imageUrl}
                    alt={form.name || "Collection preview"}
                    className="mt-4 h-40 w-64 rounded-xl border border-gray-200 object-cover"
                  />
                )}
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-800">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  placeholder="Describe this collection..."
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-3 text-sm font-medium text-gray-800">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) =>
                    updateField("isActive", event.target.checked)
                  }
                  className="h-4 w-4"
                />
                Active
              </label>

              <label className="flex items-center gap-3 text-sm font-medium text-gray-800">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(event) =>
                    updateField("isFeatured", event.target.checked)
                  }
                  className="h-4 w-4"
                />
                Featured
              </label>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Save Changes"
                    : "Create Collection"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Collection list */}
        <section className="mt-8 space-y-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              All Collections ({filteredCollections.length})
            </h2>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search collections..."
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 sm:max-w-xs"
            />
          </div>

          {loading ? (
            <p className="rounded-xl bg-white p-8 text-gray-500">
              Loading collections...
            </p>
          ) : filteredCollections.length === 0 ? (
            <p className="rounded-xl bg-white p-8 text-gray-500">
              No collections found.
            </p>
          ) : (
            filteredCollections.map((collection) => {
              const currentProductIds = collection.products.map(
                (item) => item.productId,
              );

              const availableProducts = products.filter(
                (product) =>
                  !currentProductIds.includes(product.id),
              );

              return (
                <article
                  key={collection.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                >
                  <div className="flex flex-col gap-5 p-5 md:flex-row md:items-start md:p-6">
                    {collection.imageUrl ? (
                      <img
                        src={collection.imageUrl}
                        alt={collection.name}
                        className="h-36 w-full rounded-xl object-cover md:w-48"
                      />
                    ) : (
                      <div className="flex h-36 w-full items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-400 md:w-48">
                        No image
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {collection.name}
                        </h3>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            collection.isActive
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {collection.isActive ? "Active" : "Inactive"}
                        </span>

                        {collection.isFeatured && (
                          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
                            Featured
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-sm text-gray-500">
                        /{collection.slug} · Order: {collection.sortOrder}
                      </p>

                      {collection.description && (
                        <p className="mt-3 text-sm leading-6 text-gray-600">
                          {collection.description}
                        </p>
                      )}

                      <p className="mt-3 text-sm font-medium text-gray-700">
                        {collection.products.length} products
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(collection)}
                          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                        >
                          Edit Collection
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteCollection(collection)}
                          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                        >
                          Delete Collection
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Products assigned to this collection */}
                  <div className="border-t border-gray-200 bg-gray-50 p-5 md:p-6">
                    <h4 className="font-semibold text-gray-900">
                      Products in this collection
                    </h4>

                    {collection.products.length === 0 ? (
                      <p className="mt-3 text-sm text-gray-500">
                        No products have been added yet.
                      </p>
                    ) : (
                      <div className="mt-4 space-y-3">
                        {collection.products.map((item) => (
                          <div
                            key={item.productId}
                            className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-gray-900">
                                {item.product.name}
                              </p>

                              <p className="mt-1 text-sm text-gray-500">
                                ₹
                                {Number(
                                  item.product.basePrice,
                                ).toLocaleString("en-IN")}
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              <label className="text-xs text-gray-500">
                                Order
                              </label>

                              <input
                                type="number"
                                min="0"
                                value={
                                  productOrders[
                                    `${collection.id}:${item.productId}`
                                  ] ?? String(item.sortOrder)
                                }
                                onChange={(event) =>
                                  setProductOrders((current) => ({
                                    ...current,
                                    [`${collection.id}:${item.productId}`]:
                                      event.target.value,
                                  }))
                                }
                                className="w-20 rounded-lg border border-gray-300 px-2 py-2 text-sm text-gray-900"
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  saveProductOrder(collection, item)
                                }
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                              >
                                Save Order
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  removeProduct(collection, item)
                                }
                                className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add product */}
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <select
                        value={selectedProducts[collection.id] ?? ""}
                        onChange={(event) =>
                          setSelectedProducts((current) => ({
                            ...current,
                            [collection.id]: event.target.value,
                          }))
                        }
                        className="min-w-0 flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900"
                      >
                        <option value="">Select a product to add</option>

                        {availableProducts.map((product) => (
                          <option
                            key={product.id}
                            value={product.id}
                          >
                            {product.name}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => addProduct(collection)}
                        disabled={availableProducts.length === 0}
                        className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        + Add Product
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </div>
    </main>
  );
}
