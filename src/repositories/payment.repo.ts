import { AppDataSource } from '../data-source';
import { Payment } from '../models/Payment';
import { PaymentSortFields } from '../enums/paymentQueryConstants';
import { applyMonthYearFilter } from '../shared/utils/queryFilter';
import {
  GetDonorSubscriptionPaymentsParams,
  GetPaymentsRepoParams,
  GetPaymentSummaryRepoParams,
} from '../shared/types/paymentItem.type';
import { PaymentMode } from '../enums/paymentMode';
import { PaymentStatus } from '../enums/paymentStatus';

export const paymentRepo = AppDataSource.getRepository(Payment);

export const createPaymentEntity = async (data: Partial<Payment>): Promise<Payment> => {
  return await paymentRepo.create(data);
};

export const savePayment = async (payment: Payment): Promise<Payment> => {
  return await paymentRepo.save(payment);
};

export const findPaymentById = async (id: number): Promise<Payment | null> => {
  return await paymentRepo.findOne({
    where: { id },
    relations: ['donor', 'projectSubscription'],
  });
};

export const getDonorSubscriptionPayments = async ({
  donorId,
  month,
  year,
}: GetDonorSubscriptionPaymentsParams) => {
  const qb = paymentRepo
    .createQueryBuilder('payment')
    .leftJoinAndSelect('payment.donor', 'donor')
    .leftJoinAndSelect('donor.rep', 'rep')
    .where('donor.regNum = :donorId', { donorId });

  applyMonthYearFilter(qb, month, year);

  return await qb.getMany();
};

export const getPaymentsQueryBuilder = () =>
  paymentRepo
    .createQueryBuilder('payment')
    .leftJoinAndSelect('payment.donor', 'donor')
    .leftJoinAndSelect('payment.projectSubscription', 'ps')
    .leftJoinAndSelect('ps.project', 'project');

export const findPaymentBySubscriptionAndMonth = async ({
  donorId,
  subscriptionId,
  monthYear,
}: {
  donorId: string;
  subscriptionId: number;
  monthYear: string;
}): Promise<Payment | null> => {
  return await paymentRepo
    .createQueryBuilder('payment')
    .leftJoin('payment.donor', 'donor')
    .leftJoin('payment.projectSubscription', 'subscription')
    .where('donor.regNum = :donorId', { donorId })
    .andWhere('subscription.id = :subscriptionId', { subscriptionId })
    .andWhere('payment.monthYear = :monthYear', { monthYear })
    .getOne();
};

export const getPaymentsWithFilters = async ({
  page,
  limit,
  month,
  year,
  name,
  regNum,
  sortBy,
  sortOrder = 'ASC',
}: GetPaymentsRepoParams): Promise<[Payment[], number]> => {
  const skip = (page - 1) * limit;
  const qb = getPaymentsQueryBuilder();

  applyMonthYearFilter(qb, month, year);

  if (name) {
    qb.andWhere('donor.name ILIKE :name', { name: `%${name}%` });
  }

  if (regNum) {
    qb.andWhere('donor.regNum = :regNum', { regNum });
  }

  const sortField =
    PaymentSortFields[sortBy as keyof typeof PaymentSortFields] || PaymentSortFields.PAYMENT_DATE;

  qb.orderBy(sortField, sortOrder).skip(skip).take(limit);

  return await qb.getManyAndCount();
};

export const getPaymentSummary = async ({ month, year }: { month: number; year: number }) => {
  const qb = AppDataSource.getRepository(Payment).createQueryBuilder('payment');

  if (month && year) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    qb.where('payment.paymentDate >= :startDate', { startDate }).andWhere(
      'payment.paymentDate < :endDate',
      { endDate },
    );
  }

  return await qb
    .select([
      `COALESCE(SUM(CASE WHEN payment.mode = :onlineMode THEN payment.amount ELSE 0 END), 0) as online_amount`,
      `COALESCE(COUNT(CASE WHEN payment.mode = :onlineMode THEN 1 END), 0) as online_count`,
      `COALESCE(SUM(CASE WHEN payment.mode = :offlineMode THEN payment.amount ELSE 0 END), 0) as offline_amount`,
      `COALESCE(COUNT(CASE WHEN payment.mode = :offlineMode THEN 1 END), 0) as offline_count`,
      `COALESCE(SUM(CASE WHEN payment.status = :pendingStatus THEN payment.amount ELSE 0 END), 0) as pending_amount`,
      `COALESCE(COUNT(CASE WHEN payment.status = :pendingStatus THEN 1 END), 0) as pending_count`,
      `COALESCE(SUM(CASE WHEN payment.status = :notPaidStatus THEN payment.amount ELSE 0 END), 0) as not_paid_amount`,
      `COALESCE(COUNT(CASE WHEN payment.status = :notPaidStatus THEN 1 END), 0) as not_paid_count`,
    ])
    .setParameters({
      onlineMode: PaymentMode.ONLINE,
      offlineMode: PaymentMode.PAID_TO_REP,
      pendingStatus: PaymentStatus.PENDING,
      notPaidStatus: PaymentStatus.NOT_PAID,
    })
    .getRawOne();
};
