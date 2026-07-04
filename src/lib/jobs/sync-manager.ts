import { db } from "../firebase/config";
import { UnifiedJob } from "./types";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import fs from "fs";
import path from "path";

// Real API imports
import { fetchAdzunaJobs } from "./aggregators/adzuna";
import { fetchJSearchJobs } from "./aggregators/jsearch";
import { fetchLoopCVJobs } from "./aggregators/loopcv";
import { fetchRemoteOKJobs } from "./aggregators/remoteok";
import { fetchJobicyJobs } from "./aggregators/jobicy";
import { fetchHNJobs } from "./aggregators/hackernews";
import { fetchGreenhouseJobs } from "./aggregators/greenhouse";
import { fetchLeverJobs } from "./aggregators/lever";
import { fetchAshbyJobs } from "./aggregators/ashby";

const LOCAL_DB_PATH = path.join(process.cwd(), "src/lib/jobs/synced_database.json");

/**
 * Normalizes strings to create a unique identifier for duplicate detection.
 */
export function generateDedupeHash(company: string, title: string, location: string): string {
  const c = (company || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const t = (title || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const l = (location || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  return `${c}-${t}-${l}`;
}

/**
 * Loads all jobs from the active database (Firestore or Local JSON file fallback).
 */
export async function loadAllJobsFromDb(): Promise<UnifiedJob[]> {
  // 1. Try Firestore if configured
  if (db) {
    try {
      console.log("[SyncManager] Querying jobs from Cloud Firestore...");
      const snapshot = await getDocs(collection(db, "jobs"));
      const list: UnifiedJob[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as UnifiedJob);
      });
      return list;
    } catch (e) {
      console.error("[SyncManager] Firestore query failed, falling back to JSON:", e);
    }
  }

  // 2. Fallback to Local JSON Database
  try {
    if (fs.existsSync(LOCAL_DB_PATH)) {
      const raw = fs.readFileSync(LOCAL_DB_PATH, "utf-8");
      return JSON.parse(raw) as UnifiedJob[];
    }
  } catch (err) {
    console.error("[SyncManager] Failed to read local JSON database:", err);
  }

  return [];
}

/**
 * Saves a unified job to Firestore if configured.
 */
export async function saveJobToDb(job: UnifiedJob): Promise<void> {
  if (db) {
    try {
      const docRef = doc(db, "jobs", job.id);
      await setDoc(docRef, job, { merge: true });
      return;
    } catch (e) {
      console.error(`[SyncManager] Firestore write failed for ${job.id}:`, e);
    }
  }
}

/**
 * Persists the unified index to the local JSON database cache backup.
 */
export async function saveAllJobsToJsonDb(jobs: UnifiedJob[]): Promise<void> {
  try {
    const dir = path.dirname(LOCAL_DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(jobs, null, 2), "utf-8");
    console.log(`[SyncManager] Local JSON Database updated with ${jobs.length} real jobs.`);
  } catch (err) {
    console.error("[SyncManager] Failed to write local JSON database:", err);
  }
}

export class SyncManager {
  /**
   * Runs the sync pipeline in parallel across all 9 real live sources.
   */
  static async runSync(query: string = "software engineer", location: string = "India"): Promise<{
    processed: number;
    added: number;
    merged: number;
    removed: number;
    sourceBreakdown: Record<string, number>;
    logs: string[];
  }> {
    const logs: string[] = [];
    logs.push(`[${new Date().toISOString()}] Launching Job Dhundo! Sync Pipeline...`);
    logs.push(`Parameters - Query: "${query}" | Location: "${location}"`);

    // Load current database index
    const existingJobs = await loadAllJobsFromDb();
    const jobsMap = new Map<string, UnifiedJob>();
    existingJobs.forEach((job) => {
      // Use clean dedupe hash key
      const key = generateDedupeHash(job.company, job.title, job.location);
      jobsMap.set(key, job);
    });

    logs.push(`Loaded ${existingJobs.length} existing jobs from database.`);

    logs.push("[SyncManager] Fetching from 9 live APIs in parallel...");
    
    // Trigger all live fetches in parallel
    const results = await Promise.allSettled([
      fetchAdzunaJobs(query, location, 1),
      fetchJSearchJobs(query, location, 1),
      fetchLoopCVJobs(query, location, 15),
      fetchRemoteOKJobs(query),
      fetchJobicyJobs(50, undefined, undefined, query),
      fetchHNJobs(),
      fetchGreenhouseJobs(),
      fetchLeverJobs(),
      fetchAshbyJobs()
    ]);

    const sources = [
      "adzuna",
      "jsearch",
      "loopcv",
      "remoteok",
      "jobicy",
      "hackernews",
      "greenhouse",
      "lever",
      "ashby"
    ];

    let processedCount = 0;
    let addedCount = 0;
    let mergedCount = 0;
    const sourceStats: Record<string, number> = {};

    results.forEach((result, index) => {
      const sourceName = sources[index];
      sourceStats[sourceName] = 0;

      if (result.status === "fulfilled") {
        const jobs = result.value || [];
        sourceStats[sourceName] = jobs.length;
        logs.push(`✅ [API: ${sourceName}] Successfully aggregated ${jobs.length} jobs.`);

        for (const rawJob of jobs) {
          processedCount++;

          // 1. Validation Logic
          if (!rawJob.title || !rawJob.company || !rawJob.applyUrl) {
            continue;
          }

          const hashId = generateDedupeHash(rawJob.company, rawJob.title, rawJob.location);

          if (jobsMap.has(hashId)) {
            // DUPLICATE DETECTED! Merge sources & urls
            const existing = jobsMap.get(hashId)!;

            const altUrls = existing.alternateUrls || [];
            if (rawJob.applyUrl && existing.applyUrl !== rawJob.applyUrl && !altUrls.includes(rawJob.applyUrl)) {
              altUrls.push(rawJob.applyUrl);
            }

            const altSources = existing.alternateSources || [];
            const sourceAttr = rawJob.sourceAttribution || `via ${sourceName}`;
            if (!altSources.includes(sourceAttr) && existing.sourceAttribution !== sourceAttr) {
              altSources.push(sourceAttr);
            }

            const mergedJob: UnifiedJob = {
              ...existing,
              alternateUrls: altUrls,
              alternateSources: altSources,
              lastUpdated: new Date().toISOString()
            };

            jobsMap.set(hashId, mergedJob);
            mergedCount++;
          } else {
            // NEW JOB! Create fresh entry
            const newJob: UnifiedJob = {
              ...rawJob,
              id: hashId,
              alternateUrls: [rawJob.applyUrl],
              alternateSources: [rawJob.sourceAttribution || `via ${sourceName}`],
              lastUpdated: new Date().toISOString(),
              postedDate: rawJob.postedDate || new Date().toISOString()
            };

            jobsMap.set(hashId, newJob);
            addedCount++;
          }
        }
      } else {
        logs.push(`❌ [API: ${sourceName}] Failed to fetch: ${result.reason?.message || result.reason}`);
      }
    });

    // Clean up expired listings older than 30 days
    const now = Date.now();
    const staleLimit = 30 * 24 * 60 * 60 * 1000;
    let removedCount = 0;

    const allMergedList = Array.from(jobsMap.values());
    const finalActiveList = allMergedList.filter((job) => {
      const age = now - new Date(job.postedDate).getTime();
      const isExpired = age > staleLimit;
      if (isExpired) {
        removedCount++;
        logs.push(`🗑️ [Expiry] Removed stale job: "${job.title}" at "${job.company}"`);
        return false;
      }
      return true;
    });

    // Save to Firestore
    if (db) {
      logs.push(`[Database] Syncing ${finalActiveList.length} unique jobs to Cloud Firestore...`);
      for (const job of finalActiveList) {
        await saveJobToDb(job);
      }
    }

    // Update local cached database backup
    await saveAllJobsToJsonDb(finalActiveList);

    logs.push(`[Pipeline Success] Sync complete: Processed ${processedCount}, Added ${addedCount}, Merged ${mergedCount}, Expired ${removedCount}.`);

    return {
      processed: processedCount,
      added: addedCount,
      merged: mergedCount,
      removed: removedCount,
      sourceBreakdown: sourceStats,
      logs
    };
  }
}
