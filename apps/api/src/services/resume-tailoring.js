import { loadConfig } from "../config/env.js";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

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

function tailorBulletsOffline(experience, jobDescription) {
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

/**
 * Offline fallback: plain keyword matching, no network call. Used when no
 * ANTHROPIC_API_KEY is configured, or if the API call fails for any reason.
 * This keeps the app usable even without the AI layer, it just won't be
 * as sharp as the real thing.
 */
function tailorResumeOffline(profile, jobPosting) {
  const keywordMatches = extractKeywords(jobPosting.description, profile.skills);
  const matchedKeywordText = keywordMatches.length
    ? keywordMatches.join(" | ")
    : "role-aligned product, automation, and GTM execution";

  const tailoredSections = tailorBulletsOffline(profile.experience, jobPosting.description);

  return {
    jobTitle: jobPosting.title,
    company: jobPosting.company,
    headline: `${jobPosting.title} | ${profile.headline}`,
    summary: `${profile.summary} This version emphasizes ${matchedKeywordText} to match the ${jobPosting.title} role at ${jobPosting.company}.`,
    sections: tailoredSections,
    keywordMatches,
    generatedBy: "offline-keyword-matcher"
  };
}

function buildOutreachMessageOffline(profile, jobPosting, tailoredResume) {
  const contactName = jobPosting.contact?.name ?? "Hiring team";
  const subject = `Application for ${jobPosting.title} - ${profile.fullName}`;
  const text = [
    `Hi ${contactName},`,
    "",
    `I'm reaching out to apply for the ${jobPosting.title} role at ${jobPosting.company}.`,
    `I've tailored my resume to emphasize the skills most relevant to the job: ${tailoredResume.keywordMatches.slice(0, 6).join(", ")}.`,
    "",
    `If helpful, I'd be glad to share more context or a short project walkthrough.`,
    "",
    `Best,`,
    profile.fullName
  ].join("\n");

  return {
    subject,
    text,
    generatedBy: "offline-template"
  };
}

function buildTailoringPrompt(profile, jobPosting) {
  return `You are a resume-tailoring assistant. Given a candidate's master resume profile and a target job posting, produce a tailored resume and a short outreach email.

Respond with ONLY valid JSON, no markdown fences, no commentary, matching exactly this shape:
{
  "headline": string,
  "summary": string,
  "sections": [
    { "title": string, "bullets": [ { "original": string, "tailored": string, "reason": string } ] }
  ],
  "keywordMatches": string[],
  "outreachSubject": string,
  "outreachBody": string
}

Rules:
- Do not invent experience, employers, metrics, or skills the candidate does not have.
- Reuse the candidate's real experience bullets as "original" and rewrite each as "tailored" to foreground the overlap with the job description, without fabricating anything.
- "reason" should name which job requirement each tailored bullet maps to, in a few words.
- "keywordMatches" should list the specific skills/technologies from the candidate's skill list that also appear in the job description.
- The outreach email should be short (under 120 words), specific to this company and role, and end with the candidate's full name.
- Keep the tone direct and confident, not generic or overly formal.

Candidate profile:
${JSON.stringify(
  {
    fullName: profile.fullName,
    headline: profile.headline,
    summary: profile.summary,
    skills: profile.skills,
    experience: profile.experience
  },
  null,
  2
)}

Job posting:
${JSON.stringify(
  {
    title: jobPosting.title,
    company: jobPosting.company,
    description: jobPosting.description,
    contactName: jobPosting.contact?.name ?? null
  },
  null,
  2
)}`;
}

function extractJson(rawText) {
  const fencedMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fencedMatch ? fencedMatch[1] : rawText;
  return JSON.parse(candidate.trim());
}

async function callGroq(config, prompt) {
  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${config.groqApiKey}`
    },
    body: JSON.stringify({
      model: config.groqModel,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.4,
      max_tokens: 2000
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API request failed: ${response.status} ${errorText}`);
  }

  const payload = await response.json();
  const messageContent = payload.choices?.[0]?.message?.content;

  if (!messageContent) {
    throw new Error("Groq API returned no message content.");
  }

  return extractJson(messageContent);
}

async function callAnthropic(config, prompt) {
  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": config.anthropicApiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: config.anthropicModel,
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Anthropic API request failed: ${response.status} ${errorText}`);
  }

  const payload = await response.json();
  const textBlock = payload.content?.find((block) => block.type === "text");

  if (!textBlock?.text) {
    throw new Error("Anthropic API returned no text content.");
  }

  return extractJson(textBlock.text);
}

function shapeAiResult(jobPosting, aiResult, generatedBy) {
  return {
    jobTitle: jobPosting.title,
    company: jobPosting.company,
    headline: aiResult.headline,
    summary: aiResult.summary,
    sections: aiResult.sections.map((section) => ({
      title: section.title,
      bullets: section.bullets
    })),
    keywordMatches: aiResult.keywordMatches ?? [],
    outreachSubject: aiResult.outreachSubject,
    outreachBody: aiResult.outreachBody,
    generatedBy
  };
}

/**
 * Tailors a resume against a job posting.
 *
 * Tries providers in this order, falling through silently on any failure
 * (missing key, network issue, rate limit, bad response) so the app never
 * hard-fails on the person using it:
 *
 *   1. Groq (llama-3.3-70b-versatile) - free tier, no credit card required.
 *      This is the recommended default: fast, generous rate limits, good
 *      enough quality for rewriting resume bullets and outreach copy.
 *   2. Anthropic - only used if you've configured a paid ANTHROPIC_API_KEY.
 *   3. Offline keyword matcher - zero network calls, always works, but is
 *      just string matching, not real tailoring.
 */
export async function tailorResume(profile, jobPosting) {
  const config = loadConfig();
  const prompt = buildTailoringPrompt(profile, jobPosting);

  if (config.groqApiKey) {
    try {
      const aiResult = await callGroq(config, prompt);
      return shapeAiResult(jobPosting, aiResult, `groq:${config.groqModel}`);
    } catch {
      // Fall through to the next provider.
    }
  }

  if (config.anthropicApiKey) {
    try {
      const aiResult = await callAnthropic(config, prompt);
      return shapeAiResult(jobPosting, aiResult, `anthropic:${config.anthropicModel}`);
    } catch {
      // Fall through to the offline path.
    }
  }

  return tailorResumeOffline(profile, jobPosting);
}

/**
 * If the tailored resume already carries AI-generated outreach copy (see
 * tailorResume above), reuse it as-is. Otherwise fall back to the offline
 * template. This keeps a single outreach draft consistent with whichever
 * path generated the resume.
 */
export function buildOutreachMessage(profile, jobPosting, tailoredResume) {
  if (tailoredResume.outreachSubject && tailoredResume.outreachBody) {
    return {
      subject: tailoredResume.outreachSubject,
      text: tailoredResume.outreachBody,
      generatedBy: tailoredResume.generatedBy
    };
  }

  return buildOutreachMessageOffline(profile, jobPosting, tailoredResume);
}
