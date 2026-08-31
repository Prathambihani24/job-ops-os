'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { ApplicationTracker } from '@/types';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalApplications: 0,
    applied: 0,
    interviewing: 0,
    offer: 0,
    matchScoreAvg: 0,
  });
  const [loading, setLoading] = useState(true);

  // Check if we're in the browser (not during static generation)
  const isBrowser = typeof window !== 'undefined';

  useEffect(() => {
    if (!isBrowser) return;

    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [isBrowser]);

  useEffect(() => {
    if (!user || !isBrowser) return;

    const fetchStats = async () => {
      try {
        const { count: total } = await supabase
          .from('applications')
          .select('*', { count: 'exact' })
          .eq('userId', user.id);

        const { count: applied } = await supabase
          .from('applications')
          .select('*', { count: 'exact' })
          .eq('userId', user.id)
          .eq('status', 'applied');

        const { count: interviewing } = await supabase
          .from('applications')
          .select('*', { count: 'exact' })
          .eq('userId', user.id)
          .eq('status', 'interviewing');

        const { count: offer } = await supabase
          .from('applications')
          .select('*', { count: 'exact' })
          .eq('userId', user.id)
          .eq('status', 'offer');

        // Calculate average match score
        const { data: apps } = await supabase
          .from('applications')
          .select('job:gtmAlignmentScore')
          .eq('userId', user.id);

        const avgScore = apps && apps.length > 0
          ? Math.round((apps.reduce((sum, app) => sum + (app.job?.gtmAlignmentScore || 0), 0) / apps.length) * 100) / 100
          : 0;

        setStats({
          totalApplications: total || 0,
          applied: applied || 0,
          interviewing: interviewing || 0,
          offer: offer || 0,
          matchScoreAvg: avgScore,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, isBrowser]);

  if (loading) return <div className="p-6">Loading dashboard...</div>;
  if (!user) return <div className="p-6">Please sign in to view your dashboard.</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">GTM Engineering Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <h3 className="text-sm font-medium text-slate-600">Total Applications</h3>
          <p className="text-2xl font-bold text-indigo-600">{stats.totalApplications}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <h3 className="text-sm font-medium text-slate-600">Applied</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.applied}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <h3 className="text-sm font-medium text-slate-600">Interviewing</h3>
          <p className="text-2xl font-bold text-green-600">{stats.interviewing}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <h3 className="text-sm font-medium text-slate-600">Offers</h3>
          <p className="text-2xl font-bold text-purple-600">{stats.offer}</p>
        </div>
      </div>

      {/* Match Score Gauge */}
      <div className="bg-white rounded-lg p-6 border border-slate-200">
        <h3 className="text-lg font-semibold mb-4">GTM Match Profile</h3>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative h-16 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                style={{ width: `${stats.matchScoreAvg}%` }}
              />
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">{stats.matchScoreAvg}%</div>
            <div className="text-xs text-slate-500">Avg Match Score</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-indigo-50 rounded-lg p-4 border-l-4 border-indigo-500">
          <h4 className="font-semibold text-indigo-900">Find Jobs</h4>
          <p className="text-sm text-indigo-700 mt-1">Search our GTM database and filter by role type.</p>
          <button
            onClick={() => window.open('/jobs', '_self')}
            className="mt-3 w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
          >
            Search Jobs
          </button>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
          <h4 className="font-semibold text-blue-900">Analyze JD</h4>
          <p className="text-sm text-blue-700 mt-1">Paste a job description for AI-powered analysis.</p>
          <button
            onClick={() => window.open('/jd-analyzer', '_self')}
            className="mt-3 w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
          >
            Analyze JD
          </button>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
          <h4 className="font-semibold text-green-900">Track Apps</h4>
          <p className="text-sm text-green-700 mt-1">Manage your application pipeline and follow-ups.</p>
          <button
            onClick={() => window.open('/applications', '_self')}
            className="mt-3 w-full py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
          >
            View Tracker
          </button>
        </div>
      </div>
    </div>
  );
}