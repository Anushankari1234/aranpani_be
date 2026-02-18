import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Donor } from './Donor';

@Entity('group_members')
export class GroupMember {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Donor, (donor) => donor.groupMembers)
  @JoinColumn({ name: 'group_donor_id', referencedColumnName: 'id' })
  groupDonor: Donor;

  @Column({ type: 'varchar', length: 150 })
  memberName: string;
}
