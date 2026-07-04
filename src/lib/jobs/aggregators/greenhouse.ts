import { UnifiedJob } from "../types";
import { normalizeJobs, extractSkills, normalizeExperience, normalizeJobType } from "./normalizer";

const GREENHOUSE_COMPANIES = [
  'stripe', 'airbnb', 'notion', 'figma', 'linear', 'vercel',
  'supabase', 'planetscale', 'render', 'railway', 'docker',
  'gitlab', 'hashicorp', 'twilio', 'segment', 'mux'
];

export async function fetchGreenhouseJobs(): Promise<UnifiedJob[]> {
  const allJobs: any[] = [];
  
  for (const company of GREENHOUSE_COMPANIES) {
    try {
      const res = await fetch(`https://boards-api.greenhouse.io/v1/boards/${company}/jobs`, {
        next: { revalidate: 3600 }
      });
      
      if (!res.ok) continue;
      const data = await res.json();
      
      const normalized = data.jobs.map((job: any) => ({
        id: `dm-gh-${company}-${job.id}`,
        title: job.title,
        company: company.charAt(0).toUpperCase() + company.slice(1),
        location: job.location?.name || 'Remote',
        jobType: normalizeJobType(job.title),
        experienceLevel: normalizeExperience(job.title, ''),
        description: job.content || job.description || '',
        requirements: [],
        skills: extractSkills(job.title, job.content || ''),
        postedDate: new Date().toISOString(),
        applyUrl: job.absolute_url,
        source: 'greenhouse',
        sourceAttribution: `via ${company.charAt(0).toUpperCase() + company.slice(1)}`
      }));
      
      allJobs.push(...normalized);
    } catch (e) {
      console.warn(`[Greenhouse] Failed for ${company}:`, e);
    }
  }
  
  return normalizeJobs(allJobs, 'greenhouse');
}
