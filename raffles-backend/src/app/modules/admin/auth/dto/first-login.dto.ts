// src/auth/dto/signin.dto.ts
import { IsEmail, IsString } from 'class-validator';

export class FirstLoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  confirmPassword: string;
}
