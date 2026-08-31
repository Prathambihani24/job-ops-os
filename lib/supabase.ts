import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Create a typed Supabase client
export const supabase: SupabaseClient = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY || process.env.NEXT_PRIVATE_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
    global: {
      headers: { 'X-Client-Info': 'job-ops-os/0.2.0' },
    },
  }
);