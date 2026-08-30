import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const gtmType = searchParams.get('gtmType') || 'all';
  const location = searchParams.get('location') || '';

  // Mock search for demo (will be replaced with real scraping)
  const mockJobs = [
    {
      id: '1',
      title: 'GTM Engineer - Growth Platform',
      company: 'GrowthLoop',
      location: 'Remote / US',
      type: 'Full-time',
      salaryRange: '$120k - $180k',
      description: 'Build and scale growth automation workflows for enterprise SaaS.',
      requiredSkills: ['HubSpot', 'Python', 'SQL', 'API Integration', 'Data Analysis'],
      gtmRoleType: 'GTM Engineer' as const,
      matchScore: 0,
      postedDate: '2024-08-29',
    },
    {
      id: '2',
      title: 'Solutions Engineer - CRM',
      company: 'Salesforce Partner',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salaryRange: '$150k - $200k',
      description: 'Architect custom CRM solutions for Fortune 500 clients.',
      requiredSkills: ['Salesforce', 'Apex', 'SOQL', 'Lightning', 'Process Builder'],
      gtmRoleType: 'Solutions Engineer' as const,
      matchScore: 0,
      postedDate: '2024-08-28',
    },
    {
      id: '3',
      title: 'RevOps Engineer - Subscription',
      company: 'Chargebee',
      location: 'Remote / Europe',
      type: 'Full-time',
      salaryRange: '€70k - €100k',
      description: 'Optimize revenue operations, build customer lifecycle automations.',
      requiredSkills: ['Stripe', 'HubSpot', 'SQL', 'Automation', 'Customer Success'],
      gtmRoleType: 'RevOps Engineer' as const,
      matchScore: 0,
      postedDate: '2024-08-27',
    },
  ];n

  const filtered = mockJobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.description.toLowerCase().includes(search.toLowerCase());
    const matchesGtm = gtmType === 'all' || job.gtmRoleType === gtmType;
    const matchesLocation = !location || job.location.toLowerCase().includes(location.toLowerCase());
    return matchesSearch && matchesGtm && matchesLocation;
  });

  return NextResponse.json({ jobs: filtered });
}
