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

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Fetch categories for an event
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: event_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of categories
 *   post:
 *     summary: Create new categories (Single or Bulk)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 required: [event_id, name, gender, min_age, max_age]
 *                 properties:
 *                   event_id: { type: string }
 *                   name: { type: string }
 *                   gender: { type: string, enum: [MALE, FEMALE, MIXED] }
 *                   min_age: { type: number }
 *                   max_age: { type: number }
 *               - type: array
 *                 items:
 *                   type: object
 *                   required: [event_id, name, gender, min_age, max_age]
 *                   properties:
 *                     event_id: { type: string }
 *                     name: { type: string }
 *                     gender: { type: string, enum: [MALE, FEMALE, MIXED] }
 *                     min_age: { type: number }
 *                     max_age: { type: number }
 *     responses:
 *       201:
 *         description: Categories created
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id, event_id]
 *             properties:
 *               id: { type: string }
 *               event_id: { type: string }
 *               name: { type: string }
 *               gender: { type: string, enum: [MALE, FEMALE, MIXED] }
 *               min_age: { type: number }
 *               max_age: { type: number }
 *     responses:
 *       200:
 *         description: Category updated
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: event_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted
 */
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
    const isBulk = Array.isArray(body);
    const items = isBulk ? body : [body];

    if (items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    // Validate required fields for all items
    for (const item of items) {
      const { event_id, name, gender, min_age, max_age } = item;
      if (!event_id || !name || !gender || min_age === undefined || max_age === undefined) {
        return NextResponse.json({ error: 'Missing required fields in one or more items' }, { status: 400 });
      }
    }

    const eventId = items[0].event_id;
    const { error: authError, status } = await validateOwnership(request, eventId);
    if (authError) return NextResponse.json({ error: authError }, { status });

    // 1. Fetch existing categories for overlap check
    const { data: existingCategories, error: fetchError } = await supabaseAdmin!
      .from('categories')
      .select('id, gender, min_age, max_age')
      .eq('event_id', eventId);

    if (fetchError) throw fetchError;

    const currentCategories = [...(existingCategories || [])];
    const newItemsToInsert = [];

    // 2. Check for overlap for each item
    for (const item of items) {
      const hasOverlap = checkAgeOverlap(
        { gender: item.gender, min_age: item.min_age, max_age: item.max_age },
        currentCategories
      );

      if (hasOverlap) {
        return NextResponse.json({ 
          error: 'Overlap detected', 
          message: `Solapamiento detectado para "${item.name}". Ya existe una categoría con este género y rango de edad.` 
        }, { status: 400 });
      }

      const newItem = { 
        event_id: item.event_id, 
        name: item.name, 
        gender: item.gender, 
        min_age: item.min_age, 
        max_age: item.max_age 
      };
      newItemsToInsert.push(newItem);
      // Add to currentCategories to check against other items in the same batch
      currentCategories.push(newItem as any);
    }

    // 3. Insert
    const { data, error } = await supabaseAdmin!
      .from('categories')
      .insert(newItemsToInsert)
      .select();

    if (error) throw error;

    return NextResponse.json({ 
      status: 'success', 
      data: isBulk ? data : data[0] 
    }, { status: 201 });

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
