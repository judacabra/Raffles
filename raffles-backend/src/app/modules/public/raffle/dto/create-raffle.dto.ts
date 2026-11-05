import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { RaffleStatus } from '../enum/raffle.enum';

export class CreateRaffleDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  drawDate: string;

  @IsNumber()
  totalNumbers: number;

  @IsNumber()
  digits: number;

  @IsNumber()
  pricePerNumber: number;

  @IsEnum({ enum: RaffleStatus })
  status: RaffleStatus; 
  
  @IsOptional()
  @IsString()
  winnerNumber: string;
  
  @IsOptional()
  @IsNumber()
  winnerName?: string;

  @IsOptional()  
  @IsString()
  numColor: string;

  @IsOptional()  
  @IsString()
  bgColor: string;

  @IsString()
  theme: string; 
  
  @IsString()
  fontFamily: string; 
  
  @IsString()
  createdAt: string;

  @IsString()
  hourAt: string;
  
  @IsOptional()
  @IsString()
  image?: string;

  @IsNumber()
  companyId: number;
}
