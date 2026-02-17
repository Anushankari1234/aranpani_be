import {
  createProjectDonation,
  saveProjectDonation,
} from "../repositories/projectDonation.repo";
import { findProjectByRegnum } from "../repositories/project.repo";
import {
  findDonorByPhoneNum,
  createDonor,
  saveDonor,
  findLastDonor,
} from "../repositories/donor.repo";
import { CreateProjectDonationDTO } from "../validations/projectDonationSchema";
import { UserType } from "../enums/userType";
export const createProjectDonationService = async (
  payload: CreateProjectDonationDTO,
) => {
  const project = await findProjectByRegnum(payload.projectId);
  if (!project) throw new Error("Project not found");

  let donor = await findDonorByPhoneNum(payload.phoneNumber);
  const lastDonor = await findLastDonor();
  const lastNum = lastDonor ? parseInt(lastDonor.regNum.slice(1)) : 0;
  const newRegNum = `D${String(lastNum + 1).padStart(3, "0")}`;

  if (!donor) {
    donor = createDonor({
      regNum: newRegNum,
      name: payload.donorName,
      phoneNumber: payload.phoneNumber,
      email: payload.email,
      address: payload.address,
      joinedDate: new Date(),
      userType: UserType.INDIVIDUAL,
    });

    await saveDonor(donor);
  }

  const donation = createProjectDonation({
    project,
    donor,
    donorName: payload.donorName,
    phoneNumber: payload.phoneNumber,
    email: payload.email,
    address: payload.address,
    amount: payload.amount,
    paymentMode: payload.paymentMode,
    transactionId: payload.transactionId,
    otpVerified: true,
    donationDate: new Date(),
  });

  await saveProjectDonation(donation);

  return {
    message: "One-time donation successful",
  };
};
