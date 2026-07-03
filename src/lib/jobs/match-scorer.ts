import { UnifiedJob } from "./types";

export function calculateMatchScore(
  userSkills: string[],
  jobSkills: string[],
  userPreferences: {
    preferredLocations: string[];
    minSalary: number;
    jobTypes: string[];
    remoteOnly: boolean;
  },
  job: UnifiedJob
): number {
  let score = 0;
  
  // 1. Skill overlap (50% weight)
  if (jobSkills && jobSkills.length > 0) {
    const overlap = userSkills.filter(s => 
      jobSkills.some(js => js.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(js.toLowerCase()))
    );
    score += (overlap.length / Math.max(jobSkills.length, 1)) * 50;
  } else {
    // If no skills are defined in the job description, default to 35% base skill score
    score += 35;
  }
  
  // 2. Location match (20% weight)
  const isJobRemote = job.location.toLowerCase().includes("remote");
  if (userPreferences.remoteOnly && isJobRemote) {
    score += 20;
  } else if (userPreferences.preferredLocations.some(pl => 
    job.location.toLowerCase().includes(pl.toLowerCase())
  )) {
    score += 20;
  } else if (isJobRemote) {
    // If not remote-only but job is remote, still high compatibility
    score += 15;
  }
  
  // 3. Salary match (15% weight)
  if (job.salaryMin && job.salaryMin >= userPreferences.minSalary) {
    score += 15;
  } else if (job.salaryMax && job.salaryMax >= userPreferences.minSalary) {
    score += 10;
  } else if (!job.salaryMin && !job.salaryMax) {
    // Standard default if not specified
    score += 10;
  }
  
  // 4. Job type match (10% weight)
  if (userPreferences.jobTypes.includes(job.jobType)) {
    score += 10;
  }
  
  // 5. Recency bonus (5% weight)
  const daysSincePosted = (Date.now() - new Date(job.postedDate).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSincePosted < 3) {
    score += 5;
  } else if (daysSincePosted < 7) {
    score += 3;
  } else if (daysSincePosted < 30) {
    score += 1;
  }
  
  return Math.min(Math.round(score), 100);
}
