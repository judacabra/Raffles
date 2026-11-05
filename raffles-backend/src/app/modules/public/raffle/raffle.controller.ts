import { 
  Controller, Get, Post, Body, Param, Put, 
  Delete, UseInterceptors, UploadedFile, UseGuards,
} from '@nestjs/common';

import { Tenant } from '@/common/tenant/tenant.decorator';

import { RaffleService } from './raffle.service';

import { CreateRaffleDto } from './dto/create-raffle.dto';
import { UpdateRaffleDto } from './dto/update-raffle.dto';

import { FileInterceptor } from '@webundsoehne/nest-fastify-file-upload';

import { diskStorage } from 'multer';
import { extname } from 'path';

import { JwtAuthGuard } from '../../admin/auth/jwt-auth.guard';

@Controller('raffle')
@UseGuards(JwtAuthGuard)
export class RaffleController {
  constructor(private readonly raffleService: RaffleService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/raffles',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const fileExtName = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${fileExtName}`);
        },
      }),
    })
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createRaffleDto: CreateRaffleDto
  ) {
    if (file) createRaffleDto.image = file.path;
    return this.raffleService.create(createRaffleDto);
  }

  @Get('all')
  async findAllByCompany(@Tenant() tenant: string) {
    return this.raffleService.findAllByCompany(tenant);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.raffleService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/raffles',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const fileExtName = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${fileExtName}`);
        },
      }),
    })
  )
  update(
    @Param('id') id: number, 
    @UploadedFile() file: Express.Multer.File,
    @Body() updateRaffleDto: UpdateRaffleDto,
  ) {
    if (file) updateRaffleDto.image = file.path;
    return this.raffleService.update(id, updateRaffleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.raffleService.remove(id);
  }
}
