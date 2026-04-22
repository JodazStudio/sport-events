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
  is_active: boolean;
  created_at: string;
}

/**
 * @swagger
 * /api/managers:
 *   get:
 *     summary: Fetch all managers (Superadmin only)
 *     tags: [Managers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of managers
 *       403:
 *         description: Forbidden
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
      .select('id, name, email, role, is_active, created_at')
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
 * @swagger
 * /api/managers:
 *   post:
 *     summary: Create a new manager (Superadmin only)
 *     tags: [Managers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string }
 *               role: { type: string, enum: [admin, superadmin] }
 *     responses:
 *       201:
 *         description: Manager created
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
    const { name, email, password, role = 'admin' } = body;

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
      app_metadata: { role },
      user_metadata: { name, role }
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
          role,
          is_active: true
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

/**
 * PATCH: Update an existing manager (Superadmin only)
 */
export async function PATCH(request: NextRequest) {
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
    const { id, name, email, password, role, is_active } = body;

    if (!id) {
      return NextResponse.json({ error: 'Manager ID is required' }, { status: 400 });
    }

    // 1. Update Auth if needed (email, password, role)
    const authUpdates: any = {};
    if (email) authUpdates.email = email;
    if (password) authUpdates.password = password;
    if (role) {
      authUpdates.app_metadata = { role };
      authUpdates.user_metadata = { role };
    }
    if (name) {
      authUpdates.user_metadata = { ...authUpdates.user_metadata, name };
    }

    if (Object.keys(authUpdates).length > 0) {
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(id, authUpdates);
      if (authError) {
        console.error('Error updating auth user:', authError);
        return NextResponse.json({ error: authError.message }, { status: 400 });
      }
    }

    // 2. Update DB record
    const dbUpdates: any = {};
    if (name) dbUpdates.name = name;
    if (email) dbUpdates.email = email;
    if (role) dbUpdates.role = role;
    if (is_active !== undefined) dbUpdates.is_active = is_active;

    if (Object.keys(dbUpdates).length > 0) {
      const { data, error: dbError } = await supabaseAdmin
        .from('managers')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (dbError) {
        console.error('Error updating manager record:', dbError);
        return NextResponse.json({ error: dbError.message }, { status: 400 });
      }

      return NextResponse.json(data);
    }

    return NextResponse.json({ message: 'No changes provided' });
  } catch (err) {
    console.error('Unexpected error in PATCH /api/managers:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Remove a manager (Superadmin only)
 */
export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Manager ID is required' }, { status: 400 });
    }

    // Prevent superadmin from deleting themselves
    if (id === auth.user.id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    // 1. Delete Auth user (this will cascade to public.managers due to ON DELETE CASCADE)
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (authError) {
      console.error('Error deleting auth user:', authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Unexpected error in DELETE /api/managers:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
