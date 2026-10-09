"use client";

import { useEffect, useState } from "react";
import BlogRichTextEditor from "./BlogRichTextEditor";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://sonia-furniture-backend-production.up.railway.app/api";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  featuredImage?: string | null;
  authorName?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isFeatured: boolean;
  publishedAt?: string | null;
  categoryId?: string | null;
};

type BlogCategory = {
  id: string;
  name: string;
};

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featuredImage: "",
  authorName: "SONIA FURNITURE",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  status: "DRAFT" as BlogPost["status"],
  isFeatured: false,
  publishedAt: "",
  categoryId: "",
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("Please log in as an administrator.");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [postsResponse, categoriesResponse] = await Promise.all([
        fetch(`${API_URL}/blog/posts`, { headers, cache: "no-store" }),
        fetch(`${API_URL}/blog/categories`, { headers, cache: "no-store" }),
      ]);

      if (postsResponse.status === 401 || postsResponse.status === 403) {
        throw new Error("Access denied. Please log in with an ADMIN account.");
      }

      if (!postsResponse.ok) {
        throw new Error(`Unable to load blog posts (${postsResponse.status}).`);
      }

      const postsData = await postsResponse.json();
      setPosts(Array.isArray(postsData) ? postsData : []);

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load blogs.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  function startCreate() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setShowForm(true);
    setError("");
  }

  function startEdit(post: BlogPost) {
    setEditingId(post.id);
    setForm({
      title: post.title ?? "",
      slug: post.slug ?? "",
      excerpt: post.excerpt ?? "",
      content: post.content ?? "",
      featuredImage: post.featuredImage ?? "",
      authorName: post.authorName ?? "SONIA FURNITURE",
      seoTitle: post.seoTitle ?? "",
      seoDescription: post.seoDescription ?? "",
      seoKeywords: post.seoKeywords ?? "",
      status: post.status,
      isFeatured: post.isFeatured,
      publishedAt: post.publishedAt
        ? new Date(post.publishedAt).toISOString().slice(0, 16)
        : "",
      categoryId: post.categoryId ?? "",
    });
    setShowForm(true);
    setError("");
  }

  function updateField(
    field: keyof typeof emptyForm,
    value: string | boolean,
  ) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  async function savePost(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("Your login session is missing. Please log in again.");
      }

      const payload = {
        ...form,
        excerpt: form.excerpt || undefined,
        featuredImage: form.featuredImage || undefined,
        authorName: form.authorName || undefined,
        seoTitle: form.seoTitle || undefined,
        seoDescription: form.seoDescription || undefined,
        seoKeywords: form.seoKeywords.trim() || undefined,
        categoryId: form.categoryId || undefined,
        publishedAt: form.publishedAt
          ? new Date(form.publishedAt).toISOString()
          : form.status === "PUBLISHED"
            ? new Date().toISOString()
            : undefined,
      };

      const response = await fetch(
        editingId
          ? `${API_URL}/blog/posts/${editingId}`
          : `${API_URL}/blog/posts`,
        {
          method: editingId ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(`Could not save blog (${response.status}): ${message}`);
      }

      setShowForm(false);
      setEditingId(null);
      setForm({ ...emptyForm });
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save blog.");
    } finally {
      setSaving(false);
    }
  }

  async function deletePost(post: BlogPost) {
    if (!window.confirm(`Delete "${post.title}" permanently?`)) return;

    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Please log in again.");

      const response = await fetch(`${API_URL}/blog/posts/${post.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Delete failed (${response.status}).`);
      }

      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete blog.");
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-5 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              SONIA FURNITURE
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-gray-900">
              Blog Posts
            </h1>
            <p className="mt-2 text-gray-600">
              Publish articles and manage blog SEO.
            </p>
          </div>

          <button
            type="button"
            onClick={startCreate}
            className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-700"
          >
            + Create Blog
          </button>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {showForm && (
          <form
            onSubmit={savePost}
            className="mt-8 space-y-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-8"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingId ? "Edit Blog" : "Create Blog"}
              </h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-sm text-gray-600 underline"
              >
                Cancel
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="text-sm font-medium text-gray-700">
                Blog title *
                <input
                  required
                  minLength={3}
                  value={form.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setForm((previous) => ({
                      ...previous,
                      title,
                      slug: editingId
                        ? previous.slug
                        : title
                            .toLowerCase()
                            .trim()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/^-|-$/g, ""),
                    }));
                  }}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-3"
                />
              </label>

              <label className="text-sm font-medium text-gray-700">
                URL slug *
                <input
                  required
                  minLength={3}
                  value={form.slug}
                  onChange={(e) => updateField("slug", e.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-3"
                />
              </label>

              <label className="text-sm font-medium text-gray-700">
                Author
                <input
                  value={form.authorName}
                  onChange={(e) => updateField("authorName", e.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-3"
                />
              </label>

              <label className="text-sm font-medium text-gray-700">
                Category
                <select
                  value={form.categoryId}
                  onChange={(e) => updateField("categoryId", e.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-3"
                >
                  <option value="">No category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm font-medium text-gray-700 md:col-span-2">
                Short excerpt
                <textarea
                  rows={2}
                  value={form.excerpt}
                  onChange={(e) => updateField("excerpt", e.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-3"
                />
              </label>

              {/* Use a div (not a label) so clicking inside the editor
                  doesn't trigger the first toolbar button. */}
              <div className="text-sm font-medium text-gray-700 md:col-span-2">
                <span>Blog content *</span>
                <BlogRichTextEditor
                  value={form.content}
                  onChange={(value) => updateField("content", value)}
                />
              </div>

              <label className="text-sm font-medium text-gray-700 md:col-span-2">
                Featured image URL
                <input
                  type="url"
                  value={form.featuredImage}
                  onChange={(e) => updateField("featuredImage", e.target.value)}
                  placeholder="https://..."
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-3"
                />
              </label>

              {/* ---------- SEO settings ---------- */}
              <div className="md:col-span-2">
                <h3 className="border-t border-gray-200 pt-5 text-base font-semibold text-gray-900">
                  SEO Settings
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Helps this article rank on Google for Siliguri and nearby
                  areas.
                </p>
              </div>

              <label className="text-sm font-medium text-gray-700">
                SEO title
                <input
                  value={form.seoTitle}
                  onChange={(e) => updateField("seoTitle", e.target.value)}
                  maxLength={70}
                  placeholder="How to Choose the Right Sofa | Furniture Shop in Siliguri"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-3"
                />
                <span className="mt-1 block text-xs font-normal text-gray-500">
                  {form.seoTitle.length}/70 (best under 60)
                </span>
              </label>

              <label className="text-sm font-medium text-gray-700">
                Publication date
                <input
                  type="datetime-local"
                  value={form.publishedAt}
                  onChange={(e) => updateField("publishedAt", e.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-3"
                />
              </label>

              <label className="text-sm font-medium text-gray-700 md:col-span-2">
                SEO keywords (separate with commas)
                <input
                  value={form.seoKeywords}
                  onChange={(e) => updateField("seoKeywords", e.target.value)}
                  placeholder="sofa in Siliguri, furniture shop Siliguri, furniture Jalpaiguri, furniture Darjeeling"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-3"
                />
                <span className="mt-1 block text-xs font-normal text-gray-500">
                  Nearby-area keywords (Siliguri, Matigara, Jalpaiguri,
                  Darjeeling, Kalimpong, Cooch Behar) are added automatically
                  on the public page.
                </span>
              </label>

              <label className="text-sm font-medium text-gray-700 md:col-span-2">
                SEO meta description
                <textarea
                  rows={3}
                  maxLength={160}
                  value={form.seoDescription}
                  onChange={(e) => updateField("seoDescription", e.target.value)}
                  placeholder="Planning to buy a sofa in Siliguri? Learn how to pick the right size, material and style. Visit SONIA FURNITURE."
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-3"
                />
                <span className="mt-1 block text-xs font-normal text-gray-500">
                  {form.seoDescription.length}/160
                </span>
              </label>

              <label className="text-sm font-medium text-gray-700">
                Publishing status
                <select
                  value={form.status}
                  onChange={(e) =>
                    updateField("status", e.target.value as BlogPost["status"])
                  }
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-3"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </label>

              <label className="flex items-center gap-3 self-end pb-3 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => updateField("isFeatured", e.target.checked)}
                  className="h-4 w-4"
                />
                Feature this blog
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-gray-900 px-6 py-3 font-semibold text-white hover:bg-gray-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : editingId ? "Save Changes" : "Save Blog"}
            </button>
          </form>
        )}

        <section className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-5 py-4">
            <h2 className="font-semibold text-gray-900">
              All Blog Posts ({posts.length})
            </h2>
          </div>

          {loading ? (
            <p className="p-6 text-gray-500">Loading blog posts...</p>
          ) : posts.length === 0 ? (
            <p className="p-6 text-gray-500">
              No blog posts found. Select Create Blog to add your first article.
            </p>
          ) : (
            <div className="divide-y divide-gray-200">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900">{post.title}</h3>
                    <p className="mt-1 break-all text-sm text-gray-500">
                      /blog/{post.slug}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700">
                        {post.status}
                      </span>
                      {post.isFeatured && (
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-800">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-3">
                    {post.status === "PUBLISHED" && (
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700"
                      >
                        View
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => startEdit(post)}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void deletePost(post)}
                      className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}