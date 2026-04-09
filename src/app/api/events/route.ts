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

    // Basic server-side validation
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
      if (error.code === '23505') { // Unique constraint for slug
        return NextResponse.json({ error: 'The event slug is already in use' }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json({
      status: 'success',
      data: data
    }, { status: 201 });

  } catch (err) {
    console.error('Error creating event:', err);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to create event',
      details: err instanceof Error ? err.message : String(err)
    }, { status: 500 });
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

    const body = await request.json();
    const { 
      id,
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

    if (!id) {
      return NextResponse.json({ error: 'Event ID is required for updates' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('events')
      .update({
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
      })
      .eq('id', id)
      .eq('manager_id', user.id) // Ensure security
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'The event slug is already in use' }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json({
      status: 'success',
      data: data
    });

  } catch (err) {
    console.error('Error updating event:', err);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to update event',
      details: err instanceof Error ? err.message : String(err)
    }, { status: 500 });
  }
}
