import { UnifiedJob } from "../types";
import { normalizeJobs } from "./normalizer";

export async function fetchJSearchJobs(
  query: string = "software developer",
  location: string = "",
  page: number = 1
): Promise<UnifiedJob[]> {
  const apiKey = process.env.RAPIDAPI_KEY || process.env.JSEARCH_RAPIDAPI_KEY;

  if (!apiKey) {
    console.warn("JSearch RapidAPI key (RAPIDAPI_KEY) is not configured. Returning empty results.");
    return [];
  }

  try {
    const qStr = `${query} ${location}`.trim();
    const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(qStr)}&page=${page}&num_pages=1`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
        "Accept": "application/json"
      }
    });

    if (!res.ok) {
      console.error(`JSearch API responded with status ${res.status}`);
      return [];
    }

    const data = await res.json();
    if (data.data && Array.isArray(data.data)) {
      return normalizeJobs(data.data, "jsearch");
    }
    return [];
  } catch (error) {
    console.error("JSearch aggregator error:", error);
    return [];
  }
}
