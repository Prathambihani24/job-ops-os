import {
  dashboardHighlights,
  dashboardOverview
} from "@gtm-os/shared-domain";
import { DashboardShell } from "../apps/web/components/dashboard/dashboard-shell";
import { getDashboardOverview } from "../apps/web/lib/get-dashboard-overview";

export default async function HomePage() {
  const overview = await getDashboardOverview(dashboardOverview);

  return (
    <DashboardShell
      highlights={dashboardHighlights}
      overview={overview}
    />
  );
}
