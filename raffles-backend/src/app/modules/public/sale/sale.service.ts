import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, } from 'typeorm';

import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';

import { Sale } from './entities/sale.entity';
import { RaffleNumber } from '../raffle/entities/raffleNumber.entity';
import { NumberStatus } from '../raffle/enum/raffle.enum';

@Injectable()
export class SaleService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,

     @InjectRepository(RaffleNumber)
    private readonly numberRepository: Repository<RaffleNumber>,
  ) {}

  async create(createSaleDto: CreateSaleDto): Promise<Sale> {
    const nextSale = this.saleRepository.create({
      ...createSaleDto, 
      company: { id: createSaleDto.companyId },
      raffle: { id: createSaleDto.raffleId },
    });

    nextSale.dateAt = new Date().toISOString();
    if (createSaleDto.sellerId) nextSale.sellerId = createSaleDto.sellerId;

    const sale = await this.saleRepository.save(nextSale);

    if (nextSale.numbers.length) {
      await this.numberRepository.insert(
        nextSale.numbers.map((num) => ({
          num,
          buyer: nextSale.buyer,
          phone: nextSale.phone,
          soldAt: new Date().toISOString(),
          status: NumberStatus.SOLD,
          raffle: { id: createSaleDto.raffleId },
        })),
      );
    }

    return sale;
  }

  findAllByCompany(idCompany: number): Promise<Sale[]> {
    return this.saleRepository.find({
      where: { company: { id: idCompany } },
    });
  }

  async findOne(id: number): Promise<Sale> {
    const sale = await this.saleRepository.findOne({ where: { id } });

    if(!sale){
      throw new NotFoundException(`Rol con id ${id} no encontrado`);
    }

    return sale;
  }

  async update(id: number, updateSaleDto: UpdateSaleDto): Promise<Sale> {
    const sale = await this.findOne(id);

    const updatedSale = {
      ...sale,
      ...updateSaleDto,
    };

    this.saleRepository.save(updatedSale);

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.saleRepository.delete(id);
    if (result.affected === 0){
      throw new NotFoundException(`Rol con id ${id} no encontrado`);
    }
  }
}
