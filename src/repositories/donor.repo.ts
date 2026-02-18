import { AppDataSource } from '../data-source';
import { Donor } from '../models/Donor';
import { ProjectDonation } from '../models/ProjectDonation';
import { GetDonorOneTimeDonationsParams } from '../shared/types/donorPayment.type';
const donorRepo = AppDataSource.getRepository(Donor);

export const findDonorByRegNum = async (regNum: string): Promise<Donor | null> => {
  return await donorRepo.findOneBy({ regNum });
};

export const findDonorByPhoneNum = async (phoneNumber: string): Promise<Donor | null> => {
  return await donorRepo.findOneBy({ phoneNumber });
};

export const findLastDonor = async (): Promise<Donor | null> => {
  return await donorRepo.findOne({
    where: {},
    order: { regNum: 'DESC' },
  });
};

export const createDonor = async (data: Partial<Donor>): Promise<Donor> => {
  return await donorRepo.create(data);
};

export const saveDonor = async (data: Donor): Promise<Donor> => {
  return await donorRepo.save(data);
};

export const getDonorOneTimeDonationsQueryBuilder = () => {
  return AppDataSource.getRepository(ProjectDonation)
    .createQueryBuilder('donation')
    .leftJoinAndSelect('donation.project', 'project')
    .leftJoinAndSelect('donation.donor', 'donor');
};

export const getDonorOneTimeDonations = async ({
  donorId,
  month,
  year,
}: GetDonorOneTimeDonationsParams): Promise<ProjectDonation[]> => {
  const qb = getDonorOneTimeDonationsQueryBuilder();

  qb.where('donor.regNum = :donorId', { donorId });

  if (month && year) {
    qb.andWhere('EXTRACT(MONTH FROM donation.donationDate) = :month', { month }).andWhere(
      'EXTRACT(YEAR FROM donation.donationDate) = :year',
      { year },
    );
  }

  return await qb.getMany();
};
