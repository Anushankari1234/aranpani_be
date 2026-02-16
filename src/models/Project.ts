import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany
} from 'typeorm';
import { ProjectStatus } from '../enums/ProjectStatus';
import { ProjectSubscription } from './ProjectSubscription';
import { ProjectDonation } from './ProjectDonation';

@Entity('projects')
export class Project {
  @PrimaryColumn()
  regNum!: string;

  @Column()
  templeName!: string;

  @Column({ nullable: true })
  inchargeName?: string;

  @Column({
    type: 'enum',
    enum: ProjectStatus
  })
  status!: ProjectStatus;

  @Column('text', { nullable: true })
  location?: string;

  @Column({ nullable: true })
  contactNumber?: string;

  @Column({ type: 'date', nullable: true })
  planStartDate?: Date;

  @Column({ type: 'date', nullable: true })
  planEndDate?: Date;

  @Column('decimal', { nullable: true })
  estimatedAmount?: number;

  @Column('decimal', { default: 0 })
  expensedAmount!: number;

  @Column({ nullable: true })
  completionPercent?: number;

  @Column('text', { nullable: true })
  scrapReason?: string;

  @OneToMany(() => ProjectSubscription, ps => ps.project)
  subscriptions!: ProjectSubscription[];

  @OneToMany(() => ProjectDonation, donation => donation.project)
  donations!: ProjectDonation[];
}
