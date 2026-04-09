import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Ensure the route is always treated as dynamic and not pre-rendered
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check if client is initialized
    if (!supabase) {
      return NextResponse.json({
        status: 'warn',
        message: 'Supabase client is not configured (keys are missing or placeholders)',
        connectivity: 'unconfigured'
      });
    }

    // A simple query to check connectivity
    const { error } = await supabase.from('_health').select('*').limit(1);

    return NextResponse.json({
      status: 'ok',
      message: 'Supabase client initialized',
      connectivity: error ? 'no-db (expected if table missing)' : 'connected',
      details: error ? error.message : 'Successfully reached Supabase'
    });
  } catch (err) {
    return NextResponse.json({
      status: 'error',
      message: 'Unexpected error during health check',
      error: err instanceof Error ? err.message : String(err)
    }, { status: 500 });
  }
}
