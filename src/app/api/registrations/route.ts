import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib';

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase Admin client not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
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
    } = body;

    // 1. Basic Validation
    if (!event_id || !stage_id || !first_name || !last_name || !dni || !email || !birth_date || !gender) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 2. Map gender from frontend (M/F) to DB ENUM (MALE/FEMALE)
    const dbGender = gender === 'M' ? 'MALE' : 'FEMALE';

    // 3. Calculate Category automatically
    const birthDate = new Date(birth_date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();

    const { data: category, error: categoryError } = await supabaseAdmin
      .from('categories')
      .select('id')
      .eq('event_id', event_id)
      .eq('gender', dbGender)
      .lte('min_age', age)
      .gte('max_age', age)
      .single();

    if (categoryError || !category) {
      console.error('Error finding category:', categoryError);
      return NextResponse.json(
        { error: 'No suitable category found for your age and gender.' },
        { status: 400 }
      );
    }

    // 4. Set Expiration: Today at 23:59:59 (11:59:59 PM)
    const expiresAt = new Date();
    expiresAt.setHours(23, 59, 59, 999);

    // 5. Insert Registration
    const { data: registration, error: regError } = await supabaseAdmin
      .from('registrations')
      .insert([
        {
          event_id,
          stage_id,
          category_id: category.id,
          first_name,
          last_name,
          dni,
          email,
          birth_date,
          gender: dbGender,
          shirt_size,
          status: payment_data ? 'REPORTED' : 'PENDING',
          expires_at: expiresAt.toISOString()
        }
      ])
      .select('id')
      .single();

    if (regError || !registration) {
      console.error('Error creating registration:', regError);
      return NextResponse.json(
        { error: 'Failed to process registration' },
        { status: 400 }
      );
    }

    // 6. Process Payment if provided
    if (payment_data) {
      const { receipt_url, reference_number, amount_ves, exchange_rate_bcv, amount_usd } = payment_data;
      
      const { error: paymentError } = await supabaseAdmin
        .from('payments')
        .insert([
          {
            registration_id: registration.id,
            amount_usd: amount_usd,
            exchange_rate_bcv: exchange_rate_bcv,
            amount_ves: amount_ves,
            reference_number: reference_number,
            receipt_url: receipt_url
          }
        ]);

      if (paymentError) {
        console.error('Error inserting payment:', paymentError);
        // We don't fail the whole request here, but we should log it
        // The registration is already created.
      }
    }

    return NextResponse.json({
      registration_id: registration.id
    }, { status: 201 });

  } catch (err) {
    console.error('Unexpected error in POST /api/registrations:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
