import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, checkAdmin } from '@/lib';
import { registrationService } from '@/features/events/registrationService';

/**
 * @swagger
 * /api/admin/registrations/status:
 *   patch:
 *     summary: Update registration status (Admin only)
 *     tags: [Admin Registrations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [registrationId, status]
 *             properties:
 *               registrationId: { type: string }
 *               status: { type: string, enum: [PENDING, REPORTED, APPROVED, REJECTED, EXPIRED] }
 *     responses:
 *       200:
 *         description: Status updated
 */
export async function PATCH(request: NextRequest) {
  try {
    const auth = await checkAdmin(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { registrationId, status, reason } = await request.json();

    if (!registrationId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { user, profile } = auth;

    // Verify ownership
    if (profile.role !== 'superadmin') {
      const { data: registration, error: regError } = await supabaseAdmin!
        .from('registrations')
        .select('event_id, events(manager_id)')
        .eq('id', registrationId)
        .single();
      
      const event = registration?.events as any;
      if (regError || !registration || event?.manager_id !== user.id) {
        return NextResponse.json({ error: 'Forbidden: You do not have access to this registration' }, { status: 403 });
      }
    }

    const registration = await registrationService.updateRegistrationStatus(registrationId, status, reason);

    return NextResponse.json({ registration });

  } catch (err) {
    console.error('Error in PATCH /api/admin/registrations/status:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
