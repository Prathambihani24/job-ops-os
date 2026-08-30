import type { DashboardHighlight, DashboardOverview } from "@gtm-os/types";
import type { ReactNode } from "react";
import { QuickLaunchPanel } from "./quick-launch-panel";

type DashboardShellProps = { highlights: DashboardHighlight[]; overview: DashboardOverview };

const icons = {
  grid: "⌘", spark: "✦", briefcase: "▣", radar: "◉", check: "✓", arrow: "↗"
};

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="section-label">{children}</p>;
}

function StatCard({ label, value, detail, tone }: { label: string; value: number; detail: string; tone: string }) {
  return (
    <article className={`stat-card ${tone}`}>
      <div className="stat-card-top"><span className="stat-dot" /><span className="stat-label">{label}</span><span className="stat-arrow">{icons.arrow}</span></div>
      <p className="stat-value">{value}</p>
      <p className="stat-detail">{detail}</p>
    </article>
  );
}

export function DashboardShell({ highlights, overview }: DashboardShellProps) {
  const { summary, recentApplications, pipelineStages, nextActions, careerPlan } = overview;
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">J</span><span>job ops <em>os</em></span></div>
        <div className="workspace-switcher"><span className="avatar avatar-coral">P</span><span><small>Workspace</small><strong>Pratham&apos;s HQ</strong></span><span className="chevron">⌄</span></div>
        <nav className="side-nav" aria-label="Primary navigation">
          <span className="nav-group-label">Workspace</span>
          <a className="nav-item active" href="#overview"><span>{icons.grid}</span>Overview</a>
          <a className="nav-item" href="#pipeline"><span>{icons.briefcase}</span>Applications <b>{summary.totalApplications}</b></a>
          <a className="nav-item" href="#roles"><span>{icons.spark}</span>Role matches</a>
          <a className="nav-item" href="#companies"><span>{icons.radar}</span>Companies</a>
          <span className="nav-group-label nav-group-spaced">Automations</span>
          <a className="nav-item" href="#launch"><span>✧</span>Application agent <i className="live-pill">Live</i></a>
          <a className="nav-item" href="#activity"><span>◷</span>Activity log</a>
        </nav>
        <div className="sidebar-bottom"><div className="credits"><span className="pulse-dot" /><span><strong>All systems operational</strong><small>Last synced just now</small></span></div><a className="nav-item" href="#settings"><span>⚙</span>Settings</a><div className="profile-row"><span className="avatar avatar-dark">P</span><span><strong>Pratham</strong><small>Personal workspace</small></span><span className="more">•••</span></div></div>
      </aside>

      <div className="content-wrap">
        <header className="topbar"><div className="breadcrumb"><span>Workspace</span><b>/</b><strong>Overview</strong></div><div className="top-actions"><button className="icon-button" aria-label="Search">⌕</button><button className="icon-button notification" aria-label="Notifications">♢<i /></button><button className="top-avatar">P</button></div></header>
        <div className="dashboard-content" id="overview">
          <section className="hero-section reveal"><div><div className="eyebrow"><span className="eyebrow-dot" />Thursday, July 3, 2026</div><h1>Your job search,<br /><span>in motion.</span></h1><p className="hero-copy">A calm command center for finding the right roles, making a strong impression, and keeping every opportunity moving forward.</p></div><a href="#launch" className="primary-button">Launch an application <span>{icons.arrow}</span></a></section>

          <section className="stats-grid reveal reveal-delay-1"><StatCard label="Applications" value={summary.totalApplications} detail="Tracked end to end" tone="tone-coral" /><StatCard label="Replies" value={summary.replies} detail="A 37% response rate" tone="tone-lavender" /><StatCard label="Interviewing" value={summary.interviewing} detail="Active conversations" tone="tone-blue" /><StatCard label="Offers" value={summary.offers} detail="Offer-track progress" tone="tone-green" /></section>

          <section className="main-grid reveal reveal-delay-2" id="pipeline"><article className="panel pipeline-panel"><div className="panel-heading"><div><SectionLabel>Pipeline health</SectionLabel><h2>Application momentum</h2></div><button className="ghost-button">Last 30 days <span>⌄</span></button></div><div className="pipeline-chart"><div className="chart-lines"><span /><span /><span /><span /></div><div className="chart-bars">{pipelineStages.map((stage, index) => <div className="chart-column" key={stage.label}><div className={`bar bar-${index}`} style={{ height: `${Math.max(stage.percentage, 8) * 2.1}%` }}><b>{stage.count}</b></div><span>{stage.label}</span></div>)}</div></div><div className="pipeline-footer"><span><i className="legend-dot coral" />Strongest activity this week</span><strong>+18% <span>vs last month</span></strong></div></article>
            <article className="panel queue-panel"><div className="panel-heading"><div><SectionLabel>Up next</SectionLabel><h2>Priority queue</h2></div><a className="text-link" href="#launch">View all {icons.arrow}</a></div><div className="task-list">{nextActions.map((task, index) => <div className="task-row" key={task.title}><span className={`task-check ${index === 0 ? "task-active" : ""}`}>{index === 0 ? "→" : ""}</span><div><strong>{task.title}</strong><p>{task.description}</p></div><span className={`priority priority-${task.priority}`}>{task.priority}</span></div>)}</div></article></section>

          <section className="split-grid reveal" id="roles"><article className="panel role-panel"><div className="panel-heading"><div><SectionLabel>AI role matches</SectionLabel><h2>Where you fit best</h2></div><span className="ai-badge">{icons.spark} AI ranked</span></div><p className="panel-description">Based on your experience, strengths, and the kind of work you want to do next.</p><div className="role-list">{careerPlan.roleSuggestions.slice(0, 3).map((role, index) => <div className="role-row" key={role.title}><span className="role-rank">0{index + 1}</span><div className="role-main"><strong>{role.title}</strong><span>{role.summary}</span><div className="tag-row">{role.searchQueries.slice(0, 2).map((query) => <small key={query}>{query}</small>)}</div></div><div className="fit-score"><strong>{role.fitScore}%</strong><span>fit</span></div></div>)}</div><a className="bottom-link" href="#roles">Explore all role matches {icons.arrow}</a></article>
            <article className="panel company-panel" id="companies"><div className="panel-heading"><div><SectionLabel>Target companies</SectionLabel><h2>Good signals, right now</h2></div><span className="signal-badge"><i /> Live</span></div><p className="panel-description">Companies showing hiring momentum across your strongest role matches.</p><div className="company-list">{careerPlan.companyMatches.slice(0, 3).map((company) => <div className="company-row" key={company.id}><span className="company-logo">{company.name.slice(0, 1)}</span><div><strong>{company.name}</strong><span>{company.targetRole}</span></div><span className="company-score">{company.fitScore}%</span></div>)}</div><a className="bottom-link" href="#companies">Open company radar {icons.arrow}</a></article></section>

          <section id="launch" className="launch-wrap reveal"><div className="launch-heading"><div><SectionLabel>Application agent</SectionLabel><h2>Turn a job post into momentum.</h2><p>Paste a role and let the agent tailor your resume, draft outreach, and keep your pipeline current.</p></div><span className="agent-orb">✦</span></div><QuickLaunchPanel /></section>

          <section className="panel activity-panel reveal" id="activity"><div className="panel-heading"><div><SectionLabel>Recent activity</SectionLabel><h2>Everything in one place</h2></div><a className="text-link" href="#activity">Activity log {icons.arrow}</a></div><div className="table-wrap"><table><thead><tr><th>Company</th><th>Role</th><th>Status</th><th>Next step</th></tr></thead><tbody>{recentApplications.map((application) => <tr key={application.id}><td><span className="table-company"><i>{application.companyName.slice(0, 1)}</i><strong>{application.companyName}</strong></span></td><td>{application.jobTitle}</td><td><span className={`status status-${application.status}`}>{application.status.replaceAll("_", " ")}</span></td><td>{application.nextStep ?? "Review next action"}</td></tr>)}</tbody></table></div></section>

          <section className="insight-grid reveal">{highlights.map((highlight) => <article className="insight-card" key={highlight.title}><span className="insight-icon">✦</span><SectionLabel>{highlight.eyebrow}</SectionLabel><h3>{highlight.title}</h3><p>{highlight.description}</p></article>)}</section>
        </div>
      </div>
    </main>
  );
}
