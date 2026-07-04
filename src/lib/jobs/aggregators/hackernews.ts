import { UnifiedJob } from "../types";
import { normalizeJobs, extractSkills } from "./normalizer";

// Helper to parse unstructured HN job text
function parseHNJobText(text: string) {
  if (!text) {
    return {
      company: "HN Startup",
      title: "Software Engineer",
      location: "Remote",
      applyUrl: "",
      description: "",
      requirements: [],
      skills: [],
      jobType: "full-time" as const,
      level: "mid" as const
    };
  }

  // Clean HTML markup entities commonly returned by Algolia API comments
  const clean = text
    .replace(/<p>/g, "\n\n")
    .replace(/<\/p>/g, "")
    .replace(/<pre><code>/g, "\n")
    .replace(/<\/code><\/pre>/g, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .trim();

  // Algolia comments from HN Who is Hiring generally start with: COMPANY | POSITION | LOCATION | SALARY / DETAILS
  const firstLine = clean.split("\n")[0] || "";
  const parts = firstLine.split("|").map(p => p.trim());

  const company = parts[0] || "HN Startup";
  const title = parts[1] || "Software Engineer";
  const location = parts[2] || "Remote";

  // Scan text for URLs to find the application page
  const urlMatch = clean.match(/(https?:\/\/[^\s\)]+)/gi);
  const applyUrl = urlMatch ? urlMatch[0] : "";

  const skills = extractSkills(title, clean);
  const jobType = clean.toLowerCase().includes("contract") ? ("contract" as const) : ("full-time" as const);
  
  let level: UnifiedJob["experienceLevel"] = "mid";
  if (clean.toLowerCase().includes("senior") || clean.toLowerCase().includes("lead")) {
    level = "senior";
  } else if (clean.toLowerCase().includes("junior") || clean.toLowerCase().includes("intern")) {
    level = "entry";
  }

  return {
    company,
    title,
    location,
    applyUrl,
    description: clean,
    requirements: [],
    skills,
    jobType,
    level
  };
}

export async function fetchHNJobs(): Promise<UnifiedJob[]> {
  try {
    // 1. Search for the latest "Who is Hiring" story by date
    const res = await fetch("https://hn.algolia.com/api/v1/search_by_date?query=who+is+hiring&tags=story&hitsPerPage=1");
    if (!res.ok) return [];
    
    const data = await res.json();
    const latestPostId = data.hits?.[0]?.objectID;
    if (!latestPostId) return [];

    // 2. Fetch comments (job postings) from that story ID
    const commentsRes = await fetch(`https://hn.algolia.com/api/v1/search?tags=comment,story_${latestPostId}&hitsPerPage=50`);
    if (!commentsRes.ok) return [];

    const commentsData = await commentsRes.json();
    if (!commentsData || !Array.isArray(commentsData.hits)) return [];

    const jobs = commentsData.hits
      .filter((hit: any) => hit.comment_text || hit.text)
      .map((hit: any) => {
        const rawText = hit.text || hit.comment_text || "";
        const parsed = parseHNJobText(rawText);
        return {
          id: `dm-hn-${hit.objectID}`,
          title: parsed.title,
          company: parsed.company,
          location: parsed.location,
          jobType: parsed.jobType,
          experienceLevel: parsed.level,
          description: parsed.description.substring(0, 800),
          requirements: parsed.requirements,
          skills: parsed.skills,
          postedDate: hit.created_at ? new Date(hit.created_at).toISOString() : new Date().toISOString(),
          applyUrl: parsed.applyUrl || `https://news.ycombinator.com/item?id=${hit.objectID}`
        };
      });

    return normalizeJobs(jobs, "hackernews");
  } catch (error) {
    console.error("Failed to fetch Hacker News jobs:", error);
    return [];
  }
}
