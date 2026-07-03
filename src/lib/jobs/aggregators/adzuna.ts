import { UnifiedJob } from "../types";
import { normalizeJobs } from "./normalizer";

export async function fetchAdzunaJobs(
  query: string = "software",
  location: string = "",
  page: number = 1
): Promise<UnifiedJob[]> {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  if (!appId || !appKey) {
    console.warn("Adzuna API keys (ADZUNA_APP_ID / ADZUNA_APP_KEY) are not configured. Returning empty results.");
    return [];
  }

  try {
    const what = encodeURIComponent(query);
    const where = encodeURIComponent(location);
    // Search India by default (in)
    const url = `https://api.adzuna.com/v1/api/jobs/in/search/${page}?app_id=${appId}&app_key=${appKey}&what=${what}&where=${where}&results_per_page=15&content-type=application/json`;

    const res = await fetch(url, { method: "GET" });
    if (!res.ok) {
      console.error(`Adzuna API responded with status ${res.status}`);
      return [];
    }

    const data = await res.json();
    if (data.results && Array.isArray(data.results)) {
      return normalizeJobs(data.results, "adzuna");
    }
    return [];
  } catch (error) {
    console.error("Adzuna aggregator error:", error);
    return [];
  }
}
