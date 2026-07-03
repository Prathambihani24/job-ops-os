function uniq(values) {
  return [...new Set(values.filter(Boolean))];
}

function tokenize(text) {
  return text
    .toLowerCase()
    .split(/[^a-z0-9+.#-]+/g)
    .filter(Boolean);
}

function extractKeywords(jobDescription, skillList) {
  const tokens = tokenize(jobDescription);
  const keywordMap = new Map();
  for (const skill of skillList) {
    const normalized = skill.toLowerCase();
    if (jobDescription.toLowerCase().includes(normalized)) {
      keywordMap.set(skill, true);
    }
  }

  const frequentTokens = tokens.filter((token) =>
    ["typescript", "next", "react", "postgresql", "supabase", "n8n", "slack", "hubspot", "ai", "automation", "crm", "workflow", "resume", "email"].includes(token)
  );

  return uniq([...keywordMap.keys(), ...frequentTokens.map((token) => token.toUpperCase())]);
}

function tailorBullets(experience, jobDescription) {
  const keywords = tokenize(jobDescription);
  return experience.map((section) => ({
    title: section.role,
    bullets: section.bullets.map((bullet) => {
      const matchedWords = keywords.filter((keyword) =>
        bullet.toLowerCase().includes(keyword)
      );

      const emphasis =
        matchedWords.length > 0
          ? `Aligned to ${matchedWords.slice(0, 3).join(", ")}.`
          : "Positioned to match the role priorities.";

      const focusedText =
        matchedWords.length > 0
          ? `${bullet.replace(/[.]+$/, "")} with emphasis on ${matchedWords
              .slice(0, 2)
              .join(" and ")}.`
          : bullet;

      return {
        original: bullet,
        tailored: focusedText,
        reason: emphasis
      };
    })
  }));
}

export function tailorResume(profile, jobPosting) {
  const keywordMatches = extractKeywords(jobPosting.description, profile.skills);
  const matchedKeywordText = keywordMatches.length
    ? keywordMatches.join(" | ")
    : "role-aligned product, automation, and GTM execution";

  const tailoredSections = tailorBullets(profile.experience, jobPosting.description);

  return {
    jobTitle: jobPosting.title,
    company: jobPosting.company,
    headline: `${jobPosting.title} | ${profile.headline}`,
    summary: `${profile.summary} This version emphasizes ${matchedKeywordText} to match the ${jobPosting.title} role at ${jobPosting.company}.`,
    sections: tailoredSections,
    keywordMatches
  };
}

export function buildOutreachMessage(profile, jobPosting, tailoredResume) {
  const contactName = jobPosting.contact?.name ?? "Hiring team";
  const subject = `Application for ${jobPosting.title} - ${profile.fullName}`;
  const text = [
    `Hi ${contactName},`,
    "",
    `I’m reaching out to apply for the ${jobPosting.title} role at ${jobPosting.company}.`,
    `I’ve tailored my resume to emphasize the skills most relevant to the job: ${tailoredResume.keywordMatches.slice(0, 6).join(", ")}.`,
    "",
    `If helpful, I’d be glad to share more context or a short project walkthrough.`,
    "",
    `Best,`,
    profile.fullName
  ].join("\n");

  return {
    subject,
    text
  };
}
