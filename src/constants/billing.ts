export const BillingCycle = {
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
} as const;

// types
export type TBillingCycle = (typeof BillingCycle)[keyof typeof BillingCycle];
