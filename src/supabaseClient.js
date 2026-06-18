import { createClient } from '@supabase/supabase-js';

// Retrieve keys from Vite environment variables (.env file)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are set
const isConfigured = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'YOUR_SUPABASE_URL');

if (!isConfigured) {
  console.warn(
    "OmniInbox: Supabase is not configured. Please create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable live feeds. Falling back to frontend mock data."
  );
}

// Export the client and configuration status
export const supabase = isConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;
export const supabaseConfigured = isConfigured;
