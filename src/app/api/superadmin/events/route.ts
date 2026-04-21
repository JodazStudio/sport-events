import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, supabase } from '@/lib';

export const dynamic = 'force-dynamic';

/**
 * Helper to check if the current user is a superadmin
 */
async function checkSuperadmin(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Missing or invalid authorization header', status: 401 };
  }

  const token = authHeader.split(' ')[1];
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return { error: 'Unauthorized', status: 401 };
  }

  // Check role in managers table using admin client (bypassing RLS)
  const { data: profile, error: profileError } = await supabaseAdmin!
    .from('managers')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || profile?.role !== 'superadmin') {
    return { error: 'Forbidden: Superadmin access required', status: 403 };
  }

  return { user };
}

/**
 * GET: Fetch all events with their organizers, and a list of all managers.
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await checkSuperadmin(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // 1. Fetch all events with manager details
    const { data: events, error: eventsError } = await supabaseAdmin!
      .from('events')
      .select('*, managers(name, email)')
      .order('created_at', { ascending: false });

    if (eventsError) throw eventsError;

    // 2. Fetch all managers for the assignment dropdown
    const { data: managers, error: managersError } = await supabaseAdmin!
      .from('managers')
      .select('id, name, email')
      .order('name', { ascending: true });

    if (managersError) throw managersError;

    return NextResponse.json({
      events,
      managers
    });

  } catch (err) {
    console.error('Error in GET /api/superadmin/events:', err);
    return NextResponse.json({
      error: 'Internal Server Error',
      details: err instanceof Error ? err.message : String(err)
    }, { status: 500 });
  }
}

/**
 * POST: Provision a new event.
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await checkSuperadmin(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const { manager_id, name, slug, event_date, event_time } = body;

    if (!manager_id || !name || !slug || !event_date || !event_time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin!
      .from('events')
      .insert([
        {
          manager_id,
          name,
          slug,
          event_date,
          event_time,
          // Genesis defaults
          has_inventory: false,
          description: '',
          rules_text: ''
        }
      ])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'The event slug is already in use' }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json(data, { status: 201 });

  } catch (err) {
    console.error('Error in POST /api/superadmin/events:', err);
    return NextResponse.json({
      error: 'Internal Server Error',
      details: err instanceof Error ? err.message : String(err)
    }, { status: 500 });
  }
}

/**
 * PATCH: Override event settings.
 */
export async function PATCH(request: NextRequest) {
  try {
    const auth = await checkSuperadmin(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin!
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'The event slug is already in use' }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json(data);

  } catch (err) {
    console.error('Error in PATCH /api/superadmin/events:', err);
    return NextResponse.json({
      error: 'Internal Server Error',
      details: err instanceof Error ? err.message : String(err)
    }, { status: 500 });
  }
}

/**
 * DELETE: Delete an event.
 */
export async function DELETE(request: NextRequest) {
  try {
    const auth = await checkSuperadmin(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin!
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Event deleted successfully' });

  } catch (err) {
    console.error('Error in DELETE /api/superadmin/events:', err);
    return NextResponse.json({
      error: 'Internal Server Error',
      details: err instanceof Error ? err.message : String(err)
    }, { status: 500 });
  }
}
