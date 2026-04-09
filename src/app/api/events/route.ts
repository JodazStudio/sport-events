import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    let query = supabase.from('events').select('*');

    if (slug) {
      query = query.eq('id', slug).single();
    } else {
      query = query.order('created_at', { ascending: true });
    }

    const { data, error } = await query;

    if (error) {
      // If client is unconfigured or table missing, handle gracefully
      if (error.code === 'PGRST116') { // Not found for single query
        return NextResponse.json({
          status: 'error',
          message: 'Event not found',
        }, { status: 404 });
      }

      throw error;
    }

    return NextResponse.json({
      status: 'success',
      data: data,
    });
  } catch (err) {
    console.error('Error fetching events:', err);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to fetch events',
      details: err instanceof Error ? err.message : String(err)
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  /**
   * Placeholder for event creation logic.
   */
  return NextResponse.json({
    message: "POST Events endpoint not implemented yet.",
  }, { status: 501 });
}
