import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
// import { Company } from 'src/app/modules/company/entities/company.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column('simple-array', { nullable: true })
  permissions: string[];

  // @ManyToOne(() => Company, (company) => company.roles, { nullable: true, eager: true, })
  // company: Company;
}