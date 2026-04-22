import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, checkAdmin } from '@/lib';

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

    const { registrationId, status } = await request.json();

    if (!registrationId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin!
      .from('registrations')
      .update({ status })
      .eq('id', registrationId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ registration: data });

  } catch (err) {
    console.error('Error in PATCH /api/admin/registrations/status:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
