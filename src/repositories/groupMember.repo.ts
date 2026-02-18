import { AppDataSource } from '../data-source';
import { GroupMember } from '../models/GroupMembers';

export const countMembersByDonorId = async (donorId: string): Promise<number> => {
  return await AppDataSource.getRepository(GroupMember)
    .createQueryBuilder('gm')
    .leftJoin('gm.groupDonor', 'donor')
    .where('donor.regNum = :donorId', { donorId })
    .getCount();
};
