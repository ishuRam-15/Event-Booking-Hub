export type VenueCategory =
  | 'marriage-hall'
  | 'convention-centre'
  | 'banquet-hall'
  | 'party-hall'
  | 'corporate'
  | 'outdoor-lawn';

export interface WashroomFacilities {
  gents: number;
  ladies: number;
  accessible: number;
}

export interface VenueBlock {
  id: string;
  venueId: string;
  name: string;
  code: string;
  description: string;
  totalBuiltUpAreaSqFt: number;
  diningAreaSqFt: number;
  mainHallAreaSqFt: number;
  stageAreaSqFt: number;
  cookingAreaSqFt: number;
  guestRoomsCount: number;
  carParkingCapacity: number;
  seatingCapacity: number;
  floatingCapacity: number;
  isAirConditioned: boolean;
  washrooms: WashroomFacilities;
  amenities: string[];
  pricePerDay: number;
  halfDayPrice?: number;
  images: string[];
  floorPlanUrl?: string;
  isAvailable: boolean;
}

export interface VenuePolicies {
  cancellation: string;
  securityDeposit: number;
  advancePaymentPercentage: number;
  checkInTime: string;
  checkOutTime: string;
}

export interface Venue {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: VenueCategory;
  state: string;
  city: string;
  area: string;
  address: string;
  pincode: string;
  latitude: number;
  longitude: number;
  googleMapsUrl: string;
  images: string[];
  floorPlanUrl?: string;
  rating: number;
  reviewCount: number;
  totalBuiltUpAreaSqFt: number;
  minPricePerDay: number;
  maxPricePerDay: number;
  totalSeatingCapacity: number;
  guestRoomsCount: number;
  carParkingCapacity: number;
  isVerified: boolean;
  blocks: VenueBlock[];
  facilities: string[];
  policies: VenuePolicies;
  featured?: boolean;
}

export interface PricingBreakdown {
  baseRental: number;
  facilitiesCost: number;
  packageDiscount?: number;
  securityDeposit: number;
  taxableAmount: number;
  cgst: number; // 9% intra-state
  sgst: number; // 9% intra-state
  igst: number; // 18% inter-state
  isInterstate: boolean;
  grossTotal: number;
  advancePaid: number;
  balanceDue: number;
}

export interface Booking {
  id: string;
  referenceNumber: string;
  venueId: string;
  venueName: string;
  venueCity: string;
  venueAddress: string;
  blockIds: string[];
  blockNames: string[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerGstin?: string;
  eventType: string;
  eventDate: string;
  timeSlot: 'morning' | 'evening' | 'full-day';
  guestCount: number;
  selectedFacilities: string[];
  pricing: PricingBreakdown;
  bookingStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'unpaid' | 'advance-paid' | 'fully-paid' | 'refunded';
  paymentMethod?: 'card' | 'upi' | 'netbanking' | 'bank-transfer';
  specialRequests?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  gstin?: string;
  address: string;
  city: string;
  state: string;
  avatarUrl?: string;
  bookingsCount: number;
  totalSpent: number;
  savedVenueIds: string[];
}

export interface SearchFilterState {
  state: string;
  city: string;
  locality: string;
  category: string;
  distanceRadius: number;
  minPrice: number;
  maxPrice: number;
  minSqFt: number;
  maxSqFt: number;
  minSeatingCapacity: number;
  eventType: string;
  acType: 'all' | 'ac' | 'non-ac';
  selectedFacilities: string[];
  minRooms: number;
  minParking: number;
  date: string;
  sortBy: 'price-asc' | 'price-desc' | 'popular' | 'rating' | 'recent';
}
