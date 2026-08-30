import { NextResponse } from "next/server";
import { launchApplicationFlow, normalizeJobPosting } from "../../../../../apps/api/src/services/dashboard-data.js";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const jobPosting = body.jobPosting ?? {};

  if (!jobPosting.description || String(jobPosting.description).trim().length < 40) {
    return Response.json({ error: "Paste the complete job description to generate a tailored resume." }, { status: 400 });
  }

  try {
    return NextResponse.json({
      data: await launchApplicationFlow(normalizeJobPosting(jobPosting))
    });
  } catch (error) {
    return Response.json({
      error: error instanceof Error ? error.message : "Could not generate the application package."
    }, { status: 500 });
  }
}
