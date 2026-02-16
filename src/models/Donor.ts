import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne
} from 'typeorm';
import { UserType } from '../enums/userType';
import { GroupMember } from './GroupMembers';
import { ProjectSubscription } from './ProjectSubscription';
import { Payment } from './Payment';
import { ProjectDonation } from './ProjectDonation';

@Entity('donors')
export class Donor {
  @PrimaryColumn()
  regNum!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  phoneNumber!: string;

  @Column({unique : true})
  email!: string;

  @Column({ nullable: true })
  fatherOrHusbandName?: string;

  @Column('text', { nullable: true })
  address?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ nullable: true })
  district?: string;

  @Column({ nullable: true })
  pincode?: string;

  @Column({ type: 'date' })
  joinedDate!: Date;

  @Column({
    type: 'enum',
    enum: UserType
  })
  userType!: UserType;

  @ManyToOne(() => Donor, donor => donor.representedDonors)
  @JoinColumn({ name: 'rep_id', referencedColumnName: 'regNum' })
  rep!: Donor;

  @OneToMany(() => Donor, donor => donor.rep)
  representedDonors!: Donor[];

  @Column({ default: true })
  isActive!: boolean;

  @OneToMany(() => GroupMember, gm => gm.groupDonor)
  groupMembers!: GroupMember[];

  @OneToOne(
  () => ProjectSubscription,
  subscription => subscription.donor
)
projectSubscription!: ProjectSubscription;


  @OneToMany(() => Payment, payment => payment.donor)
  payments!: Payment[];

  @OneToMany(() => ProjectDonation, donation => donation.donor)
  projectDonations!: ProjectDonation[];
}
