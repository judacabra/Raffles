import { IsString, IsNumber, IsEmail, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  imageURL?: string;

  @IsBoolean()
  isActive: boolean;

  @IsBoolean()
  isVisible: boolean;

  @IsNumber()
  companyId: number;

  @IsNumber()
  roleId: number;
}
