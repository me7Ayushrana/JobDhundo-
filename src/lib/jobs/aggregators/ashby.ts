import { UnifiedJob } from "../types";
import { normalizeJobs, extractSkills, normalizeExperience, normalizeJobType } from "./normalizer";

const ASHBY_COMPANIES = [
  'runway', 'solace', 'factory', 'kong', 'vestwell', 'warp'
];

export async function fetchAshbyJobs(): Promise<UnifiedJob[]> {
  const allJobs: any[] = [];
  
  for (const company of ASHBY_COMPANIES) {
    try {
      const res = await fetch(`https://api.ashbyhq.com/posting-api/job-board/${company}`, {
        next: { revalidate: 3600 }
      });
      
      if (!res.ok) continue;
      const data = await res.json();
      
      const normalized = data.jobs.map((job: any) => ({
        id: `dm-ashby-${company}-${job.id}`,
        title: job.title,
        company: company.charAt(0).toUpperCase() + company.slice(1),
        location: job.location || 'Remote',
        jobType: normalizeJobType(job.title + " " + (job.employmentType || '')),
        experienceLevel: normalizeExperience(job.title, ''),
        salaryMin: job.compensation?.compensationTierSummary?.min || 0,
        salaryMax: job.compensation?.compensationTierSummary?.max || 0,
        salaryCurrency: 'USD',
        salaryPeriod: 'yearly',
        description: job.descriptionPlain || '',
        requirements: [],
        skills: extractSkills(job.title, job.descriptionPlain || ''),
        postedDate: new Date().toISOString(),
        applyUrl: job.jobUrl,
        source: 'ashby',
        sourceAttribution: `via ${company.charAt(0).toUpperCase() + company.slice(1)}`
      }));
      
      allJobs.push(...normalized);
    } catch (e) {
      console.warn(`[Ashby] Failed for ${company}:`, e);
    }
  }
  
  return normalizeJobs(allJobs, 'ashby');
}
