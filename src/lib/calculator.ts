// src/lib/calculator.ts

export interface PromoInputs {
  itemName: string;
  price: number;
  cogs: number;
  normalUnits: number;
  discountType: 'PERCENT' | 'DOLLAR';
  discountValue: number;
  isDeliveryApp: boolean;
  commissionRate: number; // e.g. 0.30 for 30%
}

export interface PromoResults {
  promoPrice: number;
  cm0: number; // Baseline Contribution Margin per plate
  cm1: number; // Promo Contribution Margin per plate
  baselineGrossProfit: number;
  breakEvenUnits: number;
  additionalUnitsNeeded: number;
  volumeLiftPct: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  isUnderwater: boolean;
}

export function calculatePromo(inputs: PromoInputs): PromoResults {
  const comm = inputs.isDeliveryApp ? inputs.commissionRate : 0;
  
  // Baseline Net Margin
  const netBaselineRevenue = inputs.price * (1 - comm);
  const cm0 = netBaselineRevenue - inputs.cogs;
  const baselineGrossProfit = cm0 * inputs.normalUnits;

  // Promotional Price
  const promoPrice = inputs.discountType === 'PERCENT'
    ? inputs.price * (1 - inputs.discountValue / 100)
    : Math.max(0, inputs.price - inputs.discountValue);

  // Promo Net Margin
  const netPromoRevenue = promoPrice * (1 - comm);
  const cm1 = netPromoRevenue - inputs.cogs;

  // Margin check: if CM1 is zero or negative, you lose money on every order
  if (cm1 <= 0) {
    return {
      promoPrice,
      cm0,
      cm1,
      baselineGrossProfit,
      breakEvenUnits: Infinity,
      additionalUnitsNeeded: Infinity,
      volumeLiftPct: Infinity,
      riskLevel: 'HIGH',
      isUnderwater: true,
    };
  }

  // Break-even Units: Q1 = Q0 * (CM0 / CM1)
  const breakEvenUnits = Math.ceil(inputs.normalUnits * (cm0 / cm1));
  const additionalUnitsNeeded = Math.max(0, breakEvenUnits - inputs.normalUnits);
  const volumeLiftPct = Math.round(((breakEvenUnits - inputs.normalUnits) / inputs.normalUnits) * 100);

  // Risk Thresholds
  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  if (volumeLiftPct > 35) riskLevel = 'HIGH';
  else if (volumeLiftPct >= 15) riskLevel = 'MEDIUM';

  return {
    promoPrice,
    cm0,
    cm1,
    baselineGrossProfit,
    breakEvenUnits,
    additionalUnitsNeeded,
    volumeLiftPct,
    riskLevel,
    isUnderwater: false,
  };
}