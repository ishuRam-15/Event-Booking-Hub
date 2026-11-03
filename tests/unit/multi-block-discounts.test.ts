import { describe, it, expect } from 'vitest';

export function calculateComboDiscount(blockCount: number, baseRental: number): { discountPercentage: number; discountAmount: number } {
  let discountPercentage = 0;
  if (blockCount >= 3) {
    discountPercentage = 0.12; // 12% Full Estate Combo
  } else if (blockCount === 2) {
    discountPercentage = 0.10; // 10% Dual Block Package
  }

  const discountAmount = Math.round(baseRental * discountPercentage);
  return { discountPercentage: discountPercentage * 100, discountAmount };
}

describe('Multi-Block Architecture & Package Combo Discounts', () => {
  it('applies 0% discount when only a single standalone block is booked', () => {
    const baseRental = 180000;
    const { discountPercentage, discountAmount } = calculateComboDiscount(1, baseRental);

    expect(discountPercentage).toBe(0);
    expect(discountAmount).toBe(0);
  });

  it('applies 10% combo discount when 2 architectural blocks are paired (e.g., Block A + Block B)', () => {
    // Block A (₹2,25,000) + Block B (₹1,65,000) = ₹3,90,000
    const baseRental = 390000;
    const { discountPercentage, discountAmount } = calculateComboDiscount(2, baseRental);

    expect(discountPercentage).toBe(10);
    expect(discountAmount).toBe(39000); // 10% of 390,000
  });

  it('applies 12% full estate package discount when 3 or more blocks are bundled (Block A + B + C+)', () => {
    // Block A (₹2,25,000) + Block B (₹1,65,000) + Block C (₹1,20,000) = ₹5,10,000
    const baseRental = 510000;
    const { discountPercentage, discountAmount } = calculateComboDiscount(3, baseRental);

    expect(discountPercentage).toBe(12);
    expect(discountAmount).toBe(61200); // 12% of 510,000
  });

  it('calculates full estate discount for 4 blocks accurately', () => {
    const baseRental = 600000;
    const { discountPercentage, discountAmount } = calculateComboDiscount(4, baseRental);

    expect(discountPercentage).toBe(12);
    expect(discountAmount).toBe(72000); // 12% of 600,000
  });

  it('correctly reduces taxable turnover before statutory GST assessment', () => {
    const baseRental = 390000; // Dual blocks
    const { discountAmount } = calculateComboDiscount(2, baseRental);
    const taxableTurnover = baseRental - discountAmount;

    expect(taxableTurnover).toBe(351000); // ₹3,51,000 net taxable

    // 18% GST on net taxable
    const totalGst = Math.round(taxableTurnover * 0.18);
    expect(totalGst).toBe(63180);
  });
});
