import { NextRequest } from 'next/server';
import { supabase, supabaseAdmin } from './supabase';

/**
 * Helper to check if the current user is an admin or superadmin
 */
export async function checkAdmin(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Missing or invalid authorization header', status: 401 };
  }

  const token = authHeader.split(' ')[1];
  const { data: { user }, error: authError } = await supabase!.auth.getUser(token);

  if (authError || !user) {
    return { error: 'Unauthorized', status: 401 };
  }

  // Check role in managers table using admin client (bypassing RLS)
  const { data: profile, error: profileError } = await supabaseAdmin!
    .from('managers')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile || (profile.role !== 'admin' && profile.role !== 'superadmin')) {
    return { error: 'Forbidden: Admin access required', status: 403 };
  }

  return { user, profile };
}

/**
 * Helper to check if the current user is a superadmin
 */
export async function checkSuperadmin(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Missing or invalid authorization header', status: 401 };
  }

  const token = authHeader.split(' ')[1];
  const { data: { user }, error: authError } = await supabase!.auth.getUser(token);

  if (authError || !user) {
    return { error: 'Unauthorized', status: 401 };
  }

  // Check role in managers table using admin client (bypassing RLS)
  const { data: profile, error: profileError } = await supabaseAdmin!
    .from('managers')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile || profile.role !== 'superadmin') {
    return { error: 'Forbidden: Superadmin access required', status: 403 };
  }

  return { user, profile };
}
