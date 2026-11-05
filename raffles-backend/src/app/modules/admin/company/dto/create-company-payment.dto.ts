import { IsString, IsOptional, IsNumber, } from 'class-validator';

export class CreateCompanyPaymentDto {
  @IsNumber()
  paymentMethodId: number;

  @IsNumber()
  total: number;

  @IsString()
  @IsOptional()
  voucherURL?: string;

  @IsString()
  dateAt: string;

  @IsString()
  hourAt: string;

  @IsNumber()
  companyId: number;
}


