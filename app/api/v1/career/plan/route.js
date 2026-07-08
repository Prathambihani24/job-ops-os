import { NextResponse } from "next/server";
import { buildCareerPlan } from "../../../../../apps/api/src/services/dashboard-data.js";

export async function GET() {
  return NextResponse.json({
    data: await buildCareerPlan()
  });
}
