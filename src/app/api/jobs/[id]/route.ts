import { NextRequest, NextResponse } from "next/server";
import { HIGH_FIDELITY_FALLBACK_JOBS } from "@/lib/jobs/mock-data";
import { db } from "@/lib/firebase/config";
import { collection, getDocs } from "firebase/firestore";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Next.js 16 App Router requires awaiting params if it is a promise
    const resolvedParams = typeof (params as any).then === "function" 
      ? await (params as any) 
      : params;
    const { id } = resolvedParams;

    // 1. Check mock jobs
    const mockJob = HIGH_FIDELITY_FALLBACK_JOBS.find((j) => j.id === id);
    if (mockJob) {
      return NextResponse.json(mockJob);
    }

    // 2. Scan Firestore cache to locate the job
    if (db) {
      const querySnapshot = await getDocs(collection(db, "job_cache"));
      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        if (data.result) {
          const resultObj = JSON.parse(data.result);
          if (resultObj.jobs && Array.isArray(resultObj.jobs)) {
            const found = resultObj.jobs.find((j: any) => j.id === id);
            if (found) {
              return NextResponse.json(found);
            }
          }
        }
      }
    }

    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  } catch (error: any) {
    console.error("GET Job Details Error:", error);
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}
