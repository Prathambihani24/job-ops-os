import type {
  DashboardHighlight,
  DashboardOverview
} from "@gtm-os/types";
import { QuickLaunchPanel } from "./quick-launch-panel";

type DashboardShellProps = {
  highlights: DashboardHighlight[];
  overview: DashboardOverview;
};

export function DashboardShell({
  highlights,
  overview
}: DashboardShellProps) {
  const {
    summary,
    recentApplications,
    pipelineStages,
    nextActions,
    careerPlan
  } = overview;

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-6 py-10 lg:px-10">
      <section className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-card backdrop-blur">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-clay">
              Milestone 2 foundation
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              AI GTM Operating System
            </h1>
            <p className="mt-4 text-lg leading-8 text-steel">
              A portfolio-ready command center for pipeline visibility, AI research,
              outreach drafting, and repeatable GTM workflows.
            </p>
          </div>
          <div className="rounded-3xl bg-ink px-6 py-5 text-sand">
            <p className="text-sm uppercase tracking-[0.25em] text-sand/70">Focus</p>
            <p className="mt-2 text-2xl font-semibold">Job search first</p>
            <p className="mt-1 text-sm text-sand/80">
              Architecture ready for sales, partnerships, recruiting, and founder outreach.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[1.75rem] border border-slate-200 bg-white/85 p-6 shadow-card">
          <p className="text-sm uppercase tracking-[0.2em] text-steel">Total applications</p>
          <p className="mt-4 text-4xl font-semibold text-ink">{summary.totalApplications}</p>
          <p className="mt-3 text-sm text-steel">Tracked end to end with outcomes and follow-up notes.</p>
        </article>
        <article className="rounded-[1.75rem] border border-slate-200 bg-white/85 p-6 shadow-card">
          <p className="text-sm uppercase tracking-[0.2em] text-steel">Replies</p>
          <p className="mt-4 text-4xl font-semibold text-ink">{summary.replies}</p>
          <p className="mt-3 text-sm text-steel">Includes positive responses, interview progress, and offers.</p>
        </article>
        <article className="rounded-[1.75rem] border border-slate-200 bg-white/85 p-6 shadow-card">
          <p className="text-sm uppercase tracking-[0.2em] text-steel">Interviewing</p>
          <p className="mt-4 text-4xl font-semibold text-ink">{summary.interviewing}</p>
          <p className="mt-3 text-sm text-steel">Active conversations currently in motion.</p>
        </article>
        <article className="rounded-[1.75rem] border border-slate-200 bg-white/85 p-6 shadow-card">
          <p className="text-sm uppercase tracking-[0.2em] text-steel">Offers</p>
          <p className="mt-4 text-4xl font-semibold text-ink">{summary.offers}</p>
          <p className="mt-3 text-sm text-steel">Current offer-track progress across the pipeline.</p>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <article className="rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-card">
          <p className="text-sm uppercase tracking-[0.2em] text-steel">AI role suggestions</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Best-fit roles for your resume</h2>
          <p className="mt-3 text-sm leading-7 text-steel">
            These are ranked from your social media, marketing, CRM, and lead generation experience.
          </p>
          <div className="mt-6 space-y-4">
            {careerPlan.roleSuggestions.map((role) => (
              <div key={role.title} className="rounded-3xl bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-ink">{role.title}</p>
                    <p className="mt-1 text-sm text-steel">{role.summary}</p>
                  </div>
                  <span className="rounded-full bg-clay/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-clay">
                    {role.fitScore}%
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {role.searchQueries.map((query) => (
                    <span
                      key={query}
                      className="rounded-full bg-white px-3 py-1 text-xs text-steel"
                    >
                      {query}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-card">
          <p className="text-sm uppercase tracking-[0.2em] text-steel">Apollo company search</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Companies to target next</h2>
          <p className="mt-3 text-sm leading-7 text-steel">
            Apollo is modeled as the sourcing layer here, with a free fallback list until the API key is connected.
          </p>
          <div className="mt-6 space-y-4">
            {careerPlan.companyMatches.map((company) => (
              <div key={company.id} className="rounded-3xl bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-ink">{company.name}</p>
                    <p className="mt-1 text-sm text-steel">
                      {company.targetRole} - {company.stage}
                    </p>
                  </div>
                  <span className="rounded-full bg-moss/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-moss">
                    {company.fitScore}%
                  </span>
                </div>
                <p className="mt-3 text-sm text-steel">{company.reason}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-steel">
                  {company.hiringSignal}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <article className="rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-steel">Pipeline</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">Application momentum</h2>
            </div>
            <span className="rounded-full bg-moss/10 px-4 py-2 text-sm font-medium text-moss">
              Conversion-aware
            </span>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {pipelineStages.map((stage) => (
              <div key={stage.label} className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-steel">{stage.label}</p>
                <p className="mt-3 text-3xl font-semibold text-ink">{stage.count}</p>
                <div className="mt-4 h-2 rounded-full bg-slate-200">
                  <div
                    className="h-2 rounded-full bg-clay"
                    style={{ width: `${stage.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-card">
          <p className="text-sm uppercase tracking-[0.2em] text-steel">Today</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Priority queue</h2>
          <div className="mt-6 space-y-4">
            {nextActions.map((task) => (
              <div key={task.title} className="rounded-3xl bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-ink">{task.title}</p>
                    <p className="mt-2 text-sm text-steel">{task.description}</p>
                  </div>
                  <span className="rounded-full bg-clay/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-clay">
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <QuickLaunchPanel />

      <section className="rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-card">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-steel">Recent applications</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">Live outcome tracker</h2>
          </div>
          <span className="rounded-full bg-clay/10 px-4 py-2 text-sm font-medium text-clay">
            Updated from real records
          </span>
        </div>
        <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 bg-white">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.2em] text-steel">
              <tr>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Outcome</th>
                <th className="px-4 py-3">Next step</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentApplications.map((application) => (
                <tr key={application.id} className="text-sm">
                  <td className="px-4 py-4 font-medium text-ink">{application.companyName}</td>
                  <td className="px-4 py-4 text-steel">{application.jobTitle}</td>
                  <td className="px-4 py-4 text-steel">
                    <div className="font-medium text-ink">{application.contactName ?? "Hiring team"}</div>
                    <div>{application.contactRole ?? "Point of contact"}</div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-ink">
                      {application.status.replaceAll("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-steel">{application.outcomeSummary ?? "Pending"}</td>
                  <td className="px-4 py-4 text-steel">{application.nextStep ?? "Review next action"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {highlights.map((highlight) => (
          <article
            key={highlight.title}
            className="rounded-[1.75rem] border border-slate-200 bg-white/85 p-6 shadow-card"
          >
            <p className="text-sm uppercase tracking-[0.2em] text-steel">{highlight.eyebrow}</p>
            <h3 className="mt-3 text-2xl font-semibold text-ink">{highlight.title}</h3>
            <p className="mt-3 text-sm leading-7 text-steel">{highlight.description}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-card">
          <p className="text-sm uppercase tracking-[0.2em] text-steel">How the automation works</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Tailor, send, and track</h2>
          <p className="mt-3 text-sm leading-7 text-steel">
            The workflow should first suggest the best roles from your resume, then use Apollo to source companies, tailor the resume to the role, draft the outreach message to the point of contact, submit the application, and write the outcome back to the dashboard.
          </p>
          <p className="mt-4 text-sm leading-7 text-steel">
            When email credentials are connected, the same flow can send directly. Until then, it still produces the ready-to-send draft and keeps the pipeline visible.
          </p>
        </article>
        <article className="rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-card">
          <p className="text-sm uppercase tracking-[0.2em] text-steel">Next actions</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">What happens next</h2>
          <div className="mt-4 space-y-4">
            {nextActions.map((action) => (
              <div key={action.title} className="rounded-3xl bg-slate-50 p-4">
                <p className="font-medium text-ink">{action.title}</p>
                <p className="mt-2 text-sm text-steel">{action.description}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
