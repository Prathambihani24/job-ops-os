"use client";

import { useState } from "react";

type LaunchResult = {
  deliveryStatus: string;
  outreach: {
    subject: string;
    text: string;
  };
  tailoredResume: {
    headline: string;
    summary: string;
    keywordMatches: string[];
  };
};

const starterDescription =
  "Paste the job description here. The system will tailor your resume, draft outreach, and log the application.";

export function QuickLaunchPanel() {
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactRole, setContactRole] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [description, setDescription] = useState(starterDescription);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<LaunchResult | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/v1/applications/launch", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          jobPosting: {
            title: jobTitle,
            company,
            description,
            contact: {
              name: contactName || undefined,
              role: contactRole || undefined,
              email: contactEmail || undefined
            }
          }
        })
      });

      if (!response.ok) {
        throw new Error("Could not generate the application workflow.");
      }

      const payload = (await response.json()) as { data: LaunchResult };
      setResult(payload.data);
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong while generating the workflow.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <article className="rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-card">
        <p className="text-sm uppercase tracking-[0.2em] text-steel">Launch a job</p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">Paste a role and generate the workflow</h2>
        <p className="mt-3 text-sm leading-7 text-steel">
          This is the daily-use path: add a role, tailor the resume, draft the outreach, and write the application into your tracker.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-ink">Job title</span>
              <input
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-ink outline-none"
                onChange={(event) => setJobTitle(event.target.value)}
                placeholder="Social Media Manager"
                required
                value={jobTitle}
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Company</span>
              <input
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-ink outline-none"
                onChange={(event) => setCompany(event.target.value)}
                placeholder="Northwind Labs"
                required
                value={company}
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="text-sm font-medium text-ink">Contact name</span>
              <input
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-ink outline-none"
                onChange={(event) => setContactName(event.target.value)}
                placeholder="Hiring manager"
                value={contactName}
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Contact role</span>
              <input
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-ink outline-none"
                onChange={(event) => setContactRole(event.target.value)}
                placeholder="People Ops Lead"
                value={contactRole}
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Contact email</span>
              <input
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-ink outline-none"
                onChange={(event) => setContactEmail(event.target.value)}
                placeholder="name@company.com"
                type="email"
                value={contactEmail}
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-ink">Job description</span>
            <textarea
              className="mt-2 min-h-40 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-ink outline-none"
              onChange={(event) => setDescription(event.target.value)}
              required
              value={description}
            />
          </label>

          <button
            className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-sand transition hover:opacity-90 disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Generating..." : "Tailor resume and log application"}
          </button>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </form>
      </article>

      <article className="rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-card">
        <p className="text-sm uppercase tracking-[0.2em] text-steel">Generated output</p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">Ready-to-send draft</h2>
        <p className="mt-3 text-sm leading-7 text-steel">
          Your tailored headline, summary, and outreach draft appear here after submission.
        </p>

        {result ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-steel">Delivery status</p>
              <p className="mt-2 font-medium text-ink">{result.deliveryStatus.replaceAll("_", " ")}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-steel">Tailored headline</p>
              <p className="mt-2 font-medium text-ink">{result.tailoredResume.headline}</p>
              <p className="mt-3 text-sm leading-7 text-steel">{result.tailoredResume.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {result.tailoredResume.keywordMatches.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full bg-white px-3 py-1 text-xs text-steel"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-steel">Outreach subject</p>
              <p className="mt-2 font-medium text-ink">{result.outreach.subject}</p>
              <pre className="mt-3 whitespace-pre-wrap text-sm leading-7 text-steel">
                {result.outreach.text}
              </pre>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-3xl bg-slate-50 p-6 text-sm leading-7 text-steel">
            Once you paste a job and submit it, this panel will show the tailored resume summary and the outreach draft you can send.
          </div>
        )}
      </article>
    </section>
  );
}
