import type { MetadataRoute } from "next";
import { APP_ROUTES } from "../lib/routes";

const BASE_URL = "https://powerchain.energy";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return Object.values(APP_ROUTES).map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/legals") ? 0.3 : 0.7,
  }));
}
