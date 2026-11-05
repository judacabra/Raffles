import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';

import { Sale } from './entities/sale.entity';
import { User } from '../../admin/user/entities/user.entity';
import { Company } from '../../admin/company/entities/company.entity';
import { RaffleNumber } from '../raffle/entities/raffleNumber.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, RaffleNumber, User, Company])],
  providers: [SaleService],
  controllers: [SaleController],
  exports: [SaleService],
})
export class SaleModule {}
