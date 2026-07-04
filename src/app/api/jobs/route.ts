import { NextRequest, NextResponse } from "next/server";
import { loadAllJobsFromDb } from "@/lib/jobs/sync-manager";
import { JobSearchResult, UnifiedJob } from "@/lib/jobs/types";
import { HIGH_FIDELITY_FALLBACK_JOBS } from "@/lib/jobs/mock-data";

// Live APIs
import { fetchAdzunaJobs } from "@/lib/jobs/aggregators/adzuna";
import { fetchRemoteOKJobs } from "@/lib/jobs/aggregators/remoteok";
import { fetchJobicyJobs } from "@/lib/jobs/aggregators/jobicy";
import { fetchGreenhouseJobs } from "@/lib/jobs/aggregators/greenhouse";
import { fetchLeverJobs } from "@/lib/jobs/aggregators/lever";
import { fetchAshbyJobs } from "@/lib/jobs/aggregators/ashby";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const location = searchParams.get("location") || "";
    const jobTypes = searchParams.get("jobType") ? searchParams.get("jobType")!.split(",") : [];
    const experience = searchParams.get("experience") ? searchParams.get("experience")!.split(",") : [];
    const skills = searchParams.get("skills") ? searchParams.get("skills")!.split(",") : [];
    const salaryMin = searchParams.get("salaryMin") ? parseInt(searchParams.get("salaryMin")!, 10) : undefined;
    const salaryMax = searchParams.get("salaryMax") ? parseInt(searchParams.get("salaryMax")!, 10) : undefined;
    const remote = searchParams.get("remote") === "true";
    const postedWithin = searchParams.get("postedWithin") || "all";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const perPage = parseInt(searchParams.get("perPage") || "10", 10);

    // 1. Try cache (Firestore or local database JSON) first
    let jobsList = await loadAllJobsFromDb();
    let isCached = jobsList.length > 0;

    // 2. Fetch from real APIs in parallel if cache is empty
    if (!isCached) {
      console.log("[Jobs API] Cache empty. Performing live API search in parallel...");
      const apiResults = await Promise.allSettled([
        fetchAdzunaJobs(q || "software developer", location || "India", page),
        fetchRemoteOKJobs(q || undefined),
        fetchJobicyJobs(perPage, undefined, undefined, q || undefined),
        fetchGreenhouseJobs(),
        fetchLeverJobs(),
        fetchAshbyJobs()
      ]);

      apiResults.forEach((res) => {
        if (res.status === "fulfilled") {
          jobsList.push(...(res.value || []));
        }
      });
    }

    // 3. Fallback to Demo Mode ONLY if all APIs return 0 results
    const isDemoMode = jobsList.length === 0;
    if (isDemoMode) {
      console.log("[Jobs API] Zero real jobs found. Activating Demo Mode...");
      jobsList = HIGH_FIDELITY_FALLBACK_JOBS.map((j) => ({
        ...j,
        source: "demo",
        sourceAttribution: "Demo Data — Add API keys for live feeds"
      }));
    }

    // Apply filter parameters
    let filteredJobs = [...jobsList];

    // 1. Query Search
    if (q.trim()) {
      const term = q.toLowerCase().trim();
      filteredJobs = filteredJobs.filter((job) => {
        return (
          job.title.toLowerCase().includes(term) ||
          job.company.toLowerCase().includes(term) ||
          job.description.toLowerCase().includes(term) ||
          job.skills.some((s) => s.toLowerCase().includes(term))
        );
      });
    }

    // 2. Location
    if (location.trim()) {
      const locTerm = location.toLowerCase().trim();
      filteredJobs = filteredJobs.filter((job) => 
        job.location.toLowerCase().includes(locTerm)
      );
    }

    // 3. Job Types
    if (jobTypes.length > 0) {
      filteredJobs = filteredJobs.filter((job) => jobTypes.includes(job.jobType));
    }

    // 4. Experience Level
    if (experience.length > 0) {
      filteredJobs = filteredJobs.filter((job) => experience.includes(job.experienceLevel));
    }

    // 5. Remote Only
    if (remote) {
      filteredJobs = filteredJobs.filter((job) => 
        job.location.toLowerCase().includes("remote")
      );
    }

    // 6. Skills match
    if (skills.length > 0) {
      filteredJobs = filteredJobs.filter((job) =>
        skills.some((s) => job.skills.map((js) => js.toLowerCase()).includes(s.toLowerCase()))
      );
    }

    // 7. Salary bounds
    if (salaryMin !== undefined) {
      filteredJobs = filteredJobs.filter((job) => !job.salaryMin || job.salaryMin >= salaryMin);
    }
    if (salaryMax !== undefined) {
      filteredJobs = filteredJobs.filter((job) => !job.salaryMax || job.salaryMax <= salaryMax);
    }

    // 8. Recency
    if (postedWithin !== "all") {
      const now = Date.now();
      let limitMs = 30 * 24 * 60 * 60 * 1000;
      if (postedWithin === "24h") limitMs = 24 * 60 * 60 * 1000;
      if (postedWithin === "7d") limitMs = 7 * 24 * 60 * 60 * 1000;

      filteredJobs = filteredJobs.filter(
        (job) => now - new Date(job.postedDate).getTime() <= limitMs
      );
    }

    // Sort by newest postings
    filteredJobs.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());

    // Source breakdowns
    const sourceBreakdown: Record<string, number> = {};
    filteredJobs.forEach((job) => {
      sourceBreakdown[job.source] = (sourceBreakdown[job.source] || 0) + 1;
    });

    // Pagination
    const totalResults = filteredJobs.length;
    const startIndex = (page - 1) * perPage;
    const paginatedJobs = filteredJobs.slice(startIndex, startIndex + perPage);
    const hasMore = startIndex + perPage < totalResults;

    const result: JobSearchResult = {
      jobs: paginatedJobs,
      totalResults,
      page,
      perPage,
      hasMore,
      sourceBreakdown,
      cached: isCached,
      fetchedAt: new Date().toISOString(),
      isDemoMode
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[API GET Jobs] Endpoint crash:", error);
    return NextResponse.json({ error: "Server search error", details: error.message }, { status: 500 });
  }
}
