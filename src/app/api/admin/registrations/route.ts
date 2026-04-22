import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, checkAdmin } from '@/lib';

export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/admin/registrations:
 *   get:
 *     summary: Fetch registrations for an event (Admin only)
 *     tags: [Admin Registrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of registrations
 *       401:
 *         description: Unauthorized
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await checkAdmin(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    const { user, profile } = auth;

    // Verify event ownership
    if (profile.role !== 'superadmin') {
      const { data: event, error: eventError } = await supabaseAdmin!
        .from('events')
        .select('manager_id')
        .eq('id', eventId)
        .single();
      
      if (eventError || !event || event.manager_id !== user.id) {
        return NextResponse.json({ error: 'Forbidden: You do not have access to this event' }, { status: 403 });
      }
    }

    // Fetch registrations with relations
    const { data: registrations, error } = await supabaseAdmin!
      .from('registrations')
      .select(`
        *,
        category:categories(name),
        stage:registration_stages(name),
        payment:payments(*)
      `)
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ registrations });

  } catch (err) {
    console.error('Error in GET /api/admin/registrations:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
