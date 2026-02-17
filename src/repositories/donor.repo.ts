import { AppDataSource } from "../data-source";
import { Donor } from "../models/Donor";
import { ProjectDonation } from "../models/ProjectDonation";

const donorRepo = AppDataSource.getRepository(Donor);

export const findDonorByRegNum = (regNum: string) => {
  return donorRepo.findOneBy({ regNum });
};

export const findDonorByPhoneNum = (phoneNumber : string) => {
  return donorRepo.findOneBy({phoneNumber})
}

export const createDonor = (data: Partial<Donor>) => donorRepo.create(data)
export const saveDonor = (data : Donor) => donorRepo.save(data)
export const findLastDonor = () => donorRepo.findOne({  where: {}, order: { regNum: "DESC" } });

export const getDonorOneTimeDonationsQueryBuilder = () => {
  return AppDataSource.getRepository(ProjectDonation)
    .createQueryBuilder("donation")
    .leftJoinAndSelect("donation.project", "project")
    .leftJoinAndSelect("donation.donor", "donor");
};

interface GetDonorOneTimeDonationsParams {
  donorId: string;
  month?: number | null;
  year?: number | null;
}

export const getDonorOneTimeDonations = async ({
  donorId,
  month,
  year,
}: GetDonorOneTimeDonationsParams) => {
  const qb = getDonorOneTimeDonationsQueryBuilder();

  qb.where("donor.regNum = :donorId", { donorId });

  if (month && year) {
    qb.andWhere("EXTRACT(MONTH FROM donation.donationDate) = :month", { month })
      .andWhere("EXTRACT(YEAR FROM donation.donationDate) = :year", { year });
  }

  return qb.getMany();
};
