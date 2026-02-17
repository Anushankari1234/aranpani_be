import { PaymentMode } from "../../enums/paymentMode";
import { PaymentStatus } from "../../enums/paymentStatus";

export interface PaymentListItem {
  donorId: string;
  name: string;
  regNum: string;
  amount: number;
  status: PaymentStatus;
  paymentMode: PaymentMode;
  monthYear: string;
  projectName?: string | null;
}
