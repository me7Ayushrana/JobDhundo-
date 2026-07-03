import { UnifiedJob } from "../types";
import { normalizeJobs } from "./normalizer";

export async function fetchLoopCVJobs(
  query: string = "software",
  location: string = "",
  limit: number = 15
): Promise<UnifiedJob[]> {
  const apiKey = process.env.LOOPCV_API_KEY;

  if (!apiKey) {
    console.warn("LoopCV API key (LOOPCV_API_KEY) is not configured. Returning empty results.");
    return [];
  }

  try {
    const keyword = encodeURIComponent(query);
    const loc = encodeURIComponent(location);
    const url = `https://api.loopcv.pro/v1/jobs?keyword=${keyword}&location=${loc}&limit=${limit}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Accept": "application/json"
      }
    });

    if (!res.ok) {
      console.error(`LoopCV API responded with status ${res.status}`);
      return [];
    }

    const data = await res.json();
    const jobs = Array.isArray(data) ? data : data.jobs || data.results || [];
    return normalizeJobs(jobs, "loopcv");
  } catch (error) {
    console.error("LoopCV aggregator error:", error);
    return [];
  }
}
