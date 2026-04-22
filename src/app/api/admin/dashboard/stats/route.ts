import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, checkAdmin } from '@/lib';

export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/admin/dashboard/stats:
 *   get:
 *     summary: Fetch dashboard statistics (Admin/Superadmin only)
 *     description: Returns different stats based on user role (manager vs superadmin).
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await checkAdmin(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { user, profile } = auth;
    const role = profile.role;

    if (role === 'superadmin') {
      // 1. Total Registrations
      const { count: registrationsCount, error: regError } = await supabaseAdmin!
        .from('registrations')
        .select('*', { count: 'exact', head: true });

      if (regError) throw regError;

      // 2. Total Events
      const { count: eventsCount, error: eventsError } = await supabaseAdmin!
        .from('events')
        .select('*', { count: 'exact', head: true });

      if (eventsError) throw eventsError;

      return NextResponse.json({
        role: 'superadmin',
        stats: {
          registrations_total: registrationsCount || 0,
          events_total: eventsCount || 0,
          sync_status: 'OK',
          logs: [
            { id: 1, time: '12:34 PM', status: 'SUCCESS', message: 'Sistema operativo' },
            { id: 2, time: '11:20 AM', status: 'SUCCESS', message: 'Akomo Sync completado' },
            { id: 3, time: '09:15 AM', status: 'INFO', message: 'Backup diario generado' },
          ]
        }
      });
    } else {
      // Admin stats - Filtered by manager_id
      // 1. Get managed events
      const { data: managedEvents, error: eventsError } = await supabaseAdmin!
        .from('events')
        .select('id, name')
        .eq('manager_id', user.id);

      if (eventsError) throw eventsError;

      const eventIds = managedEvents?.map(e => e.id) || [];

      if (eventIds.length === 0) {
        return NextResponse.json({
          role: 'admin',
          stats: {
            revenue_estimated: 0,
            registrations_total: 0,
            pending_payments: 0,
            current_stage: 'Sin eventos'
          }
        });
      }

      // 2. Total Registrations for these events
      const { count: registrationsCount, error: regError } = await supabaseAdmin!
        .from('registrations')
        .select('*', { count: 'exact', head: true })
        .in('event_id', eventIds);

      if (regError) throw regError;

      // 3. Pending Payments (status = 'REPORTED')
      const { count: pendingCount, error: pendingError } = await supabaseAdmin!
        .from('registrations')
        .select('*', { count: 'exact', head: true })
        .in('event_id', eventIds)
        .eq('status', 'REPORTED');

      if (pendingError) throw pendingError;

      // 4. Revenue Estimated (Sum of stage prices for APPROVED registrations)
      const { data: approvedRegs, error: revError } = await supabaseAdmin!
        .from('registrations')
        .select('registration_stages(price_usd)')
        .in('event_id', eventIds)
        .eq('status', 'APPROVED');

      if (revError) throw revError;

      const revenue = approvedRegs?.reduce((sum, reg: any) => {
        return sum + (reg.registration_stages?.price_usd || 0);
      }, 0) || 0;

      // 5. Current Stage (active stage of the most recent event)
      const { data: activeStage, error: stageError } = await supabaseAdmin!
        .from('registration_stages')
        .select('name')
        .in('event_id', eventIds)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Ignore error if no active stage found
      const currentStage = activeStage?.name || 'N/A';

      return NextResponse.json({
        role: 'admin',
        stats: {
          revenue_estimated: revenue,
          registrations_total: registrationsCount || 0,
          pending_payments: pendingCount || 0,
          current_stage: currentStage
        }
      });
    }

  } catch (err) {
    console.error('Error in GET /api/admin/dashboard/stats:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
