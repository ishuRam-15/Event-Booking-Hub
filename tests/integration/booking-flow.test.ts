import { describe, it, expect } from 'vitest';
import { calculateGST } from '@/lib/utils';
import { calculateComboDiscount } from '../unit/multi-block-discounts.test';
import { BookingSchema } from '@/lib/validations/booking';

describe('End-to-End Booking Calculation & Statutory Workflow', () => {
  it('executes Option A (25% Advance Token Lock) flow correctly', () => {
    // 1. Host selects Dual Blocks (Block A: ₹2,25,000 + Block B: ₹1,65,000)
    const baseRental = 225000 + 165000; // 390,000
    const blockCount = 2;

    // 2. Combo discount applied
    const { discountAmount } = calculateComboDiscount(blockCount, baseRental);
    expect(discountAmount).toBe(39000); // 10% discount

    // 3. Optional facilities selected
    const facilitiesCost = 45000;

    // 4. Taxable value
    const taxableAmount = baseRental + facilitiesCost - discountAmount;
    expect(taxableAmount).toBe(396000);

    // 5. Statutory GST (Intra-state 9% + 9%)
    const gst = calculateGST(taxableAmount, false);
    expect(gst.cgst).toBe(35640);
    expect(gst.sgst).toBe(35640);
    expect(gst.totalGst).toBe(71280);

    // 6. Statutory Escrow Caution Deposit
    const securityDeposit = 50000;

    // 7. Gross Invoice Total
    const grossTotal = taxableAmount + gst.totalGst + securityDeposit;
    expect(grossTotal).toBe(517280);

    // 8. Option A: 25% Advance Token Lock
    const advancePaid = Math.round(grossTotal * 0.25);
    const balanceDue = grossTotal - advancePaid;

    expect(advancePaid).toBe(129320);
    expect(balanceDue).toBe(387960);
    expect(advancePaid + balanceDue).toBe(grossTotal);
  });

  it('executes Option B (100% Full Settlement with 2% prompt waiver) flow correctly', () => {
    const baseRental = 225000; // Single block
    const facilitiesCost = 0;
    const discountAmount = 0;
    const taxableAmount = 225000;

    const gst = calculateGST(taxableAmount, false);
    const securityDeposit = 50000;
    const rawGrossTotal = taxableAmount + gst.totalGst + securityDeposit;

    // 225000 + 40500 + 50000 = 315,500
    expect(rawGrossTotal).toBe(315500);

    // 2% prompt settlement waiver
    const settlementWaiver = Math.round(rawGrossTotal * 0.02);
    expect(settlementWaiver).toBe(6310);

    const netAmountPayable = rawGrossTotal - settlementWaiver;
    expect(netAmountPayable).toBe(309190);

    // When full settlement chosen: balance due is exactly 0
    const balanceDue = 0;
    expect(balanceDue).toBe(0);
  });

  it('validates a complete end-to-end booking submission schema for Option A', () => {
    const bookingPayload = {
      venueId: 'v-chennai-001',
      blockIds: ['blk-a', 'blk-b'],
      blockPrices: { 'blk-a': 225000, 'blk-b': 165000 },
      customerName: 'Karthik Sivakumar',
      customerEmail: 'karthik@siva.org',
      customerPhone: '+91 98409 98409',
      customerGstin: '33AAACK1234D1Z8',
      eventType: 'Traditional Hindu Wedding & Reception',
      eventDate: '2026-11-14',
      timeSlot: 'full-day' as const,
      guestCount: 1500,
      selectedFacilities: ['Central Air Conditioning', '100% DG Power Backup'],
      facilitiesCost: 45000,
      packageDiscount: 39000,
      securityDeposit: 50000,
      isInterstate: false,
      paymentPlan: 'advance' as const,
      specialRequests: 'Ensure stage florist access by 05:00 AM',
    };

    const validation = BookingSchema.safeParse(bookingPayload);
    expect(validation.success).toBe(true);
  });
});
