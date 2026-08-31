'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-b from-indigo-50 via-indigo-100 to-indigo-50">
        <div className="text-center">
          <div className="inline-block animate-pulse">
            <span className="brand-mark">J</span><span className="ml-2">job ops <em className="text-slate-400">os</em></span>
          </div>
          <p className="mt-4 text-slate-600">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  // Redirect logged-in users to dashboard
  router.push('/dashboard');
  return null;
}