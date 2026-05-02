import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib';

export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Fetch events list or a single event
 *     description: |
 *       - Anonymous: Returns all events (public list).
 *       - Authenticated Manager: Returns events they manage.
 *       - Superadmin: Returns all events.
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: slug
 *         schema:
 *           type: string
 *         description: Filter by event slug
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: Filter by event id
 *     responses:
 *       200:
 *         description: A list of events or a single event object
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const id = searchParams.get('id');
    const search = searchParams.get('search');
    const city = searchParams.get('city');
    const onlyFilled = searchParams.get('only_filled') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

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

    // Use Admin client for:
    // 1. Slug/ID lookups (publicly visible details)
    // 2. Superadmin access (view all)
    // 3. Anonymous list requests (for the landing page)
    const client = (slug || id || isSuperadmin || !userId) ? supabaseAdmin! : supabase;
    
    // For list requests, we need the count
    const isList = !slug && !id;
    let query = client.from('events').select('*, categories(*), registration_stages(*)', isList ? { count: 'exact' } : {});
    if (id) {
      query = query.eq('id', id);
    } else if (slug) {
      query = query.eq('slug', slug);
    } else {
      // Filters for list
      if (userId && !isSuperadmin) {
        query = query.eq('manager_id', userId);
      }
      if (search) {
        query = query.ilike('name', `%${search}%`);
      }
      if (city) {
        query = query.ilike('city', `%${city}%`);
      }
      if (onlyFilled) {
        query = query.not('organization', 'is', null).neq('organization->>name', '');
      }
    }

    if (id || slug) {
      const { data, error } = await query.maybeSingle();
      if (error) throw error;
      
      if (!data) {
        return NextResponse.json({ 
          status: 'error', 
          message: 'Event not found' 
        }, { status: 404 });
      }
      
      return NextResponse.json({ status: 'success', data });
    }

    // Pagination for list
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    const { data, error, count } = await query
      .order('event_date', { ascending: false })
      .range(from, to);

      if (error) throw error;

    return NextResponse.json({ 
      status: 'success', 
      data,
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: count ? Math.ceil(count / limit) : 0
      }
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

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create a new event
 *     description: Restricted to authenticated managers.
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, slug, event_date, event_time]
 *             properties:
 *               name: { type: string }
 *               slug: { type: string }
 *               description: { type: string }
 *               event_date: { type: string, format: date }
 *               event_time: { type: string }
 *               rules_text: { type: string }
 *               has_inventory: { type: boolean }
 *               banner_url: { type: string }
 *               route_image_url: { type: string }
 *               strava_url: { type: string }
 *               social_media: { type: object }
 *     responses:
 *       201:
 *         description: Event created successfully
 *       400:
 *         description: Missing required fields or slug in use
 *       401:
 *         description: Unauthorized
 */
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
      city,
      rules_text, 
      has_inventory, 
      logo_url,
      banner_url,
      route_image_url, 
      strava_url,
      social_media,
      organization,
      payment_info
    } = body;

    if (!name || !slug || !event_date || !event_time || !city) {
      return NextResponse.json({ error: 'Name, slug, date, time, and city are required' }, { status: 400 });
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
          city,
          rules_text,
          has_inventory: !!has_inventory,
          logo_url,
          banner_url,
          route_image_url,
          strava_url,
          social_media: social_media || {},
          organization: organization || null,
          payment_info: payment_info || {
            bank_name: '',
            bank_code: '',
            account_number: '',
            id_number: '',
            phone_number: '',
          },
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

/**
 * @swagger
 * /api/events:
 *   put:
 *     summary: Update an existing event
 *     description: Managers can only update their own events. Superadmins can update any event.
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id]
 *             properties:
 *               id: { type: string }
 *               name: { type: string }
 *               slug: { type: string }
 *               description: { type: string }
 *               event_date: { type: string, format: date }
 *               event_time: { type: string }
 *               rules_text: { type: string }
 *               has_inventory: { type: boolean }
 *               banner_url: { type: string }
 *               route_image_url: { type: string }
 *               strava_url: { type: string }
 *               social_media: { type: object }
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       400:
 *         description: Event ID required or slug in use
 *       401:
 *         description: Unauthorized
 */
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

/**
 * @swagger
 * /api/events:
 *   delete:
 *     summary: Remove an event
 *     description: Managers can only delete their own events. Superadmins can delete any event.
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID to delete
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       400:
 *         description: Event ID required
 *       401:
 *         description: Unauthorized
 */
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

    // Check if user is superadmin
    let isSuperadmin = false;
    const { data: profile } = await supabaseAdmin!
      .from('managers')
      .select('role')
      .eq('id', user.id)
      .single();
    isSuperadmin = profile?.role === 'superadmin';

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });

    const client = isSuperadmin ? supabaseAdmin! : supabase;
    let query = client.from('events').delete().eq('id', id);

    // Regular managers can only delete their own
    if (!isSuperadmin) {
      query = query.eq('manager_id', user.id);
    }

    const { error } = await query;

    if (error) throw error;

    return NextResponse.json({ status: 'success', message: 'Event deleted' });

  } catch (err) {
    console.error('Error deleting event:', err);
    return NextResponse.json({ status: 'error', message: 'Failed to delete event' }, { status: 500 });
  }
}
