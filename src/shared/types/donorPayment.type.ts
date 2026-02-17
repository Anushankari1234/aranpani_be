import { PaymentMode } from "../../enums/paymentMode";

export type DonorPaymentItem = {
  date: Date;
  paymentMode: PaymentMode;
  transactionId: string | null;
  repName: string | null;
  repRegisterNumber: string | null;
  type: "SUBSCRIPTION" | "ONE_TIME";
};
