import { NextResponse } from 'next/server';
import { getAdminMetrics } from '@/lib/dal/bookings';

export async function GET() {
  try {
    const metrics = await getAdminMetrics();

    return NextResponse.json({
      success: true,
      data: metrics,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch analytics metrics' },
      { status: 500 }
    );
  }
}
