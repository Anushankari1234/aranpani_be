import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectStatus } from '../enums/ProjectStatus';
import { ProjectSubscription } from './ProjectSubscription';
import { ProjectDonation } from './ProjectDonation';
@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  regNum: string;

  @Column({ type: 'varchar', length: 150 })
  templeName: string;

  @Column({ type: 'varchar', length: 150 })
  inchargeName: string;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
  })
  status: ProjectStatus;

  @Column({ type: 'text' })
  location: string;

  @Column({ type: 'varchar', length: 20 })
  contactNumber: string;

  @Column({ type: 'date', nullable: true })
  planStartDate: Date;

  @Column({ type: 'date', nullable: true })
  planEndDate: Date;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    nullable: true,
  })
  estimatedAmount: number;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    default: 0,
  })
  expensedAmount: number;

  @Column({ type: 'int', nullable: true })
  completionPercent: number;

  @Column({ type: 'text', nullable: true })
  scrapReason: string;

  @OneToMany(() => ProjectSubscription, (ps) => ps.project)
  subscriptions: ProjectSubscription[];

  @OneToMany(() => ProjectDonation, (donation) => donation.project)
  donations: ProjectDonation[];
}
