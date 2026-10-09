const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://sonia-furniture-backend-production.up.railway.app/api";

export async function getHomepageData() {
  const [
    banners,
    collections,
    products,
    categories,
    projects,
    reviews,
    rooms,
    customFurnitureBanners,
    whySonia,
  ] = await Promise.all([
    fetch(`${API_URL}/homepage/banners/active`, {
      cache: "no-store",
    }).then((res) => res.json()),

    fetch(`${API_URL}/homepage/collections`, {
      cache: "no-store",
    }).then((res) => res.json()),

    fetch(`${API_URL}/homepage/products`, {
      cache: "no-store",
    }).then((res) => res.json()),

    fetch(`${API_URL}/homepage/categories`, {
      cache: "no-store",
    }).then((res) => res.json()),

    fetch(`${API_URL}/homepage/projects`, {
      cache: "no-store",
    }).then((res) => res.json()),

    fetch(`${API_URL}/homepage/reviews`, {
      cache: "no-store",
    }).then((res) => res.json()),

    fetch(`${API_URL}/homepage/rooms`, {
      cache: "no-store",
    }).then((res) => res.json()),

    fetch(`${API_URL}/homepage/custom-furniture-banners/active`, {
      cache: "no-store",
    }).then((res) => res.json()),

    fetch(`${API_URL}/homepage/why-sonia/active`, {
      cache: "no-store",
    }).then((res) => res.json()),
  ]);

  return {
    banners,
    collections,
    products,
    categories,
    projects,
    reviews,
    rooms,
    customFurnitureBanners,
    whySonia,
  };
}