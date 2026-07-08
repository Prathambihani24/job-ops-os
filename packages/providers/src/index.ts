import type { LeadRecord, ProviderHealth } from "@gtm-os/types";

export type ProviderStatus = {
  provider: string;
  health: ProviderHealth;
  checkedAt: string;
  notes?: string;
};

export interface LeadProvider {
  name: string;
  syncLeads(): Promise<LeadRecord[]>;
  getStatus(): Promise<ProviderStatus>;
}

export interface CompanyDiscoveryProvider {
  name: string;
  findCompanies(input: {
    roleTitle: string;
    searchQueries: string[];
    limit?: number;
  }): Promise<Array<{
    id: string;
    name: string;
    stage: string;
    fitScore: number;
    source: string;
  }>>;
  getStatus(): Promise<ProviderStatus>;
}

export interface ResearchProvider {
  name: string;
  researchCompany(companyName: string): Promise<{
    summary: string;
    signals: string[];
  }>;
  getStatus(): Promise<ProviderStatus>;
}

export interface NotificationProvider {
  name: string;
  sendSummary(input: {
    channel: string;
    title: string;
    blocks: string[];
  }): Promise<{ messageId: string }>;
  getStatus(): Promise<ProviderStatus>;
}

export interface EmailProvider {
  name: string;
  sendEmail(input: {
    to: string;
    subject: string;
    text: string;
    html?: string;
  }): Promise<{ messageId: string }>;
  getStatus(): Promise<ProviderStatus>;
}

export class ManualLeadProvider implements LeadProvider {
  name = "manual";

  async syncLeads(): Promise<LeadRecord[]> {
    return [
      {
        id: "lead_01",
        companyName: "SignalStack AI",
        contactName: "Avery Chen",
        contactRole: "Founding GTM Engineer",
        source: "manual",
        score: 91
      }
    ];
  }

  async getStatus(): Promise<ProviderStatus> {
    return {
      provider: this.name,
      health: "healthy",
      checkedAt: new Date().toISOString(),
      notes: "Manual lead entry is available without external integrations."
    };
  }
}

const APOLLO_ORG_SEARCH_URL = "https://api.apollo.io/api/v1/mixed_companies/search";

export class ApolloCompanyDiscoveryProvider implements CompanyDiscoveryProvider {
  name = "apollo";
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async findCompanies(input: {
    roleTitle: string;
    searchQueries: string[];
    limit?: number;
  }): Promise<Array<{
    id: string;
    name: string;
    stage: string;
    fitScore: number;
    source: string;
  }>> {
    if (!this.apiKey) {
      return [];
    }

    const perPage = input.limit ?? 5;

    const response = await fetch(APOLLO_ORG_SEARCH_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": this.apiKey
      },
      body: JSON.stringify({
        // Companies with active job postings matching this title - not
        // companies whose name/industry text merely contains these words.
        q_organization_job_titles: [input.roleTitle],
        organization_num_employees_ranges: ["1,200"],
        organization_job_posted_at_range: {
          min: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
        },
        page: 1,
        per_page: perPage
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Apollo organization search failed: ${response.status} ${errorText}`);
    }

    const payload = await response.json();
    const organizations = payload.organizations ?? payload.accounts ?? [];

    return organizations.map((org: Record<string, unknown>, index: number) => ({
      id: String(org.id ?? `apollo_${index}`),
      name: String(org.name ?? "Unknown company"),
      stage: String(org.latest_funding_stage ?? org.funding_stage ?? "unknown"),
      fitScore: 80,
      source: "apollo"
    }));
  }

  async getStatus(): Promise<ProviderStatus> {
    if (!this.apiKey) {
      return {
        provider: this.name,
        health: "degraded",
        checkedAt: new Date().toISOString(),
        notes: "APOLLO_API_KEY is not set. Company sourcing falls back to a static list until it's configured."
      };
    }

    return {
      provider: this.name,
      health: "healthy",
      checkedAt: new Date().toISOString(),
      notes: "APOLLO_API_KEY is set. Live organization search is used for company sourcing."
    };
  }
}
