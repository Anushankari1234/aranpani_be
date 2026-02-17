import { AppDataSource } from "../data-source";
import { Payment } from "../models/Payment";

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