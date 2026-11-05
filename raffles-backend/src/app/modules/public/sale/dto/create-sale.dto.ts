import { IsString, IsNumber, IsArray, IsOptional, IsNotEmpty, } from 'class-validator';

export class CreateSaleDto {
  @IsString()
  buyer: string;

  @IsString()
  phone: string;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  numbers: string[];

  @IsNumber()
  totalNumbers: number;

  @IsNumber()
  totalPrice: number;
  
  @IsString()
  dateAt: string;

  @IsString()
  ip: string;

  @IsNumber()
  @IsOptional()
  sellerId?: number;

  @IsNumber()
  raffleId: number;

  @IsNumber()
  companyId: number;
}
