import { PaymentListItem } from './paymentItem.type';

export interface PaymentListResponse {
  payments: PaymentListItem[];
  meta: {
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
    sortBy: string;
    sortOrder: 'ASC' | 'DESC';
    month?: number | null;
    year?: number | null;
  };
}
export interface PaymentSummaryRaw {
  online_amount: string;
  online_count: string;
  offline_amount: string;
  offline_count: string;
  pending_amount: string;
  pending_count: string;
  not_paid_amount: string;
  not_paid_count: string;
}
