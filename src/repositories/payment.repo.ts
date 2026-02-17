import { AppDataSource } from "../data-source";
import { Payment } from "../models/Payment";
import { SelectQueryBuilder } from "typeorm";
import { PaymentMode } from "../enums/paymentMode";
import { PaymentStatus } from "../enums/paymentStatus";

export const paymentRepo = AppDataSource.getRepository(Payment);

export const createPaymentEntity = (data: Partial<Payment>) =>  paymentRepo.create(data);

export const savePayment = (payment: Payment) =>  paymentRepo.save(payment);

export const findPaymentById = (id: number) =>
  paymentRepo.findOne({
    where: { id },
    relations: ["donor", "projectSubscription"]
  });


export const getPaymentsQueryBuilder = () =>
  paymentRepo
    .createQueryBuilder("payment")
    .leftJoinAndSelect("payment.donor", "donor")
    .leftJoinAndSelect("payment.projectSubscription", "ps")
    .leftJoinAndSelect("ps.project", "project");

export const getPaymentSummaryQueryBuilder = () =>
  paymentRepo
    .createQueryBuilder("payment")
    .leftJoin("payment.donor", "donor");


export const getDonorPaymentsQueryBuilder = () =>
  paymentRepo
    .createQueryBuilder("payment")
    .leftJoinAndSelect("payment.donor", "donor")
    .leftJoinAndSelect("donor.rep", "rep");



interface GetPaymentsRepoParams {
  page: number;
  limit: number;
  month?: number | null;
  year?: number | null;
  name?: string;
  regNum?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export const getPaymentsWithFilters = async ({
  page,
  limit,
  month,
  year,
  name,
  regNum,
  sortBy,
  sortOrder = "ASC",
}: GetPaymentsRepoParams) => {
  const skip = (page - 1) * limit;

  const qb = getPaymentsQueryBuilder();

 
  if (month && year) {
    qb.andWhere("EXTRACT(MONTH FROM payment.paymentDate) = :month", { month })
      .andWhere("EXTRACT(YEAR FROM payment.paymentDate) = :year", { year });
  }

  if (name) {
    qb.andWhere("donor.name ILIKE :name", { name: `%${name}%` });
  }

  if (regNum) {
    qb.andWhere("donor.regNum = :regNum", { regNum });
  }

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
    allowedSortFields[sortBy as string] || "payment.paymentDate";

  qb.orderBy(sortField, sortOrder);

  
  qb.skip(skip).take(limit);

  return qb.getManyAndCount();
};


interface GetPaymentSummaryRepoParams {
  month?: number | null;
  year?: number | null;
}

export const getPaymentSummary = async ({
  month,
  year,
}: GetPaymentSummaryRepoParams) => {
  const qb = paymentRepo.createQueryBuilder("payment");

  if (month && year) {
    qb.andWhere("EXTRACT(MONTH FROM payment.paymentDate) = :month", { month })
      .andWhere("EXTRACT(YEAR FROM payment.paymentDate) = :year", { year });
  }

  const result = await qb
    .select([
      `SUM(CASE WHEN payment.mode = :onlineMode THEN payment.amount ELSE 0 END) as online_amount`,
      `COUNT(CASE WHEN payment.mode = :onlineMode THEN 1 END) as online_count`,
      `SUM(CASE WHEN payment.mode = :offlineMode THEN payment.amount ELSE 0 END) as offline_amount`,
      `COUNT(CASE WHEN payment.mode = :offlineMode THEN 1 END) as offline_count`,
      `SUM(CASE WHEN payment.status = :pendingStatus THEN payment.amount ELSE 0 END) as pending_amount`,
      `COUNT(CASE WHEN payment.status = :pendingStatus THEN 1 END) as pending_count`,
      `SUM(CASE WHEN payment.status = :notPaidStatus THEN payment.amount ELSE 0 END) as not_paid_amount`,
      `COUNT(CASE WHEN payment.status = :notPaidStatus THEN 1 END) as not_paid_count`,
    ])
    .setParameters({
      onlineMode: PaymentMode.ONLINE,
      offlineMode: PaymentMode.PAID_TO_REP,
      pendingStatus: PaymentStatus.PENDING_WITH_REP,
      notPaidStatus: PaymentStatus.NOT_PAID,
    })
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

  return result;
};

interface GetDonorSubscriptionPaymentsParams {
  donorId: string;
  month?: number | null;
  year?: number | null;
}

export const getDonorSubscriptionPayments = async ({
  donorId,
  month,
  year,
}: GetDonorSubscriptionPaymentsParams) => {
  const qb = getDonorPaymentsQueryBuilder();

  qb.where("donor.regNum = :donorId", { donorId });

  if (month && year) {
    qb.andWhere("EXTRACT(MONTH FROM payment.paymentDate) = :month", { month })
      .andWhere("EXTRACT(YEAR FROM payment.paymentDate) = :year", { year });
  }

  return qb.getMany();
};
