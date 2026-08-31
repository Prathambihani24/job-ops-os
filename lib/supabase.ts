import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;

// Create a typed Supabase client (lazy initialization)
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!_supabase) {
      const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        // Return a dummy client that throws helpful errors at runtime
        throw new Error(
          'Supabase environment variables are not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your environment.'
        );
      }

      _supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
        },
        global: {
          headers: { 'X-Client-Info': 'job-ops-os/0.2.0' },
        },
      });
    }
    return (_supabase as any)[prop];
  },
});