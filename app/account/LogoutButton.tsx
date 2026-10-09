"use client";

export default function LogoutButton() {
  function handleLogout() {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-full border border-gray-900 px-6 py-3 text-sm font-semibold transition hover:bg-gray-900 hover:text-white"
    >
      Logout
    </button>
  );
}