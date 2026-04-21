import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib';

export const dynamic = 'force-dynamic';

/**
 * GET: Fetch events for the logged-in manager or a specific event by slug/id.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const id = searchParams.get('id');

    const authHeader = request.headers.get('Authorization');
    let userId: string | null = null;
    let isSuperadmin = false;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;

      if (userId) {
        const { data: profile } = await supabaseAdmin!
          .from('managers')
          .select('role')
          .eq('id', userId)
          .single();
        isSuperadmin = profile?.role === 'superadmin';
      }
    }

    // Use Admin client for slug/id lookups to ensure public visibility bypassing RLS if needed
    // or if the user is a superadmin.
    const client = (slug || id || isSuperadmin) ? supabaseAdmin! : supabase;
    let query = client.from('events').select('*, categories(*), registration_stages(*)');

    if (id) {
      query = query.eq('id', id);
    } else if (slug) {
      query = query.eq('slug', slug);
    } else if (userId) {
      // Superadmins can see everything in their global view, but regular admins see only their own.
      // If we are in the regular events endpoint and not superadmin, filter by manager_id.
      if (!isSuperadmin) {
        query = query.eq('manager_id', userId);
      }
    }

    if (id || slug) {
      const { data, error } = await query.single();
      if (error) {
        if (error.code === 'PGRST116') return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        throw error;
      }
      return NextResponse.json({ status: 'success', data });
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;

    return NextResponse.json({ status: 'success', data });

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
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid authorization header' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      name, 
      slug, 
      description, 
      event_date, 
      event_time, 
      rules_text, 
      has_inventory, 
      banner_url, 
      route_image_url, 
      strava_url 
    } = body;

    if (!name || !slug || !event_date || !event_time) {
      return NextResponse.json({ error: 'Name, slug, date, and time are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('events')
      .insert([
        {
          name,
          slug,
          description,
          event_date,
          event_time,
          rules_text,
          has_inventory: !!has_inventory,
          banner_url,
          route_image_url,
          strava_url,
          manager_id: user.id
        }
      ])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') return NextResponse.json({ error: 'The event slug is already in use' }, { status: 400 });
      throw error;
    }

    return NextResponse.json({ status: 'success', data }, { status: 201 });

  } catch (err) {
    console.error('Error creating event:', err);
    return NextResponse.json({ status: 'error', message: 'Failed to create event' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid authorization header' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is superadmin
    let isSuperadmin = false;
    const { data: profile } = await supabaseAdmin!
      .from('managers')
      .select('role')
      .eq('id', user.id)
      .single();
    isSuperadmin = profile?.role === 'superadmin';

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });

    const client = isSuperadmin ? supabaseAdmin! : supabase;
    let query = client.from('events').update(updates).eq('id', id);

    // If not superadmin, ensure they own the event
    if (!isSuperadmin) {
      query = query.eq('manager_id', user.id);
    }

    const { data, error } = await query.select().single();

    if (error) {
      if (error.code === '23505') return NextResponse.json({ error: 'The event slug is already in use' }, { status: 400 });
      throw error;
    }

    return NextResponse.json({ status: 'success', data });

  } catch (err) {
    console.error('Error updating event:', err);
    return NextResponse.json({ status: 'error', message: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid authorization header' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
      .eq('manager_id', user.id); // Regular managers can only delete their own

    if (error) throw error;

    return NextResponse.json({ status: 'success', message: 'Event deleted' });

  } catch (err) {
    console.error('Error deleting event:', err);
    return NextResponse.json({ status: 'error', message: 'Failed to delete event' }, { status: 500 });
  }
}
