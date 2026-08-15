import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const configuredUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const configuredKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

export const isSupabaseConfigured = Boolean(configuredUrl && configuredKey);

const SUPABASE_URL = configuredUrl || "https://supabase.invalid";
const SUPABASE_PUBLISHABLE_KEY = configuredKey || "public-preview-disabled";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: typeof window !== "undefined" ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  }
});
