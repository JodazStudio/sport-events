import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, supabase } from '@/lib';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid authorization header' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase Admin client not configured' }, { status: 500 });
    }

    // 1. Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Generate a random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Save to database
    // We first delete any existing codes for this manager to keep it clean
    await supabaseAdmin
      .from('telegram_verification_codes')
      .delete()
      .eq('manager_id', user.id);

    const { error: dbError } = await supabaseAdmin
      .from('telegram_verification_codes')
      .insert({
        manager_id: user.id,
        code: code,
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 mins
      });

    if (dbError) {
      console.error('Error saving verification code:', dbError);
      return NextResponse.json({ error: 'Failed to generate code' }, { status: 500 });
    }

    return NextResponse.json({ code });
  } catch (err) {
    console.error('Unexpected error in /api/telegram/generate-code:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
