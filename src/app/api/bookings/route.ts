import { NextRequest, NextResponse } from 'next/server';
import { createBookingAction } from '@/app/actions/booking';
import { getUserBookings, getAllBookingsAdmin } from '@/lib/dal/bookings';
import { BookingSchema } from '@/lib/validations/booking';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get('admin') === 'true';

    const bookings = isAdmin ? await getAllBookingsAdmin() : await getUserBookings();

    return NextResponse.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = BookingSchema.parse(body);

    const result = await createBookingAction(validated);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      referenceNumber: result.referenceNumber,
      data: result.data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Invalid booking payload' },
      { status: 400 }
    );
  }
}
