import { Venue, VenueBlock, Booking, VenueCategory } from '@/types';
import { Database } from '@/lib/supabase/database.types';

type VenueRow = Database['public']['Tables']['venues']['Row'];
type BlockRow = Database['public']['Tables']['venue_blocks']['Row'];
type BookingRow = Database['public']['Tables']['bookings']['Row'];

export function mapVenueRowToVenue(row: VenueRow, blocks: VenueBlock[] = []): Venue {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    tagline: row.tagline,
    description: row.description,
    category: row.category as VenueCategory,
    state: row.state,
    city: row.city,
    area: row.area,
    address: row.address,
    pincode: row.pincode,
    latitude: row.latitude,
    longitude: row.longitude,
    googleMapsUrl: row.google_maps_url,
    images: row.images,
    floorPlanUrl: row.floor_plan_url || undefined,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    totalBuiltUpAreaSqFt: row.total_built_up_area_sqft,
    minPricePerDay: Number(row.min_price_per_day),
    maxPricePerDay: Number(row.max_price_per_day),
    totalSeatingCapacity: row.total_seating_capacity,
    guestRoomsCount: row.guest_rooms_count,
    carParkingCapacity: row.car_parking_capacity,
    isVerified: row.is_verified,
    featured: row.is_featured,
    facilities: row.facilities,
    policies: {
      cancellation: row.cancellation_policy,
      securityDeposit: Number(row.security_deposit),
      advancePaymentPercentage: row.advance_payment_percentage,
      checkInTime: row.check_in_time,
      checkOutTime: row.check_out_time,
    },
    blocks,
  };
}

export function mapBlockRowToBlock(row: BlockRow): VenueBlock {
  return {
    id: row.id,
    venueId: row.venue_id,
    name: row.name,
    code: row.code,
    description: row.description,
    totalBuiltUpAreaSqFt: row.total_built_up_area_sqft,
    diningAreaSqFt: row.dining_area_sqft,
    mainHallAreaSqFt: row.main_hall_area_sqft,
    stageAreaSqFt: row.stage_area_sqft,
    cookingAreaSqFt: row.cooking_area_sqft,
    guestRoomsCount: row.guest_rooms_count,
    carParkingCapacity: row.car_parking_capacity,
    seatingCapacity: row.seating_capacity,
    floatingCapacity: row.floating_capacity,
    isAirConditioned: row.is_air_conditioned,
    washrooms: {
      gents: row.washrooms_gents,
      ladies: row.washrooms_ladies,
      accessible: row.washrooms_accessible,
    },
    amenities: row.amenities,
    pricePerDay: Number(row.price_per_day),
    halfDayPrice: row.half_day_price ? Number(row.half_day_price) : undefined,
    images: row.images,
    floorPlanUrl: row.floor_plan_url || undefined,
    isAvailable: row.is_available,
  };
}

export function mapBookingRowToBooking(
  row: BookingRow,
  venueName = 'GrandVenue Partner Estate',
  venueCity = 'Chennai',
  venueAddress = '',
  blockIds: string[] = [],
  blockNames: string[] = []
): Booking {
  return {
    id: row.id,
    referenceNumber: row.reference_number,
    venueId: row.venue_id,
    venueName,
    venueCity,
    venueAddress,
    blockIds,
    blockNames,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    customerGstin: row.customer_gstin || undefined,
    eventType: row.event_type,
    eventDate: row.event_date,
    timeSlot: row.time_slot,
    guestCount: row.guest_count,
    selectedFacilities: row.selected_facilities,
    pricing: {
      baseRental: Number(row.base_rental),
      facilitiesCost: Number(row.facilities_cost),
      securityDeposit: Number(row.security_deposit),
      taxableAmount: Number(row.taxable_amount),
      cgst: Number(row.cgst),
      sgst: Number(row.sgst),
      igst: Number(row.igst),
      isInterstate: row.is_interstate,
      grossTotal: Number(row.gross_total),
      advancePaid: Number(row.advance_paid),
      balanceDue: Number(row.balance_due),
    },
    bookingStatus: row.booking_status,
    paymentStatus: row.payment_status,
    paymentMethod: row.payment_method || undefined,
    specialRequests: row.special_requests || undefined,
    createdAt: row.created_at,
  };
}
