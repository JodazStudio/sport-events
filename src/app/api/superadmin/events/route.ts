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
 * @swagger
 * /api/superadmin/events:
 *   get:
 *     summary: Fetch all events and managers (Superadmin only)
 *     description: Returns a list of all events with manager details and a list of all managers.
 *     tags: [Superadmin Events]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       403:
 *         description: Forbidden - Superadmin only
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
 * @swagger
 * /api/superadmin/events:
 *   post:
 *     summary: Provision a new event (Superadmin only)
 *     tags: [Superadmin Events]
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
 *               name: { type: string }
 *               slug: { type: string }
 *               event_date: { type: string, format: date }
 *               event_time: { type: string }
 *     responses:
 *       201:
 *         description: Event created
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
 * @swagger
 * /api/superadmin/events:
 *   patch:
 *     summary: Override event settings (Superadmin only)
 *     tags: [Superadmin Events]
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
 *     responses:
 *       200:
 *         description: Event updated
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
 * @swagger
 * /api/superadmin/events:
 *   delete:
 *     summary: Delete an event (Superadmin only)
 *     tags: [Superadmin Events]
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
