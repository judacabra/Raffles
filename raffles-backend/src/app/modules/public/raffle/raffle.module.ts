import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RaffleService } from './raffle.service';
import { RaffleController } from './raffle.controller';

import { Raffle } from './entities/raffle.entity';
import { RaffleNumber } from './entities/raffleNumber.entity';
import { Company } from '../../admin/company/entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Raffle, RaffleNumber, Company])],
  providers: [RaffleService],
  controllers: [RaffleController],
  exports: [RaffleService],
})
export class RaffleModule {}
