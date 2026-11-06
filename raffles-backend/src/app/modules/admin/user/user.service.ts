import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import * as fs from 'fs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAllByCompanyId(idCompany: number): Promise<User[]> {
    const adminRole: number = 1;

    const users: User[] = await this.userRepository
      .createQueryBuilder('u')
      .leftJoin('role', 'r', 'r.id = u.roleId')
      .leftJoin('user_company', 'uc', 'uc.userId = u.id')
      .leftJoin('company', 'c', 'c.id = uc.companyId')
      .select('u.id', 'id')
      .addSelect('u.username', 'username')
      .addSelect('u.email', 'email')
      .addSelect('u.imageURL', 'imageURL')
      .addSelect('u.isActive', 'isActive')
      .addSelect('r.name', 'role')
      .addSelect('c.id', 'companyId')
      .where('u.isVisible = true')
      .andWhere('u.roleId != :adminRole', { adminRole })
      .andWhere('c.id = :idCompany', { idCompany })
      .orderBy('u.username', 'ASC')
      .getRawMany();
    
    return users;
  }

  async findAllByCompany(companyName: string): Promise<User[]> {
    const adminRole: number = 1;

    const users: any = await this.userRepository
      .createQueryBuilder('u')
      .leftJoin('role', 'r', 'r.id = u.roleId')
      .leftJoin('user_company', 'uc', 'uc.userId = u.id')
      .leftJoin('company', 'c', 'c.id = uc.companyId')
      .select('u.id', 'id')
      .addSelect('u.username', 'username')
      .addSelect('u.email', 'email')
      .addSelect('u.imageURL', 'imageURL')
      .addSelect('u.isActive', 'isActive')
      .addSelect('r.name', 'role')
      .addSelect('c.id', 'companyId')
      .where('u.isVisible = true')
      .andWhere('u.roleId != :adminRole', { adminRole })
      .andWhere("LOWER(REPLACE(c.name, ' ', '')) = LOWER(REPLACE(:companyName, ' ', ''))", { companyName })
      .orderBy('u.username', 'ASC')
      .getRawMany();

    return users;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return user;
  }

  async findByCompanyAndEmail(companyName: string, email: string): Promise<User | null> {
    const exist = await this.userRepository
      .createQueryBuilder('u')
      .innerJoin('u.userCompany', 'uc')
      .innerJoin('uc.company', 'c')
      .where('u.email = :email', { email })
      .andWhere("LOWER(REPLACE(c.name, ' ', '')) = LOWER(REPLACE(:companyName, ' ', ''))", { companyName })

    return exist.getOne();
  }

  async update(id: number, updateUserDto: UpdateUserDto | any): Promise<User> {
    const user: User = await this.findOne(id);

    const oldImageURL = user.imageURL;
    if (oldImageURL && !updateUserDto.imageURL) updateUserDto.imageURL = null;

    const { companyId, ...rest } = updateUserDto;

    await this.userRepository.update(id, rest);

    if (oldImageURL && oldImageURL !== updateUserDto.imageURL) {
      if (fs.existsSync(oldImageURL)) {
        fs.unlinkSync(oldImageURL);
      }
    }

    return await this.findOne(id);
  }
  
  async updateStatus(id: number, status: boolean): Promise<void> {
    await this.findOne(id); 
    await this.userRepository.update(id, { isActive: status, });
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); 
    await this.userRepository.update(id, { isVisible: false, });
  }

  async isUsernameAvailable(username: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { username } });
    return !user;
  }
}
