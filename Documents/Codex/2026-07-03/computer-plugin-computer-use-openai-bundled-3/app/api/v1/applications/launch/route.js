import { NextResponse } from "next/server";
import { sampleJobPosting } from "../../../../../apps/api/src/data/sample-jobs.js";
import { launchApplicationFlow } from "../../../../../apps/api/src/services/dashboard-data.js";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const jobPosting = body.jobPosting ?? sampleJobPosting;

  return NextResponse.json({
    data: await launchApplicationFlow(jobPosting)
  });
}
