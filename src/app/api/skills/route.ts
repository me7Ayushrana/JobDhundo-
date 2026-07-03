import { NextRequest, NextResponse } from "next/server";
import { fetchPackageJson, identifyTechStack } from "@/lib/utils/github";
import { extractSkills } from "@/lib/jobs/aggregators/normalizer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { githubUsername } = body;

    if (!githubUsername) {
      return NextResponse.json({ error: "githubUsername is required" }, { status: 400 });
    }

    const username = githubUsername.trim();

    // 1. Fetch repositories from GitHub API
    // We pass a standard User-Agent header which is required by GitHub
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=30&sort=updated`, {
      headers: {
        "User-Agent": "DevMatch-Jobs-Platform"
      }
    });

    if (!reposRes.ok) {
      return NextResponse.json({ error: "Failed to fetch GitHub profile or user does not exist." }, { status: reposRes.status });
    }

    const repos = await reposRes.json();
    if (!Array.isArray(repos)) {
      return NextResponse.json({ error: "Invalid repository format returned by GitHub." }, { status: 500 });
    }

    const skillsSet = new Set<string>();
    const languageCounts: Record<string, number> = {};
    let totalStars = 0;

    // 2. Loop through repos and parse details
    for (const repo of repos) {
      totalStars += repo.stargazers_count || 0;

      // Extract skills from title and description
      const extracted = extractSkills(repo.name || "", repo.description || "");
      extracted.forEach(s => skillsSet.add(s));

      // Count languages
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
        // Map common languages directly to skills
        if (["TypeScript", "JavaScript", "Python", "Go", "Java", "C++", "C#", "Rust", "Swift", "Kotlin", "Ruby", "PHP"].includes(repo.language)) {
          skillsSet.add(repo.language);
        }
      }
    }

    // 3. Deeper analysis: fetch package.json for the top 2 starred or recently updated repos
    const topRepos = [...repos]
      .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
      .slice(0, 2);

    for (const repo of topRepos) {
      try {
        const pkg = await fetchPackageJson(username, repo.name, repo.default_branch || "main");
        if (pkg) {
          const techStack = identifyTechStack([{ path: "package.json", type: "blob" }], pkg);
          techStack.forEach(t => skillsSet.add(t));
        }
      } catch (e) {
        // Silently skip if package.json fetch fails
      }
    }

    // Sort languages by count
    const topLanguages = Object.entries(languageCounts)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0])
      .slice(0, 5);

    // Calculate a confidence score out of 100 based on repository count and activity metrics
    const confidence = Math.min(
      Math.round(
        (repos.length * 3) + // repository count weight
        (totalStars * 2) +   // star weight
        (skillsSet.size * 4) + // skills variety weight
        30                   // base index
      ),
      100
    );

    return NextResponse.json({
      skills: Array.from(skillsSet),
      confidence,
      topLanguages
    });
  } catch (error: any) {
    console.error("GitHub skills DNA scan failed:", error);
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}
