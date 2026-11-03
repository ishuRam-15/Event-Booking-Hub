import { describe, it, expect } from 'vitest';
import { calculateGST, formatCurrency, formatArea } from '@/lib/utils';

describe('Statutory GST Computation Engine (SAC 997212)', () => {
  it('calculates intra-state GST (9% CGST + 9% SGST) for Tamil Nadu transactions', () => {
    const taxableAmount = 100000; // ₹1,00,000 base rental
    const isInterstate = false;

    const result = calculateGST(taxableAmount, isInterstate);

    expect(result.cgst).toBe(9000); // 9% of 100,000
    expect(result.sgst).toBe(9000); // 9% of 100,000
    expect(result.igst).toBe(0);
    expect(result.totalGst).toBe(18000);
  });

  it('calculates inter-state GST (18% IGST) for bookings outside Tamil Nadu', () => {
    const taxableAmount = 250000; // ₹2,50,000
    const isInterstate = true;

    const result = calculateGST(taxableAmount, isInterstate);

    expect(result.cgst).toBe(0);
    expect(result.sgst).toBe(0);
    expect(result.igst).toBe(45000); // 18% of 250,000
    expect(result.totalGst).toBe(45000);
  });

  it('rounds decimal GST amounts accurately to the nearest whole integer', () => {
    const taxableAmount = 123455; // ₹1,23,455
    const intra = calculateGST(taxableAmount, false);

    // 123455 * 0.09 = 11110.95 -> 11111
    expect(intra.cgst).toBe(11111);
    expect(intra.sgst).toBe(11111);
    expect(intra.totalGst).toBe(22222);

    const inter = calculateGST(taxableAmount, true);
    // 123455 * 0.18 = 22221.9 -> 22222
    expect(inter.igst).toBe(22222);
    expect(inter.totalGst).toBe(22222);
  });

  it('handles zero or negative amounts gracefully without NaN', () => {
    const zeroResult = calculateGST(0, false);
    expect(zeroResult.cgst).toBe(0);
    expect(zeroResult.sgst).toBe(0);
    expect(zeroResult.totalGst).toBe(0);

    const negativeResult = calculateGST(-5000, true);
    expect(negativeResult.igst).toBe(0);
    expect(negativeResult.totalGst).toBe(0);
  });

  it('formats currency correctly in Indian Rupee denomination (en-IN)', () => {
    expect(formatCurrency(150000)).toBe('₹1,50,000');
    expect(formatCurrency(4280000)).toBe('₹42,80,000');
    expect(formatCurrency(0)).toBe('₹0');
  });

  it('formats built-up area correctly with square feet suffix', () => {
    expect(formatArea(24000)).toBe('24,000 sq. ft');
    expect(formatArea(65000)).toBe('65,000 sq. ft');
  });
});
