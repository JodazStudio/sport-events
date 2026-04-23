import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib';
import { checkSuperadmin } from '@/lib/auth-api';

export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/superadmin/billing:
 *   get:
 *     summary: Fetch global billing data for all stages
 *     tags: [SuperAdmin, Billing]
 *     security:
 *       - bearerAuth: []
 *   patch:
 *     summary: Mark a stage as settled
 *     tags: [SuperAdmin, Billing]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [stage_id]
 *             properties:
 *               stage_id: { type: string }
 */

export async function GET(request: NextRequest) {
  try {
    const authResult = await checkSuperadmin(request);
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    // Fetch all stages joined with events and managers
    const { data: stages, error: stagesError } = await supabaseAdmin!
      .from('registration_stages')
      .select(`
        *,
        events (
          name,
          slug,
          manager_id,
          managers (
            name,
            email
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (stagesError) throw stagesError;

    // Enriched data: calculate revenue and commission for each stage
    const enrichedStages = await Promise.all((stages || []).map(async (stage: any) => {
      // Gross Revenue: Sum of amount_ves from all payments where status = 'APPROVED'
      const { data: registrations, error: regError } = await supabaseAdmin!
        .from('registrations')
        .select(`
          id, 
          status,
          payments (
            amount_ves
          )
        `)
        .eq('stage_id', stage.id)
        .eq('status', 'APPROVED');

      if (regError) console.error(`Error fetching registrations for stage ${stage.id}:`, regError);

      let grossRevenueVes = 0;
      let approvedCount = registrations?.length || 0;

      registrations?.forEach((reg: any) => {
        // payments is usually a single object because of 1:1 relation in this schema
        const payment = Array.isArray(reg.payments) ? reg.payments[0] : reg.payments;
        if (payment) {
          grossRevenueVes += Number(payment.amount_ves || 0);
        }
      });

      const platformCommissionUsd = approvedCount * (stage.service_fee || 0);

      return {
        ...stage,
        gross_revenue_ves: grossRevenueVes,
        approved_count: approvedCount,
        platform_commission_usd: platformCommissionUsd,
      };
    }));

    return NextResponse.json({
      status: 'success',
      data: enrichedStages
    });

  } catch (err) {
    console.error('SuperAdmin Billing GET Error:', err);
    return NextResponse.json({ 
      status: 'error', 
      message: 'Failed to fetch billing data',
      details: err instanceof Error ? err.message : String(err)
    }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authResult = await checkSuperadmin(request);
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const body = await request.json();
    const { stage_id } = body;

    if (!stage_id) {
      return NextResponse.json({ error: 'Stage ID is required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin!
      .from('registration_stages')
      .update({ 
        is_settled: true,
        settled_at: new Date().toISOString()
      })
      .eq('id', stage_id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      status: 'success',
      message: 'Stage settled successfully',
      data
    });

  } catch (err) {
    console.error('SuperAdmin Billing PATCH Error:', err);
    return NextResponse.json({ 
      status: 'error', 
      message: 'Failed to settle stage',
      details: err instanceof Error ? err.message : String(err)
    }, { status: 500 });
  }
}
