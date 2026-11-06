import { Controller, Get, Post, Body, Param, Put, UseInterceptors, UploadedFile, Delete, UseGuards } from '@nestjs/common';

import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

import { FileInterceptor } from '@webundsoehne/nest-fastify-file-upload';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { CreateCompanyPaymentDto } from './dto/create-company-payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Public } from '../auth/public.decorator';

@Controller('company')
@UseGuards(JwtAuthGuard) 
export class CompanyController {
  constructor(private readonly companyService: CompanyService) { }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/companies',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const fileExtName = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${fileExtName}`);
        },
      }),
    })
  )
  async create(
    // @UploadedFile() file: Express.Multer.File,
    @Body() createCompanyDto: CreateCompanyDto
  ) {
    // if (file) {
    //   createCompanyDto.logoURL = file.path;
    // }

    return this.companyService.create(createCompanyDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @Public()
  @Get(':param')
  findOne(@Param('param') param: string | number) {
    return this.companyService.findByParam(param);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/companies',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const fileExtName = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${fileExtName}`);
        },
      }),
    })
  )
  async update(
    @Param('id') id: number,
    // @UploadedFile() file: Express.Multer.File,
    @Body() updateCompanyDto: UpdateCompanyDto
  ) {
    // if (file) {
    //   updateCompanyDto.logoURL = file.path;
    // }

    return this.companyService.update(id, updateCompanyDto);
  }

  @Put('status/:id')
  async updateStatus(@Param('id') id: number, @Body() obj: any) {
    return this.companyService.updateStatus(id, obj.status);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.companyService.remove(id);
  }

  // Payments 
  @Get(':id/payments')
  async getCompanyPayments(@Param('id') idCompany: number) {
    return this.companyService.getCompanyPayments(idCompany);
  }

  @Post(':id/payments')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/companies',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const fileExtName = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${fileExtName}`);
        },
      }),
    })
  )
  async createPayment(
    @UploadedFile() file: Express.Multer.File,
    @Body() createCompanyPaymentDto: CreateCompanyPaymentDto
  ) {
    if (file) createCompanyPaymentDto.voucherURL = file.path;
    return this.companyService.createPayment(createCompanyPaymentDto);
  }
}