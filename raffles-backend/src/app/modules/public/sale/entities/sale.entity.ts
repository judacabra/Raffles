import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, } from 'typeorm';
import type { Relation } from "typeorm";

import { Company } from '@/app/modules/admin/company/entities/company.entity';
import { Raffle } from '../../raffle/entities/raffle.entity';


@Entity()
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  buyer: string;

  @Column()
  phone: string;

  @Column()
  description: string;

  @Column("varchar", { array: true })
  numbers: string[];

  @Column()
  totalNumbers: number;

  @Column()
  totalPrice: number;
  
  @Column()
  dateAt: string;

  @Column()
  ip: string;

  @Column({ nullable: true })
  sellerId?: number;

  @ManyToOne(() => Raffle, (raffle) => raffle.sales)
  raffle: Relation<Raffle>;

  @ManyToOne(() => Company, (company) => company.raffles)
  company: Relation<Company>;
}