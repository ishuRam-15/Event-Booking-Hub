import { describe, it, expect } from 'vitest';
import { BookingSchema } from '@/lib/validations/booking';
import { VenueSchema, VenueBlockSchema } from '@/lib/validations/venue';

describe('Runtime Zod Validation Schemas', () => {
  describe('BookingSchema', () => {
    const validBooking = {
      venueId: 'v-001',
      blockIds: ['blk-a', 'blk-b'],
      blockPrices: { 'blk-a': 225000, 'blk-b': 165000 },
      customerName: 'Senthil Nathan',
      customerEmail: 'senthil@nathan.org',
      customerPhone: '+91 98401 23456',
      customerGstin: '33AAAAA0000A1Z5',
      eventType: 'Traditional Hindu Wedding & Reception',
      eventDate: '2026-11-14',
      timeSlot: 'full-day' as const,
      guestCount: 1500,
      selectedFacilities: ['Valet Parking Staff', '100% DG Power Backup'],
      facilitiesCost: 45000,
      packageDiscount: 39000,
      securityDeposit: 50000,
      isInterstate: false,
      paymentPlan: 'advance' as const,
    };

    it('successfully parses a compliant booking payload', () => {
      const parsed = BookingSchema.safeParse(validBooking);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.customerName).toBe('Senthil Nathan');
        expect(parsed.data.guestCount).toBe(1500);
      }
    });

    it('rejects invalid email addresses', () => {
      const invalid = { ...validBooking, customerEmail: 'not-an-email' };
      const result = BookingSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('valid email');
      }
    });

    it('rejects invalid GSTIN format with statutory error guidance', () => {
      const invalid = { ...validBooking, customerGstin: 'INVALID_GSTIN_123' };
      const result = BookingSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid GSTIN format');
      }
    });

    it('accepts empty or omitted customer GSTIN for personal hosts', () => {
      const personalHost = { ...validBooking, customerGstin: '' };
      const result = BookingSchema.safeParse(personalHost);
      expect(result.success).toBe(true);
    });

    it('rejects booking with empty block selection', () => {
      const noBlocks = { ...validBooking, blockIds: [] };
      const result = BookingSchema.safeParse(noBlocks);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('At least one architectural block');
      }
    });

    it('rejects negative or zero guest count', () => {
      const negativeGuests = { ...validBooking, guestCount: 0 };
      const result = BookingSchema.safeParse(negativeGuests);
      expect(result.success).toBe(false);
    });
  });

  describe('VenueSchema and VenueBlockSchema', () => {
    it('validates dynamic architectural block with all statutory sub-areas', () => {
      const validBlock = {
        name: 'Block A - Main Grand Mandapam',
        code: 'BLOCK-A',
        description: 'Vast ceremonial hall featuring pillarless acoustic design.',
        totalBuiltUpAreaSqFt: 24000,
        mainHallAreaSqFt: 14000,
        diningAreaSqFt: 6500,
        stageAreaSqFt: 1800,
        cookingAreaSqFt: 1200,
        guestRoomsCount: 10,
        carParkingCapacity: 200,
        seatingCapacity: 1800,
        floatingCapacity: 2500,
        isAirConditioned: true,
        pricePerDay: 225000,
        amenities: ['Central Air Conditioning', 'Green Rooms'],
        images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3'],
        isAvailable: true,
      };

      const parsed = VenueBlockSchema.safeParse(validBlock);
      expect(parsed.success).toBe(true);
    });

    it('rejects block with missing code or negative area', () => {
      const invalidBlock = {
        name: 'Block',
        code: '',
        description: 'Short',
        totalBuiltUpAreaSqFt: -100,
        seatingCapacity: 0,
        pricePerDay: -5000,
      };

      const result = VenueBlockSchema.safeParse(invalidBlock);
      expect(result.success).toBe(false);
    });

    it('enforces 6-digit Indian PIN code validation for venues', () => {
      const baseVenue = {
        name: 'Grand Horizon Mandapam',
        slug: 'grand-horizon-mandapam',
        tagline: 'Luxury Coastal Estate',
        description: 'Premier beachside property offering palatial spaces.',
        category: 'marriage-hall' as const,
        state: 'Tamil Nadu',
        city: 'Chennai',
        area: 'ECR Corridor',
        address: '108 East Coast Road, Chennai',
        pincode: '600041',
        latitude: 12.9812,
        longitude: 80.2589,
        googleMapsUrl: 'https://maps.google.com/?q=12.9812,80.2589',
        images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3'],
        totalBuiltUpAreaSqFt: 45000,
        minPricePerDay: 180000,
        maxPricePerDay: 450000,
        totalSeatingCapacity: 2000,
        guestRoomsCount: 12,
        carParkingCapacity: 250,
        isVerified: true,
        isFeatured: true,
        facilities: ['HVAC', 'Valet'],
        cancellationPolicy: 'Full refund 45 days prior to event date.',
        securityDeposit: 50000,
        advancePaymentPercentage: 25,
        checkInTime: '06:00 AM',
        checkOutTime: '11:00 PM',
        blocks: [
          {
            name: 'Block A - Main Pavilion',
            code: 'BLOCK-A',
            description: 'Grand reception hall with central AC.',
            totalBuiltUpAreaSqFt: 25000,
            seatingCapacity: 1500,
            pricePerDay: 200000,
          },
        ],
      };

      const validResult = VenueSchema.safeParse(baseVenue);
      expect(validResult.success).toBe(true);

      const invalidPin = { ...baseVenue, pincode: '6000' };
      const invalidResult = VenueSchema.safeParse(invalidPin);
      expect(invalidResult.success).toBe(false);
      if (!invalidResult.success) {
        expect(invalidResult.error.issues[0].message).toContain('6-digit Indian pincode');
      }
    });
  });
});
