import { NextRequest, NextResponse } from 'next/server';
import { registrationSchema } from '@/features/events/schemas';
import { registrationService } from '@/features/events/registrationService';

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
    const body = await request.json();
    
    // 1. Validate with Zod
    const result = registrationSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: result.error.issues 
      }, { status: 400 });
    }

    // 2. Process Registration via Service
    const { registrationId } = await registrationService.processRegistration(result.data);

    return NextResponse.json({
      registration_id: registrationId
    }, { status: 201 });

  } catch (err: any) {
    console.error('Unexpected error in POST /api/registrations:', err);
    return NextResponse.json({ 
      error: err.message || 'Internal Server Error' 
    }, { 
      status: (
        err.message?.includes('category') || 
        err.message?.includes('inscripción') || 
        err.message?.includes('identificación') ||
        err.message?.includes('registrada')
      ) ? 400 : 500 
    });
  }
}
