async function getProjects() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/projects/published`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return [];
  }

  return response.json();
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <section className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
            Our Work
          </p>

          <h1 className="mt-3 text-5xl font-bold md:text-6xl">
            Featured Projects
          </h1>

          <p className="mt-5 max-w-2xl leading-8 text-gray-400">
            Explore furniture solutions created by SONIA FURNITURE for
            homes, offices and commercial spaces.
          </p>
        </div>
      </section>

      {/* Projects */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        {projects.length === 0 ? (
          <div className="py-20 text-center">
            <h2 className="text-2xl font-semibold">
              No projects available
            </h2>

            <p className="mt-3 text-gray-500">
              Our latest projects will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {projects.map((project: any) => (
              <a
                key={project.id}
                href={`/projects/${project.slug}`}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white"
              >
                <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                  {project.images?.[0]?.imageUrl ? (
                    <img
                      src={project.images[0].imageUrl}
                      alt={
                        project.images[0].altText ||
                        project.title
                      }
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex flex-wrap gap-3 text-xs uppercase tracking-wide text-gray-500">
                    {project.category && (
                      <span>{project.category}</span>
                    )}

                    {project.location && (
                      <span>• {project.location}</span>
                    )}
                  </div>

                  <h2 className="mt-3 text-2xl font-semibold">
                    {project.title}
                  </h2>

                  {project.description && (
                    <p className="mt-3 leading-7 text-gray-600">
                      {project.description}
                    </p>
                  )}

                  <span className="mt-5 inline-block text-sm font-semibold underline underline-offset-4">
                    View Project
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