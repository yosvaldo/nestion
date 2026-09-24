import type { RateType } from "../generated/prisma/client.js";

interface PeakRate {
  startDate: Date | string;
  endDate: Date | string;
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
    const startObj = new Date(rate.startDate);
    const endObj = new Date(rate.endDate);

    const start = new Date(startObj.getFullYear(), startObj.getMonth(), startObj.getDate()).getTime();
    const end = new Date(endObj.getFullYear(), endObj.getMonth(), endObj.getDate()).getTime();
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