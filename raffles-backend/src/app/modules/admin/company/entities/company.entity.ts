import { Entity, PrimaryGeneratedColumn, Column, OneToMany, } from 'typeorm';
import type { Relation } from 'typeorm';

import { Raffle } from '@/app/modules/public/raffle/entities/raffle.entity';
import { CompanyPayments } from './company-payment.entity';
import { UserCompany } from '../../user/entities/user-company.entity';

import { Notification } from 'src/app/modules/admin/notification/entities/notification.entity';
// import { Role } from '../../role/entities/role.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  taxId: string;
  
  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  tag?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  logoURL?: string;

  @Column({ nullable: true })
  planId: number;

  @Column({ nullable: true })
  periodicityId: number;

  @Column({ nullable: true, default: null })
  lastPaymentId: number;

  @Column({ nullable: true, default: null })
  expiratedDate: string;

  @Column()
  dateAt: string;

  @Column()
  hourAt: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: true })
  isVisible: boolean;

  @OneToMany(() => Raffle, (raffle) => raffle.company)
  raffles: Relation<Raffle[]>;

  @OneToMany(() => CompanyPayments, companyPayments => companyPayments.company)
  payments: Relation<CompanyPayments[]>;

  @OneToMany(() => UserCompany, (usercompany) => usercompany.company)
  userCompany: Relation<UserCompany>;
}
