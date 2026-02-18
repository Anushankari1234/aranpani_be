import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { PaymentMode } from '../enums/paymentMode';
import { PaymentStatus } from '../enums/paymentStatus';
import { Donor } from './Donor';
import { ProjectSubscription } from './ProjectSubscription';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'date' })
  paymentDate: Date;

  @Column({
    type: 'enum',
    enum: PaymentMode,
  })
  mode: PaymentMode;

  @Column({ type: 'varchar', length: 150 })
  transactionId: string;

  @Column({ type: 'json' })
  donationScript: string[];

  @ManyToOne(() => Donor, (donor) => donor.payments)
  @JoinColumn({ name: 'donor_id', referencedColumnName: 'id' })
  donor: Donor;

  @ManyToOne(() => ProjectSubscription, (ps) => ps.payments)
  @JoinColumn({ name: 'project_subscription_id', referencedColumnName: 'id' })
  projectSubscription: ProjectSubscription;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PAID,
  })
  status: PaymentStatus;

  @Column({ type: 'varchar', length: 7 })
  monthYear: string;
}
