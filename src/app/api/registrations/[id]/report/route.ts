import { NextRequest, NextResponse } from 'next/server';
import { registrationService } from '@/features/events/registrationService';

/**
 * POST /api/registrations/[id]/report
 * Handles payment reporting for an existing PENDING registration.
 * Uploads receipt, updates status to REPORTED, and sends confirmation email.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const formData = await request.formData();
    const referenceNumber = formData.get('reference_number') as string;
    const amountUsd = parseFloat(formData.get('amount_usd') as string);
    const amountVes = parseFloat(formData.get('amount_ves') as string);
    const exchangeRateBcv = parseFloat(formData.get('exchange_rate_bcv') as string);
    const file = formData.get('file') as File | null;

    if (!referenceNumber) {
      return NextResponse.json(
        { error: 'El número de referencia es requerido.' },
        { status: 400 }
      );
    }

    await registrationService.processPaymentReport(id, {
      referenceNumber,
      amountUsd,
      amountVes,
      exchangeRateBcv,
      file
    });

    return NextResponse.json(
      { message: 'Pago reportado exitosamente.' },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('Unexpected error in POST /api/registrations/[id]/report:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: err.message?.includes('No encontrada') || err.message?.includes('requerido') ? 400 : 500 }
    );
  }
}
