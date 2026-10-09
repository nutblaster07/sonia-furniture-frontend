import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="inline-block text-xl font-semibold tracking-[0.18em] transition-opacity hover:opacity-80"
            >
              SONIA
            </Link>

            <p className="mt-1 text-[9px] font-medium tracking-[0.35em] text-gray-400">
              FURNITURE
            </p>

            <p className="mt-5 max-w-xs text-sm leading-7 text-gray-400">
              Modern furniture made for modern living.
              Proudly serving customers in Siliguri,
              North Bengal, Sikkim and nearby areas.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Explore
            </h3>

            <div className="mt-5 flex flex-col gap-3">
              <FooterLink href="/" label="Home" />
              <FooterLink href="/shop" label="Shop" />
              <FooterLink
                href="/custom-furniture"
                label="Custom Furniture"
              />
              <FooterLink href="/contact" label="Contact" />
            </div>
          </div>

          {/* Customer */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Customer
            </h3>

            <div className="mt-5 flex flex-col gap-3">
              <FooterLink
                href="/wishlist"
                label="Wishlist"
              />

              <FooterLink
                href="/compare"
                label="Compare"
              />

              <FooterLink
                href="/recently-viewed"
                label="Recently Viewed"
              />

              <FooterLink
                href="/account/enquiries"
                label="My Enquiries"
              />

              <FooterLink
                href="/account"
                label="My Account"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Visit Us
            </h3>

            <p className="mt-5 text-sm leading-7 text-gray-400">
              Darjeeling More, Siliguri, West Bengal
              <br />
              Serving North Bengal & Sikkim
            </p>
            <a
                href="tel:+918509158655"
                className="mt-3 inline-block text-sm text-gray-400 transition-colors duration-300 hover:text-white"
                >
                
                Call us on +91 85091 58655
            </a>
            <br />

            <a
              href="https://share.google/aZe0TNfuj28tGaZ5T"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white transition-all duration-300 hover:gap-3 hover:text-gray-300"
            >
              View Location
              <span>→</span>
            </a>

            <div className="mt-6">
              <Link
                href="/contact"
                className="inline-block rounded-full bg-white px-5 py-3 text-sm font-semibold text-gray-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-200 hover:shadow-lg"
              >
                Request Enquiry
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col gap-4 border-t border-gray-800 pt-6 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} SONIA FURNITURE.
            All rights reserved.
          </p>

          <div className="flex gap-5">
            <Link
              href="/privacy"
              className="transition-colors hover:text-white"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="transition-colors hover:text-white"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="w-fit text-sm text-gray-400 transition-all duration-300 hover:translate-x-1 hover:text-white"
    >
      {label}
    </Link>
  );
}