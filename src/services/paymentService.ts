import { PaymentStatus } from "../enums/paymentStatus";
import { PaymentMode } from "../enums/paymentMode";

import {
  createPaymentEntity,
  savePayment,
  getPaymentsQueryBuilder,
  getPaymentSummaryQueryBuilder,
  getDonorPaymentsQueryBuilder,
} from "../repositories/paymetRepo";
import { CreatePaymentDTO } from "../validations/paymentSchema";
import { findDonorByRegNum, getDonorOneTimeDonationsQueryBuilder } from "../repositories/donorRepo";
import { findSubscriptionById } from "../repositories/subscriptionRepo";
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
  const skip = (page - 1) * limit;

  const month = query.month ? Number(query.month) : null;
  const year = query.year ? Number(query.year) : null;

  const sortOrder = query.sortOrder?.toUpperCase() === "DESC" ? "DESC" : "ASC";

  const qb = getPaymentsQueryBuilder();

  if (month && year) {
    qb.andWhere("EXTRACT(MONTH FROM payment.paymentDate) = :month", {
      month,
    }).andWhere("EXTRACT(YEAR FROM payment.paymentDate) = :year", { year });
  }

  if (query.name)
    qb.andWhere("donor.name ILIKE :name", { name: `%${query.name}%` });
  if (query.regNum)
    qb.andWhere("donor.regNum = :regNum", { regNum: query.regNum });

  const allowedSortFields: Record<string, string> = {
    amount: "payment.amount",
    paymentDate: "payment.paymentDate",
    monthYear: "payment.monthYear",
    status: "payment.status",
    mode: "payment.mode",
    name: "donor.name",
    regNum: "donor.regNum",
    projectName: "project.templeName",
  };
  const sortField =
    allowedSortFields[query.sortBy as string] || "payment.paymentDate";
  qb.orderBy(sortField, sortOrder as "ASC" | "DESC");

  qb.skip(skip).take(limit);

  const [payments, totalRecords] = await qb.getManyAndCount();

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

  const qb = getPaymentSummaryQueryBuilder();
  if (month && year) {
    qb.andWhere("EXTRACT(MONTH FROM payment.paymentDate) = :month", {
      month,
    }).andWhere("EXTRACT(YEAR FROM payment.paymentDate) = :year", { year });
  }

  const result = await qb
    .select([
      `SUM(CASE WHEN payment.mode = '${PaymentMode.ONLINE}' THEN payment.amount ELSE 0 END) as online_amount`,
      `COUNT(CASE WHEN payment.mode = '${PaymentMode.ONLINE}' THEN 1 END) as online_count`,
      `SUM(CASE WHEN payment.mode = '${PaymentMode.PAID_TO_REP}' THEN payment.amount ELSE 0 END) as offline_amount`,
      `COUNT(CASE WHEN payment.mode = '${PaymentMode.PAID_TO_REP}' THEN 1 END) as offline_count`,
      `SUM(CASE WHEN payment.status = '${PaymentStatus.PENDING_WITH_REP}' THEN payment.amount ELSE 0 END) as pending_amount`,
      `COUNT(CASE WHEN payment.status = '${PaymentStatus.PENDING_WITH_REP}' THEN 1 END) as pending_count`,
      `SUM(CASE WHEN payment.status = '${PaymentStatus.NOT_PAID}' THEN payment.amount ELSE 0 END) as not_paid_amount`,
      `COUNT(CASE WHEN payment.status = '${PaymentStatus.NOT_PAID}' THEN 1 END) as not_paid_count`,
    ])
    .getRawOne<{
      online_amount: string;
      online_count: string;
      offline_amount: string;
      offline_count: string;
      pending_amount: string;
      pending_count: string;
      not_paid_amount: string;
      not_paid_count: string;
    }>();

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
  const sortOrder = query.sortOrder?.toUpperCase() === "DESC" ? "DESC" : "ASC";

  const paymentQB = getDonorPaymentsQueryBuilder();
  paymentQB.where("donor.regNum = :donorId", { donorId });

  if (month && year) {
    paymentQB.andWhere("EXTRACT(MONTH FROM payment.paymentDate) = :month", { month })
             .andWhere("EXTRACT(YEAR FROM payment.paymentDate) = :year", { year });
  }

  const subscriptionPayments = await paymentQB.getMany();

  const donationQB = getDonorOneTimeDonationsQueryBuilder();
  donationQB.where("donor.regNum = :donorId", { donorId });

  if (month && year) {
    donationQB.andWhere("EXTRACT(MONTH FROM donation.donationDate) = :month", { month })
              .andWhere("EXTRACT(YEAR FROM donation.donationDate) = :year", { year });
  }

  const oneTimeDonations = await donationQB.getMany();

  const subscriptionResults: DonorPaymentItem[] = subscriptionPayments.map(p => ({
    date: p.paymentDate,
    paymentMode: p.mode,
    transactionId: p.transactionId ?? null,
    repName: p.donor.rep?.name ?? null,
    repRegisterNumber: p.donor.rep?.regNum ?? null,
    type: "SUBSCRIPTION"
  }));

  const oneTimeResults: DonorPaymentItem[] = oneTimeDonations.map(d => ({
    date: d.donationDate,
    paymentMode: d.paymentMode,
    transactionId: d.transactionId ?? null,
    repName: null,
    repRegisterNumber: null,
    type: "ONE_TIME"
  }));

 
  const merged = [...subscriptionResults, ...oneTimeResults];

 
  merged.sort((a, b) => {
    if (sortOrder === "ASC") {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    return new Date(b.date).getTime() - new Date(a.date).getTime();
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
