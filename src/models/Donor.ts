import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserType } from '../enums/userType';
import { GroupMember } from './GroupMembers';
import { ProjectSubscription } from './ProjectSubscription';
import { Payment } from './Payment';
import { ProjectDonation } from './ProjectDonation';
@Entity('donors')
export class Donor {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  regNum: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  fatherOrHusbandName: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  state: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  district: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  pincode: string;

  @Column({ type: 'date' })
  joinedDate: Date;

  @Column({
    type: 'enum',
    enum: UserType,
  })
  userType: UserType;

  @ManyToOne(() => Donor, (donor) => donor.representedDonors, { nullable: true })
  @JoinColumn({ name: 'rep_id', referencedColumnName: 'id' })
  rep: Donor;

  @OneToMany(() => Donor, (donor) => donor.rep)
  representedDonors: Donor[];

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => GroupMember, (gm) => gm.groupDonor)
  groupMembers: GroupMember[];

  @OneToOne(() => ProjectSubscription, (sub) => sub.donor)
  projectSubscription: ProjectSubscription;

  @OneToMany(() => Payment, (payment) => payment.donor)
  payments: Payment[];

  @OneToMany(() => ProjectDonation, (donation) => donation.donor)
  projectDonations: ProjectDonation[];
}
