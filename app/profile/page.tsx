'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        if (data) {
          // Convert comma-separated strings back to arrays
          const profileWithArrays = {
            ...data,
            technicalSkills: data.technicalSkills
              ? data.technicalSkills.split(',').filter(Boolean)
              : [],
            crmExperience: data.crmExperience
              ? data.crmExperience.split(',').filter(Boolean)
              : [],
            marketingAutomation: data.marketingAutomation
              ? data.marketingAutomation.split(',').filter(Boolean)
              : [],
            apis: data.apis
              ? data.apis.split(',').filter(Boolean)
              : [],
            dataAnalysis: data.dataAnalysis
              ? data.dataAnalysis.split(',').filter(Boolean)
              : [],
            portfolioLinks: data.portfolioLinks
              ? data.portfolioLinks.split(',').filter(Boolean)
              : [],
          };
          setProfile(profileWithArrays);
        } else {
          setProfile(null);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.currentTarget);
    const updates = {
      id: user.id,
      email: user.email!,
      name: formData.get('name') as string,
      technicalSkills: (((formData.get('technicalSkills') ?? '') as string)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean))
        .join(','),
      crmExperience: (((formData.get('crmExperience') ?? '') as string)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean))
        .join(','),
      marketingAutomation: (((formData.get('marketingAutomation') ?? '') as string)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean))
        .join(','),
      apis: (((formData.get('apis') ?? '') as string)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean))
        .join(','),
      dataAnalysis: (((formData.get('dataAnalysis') ?? '') as string)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean))
        .join(','),
      portfolioLinks: (((formData.get('portfolioLinks') ?? '') as string)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean))
        .join(','),
      resumeUrl: formData.get('resumeUrl') as string || null,
      updated_at: new Date().toISOString(),
    };

    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert(updates, { onConflict: 'id' });

      if (error) throw error;
      alert('Profile saved successfully!');
    } catch (err: any) {
      alert('Error saving profile: ' + err.message);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <div className="p-6">Please sign in to view your profile.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">GTM Engineer Profile</h1>
      <p className="mb-4 text-sm text-slate-500">
        Fill in your details to get personalized job matches and AI-powered insights.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            defaultValue={profile?.name || ''}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Technical Skills (comma-separated)</label>
          <input
            type="text"
            name="technicalSkills"
            defaultValue={profile?.technicalSkills?.join(', ') ?? ''}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g., JavaScript, TypeScript, Python, SQL"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">CRM Experience (e.g., Salesforce, HubSpot)</label>
          <input
            type="text"
            name="crmExperience"
            defaultValue={profile?.crmExperience?.join(', ') ?? ''}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Marketing Automation Tools</label>
          <input
            type="text"
            name="marketingAutomation"
            defaultValue={profile?.marketingAutomation?.join(', ') ?? ''}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">APIs Worked With</label>
          <input
            type="text"
            name="apis"
            defaultValue={profile?.apis?.join(', ') ?? ''}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Data Analysis Skills</label>
          <input
            type="text"
            name="dataAnalysis"
            defaultValue={profile?.dataAnalysis?.join(', ') ?? ''}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Portfolio Links (comma-separated)</label>
          <input
            type="text"
            name="portfolioLinks"
            defaultValue={profile?.portfolioLinks?.join(', ') ?? ''}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g., https://yourportfolio.com, https://github.com/yourname"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Resume URL (optional)</label>
          <input
            type="url"
            name="resumeUrl"
            defaultValue={profile?.resumeUrl || ''}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
}