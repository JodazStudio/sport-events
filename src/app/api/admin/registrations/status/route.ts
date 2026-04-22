import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, checkAdmin } from '@/lib';

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
