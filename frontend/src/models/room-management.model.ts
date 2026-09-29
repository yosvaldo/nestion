export type PriceType = "NOMINAL" | "PERCENTAGE";

export interface SetUnavailabilityInput {
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface SetPeakSeasonRateInput {
  startDate: string;
  endDate: string;
  priceType: PriceType;
  value: number;
}