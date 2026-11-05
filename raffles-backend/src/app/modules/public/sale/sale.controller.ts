import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';

import { SaleService } from './sale.service';

import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';

import { JwtAuthGuard } from '../../admin/auth/jwt-auth.guard';

@Controller('sale')
@UseGuards(JwtAuthGuard)
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Post()
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.saleService.create(createSaleDto);
  }

  @Get('all/:idCompany')
  findAllByCompany(@Param('idCompany') idCompany: number) {
    return this.saleService.findAllByCompany(idCompany);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.saleService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateSaleDto: UpdateSaleDto) {
    return this.saleService.update(id, updateSaleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.saleService.remove(id);
  }
}
