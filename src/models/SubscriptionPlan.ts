import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { SubscriptionScheme } from '../enums/subscriptionScheme';
import { ProjectSubscription } from './ProjectSubscription';

@Entity('subscription_plans')
export class SubscriptionPlan {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'enum',
    enum: SubscriptionScheme,
    unique: true,
  })
  scheme: SubscriptionScheme;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  amountPerPerson: number;

  @Column({ type: 'int' })
  periodInMonths: number;

  @Column({ type: 'int', default: 0 })
  totalSubscribers: number;

  @OneToMany(() => ProjectSubscription, (ps) => ps.plan)
  projectSubscriptions: ProjectSubscription[];
}
