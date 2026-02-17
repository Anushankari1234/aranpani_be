import { AppDataSource } from "../data-source";
import { ProjectDonation } from "../models/ProjectDonation";

export const projectDonationRepo =  AppDataSource.getRepository(ProjectDonation);

export const createProjectDonation = (data: Partial<ProjectDonation>) => projectDonationRepo.create(data);

export const saveProjectDonation = (donation: ProjectDonation) => projectDonationRepo.save(donation);
