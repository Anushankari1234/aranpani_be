import { findDonorByRegNum } from "../repositories/donor.repo";
import { countMembersByDonorId } from "../repositories/groupMember.repo";

export const getMemberCountService = async (donorId: string) => {
  const donor = await findDonorByRegNum(donorId);

  if (!donor) {
    throw new Error("Donor not found");
  }

  const memberCount = await countMembersByDonorId(donorId);

  return {
    donorId,
    memberCount,
  };
};
