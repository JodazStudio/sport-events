import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib';
import { registrationSchema } from '@/features/events/schemas';

/**
 * @swagger
 * /api/registrations:
 *   post:
 *     summary: Register an athlete for an event
 *     description: Creates a new registration and calculates the category based on birth date and gender.
 *     tags: [Registrations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [event_id, stage_id, first_name, last_name, dni, email, birth_date, gender]
 *             properties:
 *               event_id: { type: string }
 *               stage_id: { type: string }
 *               first_name: { type: string }
 *               last_name: { type: string }
 *               dni: { type: string }
 *               email: { type: string, format: email }
 *               birth_date: { type: string, format: date }
 *               gender: { type: string, enum: [MALE, FEMALE, MIXED] }
 *               shirt_size: { type: string }
 *               payment_data:
 *                 type: object
 *                 properties:
 *                   reference_number: { type: string }
 *                   amount_usd: { type: number }
 *                   amount_ves: { type: number }
 *                   exchange_rate_bcv: { type: number }
 *                   receipt_url: { type: string }
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Validation failed or no suitable category found
 *       500:
 *         description: Server error
 */
export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase Admin client not configured' }, { status: 500 });
    }

    const body = await request.json();
    
    // 1. Validate with Zod
    const result = registrationSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: result.error.issues 
      }, { status: 400 });
    }

    const {
      event_id,
      stage_id,
      first_name,
      last_name,
      dni,
      email,
      birth_date,
      gender,
      shirt_size,
      payment_data
    } = result.data;

    // 2. Calculate Category automatically
    // Using Age at End of Year (Standard for most races)
    const birthDate = new Date(birth_date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();

    const { data: category, error: categoryError } = await supabaseAdmin
      .from('categories')
      .select('id')
      .eq('event_id', event_id)
      .eq('gender', gender)
      .lte('min_age', age)
      .gte('max_age', age)
      .single();

    if (categoryError || !category) {
      return NextResponse.json({ 
        error: 'No suitable category found for your age and gender.' 
      }, { status: 400 });
    }

    // 3. Set Expiration: Today at 23:59:59
    const expiresAt = new Date();
    expiresAt.setHours(23, 59, 59, 999);

    // 4. Call Atomic Postgres Function (RPC)
    const { data: registrationId, error: rpcError } = await supabaseAdmin
      .rpc('register_athlete', {
        p_event_id: event_id,
        p_stage_id: stage_id,
        p_category_id: category.id,
        p_first_name: first_name,
        p_last_name: last_name,
        p_dni: dni,
        p_email: email,
        p_birth_date: birth_date,
        p_gender: gender,
        p_shirt_size: shirt_size,
        p_status: payment_data ? 'REPORTED' : 'PENDING',
        p_expires_at: expiresAt.toISOString(),
        p_payment_data: payment_data || null
      });

    if (rpcError) {
      console.error('Error in register_athlete RPC:', rpcError);
      return NextResponse.json({ 
        error: rpcError.message || 'Failed to process registration' 
      }, { status: 400 });
    }

    // --- TELEGRAM NOTIFICATION ---
    // We do this asynchronously to avoid blocking the response
    (async () => {
      try {
        // 1. Get event and manager info
        const { data: eventData } = await supabaseAdmin
          .from('events')
          .select('name, manager_id, managers(telegram_chat_id, telegram_notifications_enabled)')
          .eq('id', event_id)
          .single();

        const manager = eventData?.managers as any;

        if (manager?.telegram_chat_id && manager?.telegram_notifications_enabled) {
          const { sendTelegramNotification, formatRegistrationAlert } = await import('@/lib/telegram');
          
          // Get category name for better alert
          const { data: catData } = await supabaseAdmin
            .from('categories')
            .select('name')
            .eq('id', category.id)
            .single();

          const message = formatRegistrationAlert({
            eventName: eventData?.name || 'Evento',
            athleteName: `${first_name} ${last_name}`,
            categoryName: catData?.name || 'N/A',
            amount: payment_data ? `${payment_data.amount_usd} USD` : 'Pendiente'
          });

          await sendTelegramNotification(manager.telegram_chat_id, message);
        }
      } catch (tgError) {
        console.error('Failed to send Telegram notification:', tgError);
      }
    })();

    return NextResponse.json({
      registration_id: registrationId
    }, { status: 201 });

  } catch (err) {
    console.error('Unexpected error in POST /api/registrations:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
