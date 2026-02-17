import { AppDataSource } from "../data-source";
import { ProjectSubscription } from "../models/ProjectSubscription";

const subscriptionRepo = AppDataSource.getRepository(ProjectSubscription);

export const findSubscriptionById = (id: number) => {
  return subscriptionRepo.findOneBy({ id });
};

export const findSubscriptionByDonorId = (regNum: string) => {
  return subscriptionRepo.findOne({
    where: { donor: { regNum } },
    relations: ["donor"], 
  });
};

