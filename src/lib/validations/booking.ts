import { z } from 'zod';

export const BookingSchema = z.object({
  venueId: z.string().min(1, 'Venue ID is required'),
  blockIds: z.array(z.string()).min(1, 'At least one architectural block must be selected'),
  blockPrices: z.record(z.string(), z.number().nonnegative()),
  customerName: z.string().min(2, 'Customer name must be at least 2 characters'),
  customerEmail: z.string().email('Please provide a valid email address'),
  customerPhone: z.string().min(10, 'Valid phone number is required (min 10 digits)'),
  customerGstin: z
    .string()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GSTIN format (e.g. 33AAAAA0000A1Z5)')
    .optional()
    .or(z.literal('')),
  eventType: z.string().min(1, 'Event type is required'),
  eventDate: z.string().min(1, 'Event date is required'),
  timeSlot: z.enum(['morning', 'evening', 'full-day']),
  guestCount: z.number().int().positive('Guest count must be greater than zero'),
  selectedFacilities: z.array(z.string()).default([]),
  facilitiesCost: z.number().nonnegative().default(0),
  packageDiscount: z.number().nonnegative().default(0),
  securityDeposit: z.number().nonnegative().default(50000),
  isInterstate: z.boolean().default(false),
  paymentPlan: z.enum(['advance', 'full']).default('advance'),
  specialRequests: z.string().max(1000).optional(),
});

export type BookingInput = z.infer<typeof BookingSchema>;
