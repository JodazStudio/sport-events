import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib';

export const dynamic = 'force-dynamic';

/**
 * Helper to validate manager ownership of an event
 */
async function validateOwnership(request: Request, eventId: string) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return { error: 'Unauthorized', status: 401 };

  const token = authHeader.split(' ')[1];
  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return { error: 'Unauthorized', status: 401 };

  // Check if user is superadmin
  const { data: profile } = await supabaseAdmin!
    .from('managers')
    .select('role')
    .eq('id', user.id)
    .single();
  
  if (profile?.role === 'superadmin') return { user, isSuperadmin: true };

  // Check event ownership
  const { data: event } = await supabaseAdmin!
    .from('events')
    .select('manager_id')
    .eq('id', eventId)
    .single();

  if (!event || event.manager_id !== user.id) {
    return { error: 'Forbidden', status: 403 };
  }

  return { user, isSuperadmin: false };
}

/**
 * @swagger
 * /api/stages:
 *   get:
 *     summary: Fetch registration stages for an event
 *     tags: [Stages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: event_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of stages
 *   post:
 *     summary: Create a new registration stage
 *     tags: [Stages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [event_id, name, price_usd, total_capacity]
 *             properties:
 *               event_id: { type: string }
 *               name: { type: string }
 *               price_usd: { type: number }
 *               total_capacity: { type: number }
 *               is_active: { type: boolean }
 *     responses:
 *       201:
 *         description: Stage created
 *   put:
 *     summary: Update a registration stage
 *     tags: [Stages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id, event_id]
 *             properties:
 *               id: { type: string }
 *               event_id: { type: string }
 *               name: { type: string }
 *               price_usd: { type: number }
 *               total_capacity: { type: number }
 *               is_active: { type: boolean }
 *     responses:
 *       200:
 *         description: Stage updated
 *   delete:
 *     summary: Delete a registration stage
 *     tags: [Stages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: event_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Stage deleted
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('event_id');

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    const { error: authError, status } = await validateOwnership(request, eventId);
    if (authError) return NextResponse.json({ error: authError }, { status });

    const { data, error } = await supabaseAdmin!
      .from('registration_stages')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ status: 'success', data });

  } catch (err) {
    console.error('Error fetching stages:', err);
    return NextResponse.json({ 
      status: 'error', 
      message: 'Failed to fetch stages' 
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event_id, name, price_usd, total_capacity, is_active } = body;

    if (!event_id || !name || price_usd === undefined || total_capacity === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { error: authError, status } = await validateOwnership(request, event_id);
    if (authError) return NextResponse.json({ error: authError }, { status });

    const { data, error } = await supabaseAdmin!
      .from('registration_stages')
      .insert([
        { event_id, name, price_usd, total_capacity, is_active: !!is_active }
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ status: 'success', data }, { status: 201 });

  } catch (err) {
    console.error('Error creating stage:', err);
    return NextResponse.json({ 
      status: 'error', 
      message: 'Failed to create stage',
      details: err instanceof Error ? err.message : String(err)
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, event_id, name, price_usd, total_capacity, is_active } = body;

    if (!id || !event_id) return NextResponse.json({ error: 'Stage ID and Event ID are required' }, { status: 400 });

    const { error: authError, status } = await validateOwnership(request, event_id);
    if (authError) return NextResponse.json({ error: authError }, { status });

    if (is_active) {
      const { data: stages } = await supabaseAdmin!
        .from('registration_stages')
        .select('*')
        .eq('event_id', event_id)
        .order('created_at', { ascending: true });

      if (stages && stages.length > 0) {
        const currentIndex = stages.findIndex(s => s.id === id);
        if (currentIndex > 0) {
          const previousStage = stages[currentIndex - 1];
          if (previousStage.balance_status !== 'PAID') {
            return NextResponse.json({ 
              status: 'error', 
              message: `No se puede activar esta etapa. La etapa anterior (${previousStage.name}) aún tiene un balance pendiente.` 
            }, { status: 400 });
          }
        }
      }
    }

    const { data, error } = await supabaseAdmin!
      .from('registration_stages')
      .update({ name, price_usd, total_capacity, is_active })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ status: 'success', data });

  } catch (err) {
    console.error('Error updating stage:', err);
    return NextResponse.json({ 
      status: 'error', 
      message: 'Failed to update stage',
      details: err instanceof Error ? err.message : String(err)
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const event_id = searchParams.get('event_id');

    if (!id || !event_id) return NextResponse.json({ error: 'Stage ID and Event ID are required' }, { status: 400 });

    const { error: authError, status } = await validateOwnership(request, event_id);
    if (authError) return NextResponse.json({ error: authError }, { status });

    const { error } = await supabaseAdmin!
      .from('registration_stages')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ status: 'success', message: 'Stage deleted' });

  } catch (err) {
    console.error('Error deleting stage:', err);
    return NextResponse.json({ status: 'error', message: 'Failed to delete stage' }, { status: 500 });
  }
}
