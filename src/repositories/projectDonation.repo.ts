import { AppDataSource } from '../data-source';
import { ProjectDonation } from '../models/ProjectDonation';

export const projectDonationRepo = AppDataSource.getRepository(ProjectDonation);

export const createProjectDonation = async (
  data: Partial<ProjectDonation>,
): Promise<ProjectDonation> => {
  return projectDonationRepo.create(data);
};

export const saveProjectDonation = async (donation: ProjectDonation): Promise<ProjectDonation> => {
  return await projectDonationRepo.save(donation);
};
