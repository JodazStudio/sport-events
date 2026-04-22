import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib';
import { registrationSchema } from '@/features/events/schemas';

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
      console.error('Error finding category:', categoryError);
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

    return NextResponse.json({
      registration_id: registrationId
    }, { status: 201 });

  } catch (err) {
    console.error('Unexpected error in POST /api/registrations:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
