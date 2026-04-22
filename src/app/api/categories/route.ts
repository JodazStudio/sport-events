import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib';
import { checkAgeOverlap } from '@/features/events/utils';

export const dynamic = 'force-dynamic';

/**
 * Helper to validate manager ownership of an event
 */
async function validateOwnership(request: Request, eventId: string) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return { error: 'Unauthorized', status: 401 };

  const token = authHeader.split(' ')[1];
  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return { error: 'Unauthorized', status: 401 };

  // Check if user is superadmin
  const { data: profile } = await supabaseAdmin!
    .from('managers')
    .select('role')
    .eq('id', user.id)
    .single();
  
  if (profile?.role === 'superadmin') return { user, isSuperadmin: true };

  // Check event ownership
  const { data: event } = await supabaseAdmin!
    .from('events')
    .select('manager_id')
    .eq('id', eventId)
    .single();

  if (!event || event.manager_id !== user.id) {
    return { error: 'Forbidden', status: 403 };
  }

  return { user, isSuperadmin: false };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('event_id');

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    const { error: authError, status } = await validateOwnership(request, eventId);
    if (authError) return NextResponse.json({ error: authError }, { status });

    const { data, error } = await supabaseAdmin!
      .from('categories')
      .select('*')
      .eq('event_id', eventId)
      .order('min_age', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ status: 'success', data });

  } catch (err) {
    console.error('Error fetching categories:', err);
    return NextResponse.json({ 
      status: 'error', 
      message: 'Failed to fetch categories' 
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event_id, name, gender, min_age, max_age } = body;

    if (!event_id || !name || !gender || min_age === undefined || max_age === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { error: authError, status } = await validateOwnership(request, event_id);
    if (authError) return NextResponse.json({ error: authError }, { status });

    // 1. Fetch existing categories for overlap check
    const { data: existingCategories, error: fetchError } = await supabaseAdmin!
      .from('categories')
      .select('id, gender, min_age, max_age')
      .eq('event_id', event_id);

    if (fetchError) throw fetchError;

    // 2. Check for overlap
    const hasOverlap = checkAgeOverlap(
      { gender, min_age, max_age },
      existingCategories || []
    );

    if (hasOverlap) {
      return NextResponse.json({ 
        error: 'Overlap detected', 
        message: 'Ya existe una categoría para este género con un rango de edad que se solapa.' 
      }, { status: 400 });
    }

    // 3. Insert
    const { data, error } = await supabaseAdmin!
      .from('categories')
      .insert([
        { event_id, name, gender, min_age, max_age }
      ])
      .select()
      .single();


    if (error) throw error;

    return NextResponse.json({ status: 'success', data }, { status: 201 });

  } catch (err) {
    console.error('Error creating category:', err);
    return NextResponse.json({ 
      status: 'error', 
      message: 'Failed to create category',
      details: err instanceof Error ? err.message : String(err)
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, event_id, name, gender, min_age, max_age } = body;

    if (!id || !event_id) return NextResponse.json({ error: 'Category ID and Event ID are required' }, { status: 400 });

    const { error: authError, status } = await validateOwnership(request, event_id);
    if (authError) return NextResponse.json({ error: authError }, { status });

    // 1. Fetch existing categories for overlap check
    const { data: existingCategories, error: fetchError } = await supabaseAdmin!
      .from('categories')
      .select('id, gender, min_age, max_age')
      .eq('event_id', event_id);

    if (fetchError) throw fetchError;

    // 2. Check for overlap
    const hasOverlap = checkAgeOverlap(
      { id, gender, min_age, max_age },
      existingCategories || []
    );

    if (hasOverlap) {
      return NextResponse.json({ 
        error: 'Overlap detected', 
        message: 'El nuevo rango de edad se solapa con una categoría existente para este género.' 
      }, { status: 400 });
    }

    // 3. Update
    const { data, error } = await supabaseAdmin!
      .from('categories')
      .update({ name, gender, min_age, max_age })
      .eq('id', id)
      .select()
      .single();


    if (error) throw error;

    return NextResponse.json({ status: 'success', data });

  } catch (err) {
    console.error('Error updating category:', err);
    return NextResponse.json({ 
      status: 'error', 
      message: 'Failed to update category',
      details: err instanceof Error ? err.message : String(err)
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const event_id = searchParams.get('event_id');

    if (!id || !event_id) return NextResponse.json({ error: 'Category ID and Event ID are required' }, { status: 400 });

    const { error: authError, status } = await validateOwnership(request, event_id);
    if (authError) return NextResponse.json({ error: authError }, { status });

    const { error } = await supabaseAdmin!
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ status: 'success', message: 'Category deleted' });

  } catch (err) {
    console.error('Error deleting category:', err);
    return NextResponse.json({ status: 'error', message: 'Failed to delete category' }, { status: 500 });
  }
}
