import { PaymentStatus } from "../enums/paymentStatus";
import { PaymentMode } from "../enums/paymentMode";

import {
  createPaymentEntity,
  savePayment,
  getPaymentsWithFilters,
  getPaymentSummary,
  getDonorSubscriptionPayments,
  findPaymentBySubscriptionAndMonth,
} from "../repositories/payment.repo";
import { CreatePaymentDTO } from "../validations/paymentSchema";
import {
  findDonorByRegNum,
  getDonorOneTimeDonations,
} from "../repositories/donor.repo";
import { findSubscriptionById } from "../repositories/subscription.repo";
import { PaginationQuery } from "../shared/types/pagination.type";
import { PaymentListResponse } from "../shared/types/paymentResponse.type";
import { PaymentListItem } from "../shared/types/paymentItem.type";
import { PaymentSummaryResponse } from "../shared/types/paymentSummary.type";
import { DonorPaymentResponse } from "../shared/types/donorResponse.type";
import { DonorPaymentItem } from "../shared/types/donorPayment.type";

export const createPaymentService = async (body: CreatePaymentDTO) => {
  const donor = await findDonorByRegNum(body.donorId);
  if (!donor) {
    throw new Error("Donor not found");
  }

  const subscription = await findSubscriptionById(body.projectSubscriptionId);

  if (!subscription) {
    throw new Error("Project Subscription not found");
  }

  const monthYear = body.paymentDate.substring(0, 7);

  const existingPayment = await findPaymentBySubscriptionAndMonth({
    donorId: body.donorId,
    subscriptionId: body.projectSubscriptionId,
    monthYear,
  });

  if (existingPayment) {
    throw new Error("Payment already exists for this month");
  }

  let donationArray: string[] = [];

  if (body.donationScript) {
    donationArray = body.donationScript
      .split(",")
      .map((name: string) => name.trim());
  }

  const payment = createPaymentEntity({
    donor,
    projectSubscription: subscription,
    paymentDate: new Date(body.paymentDate),
    amount: body.amount,
    mode: body.mode as PaymentMode,
    transactionId: body.transactionId,
    donationScript: donationArray,
    status: PaymentStatus.PAID,
    monthYear: body.paymentDate.substring(0, 7),
  });

  return await savePayment(payment);
};

export const getPaymentsService = async (
  query: PaginationQuery,
): Promise<PaymentListResponse> => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  const month = query.month ? Number(query.month) : null;
  const year = query.year ? Number(query.year) : null;

  const sortOrder = query.sortOrder?.toUpperCase() === "DESC" ? "DESC" : "ASC";

  const [payments, totalRecords] = await getPaymentsWithFilters({
    page,
    limit,
    month,
    year,
    name: query.name,
    regNum: query.regNum,
    sortBy: query.sortBy,
    sortOrder,
  });

  const formattedPayments: PaymentListItem[] = payments.map((payment) => ({
    donorId: payment.donor.regNum,
    name: payment.donor.name,
    regNum: payment.donor.regNum,
    amount: Number(payment.amount),
    status: payment.status,
    paymentMode: payment.mode,
    monthYear: payment.monthYear,
    projectName: payment.projectSubscription?.project?.templeName ?? null,
  }));

  return {
    payments: formattedPayments,
    meta: {
      page,
      limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      sortBy: query.sortBy || "paymentDate",
      sortOrder,
      month,
      year,
    },
  };
};

export const getPaymentSummaryService = async (query: {
  month: number | string;
  year: number | string;
}): Promise<PaymentSummaryResponse> => {
  const month = Number(query.month);
  const year = Number(query.year);

  const result = await getPaymentSummary({ month, year });

  const safeResult = result ?? {
    online_amount: "0",
    online_count: "0",
    offline_amount: "0",
    offline_count: "0",
    pending_amount: "0",
    pending_count: "0",
    not_paid_amount: "0",
    not_paid_count: "0",
  };

  return {
    online: {
      count: Number(safeResult.online_count),
      amount: Number(safeResult.online_amount),
    },
    offline: {
      count: Number(safeResult.offline_count),
      amount: Number(safeResult.offline_amount),
    },
    pendingWithRep: {
      count: Number(safeResult.pending_count),
      amount: Number(safeResult.pending_amount),
    },
    notPaid: {
      count: Number(safeResult.not_paid_count),
      amount: Number(safeResult.not_paid_amount),
    },
  };
};

export const getDonorPaymentsService = async (
  donorId: string,
  query: PaginationQuery,
): Promise<DonorPaymentResponse> => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const month = query.month ? Number(query.month) : null;
  const year = query.year ? Number(query.year) : null;

  const sortOrder: "ASC" | "DESC" =
    query.sortOrder?.toUpperCase() === "DESC" ? "DESC" : "ASC";

  const sortBy = query.sortBy || "date";

  const allowedSortFields: Record<string, keyof DonorPaymentItem> = {
    date: "date",
    paymentMode: "paymentMode",
    transactionId: "transactionId",
    repName: "repName",
    repRegisterNumber: "repRegisterNumber",
    type: "type",
  };

  const sortField = allowedSortFields[sortBy] || "date";

  const subscriptionPayments = await getDonorSubscriptionPayments({
    donorId,
    month,
    year,
  });

  const oneTimeDonations = await getDonorOneTimeDonations({
    donorId,
    month,
    year,
  });

  const subscriptionResults: DonorPaymentItem[] = subscriptionPayments.map(
    (p) => ({
      date: p.paymentDate,
      paymentMode: p.mode,
      transactionId: p.transactionId ?? null,
      repName: p.donor.rep?.name ?? null,
      repRegisterNumber: p.donor.rep?.regNum ?? null,
      type: "SUBSCRIPTION",
    }),
  );

  const oneTimeResults: DonorPaymentItem[] = oneTimeDonations.map((d) => ({
    date: d.donationDate,
    paymentMode: d.paymentMode,
    transactionId: d.transactionId ?? null,
    repName: null,
    repRegisterNumber: null,
    type: "ONE_TIME",
  }));

  const merged = [...subscriptionResults, ...oneTimeResults];

  merged.sort((a, b) => {
    const valueA = a[sortField];
    const valueB = b[sortField];

    if (valueA == null) return 1;
    if (valueB == null) return -1;

    if (sortField === "date") {
      const timeA = new Date(valueA as Date).getTime();
      const timeB = new Date(valueB as Date).getTime();
      return sortOrder === "ASC" ? timeA - timeB : timeB - timeA;
    }

    const stringA = String(valueA).toLowerCase();
    const stringB = String(valueB).toLowerCase();

    if (stringA < stringB) return sortOrder === "ASC" ? -1 : 1;
    if (stringA > stringB) return sortOrder === "ASC" ? 1 : -1;

    return 0;
  });

  const paginated = merged.slice(skip, skip + limit);

  return {
    results: paginated,
    meta: {
      page,
      limit,
      totalRecords: merged.length,
      totalPages: Math.ceil(merged.length / limit),
    },
  };
};
