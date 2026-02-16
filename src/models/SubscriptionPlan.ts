import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany
} from 'typeorm';
import { SubscriptionScheme } from '../enums/subscriptionScheme';
import { ProjectSubscription } from './ProjectSubscription';

@Entity('subscription_plans')
export class SubscriptionPlan {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({
    type: 'enum',
    enum: SubscriptionScheme,
    unique: true
  })
  scheme!: SubscriptionScheme;

  @Column('decimal')
  amountPerPerson!: number;

  @Column()
  periodInMonths!: number;

  @Column({ default: 0 })
  totalSubscribers!: number;

  @OneToMany(() => ProjectSubscription, ps => ps.plan)
  projectSubscriptions!: ProjectSubscription[];
}
