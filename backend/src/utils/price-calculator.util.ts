import type { RateType } from "../generated/prisma/client.js";

interface PeakRate {
  startDate: Date;
  endDate: Date;
  rateType: RateType;
  rateValue: number;
}

export const calculateDailyPrice = (
  date: Date,
  basePrice: number,
  peakRates: PeakRate[]
): number => {
  const targetTime = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

  const matchingRate = peakRates.find((rate) => {
    const start = new Date(rate.startDate.getFullYear(), rate.startDate.getMonth(), rate.startDate.getDate()).getTime();
    const end = new Date(rate.endDate.getFullYear(), rate.endDate.getMonth(), rate.endDate.getDate()).getTime();
    return targetTime >= start && targetTime <= end;
  });

  if (!matchingRate) return basePrice;

  if (matchingRate.rateType === "NOMINAL") {
    return basePrice + matchingRate.rateValue;
  } else if (matchingRate.rateType === "PERCENTAGE") {
    return Math.round(basePrice + (basePrice * matchingRate.rateValue) / 100);
  }

  return basePrice;
};