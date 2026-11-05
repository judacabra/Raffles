import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not, In } from 'typeorm';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = this.roleRepository.create({
      ...createRoleDto,
      permissions: createRoleDto.permissions || [],
      // company: { id: createRoleDto.companyId }
    });

    return this.roleRepository.save(role);
  }

  findAllByCompany(idCompany: number): Promise<Role[]> {
    // return this.roleRepository.find({ where: { company: { id: idCompany } } });
    return this.roleRepository.find();
  }

  findForAdmin(): Promise<Role[]> {
    return this.roleRepository
      .createQueryBuilder('r')
      .where('r.companyId IS NULL')
      .andWhere('r.id != :id', { id: 1 })
      .getMany();
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { id } });

    if(!role){
      throw new NotFoundException(`Rol con id ${id} no encontrado`);
    }

    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);

    const updatedRole = {
      ...role,
      ...updateRoleDto,
      permissions: updateRoleDto.permissions || role.permissions
    };

    this.roleRepository.save(updatedRole);

    return updatedRole;
  }

  async remove(id: number): Promise<void> {
    const result = await this.roleRepository.delete(id);
    if(result.affected === 0){
      throw new NotFoundException(`Rol con id ${id} no encontrado`);
    }
  }
}
