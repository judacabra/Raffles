import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, } from 'typeorm';
import type { Relation } from "typeorm";

import { NumberStatus } from '../enum/raffle.enum';
import { Raffle } from './raffle.entity';

@Entity()
export class RaffleNumber {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  num: string;

  @Column({
    type: "enum",
    enum: NumberStatus,
    default: NumberStatus.AVAILABLE,
  })
  status: NumberStatus;

  @Column({ nullable: true })
  buyer?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  soldAt?: string;

  @ManyToOne(() => Raffle, (raffle) => raffle.numbers)
  raffle: Relation<Raffle>;
}