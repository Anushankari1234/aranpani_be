import { AppDataSource } from "../data-source";
import { Project } from "../models/Project";

export const projectRepo = AppDataSource.getRepository(Project)

export const findProjectByRegnum = (regNum : string ) => {
    return projectRepo.findOne({
    where: { regNum }
  });
}