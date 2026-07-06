import { NextResponse } from "next/server";
import { buildDashboardOverview } from "../../../../../apps/api/src/services/dashboard-data.js";

export async function GET() {
  const data = await buildDashboardOverview();
  return NextResponse.json({ data });
}
