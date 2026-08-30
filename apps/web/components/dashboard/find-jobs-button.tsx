"use client";

import { useState } from "react";

export function FindJobsButton() {
  const [isSearching, setIsSearching] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function findJobs() {
    setIsSearching(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/jobs/discover", { method: "POST" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Could not search for jobs.");
      setMessage(`Found ${payload.jobsFound} matches and ranked the top opportunities.`);
    } catch (searchError) {
      setError(searchError instanceof Error ? searchError.message : "Could not search for jobs.");
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <div className="find-jobs-action">
      <button className="primary-button" disabled={isSearching} onClick={findJobs} type="button">
        <span className="button-orb">✦</span>
        {isSearching ? "Finding jobs..." : "Find jobs now"}
        <span>{isSearching ? "⋯" : "↗"}</span>
      </button>
      {message ? <p className="find-jobs-status">{message}</p> : null}
      {error ? <p className="find-jobs-status find-jobs-error">{error}</p> : null}
    </div>
  );
}
