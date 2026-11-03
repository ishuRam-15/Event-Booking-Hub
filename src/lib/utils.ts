import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatArea(sqft: number): string {
  return `${new Intl.NumberFormat('en-IN').format(sqft)} sq. ft`;
}

export function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function calculateGST(taxableAmount: number, isInterstate = false) {
  const safeAmount = Math.max(0, taxableAmount);
  if (isInterstate) {
    const igst = Math.round(safeAmount * 0.18);
    return {
      cgst: 0,
      sgst: 0,
      igst,
      totalGst: igst,
    };
  }
  const cgst = Math.round(safeAmount * 0.09);
  const sgst = Math.round(safeAmount * 0.09);
  return {
    cgst,
    sgst,
    igst: 0,
    totalGst: cgst + sgst,
  };
}
