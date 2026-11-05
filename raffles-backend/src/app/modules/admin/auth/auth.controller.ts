
import { Controller, Post, Body, Req, } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
// import { SignUpDto } from './dto/signup.dto';

import { FirstLoginDto } from './dto/first-login.dto';
import { Public } from './public.decorator';
import { Tenant } from '@/common/tenant/tenant.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Public()
  @Post('signin')
  async signIn(@Body() signInDto: SignInDto, @Tenant() tenant: string) {
    return this.authService.signIn(tenant, signInDto);
  };

  @Public()
  @Post('first-login')
  async firstLogin(@Tenant() tenant: string, @Body() firstLogin: FirstLoginDto) {
    return this.authService.firstLogin(tenant, firstLogin);
  };

  // @Public()
  // @Post('signup')
  // async signUp(@Body() signUpDto: SignUpDto) {
  //   return this.authService.signUp(signUpDto);
  // };
}
