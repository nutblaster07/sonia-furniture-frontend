
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

const API_URL = "http://127.0.0.1:5000/api";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  parentId: string | null;
  isActive: boolean;
  isFeatured: boolean;
  isRoomCategory: boolean;
  sortOrder: number;
  children?: Category[];
};

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  imageUrl: "",
  parentId: "",
  isActive: true,
  isFeatured: false,
  isRoomCategory: false,
  sortOrder: "0",
};

type CategoryForm = typeof emptyForm;

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const getToken = () => localStorage.getItem("access_token");

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = getToken();

      if (!token) {
        throw new Error("Please log in as an administrator.");
      }

      const response = await fetch(`${API_URL}/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load categories.",
        );
      }

      const list = Array.isArray(data) ? data : data.data;

      setCategories(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load categories.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  function createSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function updateField<K extends keyof CategoryForm>(
    field: K,
    value: CategoryForm[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function startEdit(category: Category) {
    setEditingId(category.id);

    setForm({
      name: category.name ?? "",
      slug: category.slug ?? "",
      description: category.description ?? "",
      imageUrl: category.imageUrl ?? "",
      parentId: category.parentId ?? "",
      isActive: category.isActive,
      isFeatured: category.isFeatured,
      isRoomCategory: category.isRoomCategory,
      sortOrder: String(category.sortOrder ?? 0),
    });

    setError("");
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setError("");
    setMessage("");
  }

  async function handleSubmit(
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
        parentId: form.parentId || undefined,
        isActive: form.isActive,
        isFeatured: form.isFeatured,
        isRoomCategory: form.isRoomCategory,
        sortOrder: Number(form.sortOrder),
      };

      const response = await fetch(
        editingId
          ? `${API_URL}/categories/${editingId}`
          : `${API_URL}/categories`,
        {
          method: editingId ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          Array.isArray(data.message)
            ? data.message.join(", ")
            : data.message || "Unable to save category.",
        );
      }

      setMessage(
        editingId
          ? "Category updated successfully."
          : "Category created successfully.",
      );

      resetForm();
      await loadCategories();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save category.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteCategory(category: Category) {
    const hasChildren = categories.some(
      (item) => item.parentId === category.id,
    );

    if (hasChildren) {
      setError(
        "Move or delete this category's child categories before deleting it.",
      );
      return;
    }

    if (
      !window.confirm(
        `Delete "${category.name}"? This may fail if products still use this category.`,
      )
    ) {
      return;
    }

    setError("");
    setMessage("");

    try {
      const token = getToken();

      if (!token) {
        throw new Error("Please log in as an administrator.");
      }

      const response = await fetch(
        `${API_URL}/categories/${category.id}`,
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
          data?.message || "Unable to delete category.",
        );
      }

      setMessage("Category deleted successfully.");
      await loadCategories();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete category.",
      );
    }
  }

  const filteredCategories = categories.filter((category) => {
    const text =
      `${category.name} ${category.slug}`.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  const parentCategories = categories.filter(
    (category) =>
      category.parentId === null &&
      category.id !== editingId,
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
              Categories
            </h1>

            <p className="mt-2 text-gray-600">
              Organize Home, Office and Commercial furniture.
            </p>
          </div>

          <button
            type="button"
            onClick={resetForm}
            className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-700"
          >
            + New Category
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

        {/* Category form */}
        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingId ? "Edit Category" : "Add Category"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-6"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-gray-800">
                  Category Name *
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
                  placeholder="Living Room"
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
                  placeholder="living-room"
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-800">
                  Parent Category
                </label>

                <select
                  value={form.parentId}
                  onChange={(event) =>
                    updateField("parentId", event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900"
                >
                  <option value="">None — top-level category</option>

                  {parentCategories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
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
                    alt={form.name || "Category preview"}
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
                  placeholder="Describe this furniture category..."
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-6">
              {(
                [
                  ["isActive", "Active"],
                  ["isFeatured", "Featured"],
                  ["isRoomCategory", "Show in Shop by Room"],
                ] as const
              ).map(([field, label]) => (
                <label
                  key={field}
                  className="flex items-center gap-3 text-sm font-medium text-gray-800"
                >
                  <input
                    type="checkbox"
                    checked={form[field]}
                    onChange={(event) =>
                      updateField(field, event.target.checked)
                    }
                    className="h-4 w-4"
                  />
                  {label}
                </label>
              ))}
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
                    : "Create Category"}
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

        {/* Category list */}
        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                All Categories
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {filteredCategories.length} categories
              </p>
            </div>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search categories..."
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 sm:max-w-xs"
            />
          </div>

          {loading ? (
            <p className="py-10 text-gray-500">
              Loading categories...
            </p>
          ) : filteredCategories.length === 0 ? (
            <p className="py-10 text-gray-500">
              No categories found.
            </p>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500">
                    <th className="px-3 py-3 font-medium">Category</th>
                    <th className="px-3 py-3 font-medium">Slug</th>
                    <th className="px-3 py-3 font-medium">Parent</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                    <th className="px-3 py-3 font-medium">Order</th>
                    <th className="px-3 py-3 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCategories.map((category) => {
                    const parent = categories.find(
                      (item) => item.id === category.parentId,
                    );

                    return (
                      <tr
                        key={category.id}
                        className="border-b border-gray-100"
                      >
                        <td className="px-3 py-4">
                          <div className="flex items-center gap-3">
                            {category.imageUrl ? (
                              <img
                                src={category.imageUrl}
                                alt=""
                                className="h-12 w-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-lg bg-gray-100" />
                            )}

                            <div>
                              <p className="font-semibold text-gray-900">
                                {category.name}
                              </p>

                              <div className="mt-1 flex flex-wrap gap-1">
                                {category.isFeatured && (
                                  <span className="rounded-full bg-amber-50 px-2 py-1 text-xs text-amber-800">
                                    Featured
                                  </span>
                                )}

                                {category.isRoomCategory && (
                                  <span className="rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-800">
                                    Shop by Room
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-3 py-4 text-gray-600">
                          {category.slug}
                        </td>

                        <td className="px-3 py-4 text-gray-600">
                          {parent?.name || "—"}
                        </td>

                        <td className="px-3 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              category.isActive
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {category.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td className="px-3 py-4 text-gray-600">
                          {category.sortOrder}
                        </td>

                        <td className="px-3 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => startEdit(category)}
                              className="rounded-lg border border-gray-300 px-3 py-2 font-medium text-gray-700 hover:bg-gray-100"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => deleteCategory(category)}
                              className="rounded-lg border border-red-200 px-3 py-2 font-medium text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
