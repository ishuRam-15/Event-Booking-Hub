import { NextRequest, NextResponse } from 'next/server';
import { calculateGST } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const { blockPrices, isInterstate = false, securityDeposit = 50000 } = await request.json();

    if (!blockPrices || typeof blockPrices !== 'object') {
      return NextResponse.json(
        { success: false, error: 'blockPrices map is required' },
        { status: 400 }
      );
    }

    const prices: number[] = Object.values(blockPrices);
    const count = prices.length;
    const rawTotal = prices.reduce((a, b) => a + Number(b), 0);

    // Dynamic bundle discount rules
    let discountRate = 0;
    if (count === 2) discountRate = 0.10; // 10% dual block combo
    if (count >= 3) discountRate = 0.12; // 12% full estate package

    const packageDiscount = Math.round(rawTotal * discountRate);
    const baseRental = rawTotal - packageDiscount;

    const gst = calculateGST(baseRental, isInterstate);
    const grossTotal = baseRental + gst.cgst + gst.sgst + gst.igst + securityDeposit;

    return NextResponse.json({
      success: true,
      data: {
        rawTotal,
        discountRate: discountRate * 100,
        packageDiscount,
        baseRental,
        securityDeposit,
        taxableAmount: baseRental,
        cgst: gst.cgst,
        sgst: gst.sgst,
        igst: gst.igst,
        isInterstate,
        grossTotal,
        advance25Percent: Math.round(grossTotal * 0.25),
        fullPaymentPromptDiscount: Math.round(grossTotal * 0.98), // 2% prompt settlement waiver
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Block comparison calculation failed' },
      { status: 500 }
    );
  }
}
