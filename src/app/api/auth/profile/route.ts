import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, supabase } from '@/lib';

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Fetch the authenticated user's profile
 *     description: Returns the user's role and profile data from the managers table.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid authorization header' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase Admin client not configured' }, { status: 500 });
    }

    // 1. Verify the token and get the user identity
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('Auth verification error:', authError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch the profile from the managers table
    const { data: profile, error: dbError } = await supabaseAdmin
      .from('managers')
      .select('id, name, email, role, is_active, created_at')
      .eq('id', user.id)
      .single();

    if (dbError) {
      // It's possible the user exists in Auth but not in managers yet
      console.error('Database profile error:', dbError);
      return NextResponse.json({ 
        id: user.id,
        email: user.email,
        role: (user.app_metadata?.role) || 'admin', // Fallback to auth metadata
        is_profile_missing: true
      });
    }

    if (profile.is_active === false) {
      return NextResponse.json({ error: 'Account is blocked' }, { status: 403 });
    }

    return NextResponse.json(profile);
  } catch (err) {
    console.error('Unexpected error in GET /api/auth/profile:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
