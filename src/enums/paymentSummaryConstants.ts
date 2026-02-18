import { PaymentMode } from '../enums/paymentMode';
import { PaymentStatus } from '../enums/paymentStatus';

export const PaymentSummaryParams = {
  ONLINE_MODE: PaymentMode.ONLINE,
  OFFLINE_MODE: PaymentMode.PAID_TO_REP,
  PENDING_STATUS: PaymentStatus.PENDING_WITH_REP,
  NOT_PAID_STATUS: PaymentStatus.NOT_PAID,
};
