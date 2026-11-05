import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not, In } from 'typeorm';

import { CreateRaffleDto } from './dto/create-raffle.dto';
import { UpdateRaffleDto } from './dto/update-raffle.dto';

import { Raffle } from './entities/raffle.entity';
import { RaffleNumber } from './entities/raffleNumber.entity';
import { RaffleStatus } from './enum/raffle.enum';

@Injectable()
export class RaffleService {
  constructor(
    @InjectRepository(Raffle)
    private readonly raffleRepository: Repository<Raffle>,

    @InjectRepository(RaffleNumber)
    private readonly raffleNumberRepository: Repository<RaffleNumber>,
  ) {}
  async create(createRaffleDto: CreateRaffleDto): Promise<Raffle> {
    createRaffleDto.createdAt = new Date().toISOString().split("T")[0];
    createRaffleDto.hourAt = new Date().toISOString().split("T")[1].split(".")[0];
    createRaffleDto.status = RaffleStatus.ACTIVE;

    const raffle = this.raffleRepository.create({
      ...createRaffleDto,
      company: { id: createRaffleDto.companyId }
    });

    return await this.raffleRepository.save(raffle);
  }

  async findAllByCompany(companyName: string): Promise<Raffle[]> {
    const numbers: RaffleNumber[] = await this.findAllNumbersByCompany(companyName);

    const raffles: any = await this.raffleRepository
      .createQueryBuilder('r')
      .leftJoin('company', 'c', 'c.id = r.companyId')
      .select('r.*')
      .andWhere("LOWER(REPLACE(c.name, ' ', '')) = LOWER(REPLACE(:companyName, ' ', ''))", { companyName })
      .orderBy('r.id', 'DESC');

    return raffles.getRawMany();
  }

  async findAllNumbersByCompany(companyName: string): Promise<RaffleNumber[]> {
    const numbers = await this.raffleNumberRepository
      .createQueryBuilder('rn')
      .select([
        'rn.*',
      ])
      .leftJoin('raffle', 'r' , 'rn.raffleId = r.id')
      .leftJoin('company', 'c' , 'c.id = r.companyId')
      .where("LOWER(REPLACE(c.name, ' ', '')) = LOWER(REPLACE(:companyName, ' ', ''))", { companyName })
      .getRawMany();

    return numbers;
  }

  async findOne(id: number): Promise<Raffle> {
    const raffle = await this.raffleRepository.findOne({ where: { id } });

    if (!raffle) throw new NotFoundException(`Rol con id ${id} no encontrado`);

    return raffle;
  }

  async update(id: number, updateRaffleDto: UpdateRaffleDto): Promise<Raffle> {
    const raffle = await this.findOne(id);

    const updatedRaffle = {
      ...raffle,
      ...updateRaffleDto,
    };

    await this.raffleRepository.save(updatedRaffle);

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.raffleRepository.delete(id);
    
    if (result.affected === 0){
      throw new NotFoundException(`Rol con id ${id} no encontrado`);
    }
  }
}
