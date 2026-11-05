import { IsString, IsOptional, IsDate, IsNumber, IsBoolean } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  name: string;

  @IsString()
  taxId: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  website?: string;

  @IsString()
  @IsOptional()
  logoURL?: string;

  @IsNumber()
  @IsOptional()
  planId?: number;

  @IsNumber()
  @IsOptional()
  periodicityId?: number;

  @IsDate()
  lastPayment: Date;

  @IsString()
  expiratedDate: string;

  @IsString()
  dateAt: string;

  @IsString()
  hourAt: string;

  @IsBoolean()
  isActive: boolean;

  @IsBoolean()
  isVisible: boolean;
}


