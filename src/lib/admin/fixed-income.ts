export type FixedIncomeExceptionStatus =
  | "failed"
  | "pending approval"
  | "approved"
  | "rejected"
  | "execution pending"
  | "partially liquidated"
  | "settlement pending"
  | "reconciled";

export const FIXED_INCOME_EXCEPTION_STATUSES: FixedIncomeExceptionStatus[] = [
  "failed",
  "pending approval",
  "approved",
  "rejected",
  "execution pending",
  "partially liquidated",
  "settlement pending",
  "reconciled",
];

export interface FixedIncomeException {
  reference: string;
  instrument: "Commercial Paper" | "Treasury Bill";
  customerId: string;
  counterparty: string;
  faceValue: number;
  originalRate: number;
  revisedRate: number;
  tenorDays: number;
  daysElapsed: number;
  liquidationFaceValue: number;
  status: FixedIncomeExceptionStatus;
  failureReason: string;
  owner: string;
  slaHours: number;
  purchaseTimestamp: string;
  exceptionDetectedAt: string;
}

export const fixedIncomeExceptions: FixedIncomeException[] = [
  {
    reference: "AIP-FI-20261009-00125",
    instrument: "Commercial Paper",
    customerId: "CUS-1001",
    counterparty: "Dangote Cement Plc",
    faceValue: 100_000_000,
    originalRate: 20,
    revisedRate: 18,
    tenorDays: 180,
    daysElapsed: 60,
    liquidationFaceValue: 40_000_000,
    status: "pending approval",
    failureReason: "Settlement reconciliation pending",
    owner: "Treasury Operations",
    slaHours: 24,
    purchaseTimestamp: "2026-10-09T10:15:32Z",
    exceptionDetectedAt: "2026-10-09T10:25:32Z",
  },
  {
    reference: "AIP-FI-20261008-00091",
    instrument: "Treasury Bill",
    customerId: "CUS-1002",
    counterparty: "Federal Government of Nigeria",
    faceValue: 25_000_000,
    originalRate: 19,
    revisedRate: 18,
    tenorDays: 91,
    daysElapsed: 12,
    liquidationFaceValue: 0,
    status: "failed",
    failureReason: "Payment confirmation timed out; execution must be checked before retry",
    owner: "Technology Operations",
    slaHours: 4,
    purchaseTimestamp: "2026-10-08T09:21:00Z",
    exceptionDetectedAt: "2026-10-08T09:31:00Z",
  },
  {
    reference: "AIP-FI-20261007-00063",
    instrument: "Commercial Paper",
    customerId: "CUS-1003",
    counterparty: "MTN Nigeria",
    faceValue: 15_000_000,
    originalRate: 17,
    revisedRate: 18,
    tenorDays: 180,
    daysElapsed: 45,
    liquidationFaceValue: 5_000_000,
    status: "settlement pending",
    failureReason: "Awaiting cash and securities reconciliation",
    owner: "Treasury Operations",
    slaHours: 24,
    purchaseTimestamp: "2026-10-07T13:05:18Z",
    exceptionDetectedAt: "2026-10-07T13:15:18Z",
  },
  {
    reference: "AIP-FI-20261006-00048",
    instrument: "Treasury Bill",
    customerId: "CUS-1004",
    counterparty: "Federal Government of Nigeria",
    faceValue: 12_000_000,
    originalRate: 18.5,
    revisedRate: 18,
    tenorDays: 91,
    daysElapsed: 30,
    liquidationFaceValue: 3_000_000,
    status: "approved",
    failureReason: "Repricing approved; execution not yet submitted",
    owner: "Fixed Income Desk",
    slaHours: 8,
    purchaseTimestamp: "2026-10-06T11:40:00Z",
    exceptionDetectedAt: "2026-10-06T12:00:00Z",
  },
  {
    reference: "AIP-FI-20261005-00037",
    instrument: "Commercial Paper",
    customerId: "CUS-1005",
    counterparty: "BUA Foods Plc",
    faceValue: 32_000_000,
    originalRate: 19.2,
    revisedRate: 17.8,
    tenorDays: 180,
    daysElapsed: 75,
    liquidationFaceValue: 8_000_000,
    status: "execution pending",
    failureReason: "Approved liquidation awaiting execution reference",
    owner: "Treasury Operations",
    slaHours: 12,
    purchaseTimestamp: "2026-10-05T08:16:45Z",
    exceptionDetectedAt: "2026-10-05T08:25:00Z",
  },
  {
    reference: "AIP-FI-20261004-00029",
    instrument: "Treasury Bill",
    customerId: "CUS-1006",
    counterparty: "Federal Government of Nigeria",
    faceValue: 8_500_000,
    originalRate: 20.1,
    revisedRate: 18.6,
    tenorDays: 182,
    daysElapsed: 82,
    liquidationFaceValue: 0,
    status: "rejected",
    failureReason: "Rate authority evidence was not attached",
    owner: "Compliance",
    slaHours: 24,
    purchaseTimestamp: "2026-10-04T15:10:11Z",
    exceptionDetectedAt: "2026-10-04T15:30:00Z",
  },
  {
    reference: "AIP-FI-20261003-00022",
    instrument: "Commercial Paper",
    customerId: "CUS-1007",
    counterparty: "Airtel Africa Plc",
    faceValue: 45_000_000,
    originalRate: 18.75,
    revisedRate: 17.5,
    tenorDays: 270,
    daysElapsed: 110,
    liquidationFaceValue: 15_000_000,
    status: "partially liquidated",
    failureReason: "Partial liquidation executed; residual position open",
    owner: "Treasury Operations",
    slaHours: 48,
    purchaseTimestamp: "2026-10-03T12:45:30Z",
    exceptionDetectedAt: "2026-10-03T13:02:00Z",
  },
  {
    reference: "AIP-FI-20261002-00018",
    instrument: "Treasury Bill",
    customerId: "CUS-1008",
    counterparty: "Federal Government of Nigeria",
    faceValue: 18_000_000,
    originalRate: 17.9,
    revisedRate: 17.2,
    tenorDays: 364,
    daysElapsed: 145,
    liquidationFaceValue: 6_000_000,
    status: "reconciled",
    failureReason: "Cash and securities positions reconciled",
    owner: "Finance Control",
    slaHours: 48,
    purchaseTimestamp: "2026-10-02T10:00:00Z",
    exceptionDetectedAt: "2026-10-02T10:20:00Z",
  },
  {
    reference: "AIP-FI-20261001-00011",
    instrument: "Commercial Paper",
    customerId: "CUS-1009",
    counterparty: "Dangote Cement Plc",
    faceValue: 27_500_000,
    originalRate: 20.5,
    revisedRate: 18.25,
    tenorDays: 180,
    daysElapsed: 29,
    liquidationFaceValue: 7_500_000,
    status: "pending approval",
    failureReason: "Awaiting checker review of revised pricing",
    owner: "Fixed Income Desk",
    slaHours: 12,
    purchaseTimestamp: "2026-10-01T09:12:00Z",
    exceptionDetectedAt: "2026-10-01T09:30:00Z",
  },
  {
    reference: "AIP-FI-20260930-00008",
    instrument: "Treasury Bill",
    customerId: "CUS-1010",
    counterparty: "Federal Government of Nigeria",
    faceValue: 6_000_000,
    originalRate: 16.8,
    revisedRate: 16.1,
    tenorDays: 91,
    daysElapsed: 90,
    liquidationFaceValue: 0,
    status: "failed",
    failureReason: "Settlement amount differs from expected proceeds",
    owner: "Finance Control",
    slaHours: 6,
    purchaseTimestamp: "2026-09-30T14:50:22Z",
    exceptionDetectedAt: "2026-09-30T15:05:00Z",
  },
  {
    reference: "AIP-FI-20260928-00004",
    instrument: "Commercial Paper",
    customerId: "CUS-1011",
    counterparty: "MTN Nigeria",
    faceValue: 21_000_000,
    originalRate: 19.75,
    revisedRate: 18.4,
    tenorDays: 180,
    daysElapsed: 42,
    liquidationFaceValue: 4_000_000,
    status: "settlement pending",
    failureReason: "Bank settlement confirmation outstanding",
    owner: "Treasury Operations",
    slaHours: 24,
    purchaseTimestamp: "2026-09-28T16:20:00Z",
    exceptionDetectedAt: "2026-09-28T16:35:00Z",
  },
];

export interface FixedIncomeCalculationInput {
  faceValue: number;
  originalRate: number;
  revisedRate: number;
  tenorDays: number;
  daysElapsed: number;
  liquidationFaceValue: number;
  dayCountBasis: 360 | 365;
  includeAccruedInterest?: boolean;
  actualCashReceived?: number | null;
}

export function calculateFixedIncomeImpact(input: FixedIncomeCalculationInput) {
  const remainingDays = input.tenorDays - input.daysElapsed;
  const remainingFaceValue = input.faceValue - input.liquidationFaceValue;
  const originalDiscount =
    input.faceValue * (input.originalRate / 100) * (input.tenorDays / input.dayCountBasis);
  const purchaseCash = input.faceValue - originalDiscount;
  const originalImpliedYield =
    purchaseCash > 0 && input.tenorDays > 0
      ? (((input.faceValue - purchaseCash) / purchaseCash) *
          input.dayCountBasis *
          100) /
        input.tenorDays
      : null;
  const allocatedPurchaseCashLiquidated =
    purchaseCash * (input.liquidationFaceValue / input.faceValue);
  const allocatedPurchaseCashRemaining =
    purchaseCash * (remainingFaceValue / input.faceValue);
  const liquidationDiscount =
    input.liquidationFaceValue *
    (input.revisedRate / 100) *
    (remainingDays / input.dayCountBasis);
  const liquidationProceeds = input.liquidationFaceValue - liquidationDiscount;
  const remainingDiscount =
    remainingFaceValue * (input.revisedRate / 100) * (remainingDays / input.dayCountBasis);
  const remainingDiscountedValue = remainingFaceValue - remainingDiscount;
  const accruedInterest = input.includeAccruedInterest
    ? (input.liquidationFaceValue *
        (input.originalRate / 100) *
        input.daysElapsed) /
      input.dayCountBasis
    : 0;
  const settlementVariance =
    input.actualCashReceived == null
      ? null
      : liquidationProceeds - input.actualCashReceived;
  const inverseYield =
    remainingFaceValue > 0 && remainingDiscountedValue > 0 && remainingDays > 0
      ? ((remainingFaceValue / remainingDiscountedValue - 1) *
          input.dayCountBasis *
          100) /
        remainingDays
      : null;

  return {
    remainingDays,
    originalDiscount,
    purchaseCash,
    originalImpliedYield,
    allocatedPurchaseCashLiquidated,
    allocatedPurchaseCashRemaining,
    liquidationDiscount,
    liquidationProceeds,
    accruedInterest,
    actualCashRecovered: input.actualCashReceived ?? null,
    settlementVariance,
    remainingFaceValue,
    remainingDiscount,
    remainingDiscountedValue,
    revisedInverseInterest: remainingDiscount,
    impliedInverseYield: inverseYield,
    realisedProfitLoss: liquidationProceeds - allocatedPurchaseCashLiquidated,
    unrealisedProfitLoss: remainingDiscountedValue - allocatedPurchaseCashRemaining,
  };
}
