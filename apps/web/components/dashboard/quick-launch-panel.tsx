"use client";

import { useState } from "react";

type LaunchResult = {
  deliveryStatus: string;
  application?: { company_name?: string; job_title?: string };
  outreach: { subject: string; text: string };
  tailoredResume: {
    jobTitle: string;
    company: string;
    headline: string;
    summary: string;
    sections: Array<{ title: string; bullets: Array<{ tailored: string; reason: string }> }>;
    keywordMatches: string[];
  };
};

async function copyText(text: string) {
  await navigator.clipboard?.writeText(text);
}

export function QuickLaunchPanel() {
  const [description, setDescription] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<LaunchResult | null>(null);
  const [copied, setCopied] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (description.trim().length < 40) {
      setError("Paste the complete job description (at least 40 characters).");
      return;
    }
    setIsSubmitting(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/v1/applications/launch", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ jobPosting: { description, sourceUrl: sourceUrl || undefined } })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error ?? "Could not generate the resume.");
      setResult(payload.data as LaunchResult);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong while generating the resume.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCopy(label: string, text: string) {
    try {
      await copyText(text);
      setCopied(label);
      window.setTimeout(() => setCopied(""), 1800);
    } catch {
      setError("Copy is unavailable in this browser. Select the text and copy it manually.");
    }
  }

  const resumeText = result
    ? [result.tailoredResume.headline, result.tailoredResume.summary, ...result.tailoredResume.sections.flatMap((section) => [section.title, ...section.bullets.map((bullet) => `- ${bullet.tailored}`)])].join("\n\n")
    : "";

  return (
    <section className="quick-launch-grid">
      <article className="launch-card launch-form-card">
        <div className="launch-card-kicker"><span className="launch-pulse" /> JD → resume workflow</div>
        <h3>Paste the full job description.</h3>
        <p className="launch-card-copy">No manual job entry. The agent extracts the role details, tailors your resume using verified experience, drafts outreach, and saves the version to your dashboard.</p>

        <form className="launch-form" onSubmit={handleSubmit}>
          <label className="launch-field">
            <span>Full job description <b>required</b></span>
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Paste everything from the job post here…" required />
            <small>{description.length} characters · instructions inside the JD are treated as untrusted job data</small>
          </label>
          <label className="launch-field">
            <span>Job link <i>optional</i></span>
            <input value={sourceUrl} onChange={(event) => setSourceUrl(event.target.value)} placeholder="https://company.com/careers/role" type="url" />
          </label>
          <button className="generate-button" disabled={isSubmitting} type="submit">
            <span>{isSubmitting ? "✦" : "✧"}</span>{isSubmitting ? "Generating your resume…" : "Generate tailored resume"}<b>{isSubmitting ? "···" : "↗"}</b>
          </button>
          {error ? <p className="launch-error" role="alert">{error}</p> : null}
        </form>
      </article>

      <article className="launch-card output-card">
        <div className="output-card-top"><div><div className="launch-card-kicker">Generated package</div><h3>{result ? `${result.tailoredResume.jobTitle} · ${result.tailoredResume.company}` : "Your next application, ready"}</h3></div>{result ? <span className="saved-pill">✓ Saved</span> : <span className="output-icon">✦</span>}</div>

        {result ? (
          <div className="generated-stack">
            <div className="generated-block"><div className="block-label">Tailored headline <button type="button" onClick={() => handleCopy("headline", result.tailoredResume.headline)}>{copied === "headline" ? "Copied" : "Copy"}</button></div><strong>{result.tailoredResume.headline}</strong><p>{result.tailoredResume.summary}</p></div>
            <div className="generated-block"><div className="block-label">Resume highlights <button type="button" onClick={() => handleCopy("resume", resumeText)}>{copied === "resume" ? "Copied" : "Copy all"}</button></div><ul>{result.tailoredResume.sections.slice(0, 2).flatMap((section) => section.bullets.slice(0, 2)).map((bullet) => <li key={bullet.tailored}>{bullet.tailored}</li>)}</ul><div className="keyword-list">{result.tailoredResume.keywordMatches.slice(0, 8).map((keyword) => <span key={keyword}>{keyword}</span>)}</div></div>
            <div className="generated-block outreach-block"><div className="block-label">Outreach draft <button type="button" onClick={() => handleCopy("outreach", `${result.outreach.subject}\n\n${result.outreach.text}`)}>{copied === "outreach" ? "Copied" : "Copy"}</button></div><strong>{result.outreach.subject}</strong><pre>{result.outreach.text}</pre></div>
            <a className="view-dashboard-link" href="#activity">View saved application in activity log ↗</a>
          </div>
        ) : (
          <div className="output-empty"><span className="empty-orb">✦</span><strong>Paste a JD to start</strong><p>Your tailored headline, ATS-friendly experience bullets, keywords, and outreach draft will appear here.</p><div className="empty-steps"><span>01&nbsp; Analyze JD</span><span>02&nbsp; Tailor resume</span><span>03&nbsp; Save to dashboard</span></div></div>
        )}
      </article>
    </section>
  );
}
