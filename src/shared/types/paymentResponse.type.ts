import { PaymentListItem } from "./paymentItem.type";

export interface PaymentListResponse {
  payments: PaymentListItem[];
  meta: {
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
    sortBy: string;
    sortOrder: "ASC" | "DESC";
    month?: number | null;
    year?: number | null;
  };
}

