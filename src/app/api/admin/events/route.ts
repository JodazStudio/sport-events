import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, checkAdmin, checkSuperadmin } from '@/lib';

export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/admin/events:
 *   get:
 *     summary: Fetch all events and managers (Admin only)
 *     description: Returns a list of all events with manager details and a list of all managers.
 *     tags: [Admin Events]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       403:
 *         description: Forbidden - Admin only
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await checkAdmin(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { user, profile } = auth;

    // 1. Fetch events
    let eventsQuery = supabaseAdmin!
      .from('events')
      .select('*, managers(name, email)')
      .order('created_at', { ascending: false });

    // Filter by manager if not superadmin
    if (profile.role !== 'superadmin') {
      eventsQuery = eventsQuery.eq('manager_id', user.id);
    }

    const { data: events, error: eventsError } = await eventsQuery;

    if (eventsError) throw eventsError;

    // 2. Fetch managers (only for superadmins to see all, or just the current manager)
    let managersQuery = supabaseAdmin!
      .from('managers')
      .select('id, name, email')
      .order('name', { ascending: true });

    if (profile.role !== 'superadmin') {
      managersQuery = managersQuery.eq('id', user.id);
    }

    const { data: managers, error: managersError } = await managersQuery;

    if (managersError) throw managersError;

    return NextResponse.json({
      events,
      managers
    });

  } catch (err) {
    console.error('Error in GET /api/admin/events:', err);
    return NextResponse.json({
      error: 'Internal Server Error',
      details: err instanceof Error ? err.message : String(err)
    }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/admin/events:
 *   post:
 *     summary: Provision a new event (Admin only)
 *     tags: [Admin Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [manager_id, name, slug, event_date, event_time]
 *             properties:
 *               manager_id: { type: string }
 *               slug: { type: string }
 *               description: { type: string }
 *               social_media: { type: object }
 *               event_date: { type: string, format: date }

 *               event_time: { type: string }
 *     responses:
 *       201:
 *         description: Event created
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await checkAdmin(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { user, profile } = auth;

    const body = await request.json();
    const { 
      manager_id: providedManagerId, 
      name, 
      slug, 
      event_date, 
      event_time, 
      city,
      description, 
      social_media,
      logo_url,
      banner_url,
      route_image_url,
      route_description,
      strava_url,
      rules_text,
      has_inventory,
      organization,
      payment_info
    } = body;

    // Regular managers can only create events for themselves
    const manager_id = profile.role === 'superadmin' ? (providedManagerId || user.id) : user.id;

    if (!name || !slug || !event_date || !event_time || !city) {
      return NextResponse.json({ error: 'Missing required fields (name, slug, date, time, city)' }, { status: 400 });
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
          city,
          description: description || '',
          social_media: social_media || {},
          logo_url: logo_url || '',
          banner_url: banner_url || '',
          route_image_url: route_image_url || '',
          route_description: route_description || '',
          strava_url: strava_url || '',
          rules_text: rules_text || '',
          has_inventory: !!has_inventory,
          organization: organization || null,
          payment_info: payment_info || {
            bank_name: '',
            bank_code: '',
            account_number: '',
            id_number: '',
            phone_number: '',
          }
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
    console.error('Error in POST /api/admin/events:', err);
    return NextResponse.json({
      error: 'Internal Server Error',
      details: err instanceof Error ? err.message : String(err)
    }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/admin/events:
 *   patch:
 *     summary: Override event settings (Admin only)
 *     tags: [Admin Events]
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
 *               manager_id: { type: string }
 *               name: { type: string }
 *               slug: { type: string }
 *               description: { type: string }
 *               social_media: { type: object }
 *     responses:
 *       200:
 *         description: Event updated
 */
export async function PATCH(request: NextRequest) {
  try {
    const auth = await checkAdmin(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { user, profile } = auth;

    const body = await request.json();
    const { id, ...bodyUpdates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    // Filter allowed fields to avoid errors with non-existent columns (like 'managers' or 'id')
    const allowedFields = [
      'manager_id', 'name', 'slug', 'description', 'banner_url', 'logo_url', 
      'city', 'has_inventory', 'rules_text', 'route_image_url', 'route_description', 'strava_url', 
      'social_media', 'payment_info', 'event_date', 'event_time', 'is_active', 'organization'
    ];

    const updates: any = {};
    allowedFields.forEach(field => {
      if (field in bodyUpdates) {
        updates[field] = bodyUpdates[field];
      }
    });

    let updateQuery = supabaseAdmin!
      .from('events')
      .update(updates)
      .eq('id', id);

    if (profile.role !== 'superadmin') {
      updateQuery = updateQuery.eq('manager_id', user.id);
    }

    const { data, error } = await updateQuery.select().single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'The event slug is already in use' }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json(data);

  } catch (err) {
    console.error('Error in PATCH /api/admin/events:', err);
    return NextResponse.json({
      error: 'Internal Server Error',
      details: err instanceof Error ? err.message : String(err)
    }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/admin/events:
 *   delete:
 *     summary: Delete an event (Admin only)
 *     tags: [Admin Events]
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
 *         description: Event deleted
 */
export async function DELETE(request: NextRequest) {
  try {
    const auth = await checkAdmin(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { user, profile } = auth;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    let deleteQuery = supabaseAdmin!
      .from('events')
      .delete()
      .eq('id', id);

    if (profile.role !== 'superadmin') {
      deleteQuery = deleteQuery.eq('manager_id', user.id);
    }

    const { error } = await deleteQuery;

    if (error) throw error;

    return NextResponse.json({ message: 'Event deleted successfully' });

  } catch (err) {
    console.error('Error in DELETE /api/admin/events:', err);
    return NextResponse.json({
      error: 'Internal Server Error',
      details: err instanceof Error ? err.message : String(err)
    }, { status: 500 });
  }
}
