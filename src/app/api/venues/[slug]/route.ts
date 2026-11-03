import { NextRequest, NextResponse } from 'next/server';
import { getVenueBySlug } from '@/lib/dal/venues';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const venue = await getVenueBySlug(params.slug);

    if (!venue) {
      return NextResponse.json(
        { success: false, error: 'Venue not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: venue,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch venue details' },
      { status: 500 }
    );
  }
}
