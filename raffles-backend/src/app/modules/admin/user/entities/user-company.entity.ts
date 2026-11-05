import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, } from 'typeorm';

import type { Relation } from 'typeorm';

import { User } from '../entities/user.entity';
import { Company } from '../../company/entities/company.entity';

@Entity()
export class UserCompany {
  @PrimaryGeneratedColumn()
  id: number;
  
  @ManyToOne(() => Company, (company) => company.userCompany)
  company: Relation<Company>;
  
  @ManyToOne(() => User, (user) => user.userCompany)
  user: Relation<User>;

  @Column({ default: true })
  isActive: boolean;
  
  @Column({ default: true })
  isVisible: boolean;
}
