import { UnifiedJob } from "../types";
import { normalizeJobs, extractSkills, normalizeExperience, normalizeJobType } from "./normalizer";

const LEVER_COMPANIES = [
  'netflix', 'spotify', 'uber', 'lyft', 'docker', 'gitlab',
  'notion', 'figma', 'linear', 'vercel', 'hashicorp'
];

export async function fetchLeverJobs(): Promise<UnifiedJob[]> {
  const allJobs: any[] = [];
  
  for (const company of LEVER_COMPANIES) {
    try {
      const res = await fetch(`https://api.lever.co/v0/postings/${company}?mode=json`, {
        next: { revalidate: 3600 }
      });
      
      if (!res.ok) continue;
      const data = await res.json();
      
      const normalized = data.map((job: any) => ({
        id: `dm-lever-${company}-${job.id}`,
        title: job.text,
        company: company.charAt(0).toUpperCase() + company.slice(1),
        location: job.categories?.location || 'Remote',
        jobType: normalizeJobType(job.categories?.commitment || ''),
        experienceLevel: normalizeExperience(job.text, ''),
        description: job.description?.replace(/<[^>]*>/g, '') || '',
        requirements: [],
        skills: extractSkills(job.text, job.description || ''),
        postedDate: new Date().toISOString(),
        applyUrl: job.applyUrl || job.hostedUrl,
        source: 'lever',
        sourceAttribution: `via ${company.charAt(0).toUpperCase() + company.slice(1)}`
      }));
      
      allJobs.push(...normalized);
    } catch (e) {
      console.warn(`[Lever] Failed for ${company}:`, e);
    }
  }
  
  return normalizeJobs(allJobs, 'lever');
}
