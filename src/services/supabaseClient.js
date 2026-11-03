import { createClient } from '@supabase/supabase-js';

// Retrieve credentials from environment variables (or fallbacks)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

// Detect if valid  user credentials are plugged in
export const isSupabaseConfigured = () => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    !supabaseUrl.includes('your-project-id') &&
    !supabaseAnonKey.includes('your-supabase-anon-key')
  );
};

// Safe fallback client instance to prevent crashes if credentials are not yet pasted
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    })
  : null;

// Return connection status and diagnostic telemetry
export const getSupabaseStatus = () => {
  const configured = isSupabaseConfigured();
  return {
    isConfigured: configured,
    mode: configured ? 'Supabase PostgreSQL Cloud (Live)' : 'Local Persistent Database (Hackathon Vault)',
    url: configured ? supabaseUrl : 'Local Encrypted Storage',
    tables: ['profiles', 'emergency_contacts', 'sos_incidents', 'solo_trips', 'vehicle_scans', 'awareness_posts'],
    statusText: configured ? '🟢 Cloud Connected' : '💾 Persistent Vault Active'
  };
};

export default supabase;
