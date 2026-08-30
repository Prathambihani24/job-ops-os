'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useUser } from '@supabase/auth-helpers-react';
import { JDAnalysisResult } from '@/types';

export default function JDProcessorPage() {
  const { user } = useUser();
  const [jdText, setJdText] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<JDAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeJD = async () => {
    if (!jdText.trim()) {
      setError('Please paste a job description first');
      return;
    }
    if (!user) {
      setError('Please sign in to analyze JDs');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      // First, get user profile for context
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('technicalSkills, crmExperience, apis, dataAnalysis')
        .eq('id', user.id)
        .single();

      // Prepare context for Claude
      const context = {
        userProfile: profile || { technicalSkills: [], crmExperience: [], apis: [], dataAnalysis: [] },
        jdText,
        instruction: `Analyze this Job Description as a GTM Engineer. Return JSON with:\n- jobTitle: extracted from JD\n- companyName: extracted from JD\n- matchPercentage: 0-100 based on user's profile\n- coreTechnicalSkills: array of skills mentioned\n- gtmAlignment: object with crmScore, apiScore, automationScore (0-30 each)\n- missingSkills: skills user lacks\n- suggestedBulletPoints: 3-5 resume bullet points tailored to the JD`,
      };

      // Call Claude API
      const response = await fetch('/api/jd-processor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jdText, userProfile: profile }),
      });

      const result = await response.json();

      if (!result.success) throw new Error(result.error || 'Analysis failed');

      setAnalysis(result.data);
    } catch (err: any) {
      console.error('JD analysis error:', err);
      setError(err.message || 'Failed to analyze JD');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">JD Analyzer</h1>
      <p className="mb-6 text-sm text-slate-500">
        Paste a raw Job Description and get AI-powered analysis tailored to your GTM profile.
      </p>

      <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <label className="block text-sm font-medium mb-2">Job Description (paste full text)</label>
        <textarea
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          className="w-full h-48 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          placeholder="Paste the full job description here..."
        />
      </div>

      <button
        onClick={analyzeJD}
        disabled={loading || !jdText.trim()}
        className={`w-full py-3 rounded-lg font-semibold transition-colors ${
          loading || !jdText.trim()
            ? 'bg-slate-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
        }`}
      >
        {loading ? 'Analyzing...' : 'Analyze JD'}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
          {error}
        </div>
      )}

      {analysis && (
        <div className="mt-6 p-6 bg-slate-50 rounded-lg border border-slate-200">
          <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-indigo-700 mb-1">📋 Job Title & Company</h3>
              <p className="text-sm text-slate-600">
                <strong>{analysis.jobTitle}</strong> at {analysis.companyName}
              </p>
            </div>

            <div>
              <h3 className="font-medium text-indigo-700 mb-1">📊 Match Score</h3>
              <div className="flex items-center space-x-3 mt-2">
                <div className="flex-1 bg-slate-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${analysis.matchPercentage}%` }}
                  />
                </div>
                <span className="font-bold text-indigo-600 text-lg">
                  {analysis.matchPercentage}%
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-indigo-700 mb-1">⚙️ Core Technical Skills</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {analysis.coreTechnicalSkills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-indigo-700 mb-1">🎯 GTM Alignment</h3>
              <div className="space-y-1 mt-2 text-sm">
                <p>
                  <span className="font-medium">CRM Score:</span> {analysis.gtmAlignment.crmScore}/30
                </p>
                <p>
                  <span className="font-medium">API Score:</span> {analysis.gtmAlignment.apiScore}/30
                </p>
                <p>
                  <span className="font-medium">Automation Score:</span> {analysis.gtmAlignment.automationScore}/30
                </p>
                <p className="font-semibold text-indigo-800 mt-2">
                  Overall: {analysis.gtmAlignment.overallFit}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-indigo-700 mb-1">📝 Suggested Resume Bullet Points</h3>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-slate-600">
                {analysis.suggestedBulletPoints.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-indigo-700 mb-1">⚠️ Missing Skills</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {analysis.missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Consider adding these skills to boost your match score.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
