import { DonorPaymentItem } from "./donorPayment.type";

export interface DonorPaymentResponse {
  results: DonorPaymentItem[];
  meta: {
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
  };
}