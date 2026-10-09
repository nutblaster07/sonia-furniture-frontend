async function getPosts() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/blog/posts/published`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return [];
  }

  return response.json();
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <section className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
            SONIA JOURNAL
          </p>

          <h1 className="mt-3 text-5xl font-bold md:text-6xl">
            Furniture & Design Ideas
          </h1>

          <p className="mt-5 max-w-2xl leading-8 text-gray-400">
            Furniture buying guides, interior ideas, care tips and
            inspiration from SONIA FURNITURE.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        {posts.length === 0 ? (
          <div className="py-20 text-center">
            <h2 className="text-2xl font-semibold">
              No articles available
            </h2>

            <p className="mt-3 text-gray-500">
              Check back soon for new furniture and design articles.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: any) => (
              <a
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white"
              >
                <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                  {post.featuredImage ? (
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {post.category?.name && (
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {post.category.name}
                    </p>
                  )}

                  <h2 className="mt-3 text-2xl font-semibold">
                    {post.title}
                  </h2>

                  {post.excerpt && (
                    <p className="mt-3 line-clamp-3 leading-7 text-gray-600">
                      {post.excerpt}
                    </p>
                  )}

                  <span className="mt-5 inline-block text-sm font-semibold underline underline-offset-4">
                    Read Article
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}