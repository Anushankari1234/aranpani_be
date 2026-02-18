import { ErrorMessages } from '../enums/errors.enum';
import { findDonorByRegNum } from '../repositories/donor.repo';
import { findSubscriptionByDonorId } from '../repositories/subscription.repo';

export const getSubscriptionId = async (regNum: string): Promise<number> => {
  const donor = await findDonorByRegNum(regNum);
  if (!donor) {
    throw new Error('Donor not found');
  }

  const subscription = await findSubscriptionByDonorId(regNum);
  if (!subscription) {
    throw new Error(ErrorMessages.PROJECT_SUBSCRIPTION_NOT_FOUND);
  }

  return subscription.id;
};
