import { mockCompanies } from "../data/mock-companies.js";

const APOLLO_ORG_SEARCH_URL = "https://api.apollo.io/api/v1/organizations/search";

async function findCompaniesViaApollo(apiKey, roleTitle, searchQueries, limit) {
  const keyword = searchQueries[0] ?? roleTitle;

  const response = await fetch(APOLLO_ORG_SEARCH_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey
    },
    body: JSON.stringify({
      q_organization_keyword_tags: [keyword],
      page: 1,
      per_page: limit
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Apollo organization search failed: ${response.status} ${errorText}`);
  }

  const payload = await response.json();
  const organizations = payload.organizations ?? payload.accounts ?? [];

  return organizations.map((org, index) => ({
    id: String(org.id ?? `apollo_${index}`),
    name: org.name ?? "Unknown company",
    domain: org.primary_domain ?? org.website_url ?? null,
    linkedinUrl: org.linkedin_url ?? null,
    stage: org.latest_funding_stage ?? org.funding_stage ?? "unknown",
    fitScore: 80,
    hiringSignal: "Sourced from Apollo's live organization database.",
    personalizedObservation: "Verify this company's current hiring status before reaching out.",
    source: "apollo"
  }));
}

const roleCatalog = [
  {
    title: "Social Media Manager",
    priority: "primary",
    keywords: [
      "social media",
      "instagram",
      "content",
      "canva",
      "adobe express",
      "engagement",
      "analytics"
    ],
    summary:
      "Best fit for your current experience managing content calendars, engagement, and social analytics."
  },
  {
    title: "Growth Marketing Associate",
    priority: "primary",
    keywords: [
      "lead generation",
      "apollo.io",
      "linkedin sales navigator",
      "campaign",
      "copywriting",
      "email",
      "seo"
    ],
    summary:
      "Strong match for teams that need outbound execution, lead sourcing, and campaign support."
  },
  {
    title: "GTM Operations Associate",
    priority: "secondary",
    keywords: ["hubspot", "crm", "workflow", "automation", "reporting", "pipeline"],
    summary:
      "Ideal if you want to combine CRM, outreach, reporting, and automation in one role."
  },
  {
    title: "Marketing Operations Specialist",
    priority: "secondary",
    keywords: ["excel", "analytics", "campaign management", "hubspot", "google analytics"],
    summary:
      "Good fit for teams that need a strong operator to manage campaigns, reporting, and tools."
  },
  {
    title: "Community and Brand Manager",
    priority: "explore",
    keywords: ["brand", "community", "copywriting", "content", "event", "sponsorship"],
    summary:
      "Useful if you want a more outward-facing marketing role centered on storytelling and community."
  }
];

function normalizeText(value) {
  return String(value ?? "").toLowerCase();
}

function collectProfileText(profile) {
  const segments = [
    profile.headline,
    profile.summary,
    profile.objective,
    ...(profile.skills ?? []),
    ...(profile.education ?? []),
    ...(profile.certifications ?? []),
    ...(profile.careerTargets ?? []),
    ...(profile.experience ?? []).flatMap((item) => [item.role, item.company, ...(item.bullets ?? [])]),
    ...(profile.projects ?? []).flatMap((item) => [item.name, ...(item.bullets ?? [])])
  ];

  return normalizeText(segments.join(" "));
}

function scoreRole(profileText, role) {
  const matches = role.keywords.filter((keyword) => profileText.includes(normalizeText(keyword)));
  const baseScore = role.priority === "primary" ? 78 : role.priority === "secondary" ? 70 : 62;
  const bonus = Math.min(matches.length * 4, 18);

  return {
    title: role.title,
    fitScore: Math.min(baseScore + bonus, 98),
    priority: role.priority,
    summary: role.summary,
    whyItFits: matches.length
      ? matches.slice(0, 4).map((keyword) => `Matches your background in ${keyword}.`)
      : ["Matches the broader direction of your marketing and GTM experience."],
    searchQueries: [
      role.title.toLowerCase(),
      `${role.title.toLowerCase()} startup`,
      `${role.title.toLowerCase()} ai`
    ]
  };
}

function scoreCompany(company, roleSuggestions, profileText) {
  const roleText = roleSuggestions
    .map((role) => `${role.title} ${role.summary}`)
    .join(" ")
    .toLowerCase();

  const companyText = `${company.name} ${company.hiringSignal} ${company.personalizedObservation}`.toLowerCase();
  const keywords = ["marketing", "growth", "crm", "outbound", "brand", "social", "revops", "gtm"];
  const keywordHits = keywords.filter(
    (keyword) => profileText.includes(keyword) || roleText.includes(keyword) || companyText.includes(keyword)
  ).length;

  const roleMatch = roleSuggestions[0]?.title ?? "Marketing role";
  const fitScore = Math.min(company.fitScore + keywordHits * 2, 99);

  return {
    ...company,
    fitScore,
    source: "apollo",
    targetRole: roleMatch
  };
}

export function createCareerPlanner({ profile, config, logger }) {
  const profileText = collectProfileText(profile);
  const roleSuggestions = roleCatalog
    .map((role) => scoreRole(profileText, role))
    .sort((a, b) => b.fitScore - a.fitScore);

  return {
    async plan() {
      const topRole = roleSuggestions[0];
      let companyMatches;
      let providerStatus;

      if (config.apolloApiKey && topRole) {
        try {
          const liveCompanies = await findCompaniesViaApollo(
            config.apolloApiKey,
            topRole.title,
            topRole.searchQueries,
            5
          );

          companyMatches = liveCompanies
            .map((company) => scoreCompany(company, roleSuggestions, profileText))
            .sort((a, b) => b.fitScore - a.fitScore)
            .slice(0, 5);

          providerStatus = {
            provider: "apollo",
            health: "healthy",
            checkedAt: new Date().toISOString(),
            notes: `Live company search via Apollo returned ${liveCompanies.length} results for "${topRole.title}".`
          };
        } catch (error) {
          logger.warn?.("Apollo organization search failed, falling back to static list.", {
            error: error instanceof Error ? error.message : String(error)
          });

          companyMatches = mockCompanies
            .map((company) => scoreCompany(company, roleSuggestions, profileText))
            .sort((a, b) => b.fitScore - a.fitScore)
            .slice(0, 5);

          providerStatus = {
            provider: "apollo",
            health: "degraded",
            checkedAt: new Date().toISOString(),
            notes: "Apollo API call failed, showing a static fallback company list instead. Check APOLLO_API_KEY and Apollo API status."
          };
        }
      } else {
        companyMatches = mockCompanies
          .map((company) => scoreCompany(company, roleSuggestions, profileText))
          .sort((a, b) => b.fitScore - a.fitScore)
          .slice(0, 5);

        providerStatus = {
          provider: "apollo",
          health: "degraded",
          checkedAt: new Date().toISOString(),
          notes: "APOLLO_API_KEY is not set, so this is a static fallback company list, not live sourcing."
        };
      }

      logger.info("Career plan generated.", {
        topRole: topRole?.title,
        companyCount: companyMatches.length,
        apolloStatus: providerStatus.health
      });

      return {
        primaryGoal:
          "Use the resume to target social media, growth marketing, GTM operations, and marketing automation roles.",
        roleSuggestions,
        companyMatches,
        providerStatus,
        nextSteps: [
          "Pick the highest-fit role suggestion as the weekly target.",
          "Let Apollo source companies that match the selected role and stage.",
          "Tailor the resume and outreach for each target company.",
          "Launch the application and log the outcome in the dashboard."
        ]
      };
    }
  };
}
