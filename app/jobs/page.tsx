'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { JobOpportunity } from '@/types';

export default function JobsPage() {
  const [user, setUser] = useState<any>(null);
  const [jobs, setJobs] = useState<JobOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [gtmFilter, setGtmFilter] = useState('all');
  const [location, setLocation] = useState('');
  const [matchedJobs, setMatchedJobs] = useState<JobOpportunity[]>([]);
  const [isMatching, setIsMatching] = useState(false);

  // Mock GTM jobs for demo (will be replaced with real API)
  const mockGTMJobs: JobOpportunity[] = [
    {
      id: '1',
      title: 'GTM Engineer - Growth Platform',
      company: 'GrowthLoop',
      location: 'Remote / US',
      type: 'Full-time',
      salaryRange: '$120k - $180k',
      description: 'Build and scale growth automation workflows for enterprise SaaS. Deep expertise in HubSpot, Intercom, and data pipelines required.',
      requiredSkills: ['HubSpot', 'Python', 'SQL', 'API Integration', 'Data Analysis'],
      gtmRoleType: 'GTM Engineer',
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
      description: 'Architect custom CRM solutions for Fortune 500 clients. Must have Salesforce Admin + Developer certification.',
      requiredSkills: ['Salesforce', 'Apex', 'SOQL', 'Lightning', 'Process Builder'],
      gtmRoleType: 'Solutions Engineer',
      matchScore: 0,
      postedDate: '2024-08-28',
    },
    {
      id: '3',
      title: 'RevOps Engineer - Subscription Platform',
      company: 'Chargebee',
      location: 'Remote / Europe',
      type: 'Full-time',
      salaryRange: '€70k - €100k',
      description: 'Optimize revenue operations, build customer lifecycle automations, and improve renewal rates.',
      requiredSkills: ['Stripe', 'HubSpot', 'SQL', 'Automation', 'Customer Success'],
      gtmRoleType: 'RevOps Engineer',
      matchScore: 0,
      postedDate: '2024-08-27',
    },
  ];

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Load mock jobs initially
    setJobs(mockGTMJobs);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = mockGTMJobs.filter((job) => {
      const matchesQuery = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGtm = gtmFilter === 'all' || job.gtmRoleType === gtmFilter;
      const matchesLocation = !location || (job.location?.toLowerCase().includes(location.toLowerCase()) ?? false);
      return matchesQuery && matchesGtm && matchesLocation;
    });
    setJobs(filtered);
  };

  const runSmartMatch = async () => {
    if (!user) {
      alert('Please sign in to use smart matching');
      return;
    }

    setIsMatching(true);
    try {
      // Fetch user profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profile) {
        alert('Please complete your profile first');
        setIsMatching(false);
        return;
      }

      // Calculate match scores based on profile skills
      const scoredJobs = mockGTMJobs.map((job) => {
        let score = 0;
        const skills = [...(profile.technicalSkills || []), ...(profile.crmExperience || []), ...(profile.apis || [])];
        const jobSkills = job.requiredSkills || [];

        // Exact match bonus
        jobSkills.forEach((skill) => {
          if (skills.some((s) => s.toLowerCase() === (skill || '').toLowerCase())) {
            score += 10;
          }
        });

        // Partial match
        jobSkills.forEach((skill) => {
          if (skills.some((s) => s.toLowerCase().includes((skill || '').toLowerCase()))) {
            score += 5;
          }
        });

        // GTM alignment bonus
        const gtmWeights: Record<string, number> = {
          'GTM Engineer': 30,
          'Solutions Engineer': 25,
          'RevOps Engineer': 25,
        };
        const gtmRole = profile.gtmRoleType || '';
        if (gtmRole in gtmWeights) {
          score += gtmWeights[gtmRole];
        }

        return { ...job, matchScore: Math.min(score, 100) };
      });

      setMatchedJobs(scoredJobs.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0)));
      setJobs(scoredJobs);
    } catch (error) {
      console.error('Match error:', error);
      alert('Error running smart match');
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Find GTM Jobs</h1>
      <p className="mb-6 text-sm text-slate-500">Search our curated database of GTM, Solutions, and RevOps roles.</p>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={gtmFilter}
            onChange={(e) => setGtmFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg"
          >
            <option value="all">All GTM Roles</option>
            <option value="GTM Engineer">GTM Engineer</option>
            <option value="Solutions Engineer">Solutions Engineer</option>
            <option value="RevOps Engineer">RevOps Engineer</option>
          </select>
          <input
            type="text"
            placeholder="Location (optional)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Smart Match CTA */}
      <div className="mb-6 p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-500">
        <h3 className="font-semibold text-indigo-900 mb-2">🚀 Smart Match</h3>
        <p className="text-sm text-indigo-700 mb-3">
          Let AI analyze your profile and find the best-fit roles instantly.
        </p>
        <button
          onClick={runSmartMatch}
          disabled={isMatching}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            isMatching
              ? 'bg-slate-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {isMatching ? 'Analyzing...' : 'Find My Best Matches'}
        </button>
      </div>

      {/* Job Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="border border-slate-200 rounded-lg p-5 hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-lg group-hover:text-indigo-600 transition-colors">
                {job.title}
              </h3>
              <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                {job.gtmRoleType}
              </span>
            </div>
            <div className="space-y-2 text-sm text-slate-600">
              <p>
                <span className="font-medium">Company:</span> {job.company}
              </p>
              <p>
                <span className="font-medium">Location:</span> {job.location ?? 'Not specified'}
              </p>
              <p>
                <span className="font-medium">Type:</span> {job.type ?? 'Not specified'}
              </p>
              <p>
                <span className="font-medium">Salary:</span> {job.salaryRange ?? 'Not specified'}
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                Posted {job.postedDate ?? 'Unknown'}
              </div>
              {(job.matchScore ?? 0) > 0 && (
                <div className="flex items-center space-x-1">
                  <div className="w-16 bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full"
                      style={{ width: `${job.matchScore}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-indigo-700">
                    {(job.matchScore ?? 0)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {jobs.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No jobs found matching your criteria.
        </div>
      )}
    </div>
  );
}