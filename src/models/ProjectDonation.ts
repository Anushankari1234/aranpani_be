import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { PaymentMode } from '../enums/paymentMode';
import { Project } from './Project';
import { Donor } from './Donor';

@Entity('project_donations')
export class ProjectDonation {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @ManyToOne(() => Project, project => project.donations)
  @JoinColumn({ name: 'project_id', referencedColumnName: 'regNum' })
  project!: Project;

  @ManyToOne(() => Donor, donor => donor.projectDonations, { nullable: true })
  @JoinColumn({ name: 'donor_id', referencedColumnName: 'regNum' })
  donor?: Donor;

  @Column({ nullable: true })
  donorName?: string;

  @Column()
  phoneNumber!: string;

  @Column({ nullable: true })
  email?: string;

  @Column('text', { nullable: true })
  address?: string;

  @Column('decimal')
  amount!: number;

  @Column({
    type: 'enum',
    enum: PaymentMode
  })
  paymentMode!: PaymentMode;

  @Column({ nullable: true })
  transactionId?: string;

  @Column({ default: false })
  otpVerified!: boolean;

  @Column({ type: 'date' })
  donationDate!: Date;
}
