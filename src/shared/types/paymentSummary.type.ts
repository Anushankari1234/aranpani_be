export interface PaymentSummaryItem {
  count: number;
  amount: number;
}

export interface PaymentSummaryResponse {
  online: PaymentSummaryItem;
  offline: PaymentSummaryItem;
  pendingWithRep: PaymentSummaryItem;
  notPaid: PaymentSummaryItem;
}

