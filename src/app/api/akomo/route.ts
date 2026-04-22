import { NextResponse } from 'next/server';
import { akomoService } from '@/features/akomo';

export async function GET() {
  try {
    const data = await akomoService.getRates();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error in /api/akomo:', error);
    return NextResponse.json({ error: 'Failed to fetch rates', rates: [] }, { status: 500 });
  }
}
