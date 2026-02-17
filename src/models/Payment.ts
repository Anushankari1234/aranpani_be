import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { PaymentMode} from '../enums/paymentMode';
import { PaymentStatus } from '../enums/paymentStatus';
import { Donor } from './Donor';
import { ProjectSubscription } from './ProjectSubscription';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ type: 'date' })
  paymentDate!: Date;

  @Column({
    type: 'enum',
    enum: PaymentMode
  })
  mode!: PaymentMode;

  @Column({ nullable: false })
  transactionId!: string;

  @Column({ type: 'json', nullable: false })
donationScript!: string[];



  @ManyToOne(() => Donor, donor => donor.payments)
  @JoinColumn({ name: 'donor_id', referencedColumnName: 'regNum' })
  donor!: Donor;

  @ManyToOne(() => ProjectSubscription, ps => ps.payments)
  @JoinColumn({ name: 'project_subscription_id' })
  projectSubscription!: ProjectSubscription;

  @Column('decimal')
  amount!: number;

  @Column({
  type: 'enum',
  enum: PaymentStatus,
  default: PaymentStatus.PAID
})
status!: PaymentStatus;


  @Column()
  monthYear!: string;

}
