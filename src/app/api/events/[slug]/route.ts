import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib';

export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/events/{slug}:
 *   get:
 *     summary: Fetch public event details by slug
 *     description: Returns event information and the currently active registration stage.
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique slug of the event
 *     responses:
 *       200:
 *         description: Event details and active stage
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

    // 1. Fetch event details
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*, categories(*), registration_stages(*)')
      .eq('slug', slug)
      .single();

    if (eventError || !event) {
      console.error('Error fetching event:', eventError);
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // 2. Fetch the active registration stage for this event
    const { data: activeStage, error: stageError } = await supabase
      .from('registration_stages')
      .select('id, name, price_usd, total_capacity, used_capacity')
      .eq('event_id', event.id)
      .eq('is_active', true)
      .single();

    if (stageError) {
      // It's possible there is no active stage, we should still return the event
      // but maybe indicate that registration is not available
      return NextResponse.json({
        event,
        activeStage: null,
        message: 'No active registration stages available for this event.'
      });
    }

    return NextResponse.json({
      event,
      activeStage
    });

  } catch (err) {
    console.error('Unexpected error in GET /api/events/[slug]:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
