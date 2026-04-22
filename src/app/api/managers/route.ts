import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, checkSuperadmin } from '@/lib';

/**
 * Manager Profile type based on the database schema
 */
export interface Manager {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
  created_at: string;
}

/**
 * GET: Fetch all managers from the public.managers table
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await checkSuperadmin(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase Admin client not configured' },
        { status: 500 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('managers')
      .select('id, name, email, role, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching managers:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Unexpected error in GET /api/managers:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * POST: Create a new manager (Auth + Database Record)
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await checkSuperadmin(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase Admin client not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // 1. Create the Auth Identity silently using admin client
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: { role: 'admin' },
      user_metadata: { name, role: 'admin' }
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const userId = authData.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: 'Failed to retrieve created user ID' },
        { status: 500 }
      );
    }

    // 2. Insert into the public.managers table
    const { data: managerData, error: dbError } = await supabaseAdmin
      .from('managers')
      .insert([
        {
          id: userId,
          name,
          email,
          role: 'admin'
        }
      ])
      .select()
      .single();

    if (dbError) {
      console.error('Error creating manager record:', dbError);
      
      // Cleanup: Attempt to delete the auth user if DB insert fails
      await supabaseAdmin.auth.admin.deleteUser(userId);
      
      return NextResponse.json({ error: dbError.message }, { status: 400 });
    }

    return NextResponse.json(managerData, { status: 201 });
  } catch (err) {
    console.error('Unexpected error in POST /api/managers:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
