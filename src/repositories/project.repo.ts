import { AppDataSource } from '../data-source';
import { Project } from '../models/Project';

export const projectRepo = AppDataSource.getRepository(Project);

export const findProjectByRegnum = async (regNum: string): Promise<Project | null> => {
  return await projectRepo.findOne({
    where: { regNum },
  });
};
