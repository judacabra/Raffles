import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { JwtService } from '@nestjs/jwt';

import { ForbiddenError } from '@/app/shared/errors';

import { Repository } from 'typeorm';

import { UserService } from '../user/user.service';
import { CompanyService } from '../company/company.service';

import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { FirstLoginDto } from './dto/first-login.dto';

import { User } from '../user/entities/user.entity';
import { Company } from '../company/entities/company.entity';
import { Role } from '../role/entities/role.entity';

import { UserResponse } from './interfaces/auth.interfaces';

import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly userService: UserService,
    private readonly companyService: CompanyService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(companyName: string, signInDto: SignInDto) {
    const { email, password }: SignInDto = signInDto;
    const userFind: User | null = await this.userService.findByCompanyAndEmail(companyName, email);

    if (!userFind) throw new UnauthorizedException('invalid_credentials');

    const isFirstLogin: boolean = userFind.isFirstLogin;
    if (isFirstLogin) return { isFirstLogin };

    const isMatch: boolean = await bcrypt.compare(password, userFind.password!);

    if (!isMatch) throw new UnauthorizedException('invalid_credentials');

    const companies: Company[] = await this.companyService.findByUser(userFind.id);
    const role: Role | null = await this.roleRepository.findOne({ where: { id: userFind.roleId } });

    const userResponse: UserResponse = {
      id: userFind.id,
      email: userFind.email,
      username: userFind.username,
      imageURL: userFind.imageURL,
      isActive: userFind.isActive,
      roleId: userFind.roleId,
      rolePermissions: (role && role.permissions.map((r: string) => r.trim())) ?? [],
      companies: companies,
    };

    const token: string = this.jwtService.sign(userResponse);

    return { token, userResponse };
  };

  async firstLogin(companyName: string, firstLogin: FirstLoginDto) {
    const { email, password, confirmPassword }: FirstLoginDto = firstLogin;

    const userFind: User | null = await this.userService.findByCompanyAndEmail(companyName, email);
    if (!userFind) throw new UnauthorizedException('user_does_not_exist');

    if (password !== confirmPassword) throw new UnauthorizedException('passwords_are_different');

    if (!userFind.isFirstLogin) throw new ForbiddenError('this_user_has_already_login_previously', "409");

    userFind.password = await bcrypt.hash(password, 10);
    userFind.isFirstLogin = false;

    this.userService.update(userFind.id, userFind);

    const companies: Company[] = await this.companyService.findByUser(userFind.id);
    const role: Role | null = await this.roleRepository.findOne({ where: { id: userFind.roleId } });

    const userResponse: UserResponse = {
      id: userFind.id,
      email: userFind.email,
      username: userFind.username,
      imageURL: userFind.imageURL,
      isActive: userFind.isActive,
      roleId: userFind.roleId,
      rolePermissions: (role && role.permissions.map((r: string) => r.trim())) ?? [],
      companies: companies,
    };

    const token: string = this.jwtService.sign(userResponse);

    return { token, userResponse };
  };

  // async signUp(signUpDto: SignUpDto) {
  //   const existingUser = await this.userService.findByEmail(signUpDto.email);

  //   if (existingUser) {
  //     throw new ConflictException('user_alreadey_exist');
  //   }

  //   const hashedPassword = await bcrypt.hash(signUpDto.password, 10);

  //   const createUserDto: any = {
  //     username: `${signUpDto.firstName} ${signUpDto.lastName}`,
  //     password:  hashedPassword,
  //     email: signUpDto.email,
  //     isActive: true,
  //   };

  //   try {
  //     const user: User = await this.userService.create(createUserDto);

  //     return { message: 'user_saved_successfully', user };
  //   } catch (err: any) {
  //     throw new UnauthorizedException("failed_to_save_user");
  //   }
  // };
}
