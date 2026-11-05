import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, } from 'typeorm';
import type { Relation } from 'typeorm';

import { Company } from './company.entity';

@Entity()
export class CompanyPayments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  paymentMethodId: number;

  @Column()
  total: number;

  @Column({ nullable: true })
  voucherURL?: string;

  @Column()
  dateAt: string;

  @Column()
  hourAt: string;

  @ManyToOne(() => Company, company => company.payments)
  company: Relation<Company>;
}
