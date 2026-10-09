/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Metadata } from "next";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

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

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return { title: "Article Not Found" };

  return {
    title: `${post.title} | SONIA Journal`,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: post.featuredImage ? [post.featuredImage] : undefined,
    },
  };
}

function getReadingTime(text: string) {
  const words = (text || "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/* Styles for rendered Markdown (bold, lists, headings, quotes, etc.) */
const markdownComponents: Components = {
  h1: ({ node, ...props }) => (
    <h2
      className="mb-5 mt-14 font-serif text-3xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl"
      {...props}
    />
  ),
  h2: ({ node, ...props }) => (
    <h2
      className="mb-5 mt-14 border-t border-gray-200 pt-10 font-serif text-2xl font-bold leading-snug tracking-tight text-gray-900 first:mt-0 first:border-0 first:pt-0 md:text-3xl"
      {...props}
    />
  ),
  h3: ({ node, ...props }) => (
    <h3
      className="mb-3 mt-9 font-serif text-xl font-bold text-gray-900 md:text-2xl"
      {...props}
    />
  ),
  p: ({ node, ...props }) => <p className="mb-6" {...props} />,
  strong: ({ node, ...props }) => (
    <strong className="font-semibold text-gray-900" {...props} />
  ),
  em: ({ node, ...props }) => <em className="italic" {...props} />,
  ul: ({ node, ...props }) => (
    <ul
      className="mb-7 list-disc space-y-3 pl-6 marker:text-amber-600"
      {...props}
    />
  ),
  ol: ({ node, ...props }) => (
    <ol
      className="mb-7 list-decimal space-y-3 pl-6 marker:font-semibold marker:text-amber-700"
      {...props}
    />
  ),
  li: ({ node, ...props }) => <li className="pl-1" {...props} />,
  a: ({ node, ...props }) => (
    <a
      className="font-medium text-amber-700 underline decoration-amber-300 underline-offset-4 transition hover:decoration-amber-700"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  blockquote: ({ node, ...props }) => (
    <blockquote
      className="my-8 rounded-r-xl border-l-4 border-amber-500 bg-amber-50 px-6 py-4 font-serif text-xl italic leading-8 text-gray-800"
      {...props}
    />
  ),
  hr: ({ node, ...props }) => (
    <hr className="my-12 border-gray-200" {...props} />
  ),
  img: ({ node, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="my-8 w-full rounded-2xl" alt="" {...props} />
  ),
  code: ({ node, ...props }) => (
    <code
      className="rounded bg-gray-100 px-1.5 py-0.5 text-[0.9em] text-gray-800"
      {...props}
    />
  ),
};

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params;

  const post = await getPost(slug);

  if (!post) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold">
            Article Not Found
          </h1>

          <p className="mt-3 text-gray-500">
            The article you are looking for may have been moved or removed.
          </p>

          <a
            href="/blog"
            className="mt-6 inline-block rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
          >
            Back to Blog
          </a>
        </div>
      </main>
    );
  }

  const readingTime = getReadingTime(post.content);
  const authorName = post.authorName || "SONIA FURNITURE";

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Article Header */}
      <header className="bg-gradient-to-b from-stone-50 to-white">
        <div className="mx-auto max-w-3xl px-6 pb-10 pt-12 md:pt-16">
          <a
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
          >
            <span aria-hidden>←</span> All Articles
          </a>

          {post.category?.name && (
            <p className="mt-8">
              <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-800">
                {post.category.name}
              </span>
            </p>
          )}

          <h1 className="mt-5 font-serif text-4xl font-bold leading-[1.15] tracking-tight text-gray-900 md:text-5xl">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-6 text-xl leading-8 text-gray-600">
              {post.excerpt}
            </p>
          )}

          <div className="mt-8 flex items-center gap-4 border-t border-gray-200 pt-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">
              {authorName.charAt(0).toUpperCase()}
            </div>

            <div className="text-sm">
              <p className="font-semibold text-gray-900">{authorName}</p>
              <p className="text-gray-500">
                {post.publishedAt &&
                  new Date(post.publishedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                {post.publishedAt && " · "}
                {readingTime} min read
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="mx-auto max-w-5xl px-6 pb-4 pt-2">
          <div className="aspect-[16/8] overflow-hidden rounded-3xl bg-gray-100 shadow-xl shadow-gray-200">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Article Content */}
      <article className="mx-auto max-w-3xl px-6 pb-24 pt-12">
        <div className="text-[1.125rem] leading-[1.9] text-gray-700">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Call to action */}
        <div className="mt-16 rounded-3xl bg-gray-900 px-8 py-10 text-center text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
            SONIA FURNITURE
          </p>

          <h2 className="mt-3 font-serif text-2xl font-bold md:text-3xl">
            Ready to find the perfect piece for your home?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-gray-400">
            Explore our collection of quality furniture crafted for
            comfort, style and durability.
          </p>

          <a
            href="/"
            className="mt-6 inline-block rounded-full bg-white px-7 py-3 text-sm font-semibold text-gray-900 transition hover:bg-amber-100"
          >
            Explore Our Collection
          </a>
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-gray-200 pt-8">
          <a
            href="/blog"
            className="text-sm font-semibold text-gray-900 underline underline-offset-4 hover:text-amber-700"
          >
            ← Back to Blog
          </a>

          <span className="text-sm text-gray-400">
            {readingTime} min read
          </span>
        </div>
      </article>
    </main>
  );
}