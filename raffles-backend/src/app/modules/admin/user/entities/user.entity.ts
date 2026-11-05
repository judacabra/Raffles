import { Entity, PrimaryGeneratedColumn, Column, OneToMany, } from 'typeorm';
import type { Relation } from 'typeorm';

import { UserCompany } from './user-company.entity';
import { Notification } from '../../notification/entities/notification.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  password?: string;

  @Column()
  email: string;

  @Column({ nullable: true, default: null })
  imageURL: string;

  @Column({ default: true })
  isActive: boolean;
  
  @Column({ default: true })
  isVisible: boolean;

  @Column({ default: true })
  isFirstLogin: boolean;

  @Column()
  roleId: number;

  @OneToMany(() => UserCompany, (usercompany) => usercompany.user)
  userCompany: Relation<UserCompany>;

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Relation<Notification[]>;
}
