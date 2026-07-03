// Unified job schema — every API source normalizes to this
export interface UnifiedJob {
  id: string;                    // dm-{source}-{originalId}
  title: string;
  company: string;
  companyLogo?: string;
  location: string;              // "Remote", "Bangalore, India", etc.
  jobType: "full-time" | "part-time" | "contract" | "internship" | "freelance";
  experienceLevel: "entry" | "mid" | "senior" | "lead" | "executive";
  salaryMin?: number;            // In INR for India jobs, USD for global
  salaryMax?: number;
  salaryCurrency: "INR" | "USD" | "EUR" | "GBP";
  salaryPeriod: "yearly" | "monthly" | "hourly";
  description: string;           // Full text, cleaned HTML
  requirements: string[];        // Bullet points
  skills: string[];              // Tech stack: ["React", "Node.js", "AWS"]
  postedDate: string;            // ISO 8601
  applyUrl: string;              // Original application link
  source: "adzuna" | "loopcv" | "jsearch" | "internshala" | "naukri" | "cached";
  sourceAttribution: string;     // Tiny text: "via Adzuna"
  matchScore?: number;           // 0-100, computed later
}

export interface JobSearchFilters {
  query?: string;
  location?: string;
  jobType?: UnifiedJob["jobType"][];
  experienceLevel?: UnifiedJob["experienceLevel"][];
  skills?: string[];
  salaryMin?: number;
  salaryMax?: number;
  remoteOnly?: boolean;
  postedWithin?: "24h" | "7d" | "30d" | "all";
}

export interface JobSearchResult {
  jobs: UnifiedJob[];
  totalResults: number;
  page: number;
  perPage: number;
  hasMore: boolean;
  sourceBreakdown: Record<string, number>; // {"adzuna": 45, "loopcv": 23}
  cached: boolean;
  fetchedAt: string;
}
