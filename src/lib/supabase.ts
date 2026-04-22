import { createClient } from '@supabase/supabase-js';
import { env } from './env';

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY || '';

// Validate configuration
const isConfigured = supabaseUrl && supabaseUrl !== 'your-project-url.supabase.co' && supabaseAnonKey !== 'your-anon-key';

/**
 * Standard client for use in the browser or basic server operations.
 */
export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any); // Fallback to null (cast to any for easier usage with optional chaining)

/**
 * Admin client for use in API routes and server-side operations.
 */
export const supabaseAdmin = (isConfigured && supabaseServiceRoleKey && supabaseServiceRoleKey !== 'your-service-role-key')
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null;

/**
 * Helper to get the appropriate client based on the environment.
 */
export const getSupabaseClient = (useServiceRole = false) => {
  const client = useServiceRole ? supabaseAdmin : supabase;
  if (!client) {
    if (useServiceRole && !supabaseServiceRoleKey) {
      throw new Error('Supabase Service Role Key is missing.');
    }
    throw new Error('Supabase client is not configured. Please check your environment variables.');
  }
  return client;
};
