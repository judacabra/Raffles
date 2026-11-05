import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, } from 'typeorm';
import type { Relation } from "typeorm";

import { RaffleStatus } from '../enum/raffle.enum';

import { RaffleNumber } from './raffleNumber.entity';
import { Company } from '@/app/modules/admin/company/entities/company.entity';
import { Sale } from '../../sale/entities/sale.entity';


@Entity()
export class Raffle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  drawDate: string;

  @Column()
  totalNumbers: number;

  @Column()
  digits: number;

  @Column()
  pricePerNumber: number;

  @Column({
    type: "enum",
    enum: RaffleStatus,
    default: RaffleStatus.ACTIVE,
  })
  status: RaffleStatus; 
  
  @Column({ nullable: true, default: null })
  winnerNumber: string;

  @Column({ nullable: true, })
  numColor: string;

  @Column({ nullable: true, })
  bgColor: string;
  
  @Column({ nullable: true, default: null })
  winnerName: string;
  
  @Column({ default: "default" })
  theme: string; 

  @Column({ default: "Inter" })
  fontFamily: string; 
  
  @Column()
  createdAt: string;
  
  @Column({ nullable: true })
  image?: string;

  @OneToMany(() => RaffleNumber, (number) => number.raffle)
  numbers: Relation<RaffleNumber[]>;

  @OneToMany(() => Sale, (sale) => sale.raffle)
  sales: Relation<Sale[]>;

  @ManyToOne(() => Company, (company) => company.raffles)
  company: Relation<Company>;
}