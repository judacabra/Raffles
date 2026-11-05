import { IsNumber, IsBoolean } from 'class-validator';

export class CreateUserCompanyDto {
  @IsBoolean()
  isActive: boolean;

  @IsBoolean()
  isVisible: boolean;

  @IsNumber()
  companyId: number;

  @IsNumber()
  userId: number;
}
