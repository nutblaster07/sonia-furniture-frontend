export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Hero */}
      <section className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
            About SONIA FURNITURE
          </p>

          <h1 className="mt-4 max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
            Furniture Built for Modern Indian Spaces
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-400">
            We design and manufacture furniture with a focus on thoughtful
            design, quality materials and dependable craftsmanship.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
              Our Story
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              From Idea to Furniture
            </h2>
          </div>

          <div className="space-y-5 leading-8 text-gray-600">
            <p>
              SONIA FURNITURE creates furniture for people who want their
              spaces to feel comfortable, functional and thoughtfully
              designed.
            </p>

            <p>
              From everyday home furniture to office and commercial
              requirements, we focus on creating practical pieces that
              combine modern aesthetics with reliable craftsmanship.
            </p>

            <p>
              Because we manufacture our furniture ourselves, we can also
              work with customers on customized requirements, dimensions
              and designs.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
              What We Believe
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              Built Around Quality
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-7">
              <h3 className="text-xl font-semibold">
                Quality
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                We focus on materials, construction and finishing that
                deliver dependable furniture.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-7">
              <h3 className="text-xl font-semibold">
                Craftsmanship
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Every piece is manufactured with attention to detail and
                practical usability.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-7">
              <h3 className="text-xl font-semibold">
                Customization
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                We can create furniture around your space, requirements
                and preferred style.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-3xl bg-gray-900 px-8 py-16 text-center text-white md:px-16">
          <h2 className="text-3xl font-bold md:text-4xl">
            Looking for furniture for your space?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-400">
            Explore our collection or talk to us about your custom
            furniture requirements.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="/shop"
              className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-gray-900"
            >
              Explore Furniture
            </a>

            <a
              href="/custom-furniture"
              className="rounded-full border border-white px-7 py-3 text-sm font-semibold text-white"
            >
              Request Custom Furniture
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}