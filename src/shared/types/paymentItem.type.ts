import { PaymentMode } from '../../enums/paymentMode';
import { PaymentStatus } from '../../enums/paymentStatus';

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
export interface GetPaymentsRepoParams {
  page: number;
  limit: number;
  month?: number | null;
  year?: number | null;
  name?: string;
  regNum?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface GetPaymentSummaryRepoParams {
  month?: number | null;
  year?: number | null;
}

export interface GetDonorSubscriptionPaymentsParams {
  donorId: string;
  month?: number | null;
  year?: number | null;
}

export interface PaymentSummaryResult {
  online_amount: string;
  online_count: string;
  offline_amount: string;
  offline_count: string;
  pending_amount: string;
  pending_count: string;
  not_paid_amount: string;
  not_paid_count: string;
}
