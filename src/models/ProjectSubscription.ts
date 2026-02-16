import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn
} from 'typeorm';
import { Donor } from './Donor';
import { Project } from './Project';
import { SubscriptionPlan } from './SubscriptionPlan';
import { Payment } from './Payment';

@Entity('project_subscriptions')
export class ProjectSubscription {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @OneToOne(() => Donor, donor => donor.projectSubscription)
  @JoinColumn({ name: 'donor_id', referencedColumnName: 'regNum' })
  donor!: Donor;

  @ManyToOne(() => Project, project => project.subscriptions)
  @JoinColumn({ name: 'project_id', referencedColumnName: 'regNum' })
  project!: Project;

  @ManyToOne(() => SubscriptionPlan, plan => plan.projectSubscriptions)
  @JoinColumn({ name: 'plan_id' })
  plan!: SubscriptionPlan;

  @Column({ type: 'date' })
  startDate!: Date;

  @Column({ default: 'active' })
  status!: string;

  @OneToMany(() => Payment, payment => payment.projectSubscription)
  payments!: Payment[];
}
