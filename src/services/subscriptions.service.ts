import { findDonorByRegNum } from "../repositories/donorRepo";
import { findSubscriptionByDonorId } from "../repositories/subscriptionRepo";

export const getSubscriptionId = async (regNum: string): Promise<number> => {
  const donor = await findDonorByRegNum(regNum);
  if (!donor) {
    throw new Error("Donor not found");
  }

  const subscription = await findSubscriptionByDonorId(regNum);
  if (!subscription) {
    throw new Error("Subscription not found for this donor");
  }

  return subscription.id; 
};
