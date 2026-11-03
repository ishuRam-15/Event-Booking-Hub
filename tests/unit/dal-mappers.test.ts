import { describe, it, expect } from 'vitest';
import { mapVenueRowToVenue, mapBlockRowToBlock, mapBookingRowToBooking } from '@/lib/dal/mappers';

describe('Data Access Layer (DAL) Mappers', () => {
  it('correctly maps a Supabase venue row into the domain Venue model', () => {
    const rawVenueRow: any = {
      id: 'venue-ecr-001',
      name: 'The Leela Palace Mandapam',
      slug: 'the-leela-palace-mandapam',
      tagline: 'Regal oceanfront hospitality',
      description: 'Grand royal architecture with seafront verandas and master acoustic halls.',
      category: 'marriage-hall',
      state: 'Tamil Nadu',
      city: 'Chennai',
      area: 'Adyar Seaface',
      address: 'Adyar Seaface, MRC Nagar, Chennai 600028',
      pincode: '600028',
      latitude: 13.0162,
      longitude: 80.2764,
      google_maps_url: 'https://maps.google.com/?q=13.0162,80.2764',
      images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3'],
      floor_plan_url: 'https://images.unsplash.com/photo-floorplan',
      rating: '4.95',
      review_count: 142,
      total_built_up_area_sqft: 65000,
      min_price_per_day: '250000',
      max_price_per_day: '650000',
      total_seating_capacity: 2500,
      guest_rooms_count: 16,
      car_parking_capacity: 350,
      is_verified: true,
      is_featured: true,
      facilities: ['Carrier HVAC', '250 kVA DG Backup', 'Valet Parking Staff'],
      cancellation_policy: 'Full refund 45 days prior.',
      security_deposit: '50000',
      advance_payment_percentage: 25,
      check_in_time: '06:00 AM',
      check_out_time: '11:00 PM',
    };

    const venue = mapVenueRowToVenue(rawVenueRow);

    expect(venue.id).toBe('venue-ecr-001');
    expect(venue.name).toBe('The Leela Palace Mandapam');
    expect(venue.minPricePerDay).toBe(250000);
    expect(venue.rating).toBe(4.95);
    expect(venue.featured).toBe(true);
    expect(venue.policies.securityDeposit).toBe(50000);
    expect(venue.policies.checkInTime).toBe('06:00 AM');
  });

  it('correctly maps a Supabase block row with washroom sub-objects', () => {
    const rawBlockRow: any = {
      id: 'blk-royal-a',
      venue_id: 'venue-ecr-001',
      name: 'Block A - Grand Royal Ballroom',
      code: 'BLOCK-A',
      description: 'Pillarless ballroom with high ceilings.',
      total_built_up_area_sqft: 28000,
      main_hall_area_sqft: 16000,
      dining_area_sqft: 8000,
      stage_area_sqft: 2400,
      cooking_area_sqft: 1600,
      guest_rooms_count: 10,
      car_parking_capacity: 200,
      seating_capacity: 1800,
      floating_capacity: 2500,
      is_air_conditioned: true,
      washrooms_gents: 8,
      washrooms_ladies: 10,
      washrooms_accessible: 2,
      amenities: ['Central Air Conditioning', 'Green Rooms'],
      price_per_day: '250000',
      half_day_price: '160000',
      images: ['https://images.unsplash.com/photo-ballroom'],
      floor_plan_url: null,
      is_available: true,
    };

    const block = mapBlockRowToBlock(rawBlockRow);

    expect(block.code).toBe('BLOCK-A');
    expect(block.pricePerDay).toBe(250000);
    expect(block.halfDayPrice).toBe(160000);
    expect(block.washrooms.gents).toBe(8);
    expect(block.washrooms.ladies).toBe(10);
    expect(block.washrooms.accessible).toBe(2);
    expect(block.isAirConditioned).toBe(true);
  });

  it('correctly maps a Supabase booking row with SAC 997212 breakdown', () => {
    const rawBookingRow: any = {
      id: 'book-001',
      reference_number: 'GV-IND-8841',
      venue_id: 'venue-ecr-001',
      user_id: 'usr-123',
      customer_name: 'Anand Ramanathan',
      customer_email: 'anand@ramanathan.in',
      customer_phone: '+91 94440 12345',
      customer_gstin: '33AABCR1234F1Z1',
      event_type: 'Grand Reception',
      event_date: '2026-12-18',
      time_slot: 'full-day',
      guest_count: 1200,
      selected_facilities: ['Valet Staff'],
      base_rental: '390000',
      facilities_cost: '25000',
      package_discount: '39000',
      security_deposit: '50000',
      taxable_amount: '376000',
      cgst: '33840',
      sgst: '33840',
      igst: '0',
      is_interstate: false,
      gross_total: '493680',
      advance_paid: '123420',
      balance_due: '370260',
      booking_status: 'confirmed',
      payment_status: 'advance-paid',
      payment_method: 'upi',
      special_requests: 'VIP bridal welcome requested',
      created_at: '2026-11-01T10:00:00Z',
    };

    const booking = mapBookingRowToBooking(
      rawBookingRow,
      'The Leela Palace Mandapam',
      'Chennai',
      'Adyar Seaface, Chennai',
      ['blk-a', 'blk-b'],
      ['Block A', 'Block B']
    );

    expect(booking.referenceNumber).toBe('GV-IND-8841');
    expect(booking.venueName).toBe('The Leela Palace Mandapam');
    expect(booking.pricing.grossTotal).toBe(493680);
    expect(booking.pricing.cgst).toBe(33840);
    expect(booking.pricing.sgst).toBe(33840);
    expect(booking.pricing.advancePaid).toBe(123420);
    expect(booking.pricing.balanceDue).toBe(370260);
    expect(booking.paymentMethod).toBe('upi');
  });
});
