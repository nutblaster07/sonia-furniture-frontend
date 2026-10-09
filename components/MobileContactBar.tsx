
"use client";

const PHONE_NUMBER = "+918509158655"; // Replace with your business number
const WHATSAPP_NUMBER = "+918509158655"; // Country code + number, digits only
const MAPS_URL = "https://share.google/O7Uuj2RzmIucvd4TN";

export default function MobileContactBar() {
  return (
    <nav
      aria-label="Quick contact"
      className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 border-t border-gray-200 bg-white shadow-[0_-4px_15px_rgba(0,0,0,0.08)] md:hidden"
    >
      <a
        href={`tel:+${PHONE_NUMBER}`}
        className="flex flex-col items-center justify-center gap-1 py-3 text-gray-800 active:bg-gray-100"
      >
        <span className="text-xl" aria-hidden="true">☎</span>
        <span className="text-xs font-semibold">Call</span>
      </a>

      <a
        href={MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center gap-1 border-x border-gray-200 py-3 text-gray-800 active:bg-gray-100"
      >
        <span className="text-xl" aria-hidden="true">📍</span>
        <span className="text-xs font-semibold">Location</span>
      </a>

      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
          "Hello SONIA FURNITURE, I would like to know more about your furniture."
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center gap-1 py-3 text-green-700 active:bg-green-50"
      >
        <span className="text-xl" aria-hidden="true">◉</span>
        <span className="text-xs font-semibold">WhatsApp</span>
      </a>
    </nav>
  );
}
