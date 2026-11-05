import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';

import { Company } from './entities/company.entity';
import { CompanyPayments } from './entities/company-payment.entity';
import { UserCompany } from '../user/entities/user-company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company, CompanyPayments, UserCompany])],
  controllers: [CompanyController],
  exports: [CompanyService],
  providers: [CompanyService],
})

export class CompanyModule {}