import { IsString, IsOptional, IsArray, IsNumber } from 'class-validator';

export class CreateRoleDto {
  @IsOptional()
  @IsNumber()
  companyId: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];
}
