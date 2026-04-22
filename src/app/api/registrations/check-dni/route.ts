import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const dni = searchParams.get('dni');

    if (!eventId || !dni) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const { data: existing, error } = await supabaseAdmin!
      .from('registrations')
      .select('id, status')
      .eq('event_id', eventId)
      .eq('dni', dni)
      .in('status', ['PENDING', 'REPORTED', 'APPROVED'])
      .maybeSingle();

    if (error) throw error;

    if (existing) {
      let message = 'Ya existe una inscripción registrada con esta cédula.';
      if (existing.status === 'PENDING') message = 'Ya tienes una reserva pendiente para este evento. Por favor, completa tu pago.';
      if (existing.status === 'REPORTED') message = 'Tu pago ya ha sido reportado y está siendo verificado.';
      if (existing.status === 'APPROVED') message = 'Ya te encuentras inscrito exitosamente en este evento.';
      
      return NextResponse.json({ 
        exists: true, 
        status: existing.status,
        message 
      });
    }

    return NextResponse.json({ exists: false });

  } catch (err) {
    console.error('Error in check-dni:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
