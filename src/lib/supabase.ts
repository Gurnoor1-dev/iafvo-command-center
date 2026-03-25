import { createClient } from '@supabase/supabase-js';

// It is best practice to use environment variables for these.
// If you are using Vite, they should be in a .env file as:
// VITE_SUPABASE_URL=your_url
// VITE_SUPABASE_ANON_KEY=your_key

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials are missing. Check your .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
