import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { PaymentMode } from '../enums/paymentMode';
import { Project } from './Project';
import { Donor } from './Donor';

@Entity('project_donations')
export class ProjectDonation {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Project, (project) => project.donations)
  @JoinColumn({ name: 'project_id', referencedColumnName: 'id' })
  project: Project;

  @ManyToOne(() => Donor, (donor) => donor.projectDonations, { nullable: true })
  @JoinColumn({ name: 'donor_id', referencedColumnName: 'id' })
  donor: Donor;

  @Column({ type: 'varchar', length: 150 })
  donorName: string;

  @Column({ type: 'varchar', length: 20 })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 150 })
  email: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentMode,
  })
  paymentMode: PaymentMode;

  @Column({ type: 'varchar', length: 150 })
  transactionId: string;

  @Column({ type: 'boolean', default: false })
  otpVerified: boolean;

  @Column({ type: 'date' })
  donationDate: Date;
}
