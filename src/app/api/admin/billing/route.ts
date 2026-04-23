import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib';
import { checkAdmin } from '@/lib/auth-api';

export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/admin/billing:
 *   get:
 *     summary: Calculate billing for an event
 *     description: Sums all service fees for APPROVED registrations in the current stage or event.
 *     tags: [Admin, Billing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: event_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: stage_id
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Billing calculation successful
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await checkAdmin(request);
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const { user, profile } = authResult;

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('event_id');
    const stageId = searchParams.get('stage_id');

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    // Check ownership if not superadmin
    if (profile.role !== 'superadmin') {
      const { data: event } = await supabaseAdmin!
        .from('events')
        .select('manager_id')
        .eq('id', eventId)
        .single();
      
      if (!event || event.manager_id !== user.id) {
        return NextResponse.json({ error: 'Forbidden: You do not own this event' }, { status: 403 });
      }
    }

    // 1. Fetch registrations for the stage with status APPROVED
    // Note: We join with registration_stages to get the service_fee
    let query = supabaseAdmin!
      .from('registrations')
      .select('id, stage_id, registration_stages(name, service_fee)')
      .eq('event_id', eventId)
      .eq('status', 'APPROVED');

    if (stageId) {
      query = query.eq('stage_id', stageId);
    }

    const { data: registrations, error } = await query;

    if (error) {
      console.error('Error fetching registrations for billing:', error);
      throw error;
    }

    // 2. Calculate total service fee
    let totalServiceFee = 0;
    const stageBreakdown: Record<string, { name: string; count: number; fee: number; total: number }> = {};

    registrations?.forEach((reg: any) => {
      // Supabase returns registration_stages as an object or array depending on relation
      const stage = reg.registration_stages;
      const fee = stage?.service_fee || 0;
      const stageName = stage?.name || 'Unknown';
      totalServiceFee += Number(fee);

      if (!stageBreakdown[reg.stage_id]) {
        stageBreakdown[reg.stage_id] = { name: stageName, count: 0, fee: Number(fee), total: 0 };
      }
      stageBreakdown[reg.stage_id].count++;
      stageBreakdown[reg.stage_id].total += Number(fee);
    });

    return NextResponse.json({
      status: 'success',
      data: {
        total_debt: totalServiceFee,
        registration_count: registrations?.length || 0,
        breakdown: Object.values(stageBreakdown)
      }
    });

  } catch (err) {
    console.error('Error calculating billing:', err);
    return NextResponse.json({ 
      status: 'error', 
      message: 'Failed to calculate billing',
      details: err instanceof Error ? err.message : String(err)
    }, { status: 500 });
  }
}
