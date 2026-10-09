interface BlogPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getPost(slug: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/blog/posts/slug/${slug}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export default async function BlogPostPage({
  params,
}: BlogPageProps) {
  const { slug } = await params;

  const post = await getPost(slug);

  if (!post) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Article Not Found
          </h1>

          <a
            href="/blog"
            className="mt-4 inline-block underline"
          >
            Back to Blog
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Article Header */}
      <section className="border-b border-gray-200">
        <div className="mx-auto max-w-4xl px-6 py-16">
          {post.category?.name && (
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
              {post.category.name}
            </p>
          )}

          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {post.excerpt}
            </p>
          )}

          <div className="mt-6 flex gap-4 text-sm text-gray-500">
            {post.authorName && (
              <span>By {post.authorName}</span>
            )}

            {post.publishedAt && (
              <span>
                {new Date(post.publishedAt).toLocaleDateString(
                  "en-IN",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  },
                )}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="aspect-[16/8] overflow-hidden rounded-3xl bg-gray-100">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Article Content */}
      <article className="mx-auto max-w-3xl px-6 pb-20">
        <div className="whitespace-pre-line text-lg leading-9 text-gray-700">
          {post.content}
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <a
            href="/blog"
            className="text-sm font-semibold underline underline-offset-4"
          >
            ← Back to Blog
          </a>
        </div>
      </article>
    </main>
  );
}