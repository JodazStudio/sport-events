import { NextResponse } from 'next/server';
import { akomoService } from '@/features/akomo/akomoService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rate = await akomoService.getExchangeRate();
    return NextResponse.json({ rate });
  } catch (error) {
    return NextResponse.json({ rate: 36.5 }, { status: 500 }); // Fallback
  }
}
