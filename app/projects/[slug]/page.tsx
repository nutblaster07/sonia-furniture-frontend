interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getProject(slug: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/projects/slug/${slug}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export default async function ProjectPage({
  params,
}: ProjectPageProps) {
  const { slug } = await params;

  const project = await getProject(slug);

  if (!project) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Project Not Found
          </h1>

          <a
            href="/projects"
            className="mt-4 inline-block underline"
          >
            Back to Projects
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <section className="bg-gray-900 text-white">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="flex flex-wrap gap-3 text-sm uppercase tracking-wide text-gray-400">
            {project.category && <span>{project.category}</span>}

            {project.location && (
              <span>• {project.location}</span>
            )}
          </div>

          <h1 className="mt-4 text-5xl font-bold md:text-6xl">
            {project.title}
          </h1>

          {project.description && (
            <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-400">
              {project.description}
            </p>
          )}
        </div>
      </section>

      {/* Project Images */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-2">
          {project.images?.map((image: any) => (
            <div
              key={image.id}
              className="overflow-hidden rounded-2xl bg-gray-100"
            >
              <img
                src={image.imageUrl}
                alt={image.altText || project.title}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Project Details */}
      <section className="mx-auto max-w-4xl px-6 pb-20">
        <div className="border-t border-gray-200 pt-10">
          <h2 className="text-2xl font-bold">
            About This Project
          </h2>

          {project.description && (
            <p className="mt-5 text-lg leading-8 text-gray-600">
              {project.description}
            </p>
          )}

          <div className="mt-10">
            <a
              href="/contact"
              className="inline-block rounded-full bg-gray-900 px-8 py-4 text-sm font-semibold text-white"
            >
              Discuss Your Furniture Requirement
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}