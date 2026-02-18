import { AppDataSource } from '../data-source';
import { ProjectSubscription } from '../models/ProjectSubscription';

const subscriptionRepo = AppDataSource.getRepository(ProjectSubscription);

export const findSubscriptionById = async (id: number): Promise<ProjectSubscription | null> => {
  return await subscriptionRepo.findOneBy({ id });
};

export const findSubscriptionByDonorId = async (
  regNum: string,
): Promise<ProjectSubscription | null> => {
  return await subscriptionRepo.findOne({
    where: { donor: { regNum } },
    relations: ['donor'],
  });
};
