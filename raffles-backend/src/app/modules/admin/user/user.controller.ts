
import { 
  Controller, Get, Post, Body, Param, Put, Delete, Query, 
  UseInterceptors, UploadedFile, UseGuards 
} from '@nestjs/common';

import { Tenant } from '@/common/tenant/tenant.decorator';

import { FileInterceptor } from '@webundsoehne/nest-fastify-file-upload';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { diskStorage } from 'multer';
import { extname } from 'path';

import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('all')
  async findAllByCompanyId(@Tenant() tenant: string) {
    return this.userService.findAllByCompany(tenant);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Get(':idCompany/check-username')
  async checkUsernameAvailability(@Query('username') username: string) {
    const available = await this.userService.isUsernameAvailable(username);
    return { available };
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/user',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const fileExtName = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${fileExtName}`);
        },
      }),
    })
  )
  async update(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateUserDto: UpdateUserDto
  ) {
    if (file) updateUserDto.imageURL = file.path;

    updateUserDto.isActive = true;
    updateUserDto.isVisible = true;

    return this.userService.update(id, updateUserDto);
  }

  @Put('status/:id')
  async updateStatus(@Param('id') id: number, @Body() obj: any) {
    return this.userService.updateStatus(id, obj.status);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
