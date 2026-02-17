import { findDonorByRegNum } from "../repositories/donorRepo";
import { countMembersByDonorId } from "../repositories/groupMemberRepo";

export const getMemberCountService = async (donorId: string) => {

  const donor = await findDonorByRegNum(donorId);

  if (!donor) {
    throw new Error("Donor not found");
  }

  const memberCount = await countMembersByDonorId(donorId);

  return {
    donorId,
    memberCount
  };
};
