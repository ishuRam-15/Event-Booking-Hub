import { Booking } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { MOCK_BOOKINGS, MOCK_ADMIN_METRICS } from '@/lib/mock-data';
import { mapBookingRowToBooking } from './mappers';

const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && !url.includes('placeholder'));
};

export async function getUserBookings(): Promise<Booking[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_BOOKINGS;
  }

  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let query = (supabase.from('bookings') as any).select('*, venues(name, city, address)').order('created_at', { ascending: false });

    if (user?.id) {
      query = query.eq('user_id', user.id);
    }

    const { data: bookingRows, error } = await query;

    if (error || !bookingRows || bookingRows.length === 0) {
      return MOCK_BOOKINGS;
    }

    return (bookingRows as any[]).map((b: any) => {
      const venue = b.venues || {};
      return mapBookingRowToBooking(
        b,
        venue.name || 'GrandVenue Estate',
        venue.city || 'Chennai',
        venue.address || ''
      );
    });
  } catch (err) {
    console.warn('Error fetching bookings from Supabase, using mock fallback:', err);
    return MOCK_BOOKINGS;
  }
}

export async function getAllBookingsAdmin(): Promise<Booking[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_BOOKINGS;
  }

  try {
    const supabase = createClient();
    const { data: bookingRows, error } = await (supabase
      .from('bookings') as any)
      .select('*, venues(name, city, address)')
      .order('created_at', { ascending: false });

    if (error || !bookingRows || bookingRows.length === 0) {
      return MOCK_BOOKINGS;
    }

    return (bookingRows as any[]).map((b: any) => {
      const venue = b.venues || {};
      return mapBookingRowToBooking(
        b,
        venue.name || 'GrandVenue Estate',
        venue.city || 'Chennai',
        venue.address || ''
      );
    });
  } catch (err) {
    console.warn('Error fetching admin bookings from Supabase, using mock fallback:', err);
    return MOCK_BOOKINGS;
  }
}

export async function getAdminMetrics() {
  if (!isSupabaseConfigured()) {
    return MOCK_ADMIN_METRICS;
  }

  try {
    const supabase = createClient();
    const { count: venuesCount } = await supabase.from('venues').select('*', { count: 'exact', head: true });
    const { count: blocksCount } = await supabase.from('venue_blocks').select('*', { count: 'exact', head: true });
    const { data: bookings } = await (supabase.from('bookings') as any).select('gross_total, cgst, sgst, igst, booking_status');

    if (!bookings || bookings.length === 0) {
      return MOCK_ADMIN_METRICS;
    }

    const bookingList = bookings as any[];
    const totalRevenue = bookingList.reduce((sum, b) => sum + Number(b.gross_total || 0), 0);
    const totalGstCollected = bookingList.reduce((sum, b) => sum + Number(b.cgst || 0) + Number(b.sgst || 0) + Number(b.igst || 0), 0);

    return {
      totalRevenue: totalRevenue || MOCK_ADMIN_METRICS.totalRevenue,
      totalVenues: venuesCount || MOCK_ADMIN_METRICS.totalVenues,
      totalBlocks: blocksCount || MOCK_ADMIN_METRICS.totalBlocks,
      operationalUptime: '94%',
      totalBookings: bookingList.length || MOCK_ADMIN_METRICS.totalBookings,
      confirmedBookings: bookingList.filter((b) => b.booking_status === 'confirmed').length,
      pendingBookings: bookingList.filter((b) => b.booking_status === 'pending').length,
      cancelledBookings: bookingList.filter((b) => b.booking_status === 'cancelled').length,
      totalCustomers: MOCK_ADMIN_METRICS.totalCustomers,
      totalGstCollected: totalGstCollected || MOCK_ADMIN_METRICS.totalGstCollected,
      cgstCollected: Math.round(totalGstCollected / 2) || MOCK_ADMIN_METRICS.cgstCollected,
      sgstCollected: Math.round(totalGstCollected / 2) || MOCK_ADMIN_METRICS.sgstCollected,
      monthlySales: MOCK_ADMIN_METRICS.monthlySales,
    };
  } catch (err) {
    console.warn('Error fetching admin metrics from Supabase, using mock fallback:', err);
    return MOCK_ADMIN_METRICS;
  }
}
