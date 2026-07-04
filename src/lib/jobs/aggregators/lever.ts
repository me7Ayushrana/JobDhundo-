import { UnifiedJob } from "../types";
import { normalizeJobs, normalizeExperience, normalizeJobType, extractSkills } from "./normalizer";

const LEVER_COMPANIES = [
  "netflix", "spotify", "uber", "lyft", "docker", "gitlab"
];

export async function fetchLeverJobs(): Promise<UnifiedJob[]> {
  const allJobs: any[] = [];
  
  for (const company of LEVER_COMPANIES) {
    try {
      const res = await fetch(`https://api.lever.co/v0/postings/${company}?mode=json`);
      if (!res.ok) continue;
      
      const data = await res.json();
      if (!Array.isArray(data)) continue;

      const companyName = company.charAt(0).toUpperCase() + company.slice(1);
      
      const normalized = data.map((job: any) => {
        const title = job.text || "Software Engineer";
        const descPlain = job.descriptionPlain || "";
        const categories = job.categories || {};
        
        return {
          id: `dm-lever-${company}-${job.id}`,
          title: title,
          company: companyName,
          location: categories.location || "Remote",
          jobType: normalizeJobType(categories.commitment || "full-time"),
          experienceLevel: normalizeExperience(title, descPlain),
          description: descPlain.substring(0, 1000) || "",
          requirements: [],
          skills: extractSkills(title, descPlain),
          postedDate: job.createdAt ? new Date(job.createdAt).toISOString() : new Date().toISOString(),
          applyUrl: job.applyUrl || job.hostedUrl || `https://jobs.lever.co/${company}/${job.id}`
        };
      });
      
      allJobs.push(...normalized);
    } catch (e) {
      console.warn(`Failed to fetch Lever jobs for ${company}:`, e);
    }
  }
  
  return normalizeJobs(allJobs, "lever");
}
