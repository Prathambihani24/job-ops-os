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

export class ApolloCompanyDiscoveryProvider implements CompanyDiscoveryProvider {
  name = "apollo";

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
    void input;
    return [];
  }

  async getStatus(): Promise<ProviderStatus> {
    return {
      provider: this.name,
      health: "degraded",
      checkedAt: new Date().toISOString(),
      notes: "Connect APOLLO_API_KEY or the Apollo MCP integration to return live company sourcing results."
    };
  }
}
