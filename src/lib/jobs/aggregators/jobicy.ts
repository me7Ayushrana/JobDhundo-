import { UnifiedJob } from "../types";
import { normalizeJobs, extractSkills } from "./normalizer";

export async function fetchJobicyJobs(
  count: number = 50,
  geo?: string,
  industry?: string,
  tag?: string
): Promise<UnifiedJob[]> {
  try {
    let url = `https://jobicy.com/api/v2/remote-jobs?count=${count}`;
    if (geo) url += `&geo=${geo}`;
    if (industry) url += `&industry=${industry}`;
    if (tag) url += `&tag=${encodeURIComponent(tag)}`;

    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`Jobicy API returned status ${res.status}`);
      return [];
    }

    const data = await res.json();
    if (!data || !Array.isArray(data.jobs)) return [];

    const jobs = data.jobs.map((job: any) => ({
      id: `dm-jobicy-${job.id}`,
      title: job.jobTitle || "Software Engineer",
      company: job.companyName || "Jobicy Partner",
      companyLogo: job.companyLogo || undefined,
      location: job.jobGeo || "Remote",
      jobType: (job.jobType?.toLowerCase().includes("intern") ? "internship" : "full-time") as any,
      experienceLevel: (job.jobLevel?.toLowerCase() || "mid") as any,
      salaryMin: job.salaryMin || 0,
      salaryMax: job.salaryMax || 0,
      salaryCurrency: job.salaryCurrency || "USD",
      salaryPeriod: job.salaryPeriod || "yearly",
      description: job.jobDescription || "",
      requirements: [],
      skills: extractSkills(job.jobTitle || "", job.jobDescription || ""),
      postedDate: job.pubDate ? new Date(job.pubDate).toISOString() : new Date().toISOString(),
      applyUrl: job.url || ""
    }));

    return normalizeJobs(jobs, "jobicy");
  } catch (error) {
    console.error("Failed to fetch Jobicy jobs:", error);
    return [];
  }
}
